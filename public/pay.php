<?php
/**
 * Init оплаты T‑Bank → PaymentURL (карта / СБП на форме банка).
 * Секреты: pay.config.php (см. pay.config.php.example).
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$configFile = __DIR__ . '/pay.config.php';
if (!is_readable($configFile)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server misconfigured (pay.config.php)']);
    exit;
}

/** @var array<string, mixed> $config */
$config = require $configFile;
require_once __DIR__ . '/lib/tbank.php';

$terminalKey = (string)($config['terminal_key'] ?? '');
$password = (string)($config['password'] ?? '');
$apiUrl = (string)($config['api_url'] ?? 'https://securepay.tinkoff.ru/v2');
$allowed = $config['allowed_origins'] ?? [];
$rlWindow = (int)($config['rate_limit_window_sec'] ?? 15);
$rlMax = (int)($config['rate_limit_max'] ?? 8);
$maxBody = (int)($config['max_body_bytes'] ?? 524288);

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

function pay_origin_allowed(string $origin, array $allowed): bool
{
    return $origin !== '' && in_array($origin, $allowed, true);
}

if (!is_array($allowed) || count($allowed) === 0 || !pay_origin_allowed($origin, $allowed)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Origin not allowed']);
    exit;
}

header('Access-Control-Allow-Origin: ' . $origin);
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

if ($terminalKey === '' || $password === '' || str_contains($terminalKey, 'YOUR_') || str_contains($password, 'YOUR_')) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server misconfigured (terminal keys)']);
    exit;
}

function pay_client_ip(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function pay_rate_limit(string $ip, int $window, int $max): bool
{
    $file = sys_get_temp_dir() . '/ksd_pay_rl_' . md5($ip);
    $now = time();
    $data = @json_decode((string)@file_get_contents($file), true);
    if (!is_array($data)) {
        $data = [];
    }
    $data = array_values(array_filter($data, static fn($t) => $now - (int)$t < $window));
    if (count($data) >= $max) {
        return false;
    }
    $data[] = $now;
    @file_put_contents($file, json_encode($data), LOCK_EX);
    return true;
}

if (!pay_rate_limit(pay_client_ip(), $rlWindow, $rlMax)) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Too many requests']);
    exit;
}

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > $maxBody) {
    http_response_code(413);
    echo json_encode(['success' => false, 'error' => 'Payload too large']);
    exit;
}

$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON body']);
    exit;
}

if (!empty($data['website'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid form submission']);
    exit;
}

$name = trim((string)($data['name'] ?? ''));
$phone = trim((string)($data['phone'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$itemsIn = $data['items'] ?? null;

if ($name === '' || $phone === '' || $email === '' || !is_array($itemsIn) || count($itemsIn) === 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email']);
    exit;
}

if (count($itemsIn) > 50) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Too many items']);
    exit;
}

$tax = (string)($config['tax'] ?? 'none');
$taxation = (string)($config['taxation'] ?? 'usn_income');
$receiptItems = [];
$totalKop = 0;

/** Серверные цены каталога — клиент не задаёт сумму оплаты сам */
$priceMap = [];
$pricesFile = __DIR__ . '/data/catalog-prices.json';
if (is_readable($pricesFile)) {
    $decodedPrices = json_decode((string)file_get_contents($pricesFile), true);
    if (is_array($decodedPrices) && isset($decodedPrices['prices']) && is_array($decodedPrices['prices'])) {
        foreach ($decodedPrices['prices'] as $skuKey => $rub) {
            if (is_numeric($rub)) {
                $priceMap[(string)$skuKey] = (float)$rub;
            }
        }
    }
}

foreach ($itemsIn as $row) {
    if (!is_array($row)) {
        continue;
    }
    $itemName = mb_substr(trim((string)($row['name'] ?? 'Товар')), 0, 128);
    $sku = trim((string)($row['sku'] ?? ''));
    $qty = (float)($row['quantity'] ?? 0);
    $clientPriceRub = (float)($row['priceRub'] ?? -1);

    if ($itemName === '' || $qty <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid cart item']);
        exit;
    }
    if ($qty > 9999) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Item limits exceeded']);
        exit;
    }

    // Цена только с сервера для известных SKU; иначе отклоняем (нельзя занизить сумму)
    if ($sku === '' || !array_key_exists($sku, $priceMap)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown product SKU']);
        exit;
    }
    $priceRub = (float)$priceMap[$sku];
    // Если клиент прислал цену выше серверной — тоже отсекаем (защита от мусора); ниже — точно нет
    if ($clientPriceRub >= 0 && abs($clientPriceRub - $priceRub) > 0.009) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Price mismatch']);
        exit;
    }

    $priceKop = (int)round($priceRub * 100);
    $qtyNorm = round($qty, 3);
    $amountKop = (int)round($priceKop * $qtyNorm);
    if ($amountKop < 1) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Item amount too small']);
        exit;
    }

    $label = $itemName . ' (арт. ' . $sku . ')';
    $receiptItems[] = [
        'Name' => mb_substr($label, 0, 128),
        'Price' => $priceKop,
        'Quantity' => $qtyNorm,
        'Amount' => $amountKop,
        'Tax' => $tax,
        'PaymentMethod' => 'full_prepayment',
        'PaymentObject' => 'commodity',
    ];
    $totalKop += $amountKop;
}

if ($totalKop < 100) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Minimum amount is 1 RUB']);
    exit;
}

$orderId = 'ksd-' . date('YmdHis') . '-' . bin2hex(random_bytes(3));
$description = mb_substr(
    'СТП-КОТОВ ' . $orderId . ' · ' . $name . ' · ' . $phone,
    0,
    140
);

$receipt = [
    'Email' => $email,
    'Taxation' => $taxation,
    'Items' => $receiptItems,
];
$phoneDigits = preg_replace('/\D+/', '', $phone) ?? '';
if (strlen($phoneDigits) >= 10) {
    $receipt['Phone'] = '+' . (str_starts_with($phoneDigits, '8')
        ? ('7' . substr($phoneDigits, 1))
        : $phoneDigits);
}

$init = tbank_init([
    'terminal_key' => $terminalKey,
    'password' => $password,
    'api_url' => $apiUrl,
    'amount' => $totalKop,
    'order_id' => $orderId,
    'description' => $description,
    'receipt' => $receipt,
    'success_url' => (string)($config['success_url'] ?? ''),
    'fail_url' => (string)($config['fail_url'] ?? ''),
    'notification_url' => (string)($config['notification_url'] ?? ''),
    'pay_type' => (string)($config['pay_type'] ?? 'O'),
]);

if (!$init['ok']) {
    http_response_code(502);
    echo json_encode([
        'success' => false,
        'error' => 'Payment init failed',
    ]);
    exit;
}

$paymentUrl = (string)($init['payment_url'] ?? '');
if (!pay_is_allowed_payment_url($paymentUrl)) {
    http_response_code(502);
    echo json_encode(['success' => false, 'error' => 'Invalid payment gateway URL']);
    exit;
}

echo json_encode([
    'success' => true,
    'orderId' => $orderId,
    'paymentId' => $init['payment_id'] ?? null,
    'paymentUrl' => $paymentUrl,
    'amountRub' => $totalKop / 100,
]);

/**
 * Разрешён только хост платёжной формы T‑Bank.
 */
function pay_is_allowed_payment_url(string $url): bool
{
    $parts = parse_url($url);
    if (!is_array($parts) || ($parts['scheme'] ?? '') !== 'https') {
        return false;
    }
    $host = strtolower((string)($parts['host'] ?? ''));
    $allowed = [
        'securepay.tinkoff.ru',
        'securepay.tbank.ru',
        'www.tinkoff.ru',
        'www.tbank.ru',
    ];
    if (in_array($host, $allowed, true)) {
        return true;
    }
    return (bool)preg_match('/(^|\.)tinkoff\.ru$|(^|\.)tbank\.ru$/', $host);
}

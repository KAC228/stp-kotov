<?php
/**
 * Статус платежа только через T‑Bank GetState.
 * Клиент не может «подтвердить» оплату сам — только PaymentId → запрос в банк.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$configFile = __DIR__ . '/pay.config.php';
if (!is_readable($configFile)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'paid' => false, 'error' => 'Server misconfigured']);
    exit;
}

/** @var array<string, mixed> $config */
$config = require $configFile;
require_once __DIR__ . '/lib/tbank.php';

$terminalKey = (string)($config['terminal_key'] ?? '');
$password = (string)($config['password'] ?? '');
$apiUrl = (string)($config['api_url'] ?? 'https://securepay.tinkoff.ru/v2');

if ($terminalKey === '' || $password === '' || str_contains($password, 'YOUR_')) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'paid' => false, 'error' => 'Server misconfigured']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'paid' => false, 'error' => 'Method not allowed']);
    exit;
}

function pay_status_client_ip(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function pay_status_rate_limit(string $ip, int $window = 60, int $max = 30): bool
{
    $file = sys_get_temp_dir() . '/ksd_pay_status_rl_' . md5($ip);
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

if (!pay_status_rate_limit(pay_status_client_ip())) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'paid' => false, 'error' => 'Too many requests']);
    exit;
}

// Same-site браузер: точное совпадение Host (без «суффиксного» обхода вроде host ends with .tld)
$host = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
if (str_contains($host, ':')) {
    $host = explode(':', $host, 2)[0];
}
$origin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
$referer = (string)($_SERVER['HTTP_REFERER'] ?? '');

$sameSiteHost = static function (string $candidate, string $siteHost): bool {
    $candidate = strtolower($candidate);
    if ($candidate === '' || $siteHost === '') {
        return false;
    }
    return $candidate === $siteHost || str_ends_with($candidate, '.' . $siteHost);
};

$okBrowser = false;
if ($origin !== '') {
    $oh = strtolower((string)(parse_url($origin, PHP_URL_HOST) ?? ''));
    $okBrowser = $sameSiteHost($oh, $host);
} elseif ($referer !== '') {
    $rh = strtolower((string)(parse_url($referer, PHP_URL_HOST) ?? ''));
    $okBrowser = $sameSiteHost($rh, $host);
}
if (!$okBrowser) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'paid' => false, 'error' => 'Forbidden']);
    exit;
}

$paymentId = '';
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $paymentId = trim((string)($_GET['PaymentId'] ?? $_GET['paymentId'] ?? ''));
} else {
    $raw = file_get_contents('php://input');
    $body = is_string($raw) ? json_decode($raw, true) : null;
    if (is_array($body)) {
        $paymentId = trim((string)($body['PaymentId'] ?? $body['paymentId'] ?? ''));
    }
    if ($paymentId === '') {
        $paymentId = trim((string)($_POST['PaymentId'] ?? ''));
    }
}

// Клиентский флаг paid/success игнорируем полностью
$state = tbank_get_state($terminalKey, $password, $apiUrl, $paymentId);

if (!$state['ok']) {
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'paid' => false,
        'error' => $state['error'] ?? 'Unable to verify payment',
    ]);
    exit;
}

$paid = !empty($state['paid']);
// Неоплаченные / чужие PaymentId — минимум полей (меньше oracle)
if (!$paid) {
    echo json_encode([
        'ok' => true,
        'paid' => false,
        'status' => $state['status'] ?? null,
        'paymentId' => $paymentId,
    ]);
    exit;
}

echo json_encode([
    'ok' => true,
    'paid' => true,
    'status' => $state['status'] ?? null,
    'orderId' => $state['order_id'] ?? null,
    'paymentId' => $state['payment_id'] ?? $paymentId,
    'amountRub' => isset($state['amount_kop']) ? ($state['amount_kop'] / 100) : null,
]);

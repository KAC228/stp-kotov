<?php
/**
 * Notification webhook T‑Bank EACQ.
 * Подтверждение оплаты — только подписанное уведомление банка (Token).
 * В ЛК: https://<домен>/tbank-notify.php
 * Ответ при успехе проверки подписи — ровно: OK
 */

declare(strict_types=1);

$configFile = __DIR__ . '/pay.config.php';
if (!is_readable($configFile)) {
    http_response_code(500);
    echo 'CONFIG';
    exit;
}

/** @var array<string, mixed> $config */
$config = require $configFile;
require_once __DIR__ . '/lib/tbank.php';

$password = (string)($config['password'] ?? '');
$terminalKey = (string)($config['terminal_key'] ?? '');

if ($password === '' || str_contains($password, 'YOUR_')) {
    http_response_code(500);
    echo 'CONFIG';
    exit;
}

$raw = file_get_contents('php://input');
$data = is_string($raw) ? json_decode($raw, true) : null;

if (!is_array($data) && !empty($_POST)) {
    $data = $_POST;
}

if (!is_array($data)) {
    http_response_code(400);
    echo 'BAD';
    exit;
}

// Без валидного Token от банка — отказ (подделать подтверждение нельзя)
if (!tbank_verify_token($data, $password)) {
    http_response_code(403);
    echo 'INVALID TOKEN';
    exit;
}

$reqTerminal = (string)($data['TerminalKey'] ?? '');
if ($terminalKey !== '' && $reqTerminal !== '' && !hash_equals($terminalKey, $reqTerminal)) {
    http_response_code(403);
    echo 'TERMINAL';
    exit;
}

// Опционально: зафиксировать успешную оплату локально (не для UI — UI ходит в GetState)
$status = (string)($data['Status'] ?? '');
$paymentId = (string)($data['PaymentId'] ?? '');
if (tbank_is_paid_status($status) && preg_match('/^\d{1,20}$/', $paymentId)) {
    $dir = sys_get_temp_dir() . '/ksd_tbank_paid';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    $payload = [
        'paymentId' => $paymentId,
        'orderId' => (string)($data['OrderId'] ?? ''),
        'amount' => isset($data['Amount']) ? (int)$data['Amount'] : 0,
        'status' => $status,
        'at' => gmdate('c'),
        'source' => 'tbank-notification',
    ];
    @file_put_contents(
        $dir . '/' . $paymentId . '.json',
        json_encode($payload, JSON_UNESCAPED_UNICODE),
        LOCK_EX
    );
}

header('Content-Type: text/plain; charset=utf-8');
echo 'OK';

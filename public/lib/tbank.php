<?php
/**
 * T‑Bank EACQ helpers: Token (SHA-256), Init, verify Notification.
 * @see https://developer.tbank.ru/eacq/intro/developer/token
 */

declare(strict_types=1);

/**
 * Скаляр для подписи: bool → "true"/"false", остальное — строка.
 * @param mixed $value
 */
function tbank_scalar_string($value): string
{
    if (is_bool($value)) {
        return $value ? 'true' : 'false';
    }
    if ($value === null) {
        return '';
    }
    return (string)$value;
}

/**
 * Подпись запроса / проверка Notification.
 * Вложенные объекты и массивы (Receipt, DATA, …) в токен не входят.
 *
 * @param array<string, mixed> $params
 */
function tbank_make_token(array $params, string $password): string
{
    $flat = [];
    foreach ($params as $key => $value) {
        if ($key === 'Token' || $key === 'Password') {
            continue;
        }
        if (is_array($value)) {
            continue;
        }
        $flat[(string)$key] = tbank_scalar_string($value);
    }
    $flat['Password'] = $password;
    ksort($flat, SORT_STRING);
    return hash('sha256', implode('', array_values($flat)));
}

/**
 * @param array<string, mixed> $params
 */
function tbank_verify_token(array $params, string $password): bool
{
    $got = (string)($params['Token'] ?? '');
    if ($got === '') {
        return false;
    }
    $expect = tbank_make_token($params, $password);
    return hash_equals($expect, $got);
}

/**
 * POST JSON к API T‑Bank.
 *
 * @param array<string, mixed> $body
 * @return array{ok: bool, http: int, data: array<string, mixed>|null, raw: string}
 */
function tbank_api_post(string $url, array $body): array
{
    $json = json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) {
        return ['ok' => false, 'http' => 0, 'data' => null, 'raw' => ''];
    }

    $raw = false;
    $http = 0;

    // На shared-хостинге (reg.ru) allow_url_fopen часто выключен — curl надёжнее.
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $json,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Accept: application/json',
            ],
            CURLOPT_CONNECTTIMEOUT => 8,
            CURLOPT_TIMEOUT => 15,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
        ]);
        $raw = curl_exec($ch);
        $http = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if ($raw === false) {
            $raw = 'curl_error:' . curl_error($ch);
        }
        curl_close($ch);
    } else {
        $ctx = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/json\r\nAccept: application/json\r\n",
                'content' => $json,
                'timeout' => 30,
                'ignore_errors' => true,
            ],
        ]);
        $raw = @file_get_contents($url, false, $ctx);
        if (isset($http_response_header) && is_array($http_response_header)) {
            foreach ($http_response_header as $line) {
                if (preg_match('#^HTTP/\S+\s+(\d{3})#', $line, $m)) {
                    $http = (int)$m[1];
                    break;
                }
            }
        }
    }

    $data = is_string($raw) ? json_decode($raw, true) : null;
    return [
        'ok' => is_array($data) && !empty($data['Success']),
        'http' => $http,
        'data' => is_array($data) ? $data : null,
        'raw' => is_string($raw) ? $raw : '',
    ];
}

/**
 * Init платежа. Amount — в копейках.
 *
 * @param array{
 *   terminal_key: string,
 *   password: string,
 *   api_url: string,
 *   amount: int,
 *   order_id: string,
 *   description: string,
 *   receipt: array<string, mixed>,
 *   success_url?: string,
 *   fail_url?: string,
 *   notification_url?: string,
 *   pay_type?: string,
 *   email?: string,
 *   phone?: string,
 * } $opts
 * @return array{ok: bool, payment_url?: string, payment_id?: string, error?: string, raw?: array<string, mixed>|null}
 */
function tbank_init(array $opts): array
{
    $terminalKey = (string)$opts['terminal_key'];
    $password = (string)$opts['password'];
    $apiUrl = rtrim((string)$opts['api_url'], '/');
    $amount = (int)$opts['amount'];
    $orderId = (string)$opts['order_id'];
    $description = mb_substr((string)$opts['description'], 0, 140);
    $receipt = $opts['receipt'];

    $payload = [
        'TerminalKey' => $terminalKey,
        'Amount' => $amount,
        'OrderId' => $orderId,
        'Description' => $description,
        'Receipt' => $receipt,
    ];

    if (!empty($opts['pay_type'])) {
        $payload['PayType'] = (string)$opts['pay_type'];
    }
    if (!empty($opts['success_url'])) {
        $payload['SuccessURL'] = (string)$opts['success_url'];
    }
    if (!empty($opts['fail_url'])) {
        $payload['FailURL'] = (string)$opts['fail_url'];
    }
    if (!empty($opts['notification_url'])) {
        $payload['NotificationURL'] = (string)$opts['notification_url'];
    }

    $payload['Token'] = tbank_make_token($payload, $password);

    $res = tbank_api_post($apiUrl . '/Init', $payload);
    if (!$res['ok'] || !is_array($res['data'])) {
        $msg = 'Init failed';
        if (is_array($res['data'])) {
            $parts = array_filter([
                (string)($res['data']['Message'] ?? ''),
                (string)($res['data']['Details'] ?? ''),
                isset($res['data']['ErrorCode']) ? ('code ' . $res['data']['ErrorCode']) : '',
            ]);
            if ($parts !== []) {
                $msg = implode(' · ', $parts);
            }
        } elseif ($res['raw'] !== '' && str_starts_with($res['raw'], 'curl_error:')) {
            $msg = 'Network error reaching T-Bank';
        } elseif ($res['http'] === 0 && $res['raw'] === '') {
            $msg = 'Network error reaching T-Bank (enable curl / allow_url_fopen)';
        }
        return ['ok' => false, 'error' => $msg, 'raw' => $res['data']];
    }

    $paymentUrl = (string)($res['data']['PaymentURL'] ?? '');
    $paymentId = isset($res['data']['PaymentId']) ? (string)$res['data']['PaymentId'] : '';
    if ($paymentUrl === '') {
        return ['ok' => false, 'error' => 'Empty PaymentURL', 'raw' => $res['data']];
    }

    return [
        'ok' => true,
        'payment_url' => $paymentUrl,
        'payment_id' => $paymentId,
        'raw' => $res['data'],
    ];
}

/**
 * Статусы, при которых платёж считается успешно проведённым банком.
 * @return list<string>
 */
function tbank_paid_statuses(): array
{
    return ['CONFIRMED', 'AUTHORIZED'];
}

function tbank_is_paid_status(string $status): bool
{
    return in_array($status, tbank_paid_statuses(), true);
}

/**
 * GetState — единственный способ узнать статус на стороне сайта (не доверять SuccessURL).
 *
 * @return array{
 *   ok: bool,
 *   paid: bool,
 *   status?: string,
 *   order_id?: string,
 *   amount_kop?: int,
 *   payment_id?: string,
 *   error?: string,
 *   raw?: array<string, mixed>|null
 * }
 */
function tbank_get_state(
    string $terminalKey,
    string $password,
    string $apiUrl,
    string $paymentId
): array {
    $paymentId = trim($paymentId);
    if ($paymentId === '' || !preg_match('/^\d{1,20}$/', $paymentId)) {
        return ['ok' => false, 'paid' => false, 'error' => 'Invalid PaymentId'];
    }

    $payload = [
        'TerminalKey' => $terminalKey,
        'PaymentId' => $paymentId,
    ];
    $payload['Token'] = tbank_make_token($payload, $password);

    $res = tbank_api_post(rtrim($apiUrl, '/') . '/GetState', $payload);
    if (!$res['ok'] || !is_array($res['data'])) {
        $msg = is_array($res['data'])
            ? (string)($res['data']['Message'] ?? $res['data']['Details'] ?? 'GetState failed')
            : 'GetState failed';
        return ['ok' => false, 'paid' => false, 'error' => $msg, 'raw' => $res['data']];
    }

    $status = (string)($res['data']['Status'] ?? '');
    $amount = isset($res['data']['Amount']) ? (int)$res['data']['Amount'] : 0;
    $orderId = (string)($res['data']['OrderId'] ?? '');

    return [
        'ok' => true,
        'paid' => tbank_is_paid_status($status),
        'status' => $status,
        'order_id' => $orderId,
        'amount_kop' => $amount,
        'payment_id' => $paymentId,
        'raw' => $res['data'],
    ];
}

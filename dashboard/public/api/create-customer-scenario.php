<?php

declare(strict_types=1);

const ALLOWED_ORIGINS = [
    'https://mlp-mediziner-beratung.de',
    'https://montolio.de',
    'http://127.0.0.1:5174',
    'http://localhost:5174',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, ALLOWED_ORIGINS, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    respond(405, ['error' => 'Nur POST ist erlaubt.']);
}

if ($origin === '' || !in_array($origin, ALLOWED_ORIGINS, true)) {
    respond(403, ['error' => 'Diese Herkunft ist für das Erzeugen von Kundenszenarien nicht freigeschaltet.']);
}

try {
    $rawBody = file_get_contents('php://input');
    if ($rawBody === false || trim($rawBody) === '') {
        respond(400, ['error' => 'Request-Body fehlt.']);
    }

    $payload = json_decode($rawBody, true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($payload)) {
        respond(400, ['error' => 'Ungültiges JSON-Format.']);
    }

    $customer = normalize_customer($payload['customer'] ?? null);
    if ($customer['firstName'] === '' || $customer['lastName'] === '') {
        respond(422, ['error' => 'Vor- und Nachname des Kunden sind Pflichtfelder.']);
    }

    $preset = $payload['preset'] ?? null;
    if (!is_array($preset)) {
        respond(422, ['error' => 'Preset-Snapshot fehlt.']);
    }

    foreach (['id', 'label', 'version', 'updatedAt', 'calculationConfig', 'scenarioDefaults'] as $requiredKey) {
        if (!array_key_exists($requiredKey, $preset)) {
            respond(422, ['error' => 'Preset-Snapshot ist unvollständig.']);
        }
    }

    $scenarioId = bin2hex(random_bytes(12));
    $snapshot = [
        'id' => $scenarioId,
        'createdAt' => gmdate('c'),
        'customer' => $customer,
        'preset' => $preset,
    ];

    $storageDir = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'YorkLiving-data' . DIRECTORY_SEPARATOR . 'customer-scenarios';
    if (!is_dir($storageDir) && !mkdir($storageDir, 0775, true) && !is_dir($storageDir)) {
        respond(500, ['error' => 'Speicherverzeichnis für Kundenszenarien konnte nicht angelegt werden.']);
    }

    $targetFile = $storageDir . DIRECTORY_SEPARATOR . $scenarioId . '.json';
    $encoded = json_encode($snapshot, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($encoded === false) {
        respond(500, ['error' => 'Kundenszenario konnte nicht serialisiert werden.']);
    }

    $written = file_put_contents($targetFile, $encoded . PHP_EOL, LOCK_EX);
    if ($written === false) {
        respond(500, ['error' => 'Kundenszenario konnte nicht gespeichert werden.']);
    }

    respond(201, [
        'id' => $scenarioId,
        'path' => '/YorkLiving-data/customer-scenarios/' . $scenarioId . '.json',
    ]);
} catch (JsonException) {
    respond(400, ['error' => 'Request-Body ist kein gültiges JSON.']);
} catch (Throwable $exception) {
    respond(500, ['error' => 'Serverfehler beim Erzeugen des Kundenszenarios.', 'message' => $exception->getMessage()]);
}

function normalize_customer(mixed $candidate): array
{
    if (!is_array($candidate)) {
        return ['firstName' => '', 'lastName' => ''];
    }

    return [
        'firstName' => normalize_name_part($candidate['firstName'] ?? ''),
        'lastName' => normalize_name_part($candidate['lastName'] ?? ''),
    ];
}

function normalize_name_part(mixed $value): string
{
    if (!is_string($value)) {
        return '';
    }

    $normalized = preg_replace('/\s+/u', ' ', trim($value));
    return $normalized === null ? '' : $normalized;
}

function respond(int $statusCode, array $payload): never
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

<?php
// File ini untuk debugging: melihat apa yang sebenarnya diterima server
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

$rawInput = file_get_contents('php://input');

$debugData = [
    'method' => $_SERVER['REQUEST_METHOD'],
    'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'Not Set',
    'headers' => getallheaders(),
    'get_params' => $_GET,
    'post_params' => $_POST,
    'request_params' => $_REQUEST,
    'raw_input_body' => $rawInput,
    'json_decoded' => json_decode($rawInput, true),
    'php_version' => phpversion()
];

echo json_encode($debugData, JSON_PRETTY_PRINT);

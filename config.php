<?php
// Konfigurasi Database MySQL
$host = 'localhost';
$db   = 'pkkiipendidikanu_pdb';
$user = 'pkkiipendidikanu_dioarsip';
$pass = '@Dioadam27';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     // Jangan tampilkan detail error database ke publik untuk keamanan, 
     // tapi kirim header 500 agar fetch client tahu ini error server.
     header('Content-Type: application/json', true, 500);
     echo json_encode(['error' => 'Koneksi database gagal.']);
     exit;
}

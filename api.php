<?php
// Izinkan akses dari mana saja (CORS)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight requests (Penting untuk React/Fetch)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'get_data':
        try {
            // Ambil daftar aplikasi
            $stmt = $pdo->query("SELECT * FROM apps ORDER BY created_at ASC");
            $apps = $stmt->fetchAll();

            // Ambil konfigurasi halaman (Judul dll)
            $stmt = $pdo->query("SELECT * FROM page_config WHERE id = 1 LIMIT 1");
            $config = $stmt->fetch();

            echo json_encode([
                'apps' => $apps,
                'config' => $config
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'save_app':
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (!$data || !isset($data['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Data tidak lengkap atau format JSON salah']);
            exit;
        }

        try {
            // Cek apakah aplikasi sudah ada (Update) atau baru (Insert)
            $stmt = $pdo->prepare("SELECT id FROM apps WHERE id = ?");
            $stmt->execute([$data['id']]);
            $exists = $stmt->fetch();

            if ($exists) {
                $sql = "UPDATE apps SET title=?, description=?, url=?, icon_url=?, category=?, status=?, color=? WHERE id=?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    $data['title'], $data['description'], $data['url'], 
                    $data['icon_url'], $data['category'], $data['status'], 
                    $data['color'], $data['id']
                ]);
            } else {
                $sql = "INSERT INTO apps (id, title, description, url, icon_url, category, status, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    $data['id'], $data['title'], $data['description'], $data['url'], 
                    $data['icon_url'], $data['category'], $data['status'], $data['color']
                ]);
            }
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'delete_app':
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID tidak ditemukan']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM apps WHERE id = ?");
            $stmt->execute([$data['id']]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'update_config':
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'Payload kosong']);
            exit;
        }

        try {
            // Pastikan row id=1 selalu ada atau diupdate
            $sql = "UPDATE page_config SET hero_title = ?, hero_description = ? WHERE id = 1";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$data['heroTitle'], $data['heroDescription']]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(['message' => 'PDB Apps API is running. Action not recognized.']);
        break;
}

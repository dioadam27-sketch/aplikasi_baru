-- 1. Buat Tabel 'apps' (Versi MySQL untuk phpMyAdmin)
CREATE TABLE IF NOT EXISTS apps (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url TEXT,
    icon_url TEXT,
    category VARCHAR(100) DEFAULT 'Umum',
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'maintenance', 'off'
    color VARCHAR(20) DEFAULT 'blue',    -- 'blue', 'green', 'orange', 'purple', 'red', 'teal'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Buat Tabel 'page_config'
CREATE TABLE IF NOT EXISTS page_config (
    id INT NOT NULL PRIMARY KEY DEFAULT 1,
    hero_title VARCHAR(255) DEFAULT 'Direktorat Pendidikan',
    hero_description VARCHAR(255) DEFAULT 'PDB'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Masukkan data awal (Akan mengupdate data lama jika sudah ada)
INSERT INTO page_config (id, hero_title, hero_description)
VALUES (1, 'Direktorat Pendidikan', 'PDB')
ON DUPLICATE KEY UPDATE 
    hero_title = 'Direktorat Pendidikan', 
    hero_description = 'PDB';
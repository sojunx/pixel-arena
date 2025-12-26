-- ============================================
-- SETUP DATABASE FOR PIXEL ARENA (PostgreSQL)
-- ============================================

-- Step 1: Tạo database (chạy ngoài psql hoặc bằng quyền superuser)
-- CREATE DATABASE pixel_db;

-- ============================================
-- Step 2: Kết nối vào database
-- \c pixel_db;

-- ============================================
-- Step 3: Drop tables nếu tồn tại
-- ============================================

DROP TABLE IF EXISTS pixel_history;
DROP TABLE IF EXISTS user_log;
DROP TABLE IF EXISTS pixel;

-- ============================================
-- Step 4: Tạo bảng pixel (trạng thái hiện tại)
-- ============================================

CREATE TABLE pixel (
                       x INT NOT NULL,
                       y INT NOT NULL,
                       color VARCHAR(20) NOT NULL DEFAULT '#ffffff',
                       updated_by VARCHAR(255),
                       updated_at TIMESTAMP,
                       version INT NOT NULL DEFAULT 0,
                       PRIMARY KEY (x, y)
);

-- ============================================
-- Step 5: Tạo bảng pixel_history
-- ============================================

CREATE TABLE pixel_history (
                               id BIGSERIAL PRIMARY KEY,
                               x INT NOT NULL,
                               y INT NOT NULL,
                               old_color VARCHAR(20),
                               new_color VARCHAR(20) NOT NULL,
                               changed_by VARCHAR(255) NOT NULL,
                               changed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pixel_history_xy_time
    ON pixel_history (x, y, changed_at DESC);

-- ============================================
-- Step 6: Tạo bảng user_log (cooldown tracking)
-- ============================================

CREATE TABLE user_log (
                          user_id VARCHAR(50) PRIMARY KEY,
                          last_painted_at TIMESTAMP NOT NULL
);

-- ============================================
-- Step 7: Khởi tạo 10,000 pixels (100x100)
-- ============================================

DO $$
    DECLARE
        x INT := 0;
        y INT;
    BEGIN
        WHILE x < 100 LOOP
                y := 0;
                WHILE y < 100 LOOP
                        INSERT INTO pixel (x, y, color, updated_by, updated_at, version)
                        VALUES (x, y, '#ffffff', 'system', NOW(), 0);
                        y := y + 1;
                    END LOOP;
                x := x + 1;

                IF x % 10 = 0 THEN
                    RAISE NOTICE 'Initialized % pixels', x * 100;
                END IF;
            END LOOP;
    END $$;

-- ============================================
-- Step 8: Verify setup
-- ============================================

-- Thông tin bảng
SELECT
    'pixel' AS table_name,
    COUNT(*) AS total,
    MIN(x) AS min_x,
    MAX(x) AS max_x,
    MIN(y) AS min_y,
    MAX(y) AS max_y
FROM pixel;

SELECT 'pixel_history' AS table_name, COUNT(*) FROM pixel_history;
SELECT 'user_log' AS table_name, COUNT(*) FROM user_log;

-- ============================================
-- DONE
-- ============================================



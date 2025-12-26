-- ============================================
-- SETUP HOÀN CHỈNH DATABASE CHO PIXEL ARENA
-- ============================================
-- Khởi tạo 10,000 pixels
-- ============================================

-- Step 1: Tạo database nếu chưa có
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'PixelDB')
    BEGIN
        CREATE DATABASE PixelDB;
        PRINT 'Created database PixelDB';
    END
ELSE
    BEGIN
        PRINT 'Database PixelDB already exists';
    END
GO

-- Step 2: Sử dụng database PixelDB
USE PixelDB;
GO

-- ============================================
-- Step 3: Drop các bảng cũ nếu tồn tại
-- ============================================
IF OBJECT_ID('dbo.pixel_history', 'U') IS NOT NULL
    BEGIN
        DROP TABLE dbo.pixel_history;
        PRINT 'Dropped table PixelHistory';
    END

IF OBJECT_ID('dbo.user_log', 'U') IS NOT NULL
    BEGIN
        DROP TABLE dbo.user_log;
        PRINT 'Dropped table UserLog';
    END

IF OBJECT_ID('dbo.pixel', 'U') IS NOT NULL
    BEGIN
        DROP TABLE dbo.pixel;
        PRINT 'Dropped table Pixel';
    END
GO

-- ============================================
-- Step 4: Tạo bảng Pixel (trạng thái hiện tại)
-- ============================================
CREATE TABLE pixel (
                       x INT NOT NULL,
                       y INT NOT NULL,
                       color VARCHAR(20) NOT NULL DEFAULT '#ffffff',
                       updated_by VARCHAR(255) NULL,
                       updated_at DATETIME NULL,
                       version INT NOT NULL DEFAULT 0,
                       PRIMARY KEY (x, y)
);
PRINT 'Created table Pixel';
GO

-- ============================================
-- Step 5: Tạo bảng PixelHistory (lịch sử thay đổi)
-- ============================================
CREATE TABLE pixel_history (
                              id BIGINT IDENTITY(1,1) PRIMARY KEY,
                              x INT NOT NULL,
                              y INT NOT NULL,
                              old_color VARCHAR(20) NULL,
                              new_color VARCHAR(20) NOT NULL,
                              changed_by VARCHAR(255) NOT NULL,
                              changed_at DATETIME NOT NULL DEFAULT GETDATE(),
                              INDEX idx_pixel_history (x, y, changed_at DESC)
);
PRINT 'Created table PixelHistory';
GO

-- ============================================
-- Step 6: Tạo bảng UserLog (cooldown tracking)
-- ============================================
CREATE TABLE user_log (
                         user_id VARCHAR(50) PRIMARY KEY,
                         last_painted_at DATETIME NOT NULL
);
PRINT 'Created table UserLog';
GO

-- ============================================
-- Step 7: Khởi tạo 10,000 pixels (100x100 grid)
-- Tất cả pixels bắt đầu với màu trắng (#ffffff)
-- ============================================
PRINT 'Initializing 10,000 pixels (100x100 grid)...';

DECLARE @x INT = 0;
DECLARE @y INT = 0;
DECLARE @count INT = 0;

WHILE @x < 100
    BEGIN
        SET @y = 0;
        WHILE @y < 100
            BEGIN
                INSERT INTO Pixel (x, y, color, updated_by, updated_at, version)
                VALUES (@x, @y, '#ffffff', 'system', GETDATE(), 0);

                SET @count = @count + 1;
                SET @y = @y + 1;
            END
        SET @x = @x + 1;

        -- In progress mỗi 10 hàng
        IF @x % 10 = 0
            PRINT 'Initialized ' + CAST(@count AS VARCHAR) + ' pixels...';
    END

PRINT 'Successfully initialized ' + CAST(@count AS VARCHAR) + ' pixels!';
GO

-- ============================================
-- Step 8: Verify setup thành công
-- ============================================
PRINT '';
PRINT '========================================';
PRINT 'SETUP COMPLETED!';
PRINT '========================================';

SELECT 'Database Info' AS Info;
SELECT
    name AS DatabaseName,
    create_date AS CreatedDate,
    compatibility_level AS CompatibilityLevel
FROM sys.databases
WHERE name = 'PixelDB';

SELECT 'Table Statistics' AS Info;
SELECT
    'pixel' AS TableName,
    COUNT(*) AS count,
    MIN(x) AS MinX,
    MAX(x) AS MaxX,
    MIN(y) AS MinY,
    MAX(y) AS MaxY
FROM pixel;

SELECT 'pixel_history' AS TableName, COUNT(*) AS count FROM pixel_history;
SELECT 'user_log' AS TableName, COUNT(*) AS count FROM user_log;

PRINT '';
PRINT '========================================';
PRINT 'Ready to start Spring Boot backend!';
PRINT 'Connection string:';
PRINT 'jdbc:sqlserver://localhost:1433;databaseName=PixelDB;encrypt=false';
PRINT 'Username: sa';
PRINT 'Password: 123';
PRINT '========================================';
GO

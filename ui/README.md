# Pixel Arena UI

## Issues

- Khi 2 user đều thực hiện gửi request lên api, thì user 1 gửi thành công và được broadcast lên websocket, sau đó được update màu dựa trên message đó
- Vấn đề là khi user 2 cũng gửi nhưng không thành công, thì vẫn được broadcast lên websocket, dẫn đến sai màu, nhưng reload lại trang thì là màu của user 1
- Vấn đề nằm ở cả No Lock và Optimistic Lock

## Prerequisites

- Node.js 18.x or newer (Node 20 recommended)
- npm (v8+) or yarn / pnpm
- Git

---

## How to install

### Clone Repository

```bash
git clone -b pixel-ui --single-branch https://github.com/hieundt3048/Pixel-Arena.git pixel-ui
cd pixel-ui
```

### Install & Start server

```bash
# Run locally
npm install
npm run dev

# Run with one command
docker compose up --build
```

Open <http://localhost:5173> (Vite default) in your browser. If the port is already used, Vite will prompt or choose another port

---

## Notes

> Set get all pixels limit to 10.000

### Script to add 10.000 pixels to database ( Using GPT )

```sql
CREATE DATABASE PixelDB;

-- Script insert 10.000 pixels (grid 100x100, x và y từ 0 đến 99)

WITH
    Ten(N) AS (SELECT 1 UNION ALL SELECT 1 UNION ALL SELECT 1 UNION ALL SELECT 1 UNION ALL SELECT 1
               UNION ALL SELECT 1 UNION ALL SELECT 1 UNION ALL SELECT 1 UNION ALL SELECT 1 UNION ALL SELECT 1),
    Tally(N) AS (
        SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) - 1
        FROM Ten T1
                 CROSS JOIN Ten T2
                 CROSS JOIN Ten T3
                 CROSS JOIN Ten T4
    )
INSERT INTO Pixel (x, y, color, updated_by, updated_at, version)
SELECT
    X.N AS x,
    Y.N AS y,
    '#FFFFFF' AS color,
    'system' AS updatedBy,
    GETDATE() AS updatedAt,
    0 AS version
FROM Tally X
         CROSS JOIN Tally Y
WHERE X.N <= 99
  AND Y.N <= 99;

```

### Docker compose file for mssql server

```yaml
volumes:
  mssql-db:

services:
  mssql:
    image: mcr.microsoft.com/mssql/server:2019-latest
    ports:
      - "1433:1433"
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=Sa@12345
      - MSSQL_PID=Developer
      - MSSQL_COLLATION=SQL_Latin1_General_CP1_CI_AS
      - TZ=Asia/Ho_Chi_Minh
    volumes:
      - mssql-db:/var/opt/mssql
    container_name: mssql
    # restart: always
```

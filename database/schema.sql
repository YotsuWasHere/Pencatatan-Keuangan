-- Buku Kas — template database (MySQL / MariaDB). Untuk PostgreSQL ganti AUTO_INCREMENT -> GENERATED ALWAYS AS IDENTITY.
CREATE DATABASE IF NOT EXISTS buku_kas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE buku_kas;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (            -- dompet / rekening: Tunai, BCA, GoPay, dll
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(80) NOT NULL,
  opening_balance DECIMAL(15,2) NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(60) NOT NULL,
  type ENUM('income','expense') NOT NULL,
  bucket ENUM('needs','wants','savings','none') NOT NULL DEFAULT 'none',  -- untuk aturan 50/30/20
  color CHAR(7) NOT NULL DEFAULT '#8A8578'
);

CREATE TABLE transactions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  account_id INT NULL,
  category_id INT NOT NULL,
  trx_date DATE NOT NULL,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount >= 0),
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  INDEX idx_user_date (user_id, trx_date)
);

CREATE TABLE budgets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  period CHAR(7) NOT NULL,         -- format 'YYYY-MM'
  amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  UNIQUE KEY uq_budget (user_id, category_id, period),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE savings_goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  target_amount DECIMAL(15,2) NOT NULL,
  saved_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  deadline DATE NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Data awal kategori (sama persis dengan di aplikasi)
INSERT INTO categories (code,name,type,bucket,color) VALUES
('gaji','Gaji','income','none','#2F6B4F'),('usaha','Usaha','income','none','#3E8E7E'),
('bonus','Bonus','income','none','#8AA84B'),('masuk_lain','Pemasukan lain','income','none','#6B8F71'),
('kebutuhan','Kebutuhan','expense','needs','#C8553D'),('kewajiban','Kewajiban','expense','needs','#8E3B46'),
('keinginan','Keinginan','expense','wants','#E09F3E'),('tabungan','Tabungan','expense','savings','#3A6EA5'),
('investasi','Investasi','expense','savings','#5B4B8A'),('lainnya','Lainnya','expense','none','#8A8578');

-- Ringkasan bulanan siap pakai
CREATE VIEW v_monthly_summary AS
SELECT t.user_id, DATE_FORMAT(t.trx_date,'%Y-%m') AS period,
  SUM(CASE WHEN c.type='income'  THEN t.amount END) AS total_income,
  SUM(CASE WHEN c.type='expense' THEN t.amount END) AS total_expense,
  SUM(CASE WHEN c.type='income' THEN t.amount ELSE -t.amount END) AS balance
FROM transactions t JOIN categories c ON c.id=t.category_id
GROUP BY t.user_id, period;

-- Contoh data (hapus jika tidak perlu)
INSERT INTO users (name,email,password_hash) VALUES ('Demo','demo@example.com','GANTI_DENGAN_HASH');
INSERT INTO transactions (user_id,category_id,trx_date,description,amount) VALUES
(1,1,'2026-11-01','Gaji bulanan',8500000),(1,6,'2026-11-02','Sewa kost',1500000),(1,5,'2026-11-03','Belanja bulanan',1200000);

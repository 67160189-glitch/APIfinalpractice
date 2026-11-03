CREATE TABLE IF NOT EXISTS menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  available BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
);

INSERT INTO menu_items (name, price, available) VALUES
  ('ข้าวผัด', 60.00, TRUE),
  ('ชาเย็น', 25.00, TRUE),
  ('ข้าวขาหมู', 70.00, FALSE);

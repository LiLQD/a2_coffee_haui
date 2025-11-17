CREATE DATABASE IF NOT EXISTS a2_snack
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE a2_snack;

SET default_storage_engine=INNODB;

-- Tắt kiểm tra khoá ngoại khi tạo/sửa bảng
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Bảng users: lưu cả customer và admin
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    username       VARCHAR(50)  NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    full_name      VARCHAR(100) NOT NULL,
    phone          VARCHAR(20),
    address        VARCHAR(255),
    role           ENUM('CUSTOMER', 'ADMIN') DEFAULT 'CUSTOMER',
    api_key        VARCHAR(100),      -- dùng cho admin nếu muốn bảo vệ API quản trị
    is_active      TINYINT(1) DEFAULT 1,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Bảng categories: danh mục món ăn (Bánh mì, Xôi, Đồ uống, ...)
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    is_active   TINYINT(1) DEFAULT 1,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Bảng products: món ăn cụ thể
DROP TABLE IF EXISTS products;
CREATE TABLE products (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    category_id  INT NOT NULL,
    name         VARCHAR(100) NOT NULL,
    description  VARCHAR(255),
    price        DECIMAL(10,2) NOT NULL,
    image_url    VARCHAR(255),
    is_active    TINYINT(1) DEFAULT 1,  -- bật/tắt món trong menu
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 4. Bảng carts: giỏ hàng của user
DROP TABLE IF EXISTS carts;
CREATE TABLE carts (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    status      ENUM('ACTIVE', 'ORDERED', 'ABANDONED') DEFAULT 'ACTIVE',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_carts_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Bảng cart_items: từng món trong giỏ hàng
DROP TABLE IF EXISTS cart_items;
CREATE TABLE cart_items (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    cart_id     INT NOT NULL,
    product_id  INT NOT NULL,
    quantity    INT NOT NULL DEFAULT 1,
    unit_price  DECIMAL(10,2) NOT NULL,  -- giá tại thời điểm thêm vào giỏ
    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cart_id) REFERENCES carts(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 6. Bảng orders: đơn hàng đã đặt
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    user_id           INT,                     -- có thể NULL nếu cho phép đặt không cần tài khoản
    customer_name     VARCHAR(100) NOT NULL,
    customer_phone    VARCHAR(20)  NOT NULL,
    customer_address  VARCHAR(255) NOT NULL,

    total_amount      DECIMAL(10,2) NOT NULL,
    status            ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'DELIVERING', 'COMPLETED', 'CANCELLED')
                      DEFAULT 'PENDING',

    payment_method    ENUM('CASH_ON_DELIVERY', 'STRIPE_TEST', 'MOCK') DEFAULT 'MOCK',
    payment_status    ENUM('UNPAID', 'PAID', 'FAILED', 'REFUNDED') DEFAULT 'UNPAID',
    payment_ref       VARCHAR(100),            -- mã giao dịch (nếu có)

    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- 7. Bảng order_items: chi tiết từng món trong đơn hàng
DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    order_id    INT NOT NULL,
    product_id  INT NOT NULL,
    quantity    INT NOT NULL,
    unit_price  DECIMAL(10,2) NOT NULL,   -- giá tại thời điểm đặt
    subtotal    DECIMAL(10,2) NOT NULL,   -- unit_price * quantity

    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- Admin mặc định
INSERT INTO users (username, password_hash, full_name, phone, address, role, is_active)
VALUES ('admin', 'admin_dummy_hash', 'Quản trị viên', '0123456789', 'Hà Nội', 'ADMIN', 1);

INSERT INTO categories (name, description) VALUES
('Bánh mì', 'Các loại bánh mì buổi sáng'),
('Xôi', 'Các món xôi'),
('Đồ uống', 'Cà phê, sữa, nước ép');

INSERT INTO products (category_id, name, description, price, image_url)
VALUES
(1, 'Bánh mì trứng', 'Bánh mì pate trứng', 20000, '/images/banhmi_trung.jpg'),
(1, 'Bánh mì xúc xích', 'Bánh mì xúc xích phô mai', 25000, '/images/banhmi_xucxich.jpg'),
(2, 'Xôi xéo', 'Xôi xéo hành phi', 15000, '/images/xoi_xeo.jpg'),
(3, 'Cà phê sữa đá', 'Ly cà phê sữa đá buổi sáng', 18000, '/images/cf_suada.jpg');

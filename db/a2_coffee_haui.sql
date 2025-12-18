-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: a2_snack
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `unit_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cart_items_cart` (`cart_id`),
  KEY `fk_cart_items_product` (`product_id`),
  CONSTRAINT `fk_cart_items_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `status` enum('ACTIVE','ORDERED','ABANDONED') COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVE',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_carts_user` (`user_id`),
  CONSTRAINT `fk_carts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,1,'ACTIVE','2025-11-28 01:34:31','2025-11-28 01:34:31');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Bánh mì','Các loại bánh mì buổi sáng',1,'2025-11-28 00:09:37'),(2,'Xôi','Các món xôi',1,'2025-11-28 00:09:37'),(3,'Đồ uống','Cà phê, sữa, nước ép',1,'2025-11-28 00:09:37'),(4,'Món khác','Danh mục tự tạo khi import: Món khác',1,'2025-11-29 23:37:53'),(5,'Test Cat','Danh mục tự tạo khi import: Test Cat',1,'2025-12-09 18:45:26'),(6,'Cà phê','Danh mục tự tạo khi import: Cà phê',1,'2025-12-09 19:03:55'),(7,'Trà','Danh mục tự tạo khi import: Trà',1,'2025-12-09 19:03:55');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_items_order` (`order_id`),
  KEY `fk_order_items_product` (`product_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,2,20000.00,40000.00),(2,1,3,1,15000.00,15000.00),(3,2,2,6,25000.00,150000.00),(4,2,3,4,15000.00,60000.00),(35,18,2,1,25000.00,25000.00),(36,18,3,1,12000.00,12000.00),(37,19,1,2,0.00,0.00),(38,20,2,1,25000.00,25000.00),(39,20,3,1,12000.00,12000.00),(40,20,5,1,21000.00,21000.00),(41,20,6,1,25000.00,25000.00),(42,20,8,1,25000.00,25000.00),(43,20,1,1,20000.00,20000.00),(44,21,2,2,25000.00,50000.00),(45,21,3,2,12000.00,24000.00),(46,22,2,1,25000.00,25000.00),(47,22,4,1,21000.00,21000.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `customer_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('PENDING','CONFIRMED','PREPARING','DELIVERING','COMPLETED','CANCELLED','PROCESSING') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  `payment_method` enum('CASH_ON_DELIVERY','STRIPE_TEST','MOCK') COLLATE utf8mb4_unicode_ci DEFAULT 'MOCK',
  `payment_status` enum('UNPAID','PAID','FAILED','REFUNDED') COLLATE utf8mb4_unicode_ci DEFAULT 'UNPAID',
  `payment_ref` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_orders_user` (`user_id`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,'Nguyễn Văn A','0901234567','KTX HaUI',55000.00,'COMPLETED','CASH_ON_DELIVERY','UNPAID',NULL,'2025-11-28 03:06:40','2025-12-09 19:59:53'),(2,1,'Nguyễn Văn A','0901234567','2',210000.00,'COMPLETED','CASH_ON_DELIVERY','UNPAID',NULL,'2025-11-28 19:13:59','2025-12-09 19:24:05'),(18,1,'Nguyễn Văn A','0901234567','a2',37000.00,'PENDING','CASH_ON_DELIVERY','UNPAID',NULL,'2025-12-10 18:01:30','2025-12-10 18:01:30'),(19,NULL,'Test User','0987654321','Hanoi University of Industry',0.00,'PENDING','CASH_ON_DELIVERY','UNPAID',NULL,'2025-12-12 22:02:33','2025-12-12 22:02:33'),(20,1,'Nguyễn Văn A','0901234567','a2',128000.00,'PENDING','CASH_ON_DELIVERY','UNPAID',NULL,'2025-12-15 17:58:36','2025-12-15 17:58:36'),(21,1,'Nguyễn Văn A','0901234567','a1',74000.00,'PENDING','CASH_ON_DELIVERY','UNPAID',NULL,'2025-12-15 17:58:47','2025-12-15 17:58:47'),(22,1,'Nguyễn Văn A','0901234567','a2',46000.00,'PENDING','CASH_ON_DELIVERY','UNPAID',NULL,'2025-12-17 13:49:03','2025-12-17 13:49:03');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_products_category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'Bánh mì trứng','Bánh mì pate trứng',20000.00,'/images/banhmi_trung.jpg',1,'2025-11-28 00:09:37'),(2,1,'Bánh mì xúc xích','Bánh mì xúc xích phô mai',25000.00,'/images/banhmi_xucxich.jpg',1,'2025-11-28 00:09:37'),(3,2,'Xôi xéo','Xôi xéo hành phi',12000.00,'/images/xoi_xeo.jpg',1,'2025-11-28 00:09:37'),(4,1,'Bánh mì thịt','Bánh mì thịt đầy đủ',21000.00,'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lwazqbfg4fdl94@resize_ss640x400',1,'2025-11-29 23:37:53'),(5,2,'Xôi gà','Xôi gà xé',25000.00,'https://file.hstatic.net/200000700229/article/xoi-ga-xe-1_6ae68f0c65d94664a8f954fe239e922a.jpg',1,'2025-11-29 23:37:53'),(6,1,'Bánh mì bò','Bánh mì bò áp chảo',25000.00,'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/kien-thuc/cach-lam-banh-mi-thit-bo/cach-lam-banh-mi-thit-bo-8.jpg',1,'2025-11-30 21:44:20'),(7,6,'Cà phê đen','Cà phê đen thơm ngon, đậm đà hương vị.',40000.00,'https://placehold.co/300x200?text=Cà+phê+đen',1,'2025-12-09 19:03:55'),(8,6,'Cà phê đen Đặc biệt','Cà phê đen phiên bản đặc biệt, ngon tuyệt.',42000.00,'https://placehold.co/300x200?text=Cà+phê+đen+Đặc+biệt',1,'2025-12-09 19:03:55'),(9,6,'Cà phê đen Thượng hạng','Cà phê đen phiên bản thượng hạng, ngon tuyệt.',48000.00,'https://placehold.co/300x200?text=Cà+phê+đen+Thượng+hạng',1,'2025-12-09 19:03:55'),(10,6,'Cà phê đen Truyền thống','Cà phê đen phiên bản truyền thống, ngon tuyệt.',66000.00,'https://placehold.co/300x200?text=Cà+phê+đen+Truyền+thống',1,'2025-12-09 19:03:55'),(11,6,'Cà phê đen Sữa tươi','Cà phê đen phiên bản sữa tươi, ngon tuyệt.',53000.00,'https://placehold.co/300x200?text=Cà+phê+đen+Sữa+tươi',1,'2025-12-09 19:03:55'),(12,6,'Cà phê đen Kem cheese','Cà phê đen phiên bản kem cheese, ngon tuyệt.',34000.00,'https://placehold.co/300x200?text=Cà+phê+đen+Kem+cheese',1,'2025-12-09 19:03:55'),(13,6,'Cà phê đen Full topping','Cà phê đen phiên bản full topping, ngon tuyệt.',49000.00,'https://placehold.co/300x200?text=Cà+phê+đen+Full+topping',1,'2025-12-09 19:03:55'),(14,6,'Cà phê đen  size L','Cà phê đen phiên bản  size l, ngon tuyệt.',60000.00,'https://placehold.co/300x200?text=Cà+phê+đen++size+L',1,'2025-12-09 19:03:55'),(15,6,'Cà phê đen  size M','Cà phê đen phiên bản  size m, ngon tuyệt.',30000.00,'https://placehold.co/300x200?text=Cà+phê+đen++size+M',1,'2025-12-09 19:03:55'),(16,6,'Cà phê sữa','Cà phê sữa thơm ngon, đậm đà hương vị.',32000.00,'https://placehold.co/300x200?text=Cà+phê+sữa',1,'2025-12-09 19:03:55'),(17,6,'Cà phê sữa Đặc biệt','Cà phê sữa phiên bản đặc biệt, ngon tuyệt.',45000.00,'https://placehold.co/300x200?text=Cà+phê+sữa+Đặc+biệt',1,'2025-12-09 19:03:55'),(18,6,'Cà phê sữa Thượng hạng','Cà phê sữa phiên bản thượng hạng, ngon tuyệt.',40000.00,'https://placehold.co/300x200?text=Cà+phê+sữa+Thượng+hạng',1,'2025-12-09 19:03:55'),(19,6,'Cà phê sữa Truyền thống','Cà phê sữa phiên bản truyền thống, ngon tuyệt.',34000.00,'https://placehold.co/300x200?text=Cà+phê+sữa+Truyền+thống',1,'2025-12-09 19:03:55'),(20,6,'Cà phê sữa Sữa tươi','Cà phê sữa phiên bản sữa tươi, ngon tuyệt.',29000.00,'https://placehold.co/300x200?text=Cà+phê+sữa+Sữa+tươi',1,'2025-12-09 19:03:55'),(21,6,'Cà phê sữa Kem cheese','Cà phê sữa phiên bản kem cheese, ngon tuyệt.',34000.00,'https://placehold.co/300x200?text=Cà+phê+sữa+Kem+cheese',1,'2025-12-09 19:03:55'),(22,6,'Cà phê sữa Full topping','Cà phê sữa phiên bản full topping, ngon tuyệt.',38000.00,'https://placehold.co/300x200?text=Cà+phê+sữa+Full+topping',1,'2025-12-09 19:03:55'),(23,6,'Cà phê sữa  size L','Cà phê sữa phiên bản  size l, ngon tuyệt.',65000.00,'https://placehold.co/300x200?text=Cà+phê+sữa++size+L',1,'2025-12-09 19:03:55'),(24,6,'Cà phê sữa  size M','Cà phê sữa phiên bản  size m, ngon tuyệt.',36000.00,'https://placehold.co/300x200?text=Cà+phê+sữa++size+M',1,'2025-12-09 19:03:55'),(25,6,'Bạc xỉu','Bạc xỉu thơm ngon, đậm đà hương vị.',47000.00,'https://placehold.co/300x200?text=Bạc+xỉu',1,'2025-12-09 19:03:55'),(26,6,'Bạc xỉu Đặc biệt','Bạc xỉu phiên bản đặc biệt, ngon tuyệt.',37000.00,'https://placehold.co/300x200?text=Bạc+xỉu+Đặc+biệt',1,'2025-12-09 19:03:55'),(27,6,'Bạc xỉu Thượng hạng','Bạc xỉu phiên bản thượng hạng, ngon tuyệt.',40000.00,'https://placehold.co/300x200?text=Bạc+xỉu+Thượng+hạng',1,'2025-12-09 19:03:55'),(28,6,'Bạc xỉu Truyền thống','Bạc xỉu phiên bản truyền thống, ngon tuyệt.',65000.00,'https://placehold.co/300x200?text=Bạc+xỉu+Truyền+thống',1,'2025-12-09 19:03:55'),(29,6,'Bạc xỉu Sữa tươi','Bạc xỉu phiên bản sữa tươi, ngon tuyệt.',55000.00,'https://placehold.co/300x200?text=Bạc+xỉu+Sữa+tươi',1,'2025-12-09 19:03:55'),(30,6,'Bạc xỉu Kem cheese','Bạc xỉu phiên bản kem cheese, ngon tuyệt.',58000.00,'https://placehold.co/300x200?text=Bạc+xỉu+Kem+cheese',1,'2025-12-09 19:03:55'),(31,6,'Bạc xỉu Full topping','Bạc xỉu phiên bản full topping, ngon tuyệt.',54000.00,'https://placehold.co/300x200?text=Bạc+xỉu+Full+topping',1,'2025-12-09 19:03:55'),(32,6,'Bạc xỉu  size L','Bạc xỉu phiên bản  size l, ngon tuyệt.',42000.00,'https://placehold.co/300x200?text=Bạc+xỉu++size+L',1,'2025-12-09 19:03:55'),(33,6,'Bạc xỉu  size M','Bạc xỉu phiên bản  size m, ngon tuyệt.',37000.00,'https://placehold.co/300x200?text=Bạc+xỉu++size+M',1,'2025-12-09 19:03:55'),(34,6,'Capuchino','Capuchino thơm ngon, đậm đà hương vị.',52000.00,'https://placehold.co/300x200?text=Capuchino',1,'2025-12-09 19:03:55'),(35,6,'Capuchino Đặc biệt','Capuchino phiên bản đặc biệt, ngon tuyệt.',43000.00,'https://placehold.co/300x200?text=Capuchino+Đặc+biệt',1,'2025-12-09 19:03:55'),(36,6,'Capuchino Thượng hạng','Capuchino phiên bản thượng hạng, ngon tuyệt.',69000.00,'https://placehold.co/300x200?text=Capuchino+Thượng+hạng',1,'2025-12-09 19:03:55'),(37,6,'Capuchino Truyền thống','Capuchino phiên bản truyền thống, ngon tuyệt.',66000.00,'https://placehold.co/300x200?text=Capuchino+Truyền+thống',1,'2025-12-09 19:03:55'),(38,6,'Capuchino Sữa tươi','Capuchino phiên bản sữa tươi, ngon tuyệt.',48000.00,'https://placehold.co/300x200?text=Capuchino+Sữa+tươi',1,'2025-12-09 19:03:55'),(39,6,'Capuchino Kem cheese','Capuchino phiên bản kem cheese, ngon tuyệt.',64000.00,'https://placehold.co/300x200?text=Capuchino+Kem+cheese',1,'2025-12-09 19:03:55'),(40,6,'Capuchino Full topping','Capuchino phiên bản full topping, ngon tuyệt.',50000.00,'https://placehold.co/300x200?text=Capuchino+Full+topping',1,'2025-12-09 19:03:55'),(41,6,'Capuchino  size L','Capuchino phiên bản  size l, ngon tuyệt.',67000.00,'https://placehold.co/300x200?text=Capuchino++size+L',1,'2025-12-09 19:03:55'),(42,6,'Capuchino  size M','Capuchino phiên bản  size m, ngon tuyệt.',39000.00,'https://placehold.co/300x200?text=Capuchino++size+M',1,'2025-12-09 19:03:55'),(43,6,'Latte','Latte thơm ngon, đậm đà hương vị.',30000.00,'https://placehold.co/300x200?text=Latte',1,'2025-12-09 19:03:55'),(44,6,'Latte Đặc biệt','Latte phiên bản đặc biệt, ngon tuyệt.',46000.00,'https://placehold.co/300x200?text=Latte+Đặc+biệt',1,'2025-12-09 19:03:55'),(45,6,'Latte Thượng hạng','Latte phiên bản thượng hạng, ngon tuyệt.',28000.00,'https://placehold.co/300x200?text=Latte+Thượng+hạng',1,'2025-12-09 19:03:55'),(46,6,'Latte Truyền thống','Latte phiên bản truyền thống, ngon tuyệt.',60000.00,'https://placehold.co/300x200?text=Latte+Truyền+thống',1,'2025-12-09 19:03:55'),(47,6,'Latte Sữa tươi','Latte phiên bản sữa tươi, ngon tuyệt.',66000.00,'https://placehold.co/300x200?text=Latte+Sữa+tươi',1,'2025-12-09 19:03:55'),(48,6,'Latte Kem cheese','Latte phiên bản kem cheese, ngon tuyệt.',35000.00,'https://placehold.co/300x200?text=Latte+Kem+cheese',1,'2025-12-09 19:03:55'),(49,6,'Latte Full topping','Latte phiên bản full topping, ngon tuyệt.',68000.00,'https://placehold.co/300x200?text=Latte+Full+topping',1,'2025-12-09 19:03:55'),(50,6,'Latte  size L','Latte phiên bản  size l, ngon tuyệt.',60000.00,'https://placehold.co/300x200?text=Latte++size+L',1,'2025-12-09 19:03:55'),(51,6,'Latte  size M','Latte phiên bản  size m, ngon tuyệt.',68000.00,'https://placehold.co/300x200?text=Latte++size+M',1,'2025-12-09 19:03:55'),(52,6,'Espresso','Espresso thơm ngon, đậm đà hương vị.',32000.00,'https://placehold.co/300x200?text=Espresso',1,'2025-12-09 19:03:55'),(53,6,'Espresso Đặc biệt','Espresso phiên bản đặc biệt, ngon tuyệt.',28000.00,'https://placehold.co/300x200?text=Espresso+Đặc+biệt',1,'2025-12-09 19:03:55'),(54,6,'Espresso Thượng hạng','Espresso phiên bản thượng hạng, ngon tuyệt.',69000.00,'https://placehold.co/300x200?text=Espresso+Thượng+hạng',1,'2025-12-09 19:03:55'),(55,6,'Espresso Truyền thống','Espresso phiên bản truyền thống, ngon tuyệt.',25000.00,'https://placehold.co/300x200?text=Espresso+Truyền+thống',1,'2025-12-09 19:03:55'),(56,6,'Espresso Sữa tươi','Espresso phiên bản sữa tươi, ngon tuyệt.',44000.00,'https://placehold.co/300x200?text=Espresso+Sữa+tươi',1,'2025-12-09 19:03:55'),(57,6,'Espresso Kem cheese','Espresso phiên bản kem cheese, ngon tuyệt.',43000.00,'https://placehold.co/300x200?text=Espresso+Kem+cheese',1,'2025-12-09 19:03:55'),(58,6,'Espresso Full topping','Espresso phiên bản full topping, ngon tuyệt.',70000.00,'https://placehold.co/300x200?text=Espresso+Full+topping',1,'2025-12-09 19:03:55'),(59,6,'Espresso  size L','Espresso phiên bản  size l, ngon tuyệt.',33000.00,'https://placehold.co/300x200?text=Espresso++size+L',1,'2025-12-09 19:03:55'),(60,6,'Espresso  size M','Espresso phiên bản  size m, ngon tuyệt.',30000.00,'https://placehold.co/300x200?text=Espresso++size+M',1,'2025-12-09 19:03:55'),(61,6,'Americano','Americano thơm ngon, đậm đà hương vị.',33000.00,'https://placehold.co/300x200?text=Americano',1,'2025-12-09 19:03:55'),(62,6,'Americano Đặc biệt','Americano phiên bản đặc biệt, ngon tuyệt.',54000.00,'https://placehold.co/300x200?text=Americano+Đặc+biệt',1,'2025-12-09 19:03:55'),(63,6,'Americano Thượng hạng','Americano phiên bản thượng hạng, ngon tuyệt.',39000.00,'https://placehold.co/300x200?text=Americano+Thượng+hạng',1,'2025-12-09 19:03:55'),(64,6,'Americano Truyền thống','Americano phiên bản truyền thống, ngon tuyệt.',46000.00,'https://placehold.co/300x200?text=Americano+Truyền+thống',1,'2025-12-09 19:03:55'),(65,6,'Americano Sữa tươi','Americano phiên bản sữa tươi, ngon tuyệt.',58000.00,'https://placehold.co/300x200?text=Americano+Sữa+tươi',1,'2025-12-09 19:03:55'),(66,6,'Americano Kem cheese','Americano phiên bản kem cheese, ngon tuyệt.',64000.00,'https://placehold.co/300x200?text=Americano+Kem+cheese',1,'2025-12-09 19:03:55'),(67,6,'Americano Full topping','Americano phiên bản full topping, ngon tuyệt.',35000.00,'https://placehold.co/300x200?text=Americano+Full+topping',1,'2025-12-09 19:03:55'),(68,6,'Americano  size L','Americano phiên bản  size l, ngon tuyệt.',59000.00,'https://placehold.co/300x200?text=Americano++size+L',1,'2025-12-09 19:03:55'),(69,6,'Americano  size M','Americano phiên bản  size m, ngon tuyệt.',61000.00,'https://placehold.co/300x200?text=Americano++size+M',1,'2025-12-09 19:03:55'),(70,6,'Mocha','Mocha thơm ngon, đậm đà hương vị.',42000.00,'https://placehold.co/300x200?text=Mocha',1,'2025-12-09 19:03:55'),(71,6,'Mocha Đặc biệt','Mocha phiên bản đặc biệt, ngon tuyệt.',25000.00,'https://placehold.co/300x200?text=Mocha+Đặc+biệt',1,'2025-12-09 19:03:55'),(72,6,'Mocha Thượng hạng','Mocha phiên bản thượng hạng, ngon tuyệt.',69000.00,'https://placehold.co/300x200?text=Mocha+Thượng+hạng',1,'2025-12-09 19:03:55'),(73,6,'Mocha Truyền thống','Mocha phiên bản truyền thống, ngon tuyệt.',49000.00,'https://placehold.co/300x200?text=Mocha+Truyền+thống',1,'2025-12-09 19:03:55'),(74,6,'Mocha Sữa tươi','Mocha phiên bản sữa tươi, ngon tuyệt.',62000.00,'https://placehold.co/300x200?text=Mocha+Sữa+tươi',1,'2025-12-09 19:03:55'),(75,6,'Mocha Kem cheese','Mocha phiên bản kem cheese, ngon tuyệt.',68000.00,'https://placehold.co/300x200?text=Mocha+Kem+cheese',1,'2025-12-09 19:03:55'),(76,6,'Mocha Full topping','Mocha phiên bản full topping, ngon tuyệt.',26000.00,'https://placehold.co/300x200?text=Mocha+Full+topping',1,'2025-12-09 19:03:55'),(77,6,'Mocha  size L','Mocha phiên bản  size l, ngon tuyệt.',70000.00,'https://placehold.co/300x200?text=Mocha++size+L',1,'2025-12-09 19:03:55'),(78,6,'Mocha  size M','Mocha phiên bản  size m, ngon tuyệt.',69000.00,'https://placehold.co/300x200?text=Mocha++size+M',1,'2025-12-09 19:03:55'),(79,7,'Trà đào','Trà đào thơm ngon, đậm đà hương vị.',53000.00,'https://placehold.co/300x200?text=Trà+đào',1,'2025-12-09 19:03:55'),(80,7,'Trà đào Đặc biệt','Trà đào phiên bản đặc biệt, ngon tuyệt.',68000.00,'https://placehold.co/300x200?text=Trà+đào+Đặc+biệt',1,'2025-12-09 19:03:55'),(81,7,'Trà đào Thượng hạng','Trà đào phiên bản thượng hạng, ngon tuyệt.',47000.00,'https://placehold.co/300x200?text=Trà+đào+Thượng+hạng',1,'2025-12-09 19:03:55'),(82,7,'Trà đào Truyền thống','Trà đào phiên bản truyền thống, ngon tuyệt.',49000.00,'https://placehold.co/300x200?text=Trà+đào+Truyền+thống',1,'2025-12-09 19:03:55'),(83,7,'Trà đào Sữa tươi','Trà đào phiên bản sữa tươi, ngon tuyệt.',41000.00,'https://placehold.co/300x200?text=Trà+đào+Sữa+tươi',1,'2025-12-09 19:03:55'),(84,7,'Trà đào Kem cheese','Trà đào phiên bản kem cheese, ngon tuyệt.',25000.00,'https://placehold.co/300x200?text=Trà+đào+Kem+cheese',1,'2025-12-09 19:03:55'),(85,7,'Trà đào Full topping','Trà đào phiên bản full topping, ngon tuyệt.',58000.00,'https://placehold.co/300x200?text=Trà+đào+Full+topping',1,'2025-12-09 19:03:55'),(86,7,'Trà đào  size L','Trà đào phiên bản  size l, ngon tuyệt.',39000.00,'https://placehold.co/300x200?text=Trà+đào++size+L',1,'2025-12-09 19:03:55'),(87,7,'Trà đào  size M','Trà đào phiên bản  size m, ngon tuyệt.',51000.00,'https://placehold.co/300x200?text=Trà+đào++size+M',1,'2025-12-09 19:03:55'),(88,7,'Trà vải','Trà vải thơm ngon, đậm đà hương vị.',22000.00,'https://placehold.co/300x200?text=Trà+vải',1,'2025-12-09 19:03:55'),(89,7,'Trà vải Đặc biệt','Trà vải phiên bản đặc biệt, ngon tuyệt.',36000.00,'https://placehold.co/300x200?text=Trà+vải+Đặc+biệt',1,'2025-12-09 19:03:55'),(90,7,'Trà vải Thượng hạng','Trà vải phiên bản thượng hạng, ngon tuyệt.',70000.00,'https://placehold.co/300x200?text=Trà+vải+Thượng+hạng',1,'2025-12-09 19:03:55'),(91,7,'Trà vải Truyền thống','Trà vải phiên bản truyền thống, ngon tuyệt.',41000.00,'https://placehold.co/300x200?text=Trà+vải+Truyền+thống',1,'2025-12-09 19:03:55'),(92,7,'Trà vải Sữa tươi','Trà vải phiên bản sữa tươi, ngon tuyệt.',25000.00,'https://placehold.co/300x200?text=Trà+vải+Sữa+tươi',1,'2025-12-09 19:03:55'),(93,7,'Trà vải Kem cheese','Trà vải phiên bản kem cheese, ngon tuyệt.',53000.00,'https://placehold.co/300x200?text=Trà+vải+Kem+cheese',1,'2025-12-09 19:03:55'),(94,7,'Trà vải Full topping','Trà vải phiên bản full topping, ngon tuyệt.',51000.00,'https://placehold.co/300x200?text=Trà+vải+Full+topping',1,'2025-12-09 19:03:55'),(95,7,'Trà vải  size L','Trà vải phiên bản  size l, ngon tuyệt.',37000.00,'https://placehold.co/300x200?text=Trà+vải++size+L',1,'2025-12-09 19:03:55'),(96,7,'Trà vải  size M','Trà vải phiên bản  size m, ngon tuyệt.',49000.00,'https://placehold.co/300x200?text=Trà+vải++size+M',1,'2025-12-09 19:03:55'),(97,7,'Trà sen','Trà sen thơm ngon, đậm đà hương vị.',27000.00,'https://placehold.co/300x200?text=Trà+sen',1,'2025-12-09 19:03:55'),(98,7,'Trà sen Đặc biệt','Trà sen phiên bản đặc biệt, ngon tuyệt.',46000.00,'https://placehold.co/300x200?text=Trà+sen+Đặc+biệt',1,'2025-12-09 19:03:55'),(99,7,'Trà sen Thượng hạng','Trà sen phiên bản thượng hạng, ngon tuyệt.',64000.00,'https://placehold.co/300x200?text=Trà+sen+Thượng+hạng',1,'2025-12-09 19:03:55'),(100,7,'Trà sen Truyền thống','Trà sen phiên bản truyền thống, ngon tuyệt.',52000.00,'https://placehold.co/300x200?text=Trà+sen+Truyền+thống',1,'2025-12-09 19:03:55'),(101,7,'Trà sen Sữa tươi','Trà sen phiên bản sữa tươi, ngon tuyệt.',42000.00,'https://placehold.co/300x200?text=Trà+sen+Sữa+tươi',1,'2025-12-09 19:03:55'),(102,7,'Trà sen Kem cheese','Trà sen phiên bản kem cheese, ngon tuyệt.',66000.00,'https://placehold.co/300x200?text=Trà+sen+Kem+cheese',1,'2025-12-09 19:03:55'),(103,7,'Trà sen Full topping','Trà sen phiên bản full topping, ngon tuyệt.',31000.00,'https://placehold.co/300x200?text=Trà+sen+Full+topping',1,'2025-12-09 19:03:55'),(104,7,'Trà sen  size L','Trà sen phiên bản  size l, ngon tuyệt.',64000.00,'https://placehold.co/300x200?text=Trà+sen++size+L',1,'2025-12-09 19:03:55'),(105,7,'Trà sen  size M','Trà sen phiên bản  size m, ngon tuyệt.',59000.00,'https://placehold.co/300x200?text=Trà+sen++size+M',1,'2025-12-09 19:03:55'),(106,7,'Trà lài','Trà lài thơm ngon, đậm đà hương vị.',21000.00,'https://placehold.co/300x200?text=Trà+lài',1,'2025-12-09 19:03:55');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('CUSTOMER','ADMIN') COLLATE utf8mb4_unicode_ci DEFAULT 'CUSTOMER',
  `api_key` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin123','Quản trị viên',NULL,'0123456789','Hà Nội','ADMIN','secret_admin_key_123',1,'2025-11-28 00:09:36'),(2,'verUser1','$2b$10$i9KSkzfe3E3UwLVb8LPjJ.uc9ix13zPgDEEvWUf1BkOMykIQ9UXC6','Verify User','verify@example.com',NULL,NULL,'CUSTOMER',NULL,1,'2025-12-18 12:10:14'),(3,'lilqd05','$2b$10$9.kd8GpASZbEAS0VBYNLvujTWOmkd9Jac8UQWmgbr164HW9xblP0W','Dung','temp@gmail.com',NULL,NULL,'CUSTOMER',NULL,1,'2025-12-18 12:16:00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-18 12:20:16

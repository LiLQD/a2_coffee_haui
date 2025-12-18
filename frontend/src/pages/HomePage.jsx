// src/pages/HomePage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../assets/styles/home.css";
import hauiLogo from "../assets/images/haui-logo.png";

import { fetchProducts } from "../services/productApi";
import { getCart, setCart } from "../utils/cartStore";
import { getUser } from "../utils/authStore";

function normalize(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function getProductImage(imageNameOrUrl) {
  if (!imageNameOrUrl) return null;

  if (imageNameOrUrl.startsWith("http") || imageNameOrUrl.startsWith("/")) {
    return imageNameOrUrl;
  }

  try {
    return new URL(`../assets/images/${imageNameOrUrl}`, import.meta.url).href;
  } catch (e) {
    console.warn("Không tìm thấy ảnh:", imageNameOrUrl, e);
    return null;
  }
}

export default function HomePage() {
  const navigate = useNavigate();
  const currentUser = getUser();

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const [cartCount, setCartCount] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const products = await fetchProducts(true);
        if (cancelled) return;

        setItems(products);
        setFilteredItems(products);

        const cats = Array.from(
          new Set(products.map((p) => p.category || p.category_id || "Khác"))
        );
        setCategories(cats);
      } catch (err) {
        console.error("Lỗi loadProducts:", err);
        if (!cancelled) {
          setError(err.message || "Không tải được menu");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();

    try {
      const cart = getCart();
      const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(total);
    } catch (e) {
      console.warn("Không đọc được cart từ localStorage:", e);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const q = normalize(search);
    const result = items.filter((item) => {
      const cat = item.category || item.category_id || "Khác";
      if (activeCategory !== "Tất cả" && cat !== activeCategory) return false;
      if (!q) return true;

      const name = normalize(item.name);
      const desc = normalize(item.description);
      const catNorm = normalize(String(cat));

      return name.includes(q) || desc.includes(q) || catNorm.includes(q);
    });

    setFilteredItems(result);
  }, [items, search, activeCategory]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const selectCategory = (cat) => {
    setActiveCategory(cat);
  };

  const handleAddToCart = (product) => {
    try {
      const cart = getCart();
      const index = cart.findIndex((c) => c.id === product.id);
      if (index >= 0) {
        cart[index].quantity = (cart[index].quantity || 1) + 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image_url: product.image_url || product.imageUrl || null,
          quantity: 1,
        });
      }

      setCart(cart);
      const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(total);
    } catch (err) {
      console.error("Không thêm được vào giỏ hàng:", err);
      alert("Không thêm được vào giỏ hàng");
    }
  };

  const openDetailModal = (item) => {
    setSelectedItem(item);
    setQty(1);
  };

  const closeDetailModal = () => {
    setSelectedItem(null);
    setQty(1);
  };

  const handleAddFromModal = () => {
    if (!selectedItem) return;
    for (let i = 0; i < qty; i++) {
      handleAddToCart(selectedItem);
    }
    closeDetailModal();
  };

  const goToCart = () => navigate("/cart");
  const goToOrderHistory = () => navigate("/orders");
  const goToBulkImport = () => navigate("/admin/bulkimport");
  const goToDashboard = () => navigate("/admin/dashboard");
  const goToInvoices = () => navigate("/admin/invoices"); // ✅ THÊM DÒNG NÀY

  return (
    <div className="home-container">
      {/* HEADER */}
      <header className="home-header">
        <div className="header-left">
          <img src={hauiLogo} alt="HaUI" className="header-logo" />
          <span className="brand-name">A2 BREAKFAST HAUI</span>
        </div>

        <div className="header-center">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm theo tên / mô tả / danh mục..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="header-right">
          <button className="icon-button" onClick={goToCart}>
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          <button className="icon-button" onClick={goToOrderHistory}>
            📜
          </button>

          {currentUser?.role === "ADMIN" && (
            <>

              <button className="icon-button" onClick={goToDashboard}>
                📊
              </button>

            </>
          )}


        </div>
      </header>

      {/* NAV DANH MỤC */}
      <nav className="nav-categories">
        <button
          className={`nav-item ${activeCategory === "Tất cả" ? "active" : ""}`}
          onClick={() => selectCategory("Tất cả")}
        >
          Tất cả
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`nav-item ${activeCategory === cat ? "active" : ""}`}
            onClick={() => selectCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* MAIN */}
      <main className="home-main">
        {loading && <p>Đang tải menu...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && filteredItems.length === 0 && (
          <p>Không có món nào phù hợp.</p>
        )}

        <div className="product-grid">
          {filteredItems.map((item) => {
            const imgSrc = getProductImage(
              item.image_url || item.imageUrl || null
            );

            return (
              <div
                key={item.id}
                className="product-card"
                onClick={() => openDetailModal(item)}
              >
                <div className="product-image-wrapper">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={item.name}
                      className="product-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="product-image placeholder">No Image</div>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{item.name}</h3>
                  <p className="product-desc">{item.description}</p>
                  <div className="product-footer">
                    <span className="product-price">
                      {Number(item.price).toLocaleString("vi-VN")} đ
                    </span>
                    <button
                      className="add-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* MODAL CHI TIẾT */}
      {selectedItem && (
        <div className="modal-backdrop" onClick={closeDetailModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedItem.name}</h2>
            <p>{selectedItem.description}</p>
            <p>
              Giá:{" "}
              <strong>
                {Number(selectedItem.price).toLocaleString("vi-VN")} đ
              </strong>
            </p>

            <div className="qty-row">
              <span>Số lượng:</span>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) =>
                  setQty(Math.max(1, Number(e.target.value)))
                }
              />
            </div>

            <div className="modal-actions">
              <button onClick={closeDetailModal}>Đóng</button>
              <button onClick={handleAddFromModal}>Thêm vào giỏ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
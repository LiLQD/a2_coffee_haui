// src/pages/HomePage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../assets/styles/home.css";
import hauiLogo from "../assets/images/haui-logo.png";

// gọi API lấy sản phẩm từ backend
import { fetchProducts } from "../services/productApi";

// dùng chung cart với CartPage (nếu tên hàm khác thì sửa lại cho khớp)
import { getCart, setCart } from "../utils/cartStore";

/**
 * Hàm bỏ dấu tiếng Việt + về chữ thường để search dễ hơn
 */
function normalize(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

export default function HomePage() {
  const navigate = useNavigate();

  // tạm thời hard-code, sau này thay bằng role từ Auth
  const isAdmin = true;

  // STATE CHÍNH
  const [items, setItems] = useState([]);              // tất cả món
  const [filteredItems, setFilteredItems] = useState([]); // danh sách sau lọc
  const [categories, setCategories] = useState([]);    // danh sách danh mục

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // STATE UI
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("Tất cả");

  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  const [cartCount, setCartCount] = useState(0);

  const [selectedItem, setSelectedItem] = useState(null);
  const [qty, setQty] = useState(1);

  // --------------------------------------------------
  // 1. Lấy dữ liệu sản phẩm từ backend
  // --------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        // chỉ lấy món đang bật
        const products = await fetchProducts(true);

        if (cancelled) return;

        setItems(products);
        setFilteredItems(products);

        // lấy danh mục từ trường category hoặc category_id
        const cats = Array.from(
          new Set(
            products.map((p) => p.category || p.category_id || "Khác")
          )
        );
        setCategories(cats);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(err.message || "Không tải được menu");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();

    // khởi tạo cartCount từ localStorage (nếu đã có dữ liệu)
    try {
      const cart = getCart ? getCart() : [];
      const total = Array.isArray(cart)
        ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
        : 0;
      setCartCount(total);
    } catch (e) {
      console.warn("Không đọc được cart từ localStorage:", e);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  // --------------------------------------------------
  // 2. Lọc theo danh mục + search
  // --------------------------------------------------
  useEffect(() => {
    const q = normalize(search);

    const result = items.filter((item) => {
      // lọc theo danh mục
      const cat = item.category || item.category_id || "Khác";
      if (active !== "Tất cả" && cat !== active) return false;

      // lọc theo search
      if (!q) return true;

      const name = normalize(item.name);
      const desc = normalize(item.description);
      const catNorm = normalize(String(cat));

      return (
        name.includes(q) ||
        desc.includes(q) ||
        catNorm.includes(q)
      );
    });

    setFilteredItems(result);
  }, [items, search, active]);

  // --------------------------------------------------
  // 3. Xử lý click ngoài dropdown "Thêm"
  // --------------------------------------------------
  useEffect(() => {
    function handleClickOutside(e) {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --------------------------------------------------
  // 4. Hàm tiện ích
  // --------------------------------------------------
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const selectCategory = (cat) => {
    setActive(cat);
  };

  const handleAddToCart = (product) => {
    try {
      const cart = getCart ? getCart() : [];

      const existingIndex = cart.findIndex((c) => c.id === product.id);
      if (existingIndex >= 0) {
        cart[existingIndex].quantity =
          (cart[existingIndex].quantity || 1) + 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      if (setCart) {
        setCart(cart);
      } else {
        // fallback nếu bạn chưa dùng cartStore
        localStorage.setItem("cart", JSON.stringify(cart));
      }

      const total = cart.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      );
      setCartCount(total);
      alert("Đã thêm vào giỏ hàng");
    } catch (err) {
      console.error(err);
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

  const goToCart = () => {
    navigate("/cart");
  };

  const goToBulkImport = () => {
    navigate("/bulkimport");
  };

  // --------------------------------------------------
  // 5. JSX
  // --------------------------------------------------
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
          {/* Giỏ hàng */}
          <button className="icon-button" onClick={goToCart}>
            🛒
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>

          {/* Lịch sử đơn / hoá đơn giả định */}
          <button className="icon-button" onClick={() => alert("Chưa làm!")}>
            📜
          </button>

          {/* Admin + dropdown thêm */}
          {isAdmin && (
            <div className="dropdown" ref={moreRef}>
              <button
                className="icon-button"
                onClick={() => setMoreOpen((s) => !s)}
              >
                ⋮
              </button>
              {moreOpen && (
                <div className="dropdown-menu">
                  <button onClick={goToBulkImport}>
                    📥 Bulk import món
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* NAV DANH MỤC */}
      <nav className="nav-categories">
        <button
          className={`nav-item ${active === "Tất cả" ? "active" : ""}`}
          onClick={() => selectCategory("Tất cả")}
        >
          Tất cả
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`nav-item ${active === cat ? "active" : ""}`}
            onClick={() => selectCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT */}
      <main className="home-main">
        {loading && <p>Đang tải menu...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && filteredItems.length === 0 && (
          <p>Không có món nào phù hợp.</p>
        )}

        <div className="product-grid">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="product-card"
              onClick={() => openDetailModal(item)}
            >
              <div className="product-image-wrapper">
                {item.image_url || item.imageUrl ? (
                  <img
                    src={item.image_url || item.imageUrl}
                    alt={item.name}
                    className="product-image"
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
                      e.stopPropagation(); // tránh mở modal
                      handleAddToCart(item);
                    }}
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL CHI TIẾT + CHỌN SỐ LƯỢNG */}
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
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
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

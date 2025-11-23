import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import logo from "../assets/haui-logo.png";
import { getItems } from "../utils/menuStore"; 
import { addToCart } from "../utils/cartStore";

const BASE_CATEGORIES = ["Tất cả", "Đồ ăn", "Đồ uống", "Tráng miệng"];
const MORE_CATEGORIES = ["Pizza/Burger", "Món lẩu", "Sushi", "Mì phở", "Cơm hộp"];

export default function Home() {
  const navigate = useNavigate();

  // dữ liệu + UI state
  const [items, setItems] = useState([]);         // tất cả món (từ localStorage)
  const [active, setActive] = useState("Tất cả"); // danh mục đang chọn
  const [search, setSearch] = useState("");       // từ khóa tìm kiếm
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const [cartCount, setCartCount] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [qty, setQty] = useState(1);



  useEffect(() => {
    setItems(getItems());
  }, []);

  // đóng dropdown khi click ra ngoài / ESC
  useEffect(() => {
    const onClick = (e) => { if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false); };
    const onKey = (e) => e.key === "Escape" && setMoreOpen(false);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", onClick); document.removeEventListener("keydown", onKey); };
  }, []);

  const handleLogout = () => navigate("/", { replace: true });

  const normalize = (s) =>
    (s || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // bỏ dấu tiếng Việt để tìm kiếm dễ

  const matchSearch = (item) => {
    const q = normalize(search);
    if (!q) return true;
    return (
      normalize(item.name).includes(q) ||
      normalize(item.description).includes(q) ||
      normalize(item.category).includes(q)
    );
  };

  const matchCategory = (item) => {
    if (active === "Tất cả") return true;
    return item.category === active;
  };

  const filtered = items.filter((it) => matchCategory(it) && matchSearch(it));

  const selectCategory = (label) => {
    setActive(label);
    setMoreOpen(false);
  };

  const formatVND = (n) =>
    (Number(n) || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

  return (
    <div className="home-container">
      {/* ---------- HEADER ---------- */}
      <header className="home-header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="home-logo" />
          <h1 className="site-title">A2-COFFEE-HAUI</h1>
        </div>

        {/* Ô tìm kiếm ở giữa header */}
        <div className="header-center">
          <input
            className="search-bar"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên / mô tả / danh mục…"
          />
        </div>

        <div className="header-right">
          <div className="cart-container" onClick={() => navigate("/cart")}>
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>

          <button className="icon-btn" title="Thông báo">🔔</button>
          <div className="user-account" title="Tài khoản"><span>A</span></div>
          <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
        </div>

      </header>

      {/* ---------- NAV (danh mục) ---------- */}
      <nav className="home-nav" aria-label="Bộ lọc danh mục">
        {BASE_CATEGORIES.map((label) => (
          <button
            key={label}
            className={`nav-item ${active === label ? "active" : ""}`}
            onClick={() => selectCategory(label)}
          >
            {label}
          </button>
        ))}

        {/* Xem thêm (dropdown) */}
        <div className="dropdown" ref={moreRef}>
          <button
            className={`dropdown-toggle ${moreOpen ? "open" : ""}`}
            onClick={() => setMoreOpen((s) => !s)}
            aria-haspopup="menu"
            aria-expanded={moreOpen}
          >
            Xem thêm <span className="caret">▾</span>
          </button>

          {moreOpen && (
            <div className="dropdown-menu" role="menu">
              {MORE_CATEGORIES.map((label) => (
                <button key={label} className="dropdown-item" onClick={() => selectCategory(label)} role="menuitem">
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* ---------- MAIN (card grid) ---------- */}
      <main className="home-main">
        {filtered.length === 0 ? (
          <p className="hint">
            Không tìm thấy món nào. {items.length === 0 ? "Bạn hãy nhập menu ở trang Import." : "Hãy thử đổi danh mục/từ khóa."}
          </p>
        ) : (
          <section className="menu-grid">
            {filtered.map((it) => (
              <article key={it.id} className={`menu-card ${it.available ? "" : "menu-card--off"}`}>
                <div className="menu-card__thumb">
                  {it.imageUrl ? <img src={it.imageUrl} alt={it.name} /> : <div className="thumb-fallback">No image</div>}
                  {!it.available && <span className="badge">Hết hàng</span>}
                </div>
                <div className="menu-card__body">
                  <h4 className="menu-card__title">{it.name}</h4>
                  <p className="menu-card__desc">{it.description || "—"}</p>
                </div>
                <div className="menu-card__footer">
                  <span className="price">{formatVND(it.price)}</span>
                  <span className="category">{it.category}</span>
                </div>
                <button
  className="order-btn"
  onClick={() => {
    setSelectedItem(it);
    setQty(1);
  }}
>
  🛒 Đặt hàng
</button>


              </article>
            ))}
          </section>
          
        )}
      </main>


{/* MODAL CHỌN SỐ LƯỢNG */}
{selectedItem && (
  <div className="qty-modal">
    <div className="qty-box">
      <h3>{selectedItem.name}</h3>

      <div className="qty-control">
        <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
        <span>{qty}</span>
        <button onClick={() => setQty(q => q + 1)}>+</button>
      </div>

      <button
        className="add-btn"
        onClick={() => {
          addToCart({ ...selectedItem }, qty);
          setSelectedItem(null);
        }}
      >
        Thêm vào giỏ hàng
      </button>

      <button className="close-btn" onClick={() => setSelectedItem(null)}>Hủy</button>
    </div>
  </div>
)}

    </div>
  );
  
}

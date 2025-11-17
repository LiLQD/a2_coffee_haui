// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../assets/styles/home.css"; 
// import logo from "../assets/images/haui-logo.png"; 

// const API_BASE_URL = "http://localhost:5173/api"; 
// export default function HomePage() {
//   const navigate = useNavigate();

//   // state dữ liệu
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [activeCategoryId, setActiveCategoryId] = useState("all");
//   const [search, setSearch] = useState("");

//   // state UI
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const [catRes, prodRes] = await Promise.all([
//           fetch(`${API_BASE_URL}/categories`),
//           fetch(`${API_BASE_URL}/products`),
//         ]);

//         if (!catRes.ok || !prodRes.ok) {
//           throw new Error("Không thể tải dữ liệu từ server");
//         }

//         const catData = await catRes.json();
//         const prodData = await prodRes.json();

//         setCategories(catData.data || catData || []);
//         setProducts(prodData.data || prodData || []);
//       } catch (err) {
//         console.error(err);
//         setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleLogout = () => {
//     // nếu bạn lưu token trong localStorage, có thể xóa ở đây
//     // localStorage.removeItem("accessToken");
//     navigate("/login", { replace: true });
//   };

//   const normalize = (s) =>
//     (s || "")
//       .toString()
//       .toLowerCase()
//       .normalize("NFD")
//       .replace(/[\u0300-\u036f]/g, "");

//   const matchSearch = (product) => {
//     const q = normalize(search);
//     if (!q) return true;
//     return (
//       normalize(product.name).includes(q) ||
//       normalize(product.description).includes(q) ||
//       normalize(product.categoryName || "") // nếu backend trả categoryName
//     );
//   };

//   const matchCategory = (product) => {
//     if (activeCategoryId === "all") return true;
//     return product.categoryId === activeCategoryId;
//   };

//   const filteredProducts = products.filter(
//     (p) => matchCategory(p) && matchSearch(p)
//   );

//   const formatVND = (n) =>
//     (Number(n) || 0).toLocaleString("vi-VN", {
//       style: "currency",
//       currency: "VND",
//       maximumFractionDigits: 0,
//     });

//   const handleAddToCart = async (product) => {
//     try {
//       // tùy cách thiết kế auth, có thể cần token:
//       // const token = localStorage.getItem("accessToken");
//       const res = await fetch(`${API_BASE_URL}/cart/items`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           // Authorization: token ? `Bearer ${token}` : undefined,
//         },
//         body: JSON.stringify({
//           productId: product.id,
//           quantity: 1,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error("Không thể thêm vào giỏ hàng");
//       }

//       // có thể đọc res.json() nếu backend trả data
//       // const data = await res.json();
//       alert("Đã thêm vào giỏ hàng");
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Thêm vào giỏ hàng thất bại");
//     }
//   };

//   return (
//     <div className="home-container">
//       {/* ---------- HEADER ---------- */}
//       <header className="home-header">
//         <div className="header-left">
//           <img src={logo} alt="Logo" className="home-logo" />
//           <h1 className="site-title">A2 BREAKFAST HAUI</h1>
//         </div>

//         {/* Ô tìm kiếm ở giữa header */}
//         <div className="header-center">
//           <input
//             className="search-bar"
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Tìm theo tên / mô tả / danh mục…"
//           />
//         </div>

//         <div className="header-right">
//           <button
//             className="icon-btn"
//             title="Giỏ hàng"
//             onClick={() => navigate("/cart")}
//           >
//             🛒
//           </button>
//           <button
//             className="icon-btn"
//             title="Lịch sử đơn hàng"
//             onClick={() => navigate("/orders")}
//           >
//             📜
//           </button>
//           <div
//             className="user-account"
//             title="Tài khoản"
//             onClick={() => navigate("/profile")}
//           >
//             <span>A</span>
//           </div>
//           <button className="logout-btn" onClick={handleLogout}>
//             Đăng xuất
//           </button>
//         </div>
//       </header>

//       {/* ---------- NAV (danh mục) ---------- */}
//       <nav className="home-nav" aria-label="Bộ lọc danh mục">
//         <button
//           className={`nav-item ${activeCategoryId === "all" ? "active" : ""}`}
//           onClick={() => setActiveCategoryId("all")}
//         >
//           Tất cả
//         </button>

//         {categories.map((cat) => (
//           <button
//             key={cat.id}
//             className={`nav-item ${
//               activeCategoryId === cat.id ? "active" : ""
//             }`}
//             onClick={() => setActiveCategoryId(cat.id)}
//           >
//             {cat.name}
//           </button>
//         ))}
//       </nav>

//       {/* ---------- MAIN (card grid) ---------- */}
//       <main className="home-main">
//         {loading && <p className="hint">Đang tải dữ liệu...</p>}
//         {error && !loading && <p className="error">{error}</p>}

//         {!loading && !error && filteredProducts.length === 0 && (
//           <p className="hint">Không tìm thấy món nào phù hợp.</p>
//         )}

//         {!loading && !error && filteredProducts.length > 0 && (
//           <section className="menu-grid">
//             {filteredProducts.map((p) => (
//               <article
//                 key={p.id}
//                 className={`menu-card ${p.is_active === 0 ? "menu-card--off" : ""
//                   }`}
//               >
//                 <div className="menu-card__thumb">
//                   {p.image_url ? (
//                     <img src={p.image_url} alt={p.name} />
//                   ) : (
//                     <div className="thumb-fallback">No image</div>
//                   )}
//                   {p.is_active === 0 && (
//                     <span className="badge">Tạm ngưng</span>
//                   )}
//                 </div>
//                 <div className="menu-card__body">
//                   <h4 className="menu-card__title">{p.name}</h4>
//                   <p className="menu-card__desc">
//                     {p.description || "—"}
//                   </p>
//                 </div>
//                 <div className="menu-card__footer">
//                   <div className="left">
//                     <span className="price">{formatVND(p.price)}</span>
//                     {p.categoryName && (
//                       <span className="category">{p.categoryName}</span>
//                     )}
//                   </div>
//                   <button
//                     className="add-to-cart-btn"
//                     disabled={p.is_active === 0}
//                     onClick={() => handleAddToCart(p)}
//                   >
//                     Thêm vào giỏ
//                   </button>
//                 </div>
//               </article>
//             ))}
//           </section>
//         )}
//       </main>
//     </div>
//   );
// }


import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <h2>Trang chủ A2 Breakfast HaUI</h2>
      <p>Nếu bạn thấy được dòng này thì frontend đã chạy OK.</p>
      <p>
        <Link to="/login">Đi tới trang đăng nhập</Link>
      </p>
    </div>
  );
}

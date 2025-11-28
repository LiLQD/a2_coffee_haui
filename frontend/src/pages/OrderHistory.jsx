// src/pages/OrderHistory.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/orderHistory.css"; 

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Tạm thời hard-code userId = 1 (sau này thay bằng user login thực tế)
const MOCK_USER_ID = 1;

export default function OrderHistory() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      try {
        setLoading(true);
        setError("");

        // 1. Lấy danh sách order của user
        const res = await fetch(
          `${API_BASE_URL}/orders?userId=${MOCK_USER_ID}`
        );
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = await res.json();
        const baseOrders = json.data || [];

        if (cancelled || baseOrders.length === 0) {
          if (!cancelled) setOrders([]);
          return;
        }

        // 2. Với mỗi order, gọi thêm /orders/:id để lấy items
        const ordersWithItems = await Promise.all(
          baseOrders.map(async (o) => {
            try {
              const detailRes = await fetch(`${API_BASE_URL}/orders/${o.id}`);
              if (!detailRes.ok) throw new Error();
              const detailJson = await detailRes.json();
              const detail = detailJson.data || {};
              return {
                ...o,
                items: detail.items || [],
              };
            } catch (e) {
              console.warn("Không lấy được chi tiết order", o.id, e);
              return { ...o, items: [] };
            }
          })
        );

        if (!cancelled) {
          setOrders(ordersWithItems);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Không tải được lịch sử đơn hàng. Vui lòng thử lại sau.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatDateTime = (value) => {
    if (!value) return "";
    try {
      return new Date(value).toLocaleString("vi-VN");
    } catch {
      return value;
    }
  };

  const formatMoney = (n) =>
    Number(n || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 });

  return (
    <div className="oh-wrapper">
      {/* Header */}
      <div className="oh-header">
        <button className="oh-back-btn" onClick={() => navigate("/home")}>
          ← Quay lại
        </button>
        <h2>Lịch sử đơn hàng</h2>
      </div>

      {loading && <p>Đang tải lịch sử đơn hàng...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="oh-empty">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="Empty"
          />
          <p>Chưa có đơn hàng nào.</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="oh-list">
          {orders.map((order) => (
            <div key={order.id} className="oh-card">
              {/* Header của từng đơn */}
              <div className="oh-card-head">
                <div>
                  <h3 className="oh-order-id">📦 Mã đơn: {order.id}</h3>
                  <p className="oh-date">
                    🕒 {formatDateTime(order.created_at)}
                  </p>
                </div>
                <div className="oh-total">
                  {formatMoney(order.total_amount)} đ
                </div>
              </div>

              {/* Thông tin khách hàng */}
              <div className="oh-info">
                <p>
                  <b>Khách hàng:</b> {order.customer_name}
                </p>
                <p>
                  <b>Địa chỉ:</b> {order.customer_address}
                </p>
                <p>
                  <b>SĐT:</b> {order.customer_phone}
                </p>
                <p>
                  <b>Trạng thái đơn:</b> {order.status}
                </p>
                <p>
                  <b>Thanh toán:</b> {order.payment_method} /{" "}
                  {order.payment_status}
                </p>
              </div>

              {/* Danh sách món trong đơn */}
              <div className="oh-items">
                {order.items && order.items.length > 0 ? (
                  order.items.map((it) => (
                    <div key={it.id} className="oh-item-row">
                      <img
                        src={it.image_url || "/images/default_food.png"}
                        alt={it.name}
                        className="oh-item-img"
                      />
                      <div className="oh-item-info">
                        <p className="oh-item-name">{it.name}</p>
                        <p className="oh-item-qty">
                          Số lượng: {it.quantity}
                        </p>
                      </div>
                      <div className="oh-item-price">
                        {formatMoney(Number(it.unit_price) * it.quantity)} đ
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: 14, color: "#777" }}>
                    (Không có dữ liệu chi tiết món ăn)
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

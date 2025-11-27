// src/pages/CheckoutPage.jsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/styles/checkOutPage.css";
import { getCart } from "../utils/cartStore";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Ưu tiên cart truyền từ CartPage qua state, nếu không thì đọc lại từ localStorage
  const cartFromState = location.state?.cart;

  const cart = useMemo(() => {
    if (Array.isArray(cartFromState) && cartFromState.length > 0) {
      return cartFromState;
    }
    try {
      const stored = getCart ? getCart() : [];
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }, [cartFromState]);

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const [form, setForm] = useState({
    fullName: "Nguyễn Văn A",
    email: "example@gmail.com",
    phone: "0901234567",
    address: "",
    receiveTime: "",
    note: "",
    payment_method: "CASH_ON_DELIVERY",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cart.length) {
      alert("Giỏ hàng đang trống, hãy chọn món trước.");
      navigate("/cart");
      return;
    }

    // Ở bước này chỉ submit giả, phần gọi API tạo order sẽ làm sau
    alert(
      `Đặt hàng demo thành công!\nTổng tiền: ${totalAmount.toLocaleString(
        "vi-VN"
      )} đ\n\nSau này sẽ gọi API /api/orders ở bước này.`
    );
  };

  return (
    <div className="checkout-page">
      <div className="checkout-card">
        {/* Link quay lại giỏ hàng */}
        <button
          type="button"
          className="checkout-back"
          onClick={() => navigate("/cart")}
        >
          ← Quay lại giỏ hàng
        </button>

        <h1 className="checkout-title">Thông tin thanh toán</h1>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-form-group">
            <label className="checkout-label">Họ và tên</label>
            <input
              type="text"
              className="checkout-input"
              value={form.fullName}
              onChange={handleChange("fullName")}
              required
            />
          </div>

          <div className="checkout-form-group">
            <label className="checkout-label">Email</label>
            <input
              type="email"
              className="checkout-input"
              value={form.email}
              onChange={handleChange("email")}
            />
          </div>

          <div className="checkout-form-group">
            <label className="checkout-label">Số điện thoại</label>
            <input
              type="tel"
              className="checkout-input"
              value={form.phone}
              onChange={handleChange("phone")}
              required
            />
          </div>

          <div className="checkout-form-group">
            <label className="checkout-label">Địa chỉ giao hàng</label>
            <input
              type="text"
              className="checkout-input"
              placeholder="Số nhà, đường, phường/xã..."
              value={form.address}
              onChange={handleChange("address")}
              required
            />
          </div>

          <div className="checkout-form-group">
            <label className="checkout-label">Thời gian nhận hàng (ghi chú)</label>
            <input
              type="text"
              className="checkout-input"
              placeholder="Ví dụ: Thứ 7 sau 14h, hoặc sáng Chủ nhật..."
              value={form.receiveTime}
              onChange={handleChange("receiveTime")}
            />
          </div>

          <div className="checkout-form-group">
            <label className="checkout-label">Ghi chú thêm</label>
            <textarea
              className="checkout-textarea"
              rows={3}
              placeholder="Yêu cầu đặc biệt, chuông hỏng, gửi bưu điện..."
              value={form.note}
              onChange={handleChange("note")}
            />
          </div>

          <div className="checkout-form-group">
            <label className="checkout-label">Phương thức thanh toán</label>
            <select
              className="checkout-select"
              value={form.payment_method}
              onChange={handleChange("payment_method")}
            >
              <option value="CASH_ON_DELIVERY">
                Thanh toán khi nhận hàng (COD)
              </option>
              <option value="MOCK">Thanh toán thử (mock)</option>
            </select>
          </div>

          {/* Tổng tiền */}
          <div className="checkout-summary">
            <span>Tổng tiền:</span>
            <strong>{totalAmount.toLocaleString("vi-VN")} đ</strong>
          </div>

          <button type="submit" className="checkout-submit">
            Xác nhận đặt hàng
          </button>
        </form>
      </div>
    </div>
  );
}

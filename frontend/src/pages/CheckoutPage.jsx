import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/checkOutPage.css";
import { getCart, clearCart } from "../utils/cartStore";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const cart = getCart ? getCart() : [];

  const totalAmount = useMemo(
    () =>
      (Array.isArray(cart) ? cart : []).reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
        0
      ),
    [cart]
  );

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    payment_method: "CASH_ON_DELIVERY",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    navigate("/cart");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cart || !cart.length) {
      alert("Giỏ hàng đang trống.");
      return;
    }

    try {
      const payload = {
        userId: 1, // tạm thời hard-code; sau nối với hệ thống đăng nhập
        customer: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          email: form.email,
          payment_method: form.payment_method,
        },
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity || 1,
          unitPrice: Number(item.price) || 0,
        })),
        totalAmount,
      };

      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Create order failed:", text);
        alert("Tạo đơn hàng thất bại. Vui lòng thử lại.");
        return;
      }

      const data = await res.json();
      console.log("Order created:", data);

      // Xoá giỏ + quay về trang chủ (hoặc trang cảm ơn)
      if (clearCart) clearCart();
      alert("Đặt món thành công!");
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi gửi đơn hàng.");
    }
  };

  return (
    <div className="checkout-container">
      <button className="back-btn" type="button" onClick={handleBack}>
        ← Quay lại giỏ hàng
      </button>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <h2>Thông tin đặt hàng</h2>

        <label>
          Họ và tên
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Số điện thoại
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Địa chỉ giao hàng
          <textarea
            name="address"
            rows={3}
            value={form.address}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email (không bắt buộc)
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Phương thức thanh toán
          <select
            name="payment_method"
            value={form.payment_method}
            onChange={handleChange}
          >
            <option value="CASH_ON_DELIVERY">Thanh toán khi nhận hàng</option>
            <option value="MOCK">Thanh toán giả lập (test)</option>
          </select>
        </label>

        <div>
          <strong>Tổng tiền: {totalAmount.toLocaleString("vi-VN")} đ</strong>
        </div>

        <button className="confirm-btn" type="submit">
          Xác nhận đặt món
        </button>
      </form>
    </div>
  );
}

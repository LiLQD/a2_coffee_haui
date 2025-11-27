// src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../assets/styles/cartPage.css";
import { getCart, setCart, clearCart } from "../utils/cartStore";

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  // load giỏ từ localStorage
  useEffect(() => {
    const current = getCart();
    console.log("CartPage initial cart:", current);
    setItems(current);
  }, []);

  const updateCart = (newItems) => {
    setItems(newItems);
    setCart(newItems);
  };

  const handleChangeQty = (index, newQty) => {
    const qty = Math.max(1, Number(newQty) || 1);
    const newItems = [...items];
    newItems[index] = { ...newItems[index], quantity: qty };
    updateCart(newItems);
  };

  const handleRemove = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    updateCart(newItems);
  };

  const handleClear = () => {
    if (!window.confirm("Xoá toàn bộ giỏ hàng?")) return;
    clearCart();
    setItems([]);
  };

  const handleBackToMenu = () => {
    navigate("/home");
  };

  const handleCheckout = () => {
    // sau này sẽ gọi backend /order
    alert("Chức năng thanh toán sẽ làm ở bước sau.");
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="cart-page">
      <div className="cart-card">
        <div className="cart-header">
          <h2>Giỏ hàng</h2>
          <button className="link-button" onClick={handleBackToMenu}>
            ← Quay lại đặt món
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Giỏ hàng đang trống.</p>
            <button className="primary-btn" onClick={handleBackToMenu}>
              Đặt món ngay
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item, idx) => (
                <div className="cart-item" key={item.id ?? idx}>
                  <div className="cart-item-left">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="cart-item-image"
                      />
                    )}
                    <div>
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-desc">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div className="cart-item-right">
                    <div className="cart-item-price">
                      {Number(item.price).toLocaleString("vi-VN")} đ
                    </div>

                    <div className="cart-item-qty">
                      <span>SL:</span>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity || 1}
                        onChange={(e) =>
                          handleChangeQty(idx, e.target.value)
                        }
                      />
                    </div>

                    <div className="cart-item-subtotal">
                      {(
                        Number(item.price || 0) *
                        (item.quantity || 1)
                      ).toLocaleString("vi-VN")}{" "}
                      đ
                    </div>

                    <button
                      className="danger-btn"
                      onClick={() => handleRemove(idx)}
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                Tổng tiền:{" "}
                <strong>
                  {totalAmount.toLocaleString("vi-VN")} đ
                </strong>
              </div>
              <div className="cart-footer-actions">
                <button className="secondary-btn" onClick={handleClear}>
                  Xoá hết
                </button>
                <button className="primary-btn" onClick={handleCheckout}>
                  Đặt món
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

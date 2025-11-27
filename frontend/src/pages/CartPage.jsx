import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/cartPage.css";
import { getCart, setCart, clearCart } from "../utils/cartStore";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCartState] = useState([]);

  // Load cart từ localStorage
  useEffect(() => {
    const stored = getCart ? getCart() : [];
    setCartState(Array.isArray(stored) ? stored : []);
  }, []);

  // Tính tổng tiền
  const totalAmount = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
        0
      ),
    [cart]
  );

  const syncCart = (nextCart) => {
    setCartState(nextCart);
    if (setCart) {
      setCart(nextCart);
    } else {
      localStorage.setItem("cart", JSON.stringify(nextCart));
    }
  };

  const handleQtyChange = (index, value) => {
    const qty = Math.max(1, Number(value) || 1);
    const next = [...cart];
    next[index] = { ...next[index], quantity: qty };
    syncCart(next);
  };

  const handleRemove = (index) => {
    const next = cart.filter((_, i) => i !== index);
    syncCart(next);
  };

  const handleClearAll = () => {
    if (!cart.length) return;
    if (!window.confirm("Xoá toàn bộ giỏ hàng?")) return;
    syncCart([]);
    if (clearCart) clearCart();
  };

  const handleBackToMenu = () => {
    navigate("/home");
  };

  const handleCheckout = () => {
    if (!cart.length) {
      alert("Giỏ hàng đang trống.");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <div className="cart-card">
        {/* Header */}
        <div className="cart-header">
          <h2>Giỏ hàng</h2>
          <button className="link-button" onClick={handleBackToMenu}>
            ← Quay lại đặt món
          </button>
        </div>

        {/* Empty state */}
        {cart.length === 0 && (
          <div className="cart-empty">
            <p>Giỏ hàng đang trống.</p>
            <button className="primary-btn" onClick={handleBackToMenu}>
              Đặt món ngay
            </button>
          </div>
        )}

        {/* Danh sách item */}
        {cart.length > 0 && (
          <>
            <div className="cart-items">
              {cart.map((item, index) => (
                <div className="cart-item" key={item.id ?? index}>
                  <div className="cart-item-left">
                    {item.image_url || item.imageUrl ? (
                      <img
                        className="cart-item-image"
                        src={item.image_url || item.imageUrl}
                        alt={item.name}
                      />
                    ) : (
                      <div className="cart-item-image" />
                    )}

                    <div>
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-desc">
                        {item.description || ""}
                      </div>
                    </div>
                  </div>

                  <div className="cart-item-right">
                    <div className="cart-item-price">
                      {(Number(item.price) || 0).toLocaleString("vi-VN")} đ
                    </div>

                    <div className="cart-item-qty">
                      <span>SL:</span>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity || 1}
                        onChange={(e) =>
                          handleQtyChange(index, e.target.value)
                        }
                      />
                    </div>

                    <div className="cart-item-subtotal">
                      {(
                        (Number(item.price) || 0) * (item.quantity || 1)
                      ).toLocaleString("vi-VN")}{" "}
                      đ
                    </div>

                    <button
                      className="danger-btn"
                      type="button"
                      onClick={() => handleRemove(index)}
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="cart-footer">
              <div className="cart-total">
                Tổng tiền:{" "}
                <strong>{totalAmount.toLocaleString("vi-VN")} đ</strong>
              </div>

              <div className="cart-footer-actions">
                
                <button
                  className="danger-btn"
                  type="button"
                  onClick={handleClearAll}
                >
                  Xoá hết
                </button>
                <button
                  className="primary-btn"
                  type="button"
                  onClick={handleCheckout}
                >
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

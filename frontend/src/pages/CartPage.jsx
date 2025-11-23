import { getCart, setCart } from "../utils/cartStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/cartPage.css";

export default function Cart() {
  const [cart, setCartState] = useState(getCart());
  const navigate = useNavigate();

  const updateQty = (id, delta) => {
    const newCart = cart.map((item) =>
      item.id === id
        ? { ...item, qty: Math.max(1, item.qty + delta) }
        : item
    );
    setCart(newCart);
    setCartState(newCart);
  };

  const removeItem = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    setCartState(newCart);
  };

  const total = cart.reduce((t, item) => t + item.qty * item.price, 0);

  return (
    <div className="cart-layout">

      {/* ------ LEFT: LIST ITEMS ------ */}
      <div className="cart-left">
        <button className="back-btn" onClick={() => navigate("/home")}>
          ⬅ Quay lại
        </button>
        <h2>Giỏ hàng</h2>

        {cart.length === 0 ? (
          <p>Giỏ hàng trống</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.imageUrl} className="cart-img" />

              <div className="cart-info">
                <h4>{item.name}</h4>
                <p className="price">{item.price.toLocaleString()} đ</p>

                <div className="qty-wrap">
                  <button onClick={() => updateQty(item.id, -1)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)}>+</button>
                </div>
              </div>

              <div className="cart-right-info">
                <div className="sub">
                  {(item.qty * item.price).toLocaleString()} đ
                </div>
                <button className="remove-btn" onClick={() => removeItem(item.id)}>
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ------ RIGHT: PAYMENT SUMMARY ------ */}
      <div className="cart-right">
        <h3>Thanh toán</h3>

        <div className="summary-list">
          {cart.map((item) => (
            <div key={item.id} className="sum-item">
              <span>{item.name} x {item.qty}</span>
              <span>{(item.qty * item.price).toLocaleString()} đ</span>
            </div>
          ))}
        </div>

        <div className="sum-total">
          <strong>Tổng cộng</strong>
          <strong>{total.toLocaleString()} đ</strong>
        </div>

        <button
          className="pay-btn"
          onClick={() => navigate("/checkout")}
        >
          Thanh toán
        </button>
      </div>

    </div>
  );
}
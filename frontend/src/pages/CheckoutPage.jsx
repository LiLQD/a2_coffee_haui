import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../assets/styles/checkOutPage.css";

export default function Checkout() {
  const [info, setInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    time: "",        // để trống, người dùng sẽ tự ghi text
    note: "",
    payment: "cod"
  });

  const navigate = useNavigate(); // Thêm để có thể điều hướng

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    alert("Đặt hàng thành công!\n\n" + JSON.stringify(info, null, 2));
  };

  return (
    <div className="checkout-container">
      {/* Nút quay lại giỏ hàng – giờ đã hoạt động */}
      <button className="back-btn" onClick={() => navigate("/cart")}>
        Quay lại giỏ hàng
      </button>

      <h2>Thông tin thanh toán</h2>

      <div className="checkout-form">
        <label>Họ và tên</label>
        <input name="name" value={info.name} onChange={handleChange} placeholder="Nguyễn Văn A" />

        <label>Email</label>
        <input name="email" type="email" value={info.email} onChange={handleChange} placeholder="example@gmail.com" />

        <label>Số điện thoại</label>
        <input name="phone" value={info.phone} onChange={handleChange} placeholder="0901234567" />

        <label>Địa chỉ giao hàng</label>
        <input name="address" value={info.address} onChange={handleChange} placeholder="Số nhà, đường, phường/xã..." />

        {/* Thay datetime-local bằng input text bình thường */}
        <label>Thời gian nhận hàng (ghi chú)</label>
        <input
          name="time"
          value={info.time}
          onChange={handleChange}
          placeholder="Ví dụ: Thứ 7 sau 14h, hoặc sáng Chủ nhật..."
        />

        <label>Ghi chú thêm</label>
        <textarea
          name="note"
          value={info.note}
          onChange={handleChange}
          rows="3"
          placeholder="Yêu cầu đặc biệt, chuông hỏng, gửi bưu điện..."
        ></textarea>

        <label>Phương thức thanh toán</label>
        <select name="payment" value={info.payment} onChange={handleChange}>
          <option value="cod">Thanh toán khi nhận hàng (COD)</option>
          <option value="bank">Chuyển khoản ngân hàng</option>
          <option value="momo">Momo</option>
          <option value="vnpay">VNPay</option>
        </select>

        <button className="confirm-btn" onClick={handleSubmit}>
          Xác nhận đặt hàng
        </button>
      </div>
    </div>
  );
}
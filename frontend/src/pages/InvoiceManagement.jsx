// frontend/src/pages/InvoiceManagement.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/invoice.css";

const API_BASE = "http://localhost:3000/api";

export default function InvoiceManagement({ isEmbedded = false }) {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });

  // Modal detail
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceDetail, setInvoiceDetail] = useState(null);

  useEffect(() => {
    loadInvoices();
  }, [filter]);

  async function loadInvoices() {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filter.status) params.append("status", filter.status);
      if (filter.startDate) params.append("startDate", filter.startDate);
      if (filter.endDate) params.append("endDate", filter.endDate);

      const res = await fetch(`${API_BASE}/invoices?${params}`);
      const data = await res.json();

      setInvoices(data.data.invoices || []);
      setStats(data.data.stats || {});
    } catch (err) {
      console.error("Load invoices error:", err);
      alert("Không tải được danh sách hóa đơn");
    } finally {
      setLoading(false);
    }
  }

  async function viewDetail(invoice) {
    try {
      const res = await fetch(`${API_BASE}/invoices/${invoice.id}`);
      const data = await res.json();

      setSelectedInvoice(invoice);
      setInvoiceDetail(data.data);
    } catch (err) {
      console.error("Load detail error:", err);
      alert("Không tải được chi tiết hóa đơn");
    }
  }

  async function updateStatus(invoiceId, newStatus) {
    if (!window.confirm(`Chuyển trạng thái sang ${newStatus}?`)) return;

    try {
      const res = await fetch(`${API_BASE}/invoices/${invoiceId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("HTTP " + res.status);

      alert("Cập nhật trạng thái thành công");
      loadInvoices();
      setSelectedInvoice(null);
    } catch (err) {
      console.error("Update status error:", err);
      alert("Cập nhật thất bại");
    }
  }

  async function deleteInvoice(invoiceId) {
    if (!window.confirm("Xóa hóa đơn này? Không thể hoàn tác!")) return;

    try {
      const res = await fetch(`${API_BASE}/invoices/${invoiceId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("HTTP " + res.status);

      alert("Xóa hóa đơn thành công");
      loadInvoices();
      setSelectedInvoice(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Xóa thất bại");
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: "badge-warning",
      PROCESSING: "badge-info",
      COMPLETED: "badge-success",
      CANCELLED: "badge-danger",
    };
    return badges[status] || "badge-secondary";
  };

  const getStatusText = (status) => {
    const texts = {
      PENDING: "Chờ xử lý",
      PROCESSING: "Đang xử lý",
      COMPLETED: "Hoàn thành",
      CANCELLED: "Đã hủy",
    };
    return texts[status] || status;
  };

  return (
    <div className="invoice-container">
      {!isEmbedded && (
        <header className="invoice-header">
          <h1>🧾 Quản lý Hóa đơn</h1>
          <button onClick={() => navigate("/admin/dashboard")}>
            ← Dashboard
          </button>
        </header>
      )}

      {/* Stats Cards */}
      <div className="invoice-stats">
        <div className="stat-card">
          <h3>Tổng hóa đơn</h3>
          <p className="stat-number">{stats.total_invoices || 0}</p>
        </div>
        <div className="stat-card stat-revenue">
          <h3>Tổng doanh thu</h3>
          <p className="stat-number">
            {(stats.total_revenue || 0).toLocaleString()} đ
          </p>
        </div>
        <div className="stat-card stat-pending">
          <h3>Chờ xử lý</h3>
          <p className="stat-number">{stats.pending_count || 0}</p>
        </div>
        <div className="stat-card stat-completed">
          <h3>Hoàn thành</h3>
          <p className="stat-number">{stats.completed_count || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="invoice-filters">
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ xử lý</option>
          <option value="PROCESSING">Đang xử lý</option>
          <option value="COMPLETED">Hoàn thành</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>

        <input
          type="date"
          value={filter.startDate}
          onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
          placeholder="Từ ngày"
        />

        <input
          type="date"
          value={filter.endDate}
          onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
          placeholder="Đến ngày"
        />

        <button onClick={loadInvoices}>🔍 Lọc</button>
        <button
          onClick={() => setFilter({ status: "", startDate: "", endDate: "" })}
        >
          ↺ Reset
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="invoice-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>SĐT</th>
              <th>Số món</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>#{inv.id}</td>
                <td>{inv.customer_name}</td>
                <td>{inv.customer_phone}</td>
                <td>{inv.item_count}</td>
                <td>{Number(inv.total_amount).toLocaleString()} đ</td>
                <td>
                  <span className={`badge ${getStatusBadge(inv.status)}`}>
                    {getStatusText(inv.status)}
                  </span>
                </td>
                <td>{new Date(inv.created_at).toLocaleDateString("vi-VN")}</td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => viewDetail(inv)}
                  >
                    👁️ Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Detail */}
      {selectedInvoice && invoiceDetail && (
        <div className="modal-backdrop" onClick={() => setSelectedInvoice(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Chi tiết Hóa đơn #{selectedInvoice.id}</h2>

            <div className="invoice-info">
              <p>
                <strong>Khách hàng:</strong> {invoiceDetail.order.customer_name}
              </p>
              <p>
                <strong>SĐT:</strong> {invoiceDetail.order.customer_phone}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {invoiceDetail.order.customer_address}
              </p>
              <p>
                <strong>Thanh toán:</strong> {invoiceDetail.order.payment_method}
              </p>
            </div>

            <h3>Danh sách món</h3>
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Món</th>
                  <th>SL</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {invoiceDetail.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product_name}</td>
                    <td>{item.quantity}</td>
                    <td>{Number(item.unit_price).toLocaleString()} đ</td>
                    <td>{Number(item.subtotal).toLocaleString()} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="modal-total">
              <strong>Tổng cộng:</strong>
              <span>
                {Number(invoiceDetail.order.total_amount).toLocaleString()} đ
              </span>
            </div>

            <div className="modal-actions">
              <button onClick={() => setSelectedInvoice(null)}>Đóng</button>

              {selectedInvoice.status === "PENDING" && (
                <button
                  className="btn-primary"
                  onClick={() => updateStatus(selectedInvoice.id, "PROCESSING")}
                >
                  ✓ Xử lý
                </button>
              )}

              {selectedInvoice.status === "PROCESSING" && (
                <button
                  className="btn-success"
                  onClick={() => updateStatus(selectedInvoice.id, "COMPLETED")}
                >
                  ✓ Hoàn thành
                </button>
              )}

              <button
                className="btn-danger"
                onClick={() => deleteInvoice(selectedInvoice.id)}
              >
                🗑️ Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
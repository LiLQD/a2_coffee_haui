// frontend/src/pages/BulkImport.jsx
import { useEffect, useState } from "react";
import Papa from "papaparse";

import "../assets/styles/bulkImport.css";

import { getAdminApiKey } from "../utils/authStore";
import { importProducts } from "../services/bulkImportApi";
import { fetchProducts } from "../services/productApi";

/**
 * Chuẩn hoá 1 dòng CSV thành object chuẩn để gửi lên backend
 */
function normalizeRow(row) {
  return {
    name: (row.name || "").trim(),
    price: Number(row.price) || 0,
    category: (row.category || "Khác").trim(),
    description: (row.description || "").trim(),
    imageUrl: row.imageUrl || row.image_url || null,
    available: String(row.available ?? "true").toLowerCase(),
  };
}

export default function BulkImport() {
  const [preview, setPreview] = useState([]);
  const [serverItems, setServerItems] = useState([]);

  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");

  const adminApiKey = getAdminApiKey();

  // ----------------- LOAD MENU TỪ DB -----------------
  const loadFromServer = async () => {
    try {
      setLoading(true);
      setError("");
      // lấy tất cả sản phẩm, không chỉ active
      const products = await fetchProducts(false);
      setServerItems(products);
    } catch (err) {
      console.error(err);
      setError("Không tải được danh sách món từ server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFromServer();
  }, []);

  // ----------------- TEMPLATE CSV -----------------
  const downloadTemplate = () => {
    const csv = "name,price,category,description,imageUrl,available\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "template.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  // ----------------- XỬ LÝ FILE CSV -----------------
  const handleFile = (file) => {
    if (!file) return;

    setError("");
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const rows = (res.data || [])
          .map((row) => normalizeRow(row))
          .filter((r) => r.name && r.price > 0);

        if (rows.length === 0) {
          setError("File CSV không có dữ liệu hợp lệ.");
        }

        setPreview(rows);
      },
      error: (err) => {
        console.error(err);
        setError("Không đọc được file CSV.");
      },
    });
  };

  // ----------------- GỬI LÊN API IMPORT -----------------
  const commitImport = async () => {
    if (!preview.length) {
      alert("Không có dữ liệu để import.");
      return;
    }

    if (!adminApiKey) {
      alert("Không tìm thấy API key admin. Hãy đăng nhập lại.");
      return;
    }

    if (!window.confirm(`Import ${preview.length} món vào menu?`)) {
      return;
    }

    try {
      setImporting(true);
      setError("");

      // gửi thẳng mảng preview, service sẽ wrap thành { products: [...] }
      const res = await importProducts(preview, adminApiKey);
      const inserted = res?.data?.inserted ?? 0;

      alert(`Đã import thành công ${inserted} món vào DB.`);

      // Xoá preview và load lại menu từ DB
      setPreview([]);
      await loadFromServer();
    } catch (err) {
      console.error(err);
      setError(err.message || "Import thất bại.");
    } finally {
      setImporting(false);
    }
  };

  // ----------------- JSX (giữ nguyên cấu trúc + class để CSS chạy) -----------------
  return (
    <div className="bulk-import-container">
      <h2>Quản lý món (Import CSV → DB)</h2>

      {/* HÀNG NÚT */}
      <div className="import-actions">
        <button className="import-btn" onClick={downloadTemplate}>
          📄 Tải file mẫu
        </button>

        <label className="import-btn">
          📂 Chọn file CSV
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </label>

        <button
          className="import-btn"
          disabled={importing || !preview.length}
          onClick={commitImport}
        >
          {importing ? "⏳ Đang import..." : "✅ Thêm vào DB"}
        </button>
      </div>

      {/* THÔNG BÁO LỖI */}
      {error && <p className="bulk-import-error">{error}</p>}

      {/* PREVIEW CSV */}
      {preview.length > 0 && (
        <div className="preview-section">
          <h3>Dữ liệu sắp import ({preview.length} dòng):</h3>
          <table className="import-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Giá</th>
                <th>Danh mục</th>
                <th>Mô tả</th>
                <th>Ảnh</th>
                <th>Hiển thị</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.category}</td>
                  <td>{item.description}</td>
                  <td>{item.imageUrl ? "✅" : "⛔"}</td>
                  <td>{item.available}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DANH SÁCH MÓN TRONG DB */}
      <h3>Danh sách món hiện tại trong DB</h3>
      {loading ? (
        <p>Đang tải...</p>
      ) : serverItems.length === 0 ? (
        <p>Chưa có món nào trong DB.</p>
      ) : (
        <table className="import-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Danh mục</th>
              <th>Ảnh</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {serverItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{Number(item.price).toLocaleString("vi-VN")} đ</td>
                <td>{item.category || item.category_id}</td>
                <td>{item.image_url ? "✅" : "⛔"}</td>
                <td>{item.is_active ? "✅" : "⛔"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

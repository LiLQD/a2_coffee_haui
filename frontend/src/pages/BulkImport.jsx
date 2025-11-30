// frontend/src/pages/BulkImport.jsx
import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "../assets/styles/bulkImport.css";
import { getUser } from "../utils/authStore";
import {
  importProducts,
  updateProduct,
  deleteProduct,
} from "../services/bulkImportApi";
import { fetchProducts } from "../services/productApi";

const BulkImport = () => {
  const [previewRows, setPreviewRows] = useState([]);
  const [dbProducts, setDbProducts] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  // popup edit
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    is_active: 1,
  });

  const adminUser = getUser();
  const adminApiKey = adminUser?.apiKey;

  useEffect(() => {
    loadDbProducts();
  }, []);

  async function loadDbProducts() {
    try {
      // Lấy tất cả (kể cả inactive)
      const resp = await fetchProducts(false);
      setDbProducts(resp);
    } catch (err) {
      console.error("Lỗi loadDbProducts:", err);
      alert("Không load được danh sách món từ DB.");
    }
  }

  function handleDownloadTemplate() {
    const header =
      "Tên,Giá,Danh mục,Mô tả,Hiển thị\n" +
      "Bánh mì trứng,20000,Bánh mì,Bánh mì pate trứng,true\n" +
      "Bánh mì thịt,25000,Bánh mì,Bánh mì thịt đầy đủ,true\n";

    const blob = new Blob([header], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_mon_an.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const rows = results.data
          .map((row) => {
            const name = (row["Tên"] || "").trim();
            const price = Number(row["Giá"]);
            const category = (row["Danh mục"] || "").trim();
            const description = (row["Mô tả"] || "").trim();
            const visibleRaw = (row["Hiển thị"] || "").toString().toLowerCase();
            const is_active =
              visibleRaw === "false" || visibleRaw === "0" ? false : true;

            if (!name || !price || !category) return null;

            return {
              name,
              price,
              category,
              description,
              is_active,
            };
          })
          .filter(Boolean);

        setPreviewRows(rows);
      },
      error(err) {
        console.error("CSV parse error:", err);
        alert("Không đọc được file CSV.");
      },
    });
  }

  async function commitImport() {
    if (!adminApiKey) {
      alert("Không tìm thấy API key admin. Hãy đăng nhập lại.");
      return;
    }

    if (!previewRows.length) {
      alert("Chưa có dữ liệu hợp lệ để import.");
      return;
    }

    try {
      setIsImporting(true);
      await importProducts(previewRows, adminApiKey);
      alert("Import thành công.");
      setPreviewRows([]);
      setSelectedFile(null);
      await loadDbProducts();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsImporting(false);
    }
  }

  // ---- Edit / Delete ----
  function openEditModal(p) {
    setEditingProduct(p);
    setEditForm({
      name: p.name || "",
      price: p.price || "",
      category: p.category || "",
      description: p.description || "",
      is_active: p.is_active ? 1 : 0,
    });
  }

  function closeEditModal() {
    setEditingProduct(null);
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) || "" : value,
    }));
  }

  async function saveEdit() {
    if (!editingProduct) return;
    if (!adminApiKey) {
      alert("Không tìm thấy API key admin. Hãy đăng nhập lại.");
      return;
    }

    try {
      const payload = {
        name: editForm.name,
        price: Number(editForm.price),
        description: editForm.description,
        // is_active và category bạn có thể map thêm nếu có UI riêng
      };

      await updateProduct(editingProduct.id, payload, adminApiKey);
      alert("Cập nhật món thành công.");
      closeEditModal();
      await loadDbProducts();
    } catch (err) {
      console.error(err);
      alert("Lỗi cập nhật món: " + err.message);
    }
  }

  async function handleDelete(p) {
    if (!window.confirm(`Xoá (ẩn) món "${p.name}"?`)) return;
    if (!adminApiKey) {
      alert("Không tìm thấy API key admin. Hãy đăng nhập lại.");
      return;
    }

    try {
      await deleteProduct(p.id, adminApiKey);
      await loadDbProducts();
    } catch (err) {
      console.error(err);
      alert("Lỗi xoá món: " + err.message);
    }
  }

  return (
    <div className="bulkimport-page">
      <h1 className="bulkimport-title">Quản lý món (Import CSV → DB)</h1>

      <div className="bulkimport-actions">
        <button className="btn-template" onClick={handleDownloadTemplate}>
          📄 Tải file mẫu
        </button>

        <label className="btn-choose-file">
          📂 Chọn file CSV
          <input
            type="file"
            accept=".csv,text/csv"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </label>

        <label className="commit-wrapper">
          <input
            type="checkbox"
            checked={true}
            readOnly
            className="commit-checkbox"
          />
          <span> Thêm vào DB</span>
        </label>

        <button
          className="btn-commit"
          onClick={commitImport}
          disabled={isImporting || !previewRows.length}
        >
          {isImporting ? "Đang import..." : "Thêm vào DB"}
        </button>
      </div>

      {/* Bảng preview CSV */}
      <section className="bulkimport-section">
        <h2 className="section-title">
          Dữ liệu sắp import ({previewRows.length} dòng):
        </h2>
        {previewRows.length === 0 ? (
          <p>Chưa có dữ liệu.</p>
        ) : (
          <table className="bulk-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Giá</th>
                <th>Danh mục</th>
                <th>Mô tả</th>
                <th>Hiển thị</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.name}</td>
                  <td>{row.price.toLocaleString()} đ</td>
                  <td>{row.category}</td>
                  <td>{row.description}</td>
                  <td>{row.is_active ? "true" : "false"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Bảng sản phẩm trong DB */}
      <section className="bulkimport-section">
        <h2 className="section-title">Danh sách món hiện tại trong DB</h2>
        <table className="bulk-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Danh mục</th>
              <th>Ảnh</th>
              <th>Active</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {dbProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{Number(p.price).toLocaleString()} đ</td>
                <td>{p.category}</td>
                <td>{p.image_url ? "✅" : "⛔"}</td>
                <td>{p.is_active ? "✅" : "⛔"}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => openEditModal(p)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(p)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
            {dbProducts.length === 0 && (
              <tr>
                <td colSpan={7}>Chưa có món nào trong DB</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Modal sửa món đơn giản */}
      {editingProduct && (
        <div className="bulk-modal-backdrop">
          <div className="bulk-modal">
            <h3>Sửa món #{editingProduct.id}</h3>
            <div className="form-row">
              <label>Tên</label>
              <input
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-row">
              <label>Giá</label>
              <input
                name="price"
                type="number"
                value={editForm.price}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-row">
              <label>Mô tả</label>
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
              />
            </div>

            <div className="modal-actions">
              <button onClick={closeEditModal}>Huỷ</button>
              <button onClick={saveEdit}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkImport;

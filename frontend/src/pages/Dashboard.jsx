// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import "../assets/styles/dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = "http://localhost:3000/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    ordersByStatus: {},
    revenueByDate: [],
    topProducts: [],
    categoryDistribution: {},
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);

      // 1. Lấy tất cả sản phẩm
      const productsRes = await fetch(`${API_BASE_URL}/products?activeOnly=false`);
      const productsData = await productsRes.json();
      const products = productsData.data || [];

      // 2. Lấy tất cả đơn hàng
      const ordersRes = await fetch(`${API_BASE_URL}/orders`);
      const ordersData = await ordersRes.json();
      const orders = ordersData.data || [];

      // 3. Tính toán thống kê
      const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

      // Đơn hàng theo trạng thái
      const ordersByStatus = orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      }, {});

      // Doanh thu theo ngày (7 ngày gần nhất)
      const revenueByDate = calculateRevenueByDate(orders);

      // Top 5 sản phẩm bán chạy
      const topProducts = calculateTopProducts(orders, products);

      // Phân bổ theo danh mục
      const categoryDistribution = products.reduce((acc, p) => {
        const cat = p.category || "Khác";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        ordersByStatus,
        revenueByDate,
        topProducts,
        categoryDistribution,
      });
    } catch (err) {
      console.error("Lỗi load dashboard:", err);
      alert("Không tải được dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  }

  function calculateRevenueByDate(orders) {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      last7Days.push({ date: dateStr, revenue: 0 });
    }

    orders.forEach((o) => {
      const orderDate = new Date(o.created_at).toISOString().split("T")[0];
      const found = last7Days.find((d) => d.date === orderDate);
      if (found) {
        found.revenue += Number(o.total_amount || 0);
      }
    });

    return last7Days;
  }

  function calculateTopProducts(orders, products) {
    const productSales = {};

    orders.forEach((order) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const pid = item.product_id;
          if (!productSales[pid]) {
            productSales[pid] = { count: 0, name: item.name };
          }
          productSales[pid].count += item.quantity;
        });
      }
    });

    return Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  // Chart data
  const orderStatusData = {
    labels: Object.keys(stats.ordersByStatus),
    datasets: [
      {
        label: "Số đơn hàng",
        data: Object.values(stats.ordersByStatus),
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336", "#2196F3"],
      },
    ],
  };

  const revenueData = {
    labels: stats.revenueByDate.map((d) => d.date),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: stats.revenueByDate.map((d) => d.revenue),
        borderColor: "#2196F3",
        backgroundColor: "rgba(33, 150, 243, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const topProductsData = {
    labels: stats.topProducts.map((p) => p.name),
    datasets: [
      {
        label: "Số lượng bán",
        data: stats.topProducts.map((p) => p.count),
        backgroundColor: "#FF6384",
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(stats.categoryDistribution),
    datasets: [
      {
        data: Object.values(stats.categoryDistribution),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>📊 Dashboard Quản Trị</h1>
        <button onClick={() => navigate("/home")}>← Quay lại</button>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Tổng Sản Phẩm</h3>
          <p className="stat-number">{stats.totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Tổng Đơn Hàng</h3>
          <p className="stat-number">{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Doanh Thu</h3>
          <p className="stat-number">{stats.totalRevenue.toLocaleString()} đ</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Đơn Hàng Theo Trạng Thái</h3>
          <Bar data={orderStatusData} options={{ responsive: true }} />
        </div>

        <div className="chart-card">
          <h3>Doanh Thu 7 Ngày Gần Nhất</h3>
          <Line data={revenueData} options={{ responsive: true }} />
        </div>

        <div className="chart-card">
          <h3>Top 5 Sản Phẩm Bán Chạy</h3>
          <Bar data={topProductsData} options={{ responsive: true, indexAxis: "y" }} />
        </div>

        <div className="chart-card">
          <h3>Phân Bố Danh Mục</h3>
          <Pie data={categoryData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}
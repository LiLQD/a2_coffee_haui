import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import BulkImport from "./pages/admin/BulkImport.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/home" element={<HomePage />} />

      <Route path="/cart" element={<CartPage />} />

      <Route path="/bulkimport" element={<BulkImport />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;

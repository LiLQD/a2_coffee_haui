// frontend/src/App.jsx
import React from "react";
import AppRoutes from "./routes.jsx";
// import AdminRoute from "./components/AdminRoute";
// import BulkImportPage from "./pages/BulkImportPage";

function App() {
  // Không còn header test nữa, chỉ render routes

  return (
    <div className="app-root">
      <AppRoutes />
    </div>
  );
  
}

export default App;

import { Navigate } from "react-router-dom";
import { getUser } from "../utils/authStore";

export default function AdminRoute({ children }) {
  const user = getUser();

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/home" replace />;
  }

  return children;
}

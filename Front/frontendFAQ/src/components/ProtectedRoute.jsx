import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase.js";

export default function ProtectedRoute({ children }) {
  // User not logged in --> block access
  if (!auth.currentUser) {
    return <Navigate to="/not-authorized" replace />;
  }

  // User logged in --> allow access
  return children;
}

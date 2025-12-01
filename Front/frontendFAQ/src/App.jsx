import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Faculty from "./pages/Faculty";
import Login from "./pages/Login";
import NotAuthorized from "./pages/NotAuthorized";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected page */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute>
              <Faculty />
            </ProtectedRoute>
          }
        />

        {/* When user lacks access */}
        <Route path="/not-authorized" element={<NotAuthorized />} />

      </Routes>
    </Router>
  );
}

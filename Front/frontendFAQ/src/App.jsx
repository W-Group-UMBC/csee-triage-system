import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Faculty from "./pages/Faculty";
import Login from "./pages/Login";

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
          element={<Faculty />}
        />

      </Routes>
    </Router>
  );
}

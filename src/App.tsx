import { Routes, Route } from "react-router";
import Home from "@/pages/Home";
import Signup from "@/pages/Signup";
import CardPage from "@/pages/CardPage";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/card/:memberId" element={<CardPage />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}


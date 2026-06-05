import { Outlet, Link, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, Users, Image as ImageIcon, FileText, ShoppingBag, Menu, X, List, Globe } from "lucide-react";
import "./Admin.css";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const AdminLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("role") !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  const handleExit = () => {
    Swal.fire({
      title: t("logout_confirm_title", "Chiqib ketmoqchimisiz?"),
      text: t("logout_confirm_text", "Saytning asosiy qismiga qaytasiz"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("yes_logout", "Ha, chiqish"),
      cancelButtonText: t("cancel", "Bekor qilish")
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/");
      }
    });
  };

  return (
    <div className="admin-layout">
      {isSidebarOpen && <div className="admin-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      <aside className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="admin-brand" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <h2>Admin Panel</h2>
          <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
        </div>
        <nav className="admin-nav">
          <Link onClick={() => setIsSidebarOpen(false)} to="/admin" className="admin-link"><LayoutDashboard size={20}/> Dashboard</Link>
          <Link onClick={() => setIsSidebarOpen(false)} to="/admin/cards" className="admin-link"><ShoppingBag size={20}/> Mahsulotlar</Link>
          <Link onClick={() => setIsSidebarOpen(false)} to="/admin/categories" className="admin-link"><List size={20}/> Kategoriyalar</Link>
          <Link onClick={() => setIsSidebarOpen(false)} to="/admin/swiper" className="admin-link"><ImageIcon size={20}/> Swiper Banner</Link>
          <Link onClick={() => setIsSidebarOpen(false)} to="/admin/news" className="admin-link"><FileText size={20}/> Yangiliklar</Link>
          <Link onClick={() => setIsSidebarOpen(false)} to="/admin/users" className="admin-link"><Users size={20}/> Foydalanuvchilar</Link>
        </nav>
        <div className="admin-bottom-nav">
          <button onClick={handleExit} className="admin-exit-btn">
            <LogOut size={20} /> Saytga qaytish
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-header" style={{justifyContent: "space-between"}}>
          <div style={{display: "flex", alignItems: "center", gap: "15px"}}>
            <button className="admin-menu-btn" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
            <h3 style={{margin: 0}}>Boshqaruv markazi</h3>
          </div>
          <button onClick={() => navigate("/")} className="admin-exit-btn" style={{width: "auto", padding: "8px 15px", gap: "8px"}}>
            <Globe size={18} /> Saytni ko'rish
          </button>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

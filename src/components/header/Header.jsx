import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  ShoppingCart,
  Heart,
  Search,
  User,
  LogOut,
  ShoppingBag,
  XCircle,
  Star,
  ChevronDown,
  Menu,
  X,
  Shield,
} from "lucide-react";
import api from "../../api/axios";
import "./Header.css";
import Swal from "sweetalert2";

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = useSelector((state) => state.basket?.value || []);
  const wishlistItems = useSelector((state) => state.like?.value || []);

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products/getProducts").then(res => setProducts(res.data)).catch(console.error);
  }, []);

  const languages = [
    { code: "en", label: "English" },
    { code: "uz", label: "Oʻzbekcha" },
    { code: "ru", label: "Русский" },
  ];

  const currentLangLabel =
    languages.find((l) => l.code === i18n.language)?.label || "English";

  useEffect(() => {
    const userStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(userStatus);
    setIsSideMenuOpen(false);
    setIsUserMenuOpen(false);
    setSearchTerm("");
  }, [location]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
    } else {
      const results = products.filter((p) => {
        const translatedName = (p.description || "Mahsulot").toLowerCase();
        return translatedName.includes(searchTerm.toLowerCase());
      });
      setFilteredProducts(results.slice(0, 5));
    }
  }, [searchTerm, t]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    navigate("/register");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  const handleAdminAccess = () => {
    Swal.fire({
      title: 'Admin Access',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="${t("username_placeholder", "Username")}">` +
        `<input id="swal-input2" class="swal2-input" type="password" placeholder="${t("password_placeholder", "Password")}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Login',
      cancelButtonText: t("cancel", "Cancel"),
      customClass: { popup: 'small-confirm-modal' },
      preConfirm: () => {
        const login = document.getElementById('swal-input1').value;
        const password = document.getElementById('swal-input2').value;
        if (!login || !password) {
          Swal.showValidationMessage(t("enter_credentials", "Please enter username and password"));
        }
        return { login, password };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value.login === "admin" && result.value.password === "admin") {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("role", "admin");
          Swal.fire({ icon: 'success', title: t("welcome_admin", "Xush kelibsiz, Admin!"), timer: 1500, showConfirmButton: false });
          navigate("/admin");
        } else {
          Swal.fire({ icon: 'error', title: t("error", "Xato!"), text: t("invalid_credentials", "Login yoki parol noto'g'ri") });
        }
      }
    });
  };

  return (
    <header className="site-header">
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="promo-section">
            <p>
              {t("summer_sale")} - OFF 50%!{" "}
              <Link to="/shop" className="shop-now">
                {t("shop_now")}
              </Link>
            </p>
          </div>
          <div
            className="lang-dropdown"
            onClick={() => setIsLangOpen(!isLangOpen)}
          >
            <div className="selected-lang">
              {currentLangLabel} <ChevronDown size={16} />
            </div>
            {isLangOpen && (
              <ul className="lang-list">
                {languages.map((lang) => (
                  <li key={lang.code} onClick={() => changeLanguage(lang.code)}>
                    {lang.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="header-wrap">
          <div className="logo-wrap">
            <span
              className="mobile-menu-trigger"
              onClick={() => setIsSideMenuOpen(true)}
            >
              <Menu size={28} />
            </span>
            <h1 onClick={() => navigate("/")} className="logo">
              Exclusive
            </h1>
          </div>

          <nav className="header-navigation">
            <ul>
              <li>
                <Link to="/">{t("home")}</Link>
              </li>
              <li>
                <Link to="/contact">{t("contact")}</Link>
              </li>
              <li>
                <Link to="/about">{t("about")}</Link>
              </li>
              {!isLoggedIn && (
                <li>
                  <Link to="/register">{t("signup")}</Link>
                </li>
              )}
            </ul>
          </nav>

          <div className={`side-menu ${isSideMenuOpen ? "open" : ""}`}>
            <div className="side-menu-header">
              <span onClick={() => setIsSideMenuOpen(false)}>
                <X size={32} />
              </span>
            </div>
            <ul className="side-menu-links">
              <li>
                <Link to="/">{t("home")}</Link>
              </li>
              <li>
                <Link to="/contact">{t("contact")}</Link>
              </li>
              <li>
                <Link to="/about">{t("about")}</Link>
              </li>
              {!isLoggedIn && (
                <li>
                  <Link to="/register">{t("signup")}</Link>
                </li>
              )}
            </ul>
          </div>
          {isSideMenuOpen && (
            <div
              className="menu-overlay"
              onClick={() => setIsSideMenuOpen(false)}
            ></div>
          )}

          <div className="header-action-wrap">
            <div className="search-wrap desktop-search">
              <div className="search-input-field">
                <input
                  type="text"
                  placeholder={t("search_placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={20} />
              </div>

              {searchTerm && (
                <div className="search-results-dropdown">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="search-item"
                        onClick={() => {
                          navigate(`/product/${product.id}`);
                          setSearchTerm("");
                        }}
                      >
                        <img src={product.image} alt={t(product.nameKey)} />
                        <div className="search-item-info">
                          <span className="search-item-name">
                            {product.description || "Mahsulot"}
                          </span>
                          <span className="search-item-price">
                            ${product.price}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="search-no-result">{t("no_results")}</div>
                  )}
                </div>
              )}
            </div>

            <div className="product-action">
              <Link to="/like" className="icon-badge-wrapper">
                <Heart size={24} />
                {wishlistItems.length > 0 && (
                  <span className="badge">{wishlistItems.length}</span>
                )}
              </Link>
              <Link to="/basket" className="icon-badge-wrapper">
                <ShoppingCart size={24} />
                {cartItems.length > 0 && (
                  <span className="badge">{cartItems.length}</span>
                )}
              </Link>

              <div className="icon-badge-wrapper" onClick={handleAdminAccess} style={{cursor: "pointer"}}>
                <Shield size={24} />
              </div>

              {isLoggedIn && (
                <div className="user-dropdown-container">
                  <span
                    className="user-btn"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <User size={24} />
                  </span>
                  {isUserMenuOpen && (
                    <div className="user-dropdown-menu">
                      <Link
                        to="/account"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User size={20} /> {t("manage_account")}
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <ShoppingBag size={20} /> {t("my_order")}
                      </Link>
                      <Link
                        to="/cancellations"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <XCircle size={20} /> {t("cancellations")}
                      </Link>
                      <Link
                        to="/reviews"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Star size={20} /> {t("my_reviews")}
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

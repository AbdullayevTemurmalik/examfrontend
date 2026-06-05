import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./App.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./page/home/Home";
import Registration from "./page/registration/Registration";
import NotFound from "./page/notFound/NotFound";
import About from "./page/about/About";
import Heart from "./page/heart/Heart";
import SinglePage from "./page/singlePage/SinglePage";
import Basket from "./page/basket/Basket";
import Contact from "./page/contact/Contact";
import Checkout from "./components/checkout/Checkout";
import { HelmetProvider } from "react-helmet-async";
import MyAccount from "./page/account/MyAccount";
import Login from "./page/registration/Login";
import AdminLayout from "./page/admin/AdminLayout";
import AdminDashboard from "./page/admin/AdminDashboard";
import AdminSwiper from "./page/admin/AdminSwiper";
import AdminNews from "./page/admin/AdminNews";
import AdminCards from "./page/admin/AdminCards";
import AdminUsers from "./page/admin/AdminUsers";
import AdminCategories from "./page/admin/AdminCategories";

export const sendState = createContext();
export const ThemeContext = createContext();

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const data = useSelector((item) => item.info.value);

  const toggleTheme = () => {
    setIsDarkTheme((prev) => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkTheme]);

  useEffect(() => {
    const showRegistration = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const isAdminRoute = location.pathname.startsWith("/admin");
      if (!isLoggedIn && data.length < 1 && location.pathname !== "/register" && location.pathname !== "/login" && !isAdminRoute) {
        navigate("/register");
      }
    };

    const timer = setTimeout(() => {
      window.addEventListener("mousemove", showRegistration, { once: true });
    }, 4000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", showRegistration);
    };
  }, [data, location.pathname, navigate]);

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <HelmetProvider>
        <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
          <sendState.Provider value={{ state, setState }}>
            <div className="main-wrapper">
              {!isAdminRoute && <Header />}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/like" element={<Heart />} />
                <Route path="/product/:id" element={<SinglePage />} />
                <Route path="/basket" element={<Basket />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/account" element={<MyAccount />} />
                <Route path="*" element={<NotFound />} />
                
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="swiper" element={<AdminSwiper />} />
                  <Route path="news" element={<AdminNews />} />
                  <Route path="cards" element={<AdminCards />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="users" element={<AdminUsers />} />
                </Route>
              </Routes>
              {!isAdminRoute && <Footer />}
            </div>
          </sendState.Provider>
        </ThemeContext.Provider>
      </HelmetProvider>
    </>
  );
}

export default App;

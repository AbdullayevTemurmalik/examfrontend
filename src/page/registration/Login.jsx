import "./Registration.css";
import phone from "../../assets/Side.png";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (userName === "admin" && password === "admin") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", "admin");
        Swal.fire({ title: t("welcome_admin", "Xush kelibsiz, Admin!"), icon: "success", timer: 1500 });
        return navigate("/admin");
      }

      const res = await api.post("/users/login", { userName, password });
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data.user));
      localStorage.setItem("role", "user");

      Swal.fire({ title: t("login_success", "Muvaffaqiyatli kirildi!"), icon: "success", timer: 1500 });
      navigate("/");
    } catch (error) {
      Swal.fire({ title: t("error", "Xato!"), text: error.response?.data?.message || t("error_occured", "Xatolik"), icon: "error" });
    }
  };

  return (
    <div className="registration">
      <div className="registration-wrap">
        <div className="registration-left">
          <img src={phone} alt="side" />
        </div>
        <div className="registration-right">
          <h2>Log in to Exclusive</h2>
          <p className="subtitle">Enter your details below</p>
          <form onSubmit={handleLogin} className="registration-form">
            <input
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              type="text"
              placeholder="Username or admin"
              required
            />
            <div className="password-input-wrap" style={{position: "relative", width: "100%", display: "flex", alignItems: "center"}}>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                style={{width: "100%", paddingRight: "45px"}}
              />
              <span 
                onClick={() => setShowPassword(!showPassword)} 
                style={{position: "absolute", right: "15px", cursor: "pointer", color: "gray", display: "flex", alignItems: "center"}}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            <button type="submit" className="red-btn">Log in</button>
            <p className="login-text">
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;

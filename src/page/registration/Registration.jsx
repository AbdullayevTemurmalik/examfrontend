import "./Registration.css";
import phone from "../../assets/Side.png";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import { Chrome, Eye, EyeOff } from "lucide-react";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const Registration = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", userName: "", age: "", gender: "male", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const genders = [
    { value: 'male', label: 'Erkak' },
    { value: 'female', label: 'Ayol' },
    { value: 'other', label: 'Boshqa' }
  ];
  const selectedGenderLabel = genders.find(g => g.value === form.gender)?.label || t("select_gender", "Jinsni tanlang");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/register", form);
      Swal.fire({ title: t("success", "Muvaffaqiyatli"), text: t("registered_login", "Ro'yxatdan o'tdingiz, endi tizimga kiring!"), icon: "success" });
      navigate("/login");
    } catch (error) {
      Swal.fire({ title: t("error", "Xato"), text: error.response?.data?.message || t("error_occured", "Xatolik yuz berdi"), icon: "error" });
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userData", JSON.stringify({ email: user.email, userName: user.displayName }));
      localStorage.setItem("role", "user");
      Swal.fire({ title: t("success", "Muvaffaqiyatli"), icon: "success", timer: 1500 });
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error.message);
    }
  };

  return (
    <div className="registration" style={{padding: "40px 0"}}>
      <div className="registration-wrap">
        <div className="registration-left">
          <img src={phone} alt="side" />
        </div>
        <div className="registration-right">
          <h2>Create an account</h2>
          <p className="subtitle">Enter your details below</p>
          <form onSubmit={handleRegister} className="registration-form">
            <input onChange={(e) => setForm({...form, firstName: e.target.value})} value={form.firstName} type="text" placeholder="First Name" required />
            <input onChange={(e) => setForm({...form, lastName: e.target.value})} value={form.lastName} type="text" placeholder="Last Name" required />
            <input onChange={(e) => setForm({...form, userName: e.target.value})} value={form.userName} type="text" placeholder="Username" required />
            <div style={{display: "flex", gap: "10px", width: "100%"}}>
              <input onChange={(e) => setForm({...form, age: e.target.value})} value={form.age} type="number" placeholder="Age" className="flex-input" required />
              <div className="custom-dropdown" ref={dropdownRef} style={{height: '56px'}}>
                <div className="custom-dropdown-header" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  {selectedGenderLabel}
                  <span className={`arrow ${dropdownOpen ? 'open' : ''}`}></span>
                </div>
                {dropdownOpen && (
                  <div className="custom-dropdown-list">
                    {genders.map(g => (
                      <div 
                        key={g.value} 
                        className={`custom-dropdown-item ${form.gender === g.value ? 'selected' : ''}`}
                        onClick={() => {
                          setForm({...form, gender: g.value});
                          setDropdownOpen(false);
                        }}
                      >
                        {g.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <input onChange={(e) => setForm({...form, email: e.target.value})} value={form.email} type="email" placeholder="Email" required />
            
            <div className="password-input-wrap" style={{position: "relative", width: "100%", display: "flex", alignItems: "center"}}>
              <input
                onChange={(e) => setForm({...form, password: e.target.value})}
                value={form.password}
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

            <button type="submit" className="red-btn">Create Account</button>

            <button type="button" onClick={loginWithGoogle} className="google-btn">
              <Chrome size={20} />
              <span>Sign up with Google</span>
            </button>

            <p className="login-text">
              Already have account? <Link to="/login">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Registration;

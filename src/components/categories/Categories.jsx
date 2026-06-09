import "./Categories.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/axios";
import { name as setCategoryFilter } from "../../redux/filterSlice";
import {
  Smartphone,
  Monitor,
  Watch,
  Camera,
  Headphones,
  Gamepad2,
} from "lucide-react";

const Categories = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const activeCategory = useSelector((state) => state.filter?.value);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories/getCategories").then(res => setCategories(res.data)).catch(console.error);
  }, []);

  const handleCategoryClick = (id) => {
    dispatch(setCategoryFilter(id === activeCategory ? "" : id.toString()));
  };

  return (
    <div className="container categories-section">
      <div className="section-title">
        <span className="red-rectangle"></span>
        <p>{t("categories")}</p>
      </div>
      <div className="browse-header">
        <h3>{t("browse_category")}</h3>
      </div>
      <div className="categories-grid">
        {categories.map((item) => (
          <div
            key={item.id}
            className={`category-box ${activeCategory === item.id.toString() ? "active" : ""}`}
            onClick={() => handleCategoryClick(item.id)}
          >
            <span className="category-icon"><Monitor size={40} strokeWidth={1.5} /></span>
            <p>{item.name}</p>
          </div>
        ))}
      </div>
      <hr className="section-divider" />
    </div>
  );
};

export default Categories;

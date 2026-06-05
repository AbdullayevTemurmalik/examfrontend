import { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { Toast } from "./AdminSwiper";
import { Trash2, Edit } from "lucide-react";

const AdminCards = () => {
  const { t } = useTranslation();
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ image: "", price: "", description: "", category_id: "", discount: "0", stars: "5" });
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

  const fetchCards = async () => {
    try {
      const { data } = await api.get("/products/getProducts");
      setCards(data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories/getCategories");
      setCategories(data);
      if (data.length > 0 && !form.category_id) {
        setForm(prev => ({ ...prev, category_id: data[0].id }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { 
    fetchCards(); 
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    Swal.fire({
      title: t("new_category_name", "Yangi kategoriya nomi"),
      input: "text",
      showCancelButton: true,
      confirmButtonText: t("add", "Qo'shish"),
      cancelButtonText: t("cancel", "Bekor qilish"),
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          await api.post("/categories/createCategory", { name: result.value });
          Toast.fire({ icon: "success", title: t("category_added", "Kategoriya qo'shildi") });
          fetchCategories();
        } catch (error) {
          Toast.fire({ icon: "error", title: t("error", "Xatolik yuz berdi") });
        }
      }
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products/createProduct", form);
      Toast.fire({ icon: "success", title: t("added_successfully", "Qo'shildi") });
      setForm({ image: "", price: "", description: "", category_id: "1", discount: "", stars: "" });
      fetchCards();
    } catch (error) {
      const errMsg = error.response?.data?.error || error.response?.data?.message || t("add_error", "Qo'shishda xatolik");
      Toast.fire({ icon: "error", title: errMsg });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: t("are_you_sure", "Rostdan ham o'chirmoqchimisiz?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("yes_delete", "Ha, o'chirish"),
      cancelButtonText: t("cancel", "Bekor qilish"),
      customClass: { popup: 'small-confirm-modal' },
      width: '300px'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/products/deleteProduct/${id}`);
          Toast.fire({ icon: "success", title: t("deleted_successfully", "O'chirildi!") });
          fetchCards();
        } catch (error) {
          Toast.fire({ icon: "error", title: t("error", "Xatolik yuz berdi") });
        }
      }
    });
  };

  const handleEdit = async (item) => {
    const { value: formValues } = await Swal.fire({
      title: t("edit_product", "Mahsulotni tahrirlash"),
      html: `
        <input id="swal-desc" class="swal2-input" placeholder="${t("name_desc", "Nomi/Tarif")}" value="${item.description}">
        <input id="swal-price" class="swal2-input" type="number" placeholder="${t("price", "Narxi")}" value="${item.price}">
        <input id="swal-img" class="swal2-input" placeholder="${t("image_url", "Rasm URL")}" value="${item.image}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: t("save", "Saqlash"),
      cancelButtonText: t("cancel", "Bekor qilish"),
      preConfirm: () => {
        return {
          description: document.getElementById('swal-desc').value,
          price: document.getElementById('swal-price').value,
          image: document.getElementById('swal-img').value,
          category_id: item.category_id,
          discount: item.discount || 0,
          stars: item.stars || 5
        }
      }
    });
    if (formValues) {
      try {
        await api.put(`/products/updateProduct/${item.id}`, formValues);
        Toast.fire({ icon: "success", title: t("saved_successfully", "O'zgartirildi!") });
        fetchCards();
      } catch (error) {
        Toast.fire({ icon: "error", title: t("error", "Xatolik yuz berdi") });
      }
    }
  };

  return (
    <div className="admin-crud-page">
      <h2>Mahsulotlar (Cards) Boshqaruvi</h2>
      <form onSubmit={handleAdd} className="admin-form" style={{flexWrap: "wrap", alignItems: "center"}}>
        <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="Rasm URL" required />
        <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Nomi/Tarif" required />
        <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="Narxi" required />
        
        <div style={{display: "flex", gap: "15px", flex: 1, minWidth: "250px"}}>
          <div className="custom-dropdown" ref={dropdownRef}>
            <div className="custom-dropdown-header" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {categories.find(c => String(c.id) === String(form.category_id))?.name || "Kategoriyani tanlang"}
              <span className={`arrow ${dropdownOpen ? 'open' : ''}`}></span>
            </div>
            {dropdownOpen && (
              <div className="custom-dropdown-list">
                {categories.map(c => (
                  <div 
                    key={c.id} 
                    className={`custom-dropdown-item ${String(form.category_id) === String(c.id) ? 'selected' : ''}`}
                    onClick={() => {
                      setForm({...form, category_id: c.id});
                      setDropdownOpen(false);
                    }}
                  >
                    {c.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="button" onClick={handleAddCategory} className="red-btn" style={{padding: "0 25px", borderRadius: "12px", fontSize: "20px"}}>+</button>
        </div>

        <button type="submit" className="red-btn" style={{padding: "16px 30px", borderRadius: "12px", height: "100%"}}>Qo'shish</button>
      </form>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Rasm</th><th>Nomi</th><th>Narxi</th><th>Amallar</th></tr>
          </thead>
          <tbody>
            {cards.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td><img src={c.image} alt="card" style={{width: 45, height: 45, objectFit: "cover", borderRadius: "6px"}} /></td>
                <td>{c.description}</td>
                <td>${c.price}</td>
                <td>
                  <div className="action-icons">
                    <button className="icon-btn edit" onClick={() => handleEdit(c)} title="Tahrirlash"><Edit size={18} /></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(c.id)} title="O'chirish"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminCards;

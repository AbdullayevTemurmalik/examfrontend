import { useState, useEffect } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { Toast } from "./AdminSwiper";
import { Trash2, Edit } from "lucide-react";

const AdminCategories = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories/getCategories");
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/categories/createCategory", { name });
      Toast.fire({ icon: "success", title: t("category_added", "Kategoriya qo'shildi!") });
      setName("");
      fetchCategories();
    } catch (error) {
      const errMsg = error.response?.data?.error || error.response?.data?.message || "Xatolik yuz berdi";
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
          await api.delete(`/categories/deleteCategory/${id}`);
          Toast.fire({ icon: "success", title: t("deleted_successfully", "O'chirildi!") });
          fetchCategories();
        } catch (error) {
          Toast.fire({ icon: "error", title: t("error", "Xatolik yuz berdi") });
        }
      }
    });
  };

  const handleEdit = async (item) => {
    const { value: newName } = await Swal.fire({
      title: t("edit_category", "Kategoriyani tahrirlash"),
      input: "text",
      inputValue: item.name,
      showCancelButton: true,
      confirmButtonText: t("save", "Saqlash"),
      cancelButtonText: t("cancel", "Bekor qilish")
    });
    if (newName) {
      try {
        await api.put(`/categories/updateCategory/${item.id}`, { name: newName });
        Toast.fire({ icon: "success", title: t("saved_successfully", "O'zgartirildi!") });
        fetchCategories();
      } catch (error) {
        Toast.fire({ icon: "error", title: t("error", "Xatolik yuz berdi") });
      }
    }
  };

  return (
    <div className="admin-crud-page">
      <h2>Kategoriyalar Boshqaruvi</h2>
      <form onSubmit={handleAdd} className="admin-form">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Yangi kategoriya nomi" required />
        <button type="submit" className="red-btn">Qo'shish</button>
      </form>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Nomi</th><th>Amallar</th></tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
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
export default AdminCategories;

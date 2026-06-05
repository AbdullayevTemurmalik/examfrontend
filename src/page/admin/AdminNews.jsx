import { useState, useEffect } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { Toast } from "./AdminSwiper";
import { Trash2, Edit } from "lucide-react";

const AdminNews = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [url, setUrl] = useState("");

  const fetchNews = async () => {
    try {
      const { data } = await api.get("/news/getNews");
      setNews(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/news/createNews", { url });
      Toast.fire({ icon: "success", title: t("added_successfully", "Qo'shildi") });
      setUrl("");
      fetchNews();
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
          await api.delete(`/news/deleteNews/${id}`);
          Toast.fire({ icon: "success", title: t("deleted_successfully", "O'chirildi!") });
          fetchNews();
        } catch (error) {
          Toast.fire({ icon: "error", title: t("error", "Xatolik yuz berdi") });
        }
      }
    });
  };

  const handleEdit = async (item) => {
    const { value: newUrl } = await Swal.fire({
      title: t("edit_image", "Rasmni tahrirlash"),
      input: "text",
      inputValue: item.url,
      showCancelButton: true,
      confirmButtonText: t("save", "Saqlash"),
      cancelButtonText: t("cancel", "Bekor qilish")
    });
    if (newUrl) {
      try {
        await api.put(`/news/updateNews/${item.id}`, { url: newUrl });
        Toast.fire({ icon: "success", title: t("saved_successfully", "O'zgartirildi!") });
        fetchNews();
      } catch (error) {
        Toast.fire({ icon: "error", title: t("error", "Xatolik yuz berdi") });
      }
    }
  };

  return (
    <div className="admin-crud-page">
      <h2>Yangiliklar (Yangi kelganlar) Boshqaruvi</h2>
      <form onSubmit={handleAdd} className="admin-form">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Rasm URL (https://...)" required />
        <button type="submit" className="red-btn">Qo'shish</button>
      </form>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Rasm</th><th>Amallar</th></tr>
          </thead>
          <tbody>
            {news.map(n => (
              <tr key={n.id}>
                <td>{n.id}</td>
                <td><img src={n.url} alt="news" style={{width: 60, height: 60, objectFit: "cover", borderRadius: "8px"}} /></td>
                <td>
                  <div className="action-icons">
                    <button className="icon-btn edit" onClick={() => handleEdit(n)} title="Tahrirlash"><Edit size={18} /></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(n.id)} title="O'chirish"><Trash2 size={18} /></button>
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
export default AdminNews;

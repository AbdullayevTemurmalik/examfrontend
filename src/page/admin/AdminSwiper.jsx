import { useState, useEffect } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { Trash2, Edit } from "lucide-react";

export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

const AdminSwiper = () => {
  const { t } = useTranslation();
  const [swipers, setSwipers] = useState([]);
  const [url, setUrl] = useState("");

  const fetchSwipers = async () => {
    try {
      const { data } = await api.get("/swiper/getSwipers");
      setSwipers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchSwipers(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/swiper/createSwiper", { url });
      Toast.fire({ icon: "success", title: t("added_successfully", "Qo'shildi") });
      setUrl("");
      fetchSwipers();
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
          await api.delete(`/swiper/deleteSwiper/${id}`);
          Toast.fire({ icon: "success", title: t("deleted_successfully", "O'chirildi!") });
          fetchSwipers();
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
        await api.put(`/swiper/updateSwiper/${item.id}`, { url: newUrl });
        Toast.fire({ icon: "success", title: t("saved_successfully", "O'zgartirildi!") });
        fetchSwipers();
      } catch (error) {
        Toast.fire({ icon: "error", title: t("error", "Xatolik yuz berdi") });
      }
    }
  };

  return (
    <div className="admin-crud-page">
      <h2>Swiper Banner Boshqaruvi</h2>
      <form onSubmit={handleAdd} className="admin-form">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Rasm URL (https://...)" required />
        <button type="submit" className="red-btn">Qo'shish</button>
      </form>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Rasm</th><th>URL</th><th>Amallar</th></tr>
          </thead>
          <tbody>
            {swipers.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td><img src={s.url} alt="swiper" style={{width: 60, height: 40, objectFit: "cover", borderRadius: "6px"}} /></td>
                <td><a href={s.url} target="_blank" rel="noreferrer" style={{color: "#3b82f6"}}>{s.url.substring(0, 30)}...</a></td>
                <td>
                  <div className="action-icons">
                    <button className="icon-btn edit" onClick={() => handleEdit(s)} title="Tahrirlash"><Edit size={18} /></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(s.id)} title="O'chirish"><Trash2 size={18} /></button>
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
export default AdminSwiper;

import { useState, useEffect } from "react";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { Toast } from "./AdminSwiper";
import { Trash2, Edit, User, Mail, Calendar, ShieldCheck } from "lucide-react";

const AdminUsers = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users/getUsers");
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

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
          await api.delete(`/users/deleteUser/${id}`);
          Toast.fire({ icon: "success", title: t("deleted_successfully", "O'chirildi!") });
          fetchUsers();
        } catch (error) {
          Toast.fire({ icon: "error", title: t("error", "Xatolik yuz berdi") });
        }
      }
    });
  };

  return (
    <div className="admin-crud-page">
      <h2>Foydalanuvchilar Boshqaruvi</h2>
      <div className="admin-users-grid">
        {users.map(u => (
          <div className="user-card" key={u.id}>
            <div className="user-card-header">
              <div className="user-avatar-icon">
                <User size={24} />
              </div>
              <div className="user-actions">
                <button className="edit" title="Tahrirlash"><Edit size={16} /></button>
                <button className="delete" onClick={() => handleDelete(u.id)} title="O'chirish"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="user-card-body">
              <h3>{u.name} {u.surname}</h3>
              <div className="user-info-line">
                <Mail size={14} />
                <span>{u.email}</span>
              </div>
              <div className="user-info-line">
                <Calendar size={14} />
                <span>Qo'shilgan: 02.06.2026</span>
              </div>
            </div>
            <div className="user-card-footer">
              <div className="user-status">
                <ShieldCheck size={16} />
                <span>Aktiv</span>
              </div>
              <div className="user-id-badge">ID: {u.id}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminUsers;

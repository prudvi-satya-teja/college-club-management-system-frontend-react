import { useEffect, useState, useCallback } from 'react';
import { userApi } from '../../api/userApi';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Users, Search, Trash2, Edit, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import './UsersPage.css';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, userId: null });
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userApi.getUsers({
        page,
        size: 10,
        name: searchTerm || undefined,
      });
      const data = res.data;
      if (Array.isArray(data)) {
        setUsers(data);
        setTotalPages(0);
      } else {
        setUsers(data.content || []);
        setTotalPages(data.totalPages || 0);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async () => {
    try {
      await userApi.deleteUser(deleteConfirm.userId);
      setUsers(users.filter(u => u.id !== deleteConfirm.userId));
      setDeleteConfirm({ open: false, userId: null });
      toast.success('User deleted');
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleUpdateRole = async (userId) => {
    try {
      await userApi.updateUser(userId, { role: newRole });
      setUsers(users.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
      setEditingUserId(null);
      toast.success('Role updated');
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="users-wrapper">
        <div className="users-spinner">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="users-wrapper">

      <div className="users-header">
        <h1 className="users-title">User Management</h1>
        <div className="users-toolbar">
          <div className="users-search">
            <Search size={16} className="users-search-icon" />
            <input
              type="text"
              placeholder="Search by name, roll number, email…"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
            />
          </div>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="users-empty">
          <div className="users-empty-icon"><Users size={28} /></div>
          <p className="users-empty-title">No users found</p>
          <p className="users-empty-sub">Try adjusting your search.</p>
        </div>
      ) : (
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Roll No.</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="users-td-mono">{u.id}</td>
                  <td className="users-td-name">{u.name}</td>
                  <td>{u.rollNumber || '—'}</td>
                  <td className="users-td-email">{u.email}</td>
                  <td>{u.phoneNumber || '—'}</td>
                  <td>
                    {editingUserId === u.id ? (
                      <div className="users-select-wrap">
                        <select
                          value={newRole}
                          onChange={e => setNewRole(e.target.value)}
                          className="users-select"
                        >
                          <option value="USER">User</option>
                          <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                      </div>
                    ) : (
                      <Badge role={u.role} size="sm" />
                    )}
                  </td>
                  <td>
                    {editingUserId === u.id ? (
                      <div className="users-actions">
                        <button
                          className="users-action-btn users-action-save"
                          onClick={() => handleUpdateRole(u.id)}
                        >
                          <Save size={13} /> Save
                        </button>
                        <button
                          className="users-action-btn users-action-cancel"
                          onClick={() => setEditingUserId(null)}
                        >
                          <X size={13} /> Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="users-actions">
                        <button
                          className="users-action-btn users-action-edit"
                          onClick={() => { setEditingUserId(u.id); setNewRole(u.role); }}
                        >
                          <Edit size={13} /> Edit
                        </button>
                        <button
                          className="users-action-btn users-action-delete"
                          onClick={() => setDeleteConfirm({ open: true, userId: u.id })}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="users-pagination">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, userId: null })}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message="Are you sure you want to delete this user? This cannot be undone."
      />
    </div>
  );
}
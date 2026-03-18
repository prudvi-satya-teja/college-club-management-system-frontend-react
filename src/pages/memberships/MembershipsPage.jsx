import { useEffect, useState, useCallback } from 'react';
import useAuthStore from '../../store/authStore';
import { membershipApi } from '../../api/membershipApi';
import { clubApi } from '../../api/clubApi';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import { Users, Plus, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import './MembershipsPage.css';

export default function MembershipsPage() {
  const user = useAuthStore(state => state.user);
  const [adminClubs, setAdminClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, memberId: null });
  const [editingMembership, setEditingMembership] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  useEffect(() => {
    if (selectedClubId) {
      setPage(0);
      fetchMembers();
    }
  }, [selectedClubId, page, fetchMembers]);

  const fetchClubs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await clubApi.getAllClubs();

      const memberRes = await membershipApi.getAllMemberships(null, 0, 100);
      const userAdminClubs = memberRes.data.content
        ?.filter(m => m.user?.userId === user?.userId && m.role === 'ADMIN')
        .map(m => m.club?.clubId);

      const adminClubsData = res.data.content?.filter(c => userAdminClubs?.includes(c.clubId)) || [];
      setAdminClubs(adminClubsData);

      if (adminClubsData.length > 0) {
        setSelectedClubId(adminClubsData[0].clubId);
      }
    } catch (err) {
      console.error('Error fetching clubs:', err);
      toast.error('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await membershipApi.getAllMemberships(selectedClubId, page, 10);
      setMembers(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error('Error fetching members:', err);
      toast.error('Failed to load members');
    }
  }, [selectedClubId, page]);

  const handleDeleteMember = async () => {
    try {
      await membershipApi.deleteMembership(deleteConfirm.memberId);
      setMembers(members.filter(m => m.id !== deleteConfirm.memberId));
      toast.success('Member removed successfully');
    } catch (err) {
      console.error('Error removing member:', err);
      toast.error('Failed to remove member');
    }
  };

  const handleUpdateRole = async memberId => {
    try {
      await membershipApi.updateMembership(memberId, newRole);
      setMembers(members.map(m => (m.id === memberId ? { ...m, role: newRole } : m)));
      setEditingMembership(null);
      toast.success('Role updated successfully');
    } catch (err) {
      console.error('Error updating role:', err);
      toast.error('Failed to update role');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (adminClubs.length === 0) {
    return (
      <div className="p-4 sm:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Memberships</h1>
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">You are not an admin of any club</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Club Memberships</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Club</label>
        <select
          value={selectedClubId}
          onChange={e => setSelectedClubId(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        >
          {adminClubs.map(club => (
            <option key={club.clubId} value={club.clubId}>
              {club.clubName}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-6 h-6" /> Club Members
          </h2>
          <button
            onClick={() => {}}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
          >
            <Plus className="w-5 h-5" /> Add Member
          </button>
        </div>

        {members.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No members in this club</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Roll Number</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800 font-medium">{member.user?.name}</td>
                    <td className="px-4 py-3 text-gray-600">{member.user?.rollNumber}</td>
                    <td className="px-4 py-3 text-gray-600">{member.user?.email}</td>
                    <td className="px-4 py-3">
                      {editingMembership?.id === member.id ? (
                        <select
                          value={newRole}
                          onChange={e => setNewRole(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="MEMBER">Member</option>
                          <option value="COORDINATOR">Coordinator</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      ) : (
                        <Badge role={member.role} size="sm" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingMembership?.id === member.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateRole(member.id)}
                            className="text-sm text-green-600 hover:text-green-700 font-semibold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingMembership(null)}
                            className="text-sm text-gray-600 hover:text-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingMembership(member);
                              setNewRole(member.role);
                            }}
                            className="p-1 text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ open: true, memberId: member.id })}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, memberId: null })}
        onConfirm={handleDeleteMember}
        title="Remove Member"
        message="Are you sure you want to remove this member from the club?"
      />
    </div>
  );
}

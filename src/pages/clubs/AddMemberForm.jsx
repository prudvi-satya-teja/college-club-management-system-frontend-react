import { useState } from 'react';
import { userApi } from '../../api/userApi';
import { membershipApi } from '../../api/membershipApi';
import { X, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import './AddMemberForm.css';

export default function AddMemberForm({ clubId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState('MEMBER');

  const handleSearch = async e => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await userApi.getUsers({
        search: value,
        page: 0,
        size: 10,
      });
      setSearchResults(res.data.content || []);
    } catch (err) {
      console.error('Error searching users:', err);
      toast.error('Failed to search users');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!selectedUser) {
      toast.error('Please select a user');
      return;
    }

    try {
      setLoading(true);
      await membershipApi.createMembership(clubId, selectedUser.userId, role);
      toast.success('Member added successfully');
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('Error adding member:', err);
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="member-form-wrapper">
      <div className="member-form-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="member-form-title">Add Member</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Search User</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by name, email, or roll number..."
                className="form-input pl-10"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="mt-2 border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                {searchResults.map(user => (
                  <button
                    key={user.userId}
                    type="button"
                    onClick={() => {
                      setSelectedUser(user);
                      setSearchTerm('');
                      setSearchResults([]);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-indigo-50 border-b last:border-b-0 transition-all flex flex-col"
                  >
                    <span className="font-medium text-gray-800">{user.name}</span>
                    <span className="text-sm text-gray-600">{user.email}</span>
                    <span className="text-xs text-gray-500">{user.rollNumber}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedUser && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-medium text-gray-800">{selectedUser.name}</p>
              <p className="text-sm text-gray-600">{selectedUser.email}</p>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="text-sm text-blue-600 hover:text-blue-700 mt-2"
              >
                Choose different user
              </button>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="form-select"
            >
              <option value="MEMBER">Member</option>
              <option value="COORDINATOR">Coordinator</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="form-actions pt-4">
            <button
              type="submit"
              disabled={loading || !selectedUser}
              className="form-submit"
            >
              {loading ? 'Adding...' : 'Add Member'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="form-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

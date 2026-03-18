import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { clubApi } from '../../api/clubApi';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner from '../../components/common/Spinner';
import { Plus, Trash2, Edit, Search, ArrowUpRight, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { isSuperAdmin } from '../../utils/roleUtils';
import './ClubsListPage.css';

export default function ClubsListPage() {
  const user = useAuthStore(state => state.user);
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, clubId: null });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchClubs(); }, []);

  useEffect(() => {
    setFilteredClubs(
      clubs.filter(club =>
        club.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.clubCode.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, clubs]);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const res = await clubApi.getAllClubs();
      setClubs(res.data.content || res.data || []);
    } catch (err) {
      toast.error('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClub = async () => {
    try {
      await clubApi.deleteClub(deleteConfirm.clubId);
      setClubs(clubs.filter(c => c.clubId !== deleteConfirm.clubId));
      toast.success('Club deleted');
      setDeleteConfirm({ open: false, clubId: null });
    } catch {
      toast.error('Failed to delete club');
    }
  };

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const avatarColors = ['#c9a84c','#4a6cf7','#34c77b','#e05a5a','#9b59b6','#e67e22','#1abc9c'];
  const getColor = (str = '') => avatarColors[str.charCodeAt(0) % avatarColors.length];

  if (loading) {
    return (
      <div className="cl-wrapper">
        <div className="cl-spinner-wrap"><Spinner size="lg" /></div>
      </div>
    );
  }

  return (
    <div className="cl-wrapper">
      <div className="cl-header">
        <div>
          <p className="cl-eyebrow">Campus</p>
          <h1 className="cl-title">Clubs</h1>
        </div>
        {isSuperAdmin(user) && (
          <Link to="/clubs/new" className="cl-add-btn">
            <Plus size={16} /> Add Club
          </Link>
        )}
      </div>

      <div className="cl-search-wrap">
        <div className="cl-search">
          <Search className="cl-search-icon" size={15} />
          <input
            type="text"
            placeholder="Search by name or code…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="cl-search-input"
          />
          {searchTerm && (
            <button className="cl-search-clear" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>
        <span className="cl-count">{filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''}</span>
      </div>

      {filteredClubs.length === 0 ? (
        <div className="cl-empty">
          <div className="cl-empty-icon"><Users size={32} /></div>
          <p className="cl-empty-title">No clubs found</p>
          <p className="cl-empty-sub">
            {searchTerm ? `No results for "${searchTerm}"` : 'No clubs have been created yet.'}
          </p>
        </div>
      ) : (
        <div className="cl-grid">
          {filteredClubs.map(club => (
            <div key={club.clubId} className="cl-card">
            
              {club.clubImage ? (
                <img src={club.clubImage} alt={club.clubName} className="cl-card-img" />
              ) : (
                <div
                  className="cl-card-avatar"
                  style={{ background: `${getColor(club.clubName)}1a`, color: getColor(club.clubName) }}
                >
                  {getInitials(club.clubName)}
                </div>
              )}

              <div className="cl-card-body">
                <h3 className="cl-card-name">{club.clubName}</h3>
                <span className="cl-card-code">{club.clubCode}</span>
              </div>

              <div className="cl-card-footer">
                <div className="cl-card-status">
                  <span className="cl-status-dot" />
                  Active
                </div>
                <Link to={`/clubs/${club.clubId}`} className="cl-card-link">
                  View <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, clubId: null })}
        onConfirm={handleDeleteClub}
        title="Delete Club"
        message="Are you sure you want to delete this club? This action cannot be undone."
      />
    </div>
  );
}
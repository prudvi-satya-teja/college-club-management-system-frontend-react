import { useEffect, useState, useCallback } from 'react';
import useAuthStore from '../../store/authStore';
import { userApi } from '../../api/userApi';
import { membershipApi } from '../../api/membershipApi';
import { registrationApi } from '../../api/registrationApi';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import { Mail, Phone, FileText, Calendar, Award, Star, Edit3, Save, X, Users, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';
import './ProfilePage.css';

export default function ProfilePage() {
  const authUser = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const [userProfile, setUserProfile] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', phoneNumber: '' });

  const avatarColors = ['#c9a84c','#4a6cf7','#34c77b','#e05a5a','#9b59b6','#e67e22','#1abc9c'];
  const getColor = (str = '') => avatarColors[(str.charCodeAt(0) || 0) % avatarColors.length];

  const fetchProfileData = useCallback(async () => {
    if (!authUser?.userId) return;
    try {
      const [userRes, memberRes, regRes] = await Promise.all([
        userApi.getUserById(authUser.userId),
        membershipApi.getAllMemberships(null, 0, 100),
        registrationApi.getAllRegistrations(null, authUser.userId, 0, 5),
      ]);
      const userData = userRes.data;
      setUserProfile(userData);
      setEditData({ name: userData.name, phoneNumber: userData.phoneNumber || '' });
      setMemberships(memberRes.data.data?.filter(m => m.user?.id === authUser.userId) || []);
      setRecentRegistrations((regRes.data.data?.filter(r => r.user?.id === authUser.userId) || []).slice(0, 5));
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [authUser?.userId]);

  useEffect(() => { fetchProfileData(); }, [fetchProfileData]);

  const handleSaveProfile = async () => {
    if (!editData.name.trim()) { toast.error('Name cannot be empty'); return; }
    try {
      const payload = { name: editData.name, ...(editData.phoneNumber && { phoneNumber: editData.phoneNumber }) };
      await userApi.updateUser(authUser.userId, payload);
      setUserProfile({ ...userProfile, ...payload });
      setUser({ ...authUser, ...payload });
      setIsEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (loading || !userProfile) return (
    <div className="pp-loading"><Spinner size="lg" /></div>
  );

  const initials = userProfile.name?.charAt(0).toUpperCase() || 'U';
  const avatarColor = getColor(userProfile.name || '');

  return (
    <div className="pp-root">

      <div className="pp-header">
        <div className="pp-header-inner">
          <p className="pp-eyebrow">Account</p>
          <h1 className="pp-title">My <em>Profile</em></h1>
          <p className="pp-subtitle">Manage your personal information and activity.</p>
        </div>
        <div className="pp-header-grid" />
        <div className="pp-header-glow" />
      </div>

      <div className="pp-body">

        <div className="pp-hero-card">
          <div className="pp-hero-top">
           
            <div className="pp-avatar" style={{ background: `${avatarColor}22`, color: avatarColor }}>
              {initials}
            </div>

            <div className="pp-identity">
              <h2 className="pp-name">{userProfile.name}</h2>
              <Badge role={userProfile.role} />
            </div>

            <div className="pp-hero-stats">
              <div className="pp-stat">
                <span className="pp-stat-num">{memberships.length}</span>
                <span className="pp-stat-label">Clubs</span>
              </div>
              <div className="pp-stat-div" />
              <div className="pp-stat">
                <span className="pp-stat-num">{recentRegistrations.length}</span>
                <span className="pp-stat-label">Events</span>
              </div>
            </div>
          </div>

          <div className="pp-divider" />

          {!isEditing ? (
            <div className="pp-info-grid">
              <div className="pp-info-item">
                <Mail size={14} className="pp-info-icon" />
                <div>
                  <span className="pp-info-label">Email</span>
                  <span className="pp-info-value">{userProfile.email}</span>
                </div>
              </div>
              <div className="pp-info-item">
                <FileText size={14} className="pp-info-icon" />
                <div>
                  <span className="pp-info-label">Roll Number</span>
                  <span className="pp-info-value">{userProfile.rollNumber}</span>
                </div>
              </div>
              {userProfile.phoneNumber && (
                <div className="pp-info-item">
                  <Phone size={14} className="pp-info-icon" />
                  <div>
                    <span className="pp-info-label">Phone</span>
                    <span className="pp-info-value">{userProfile.phoneNumber}</span>
                  </div>
                </div>
              )}
              <div className="pp-action-row">
                <button className="pp-btn-edit" onClick={() => setIsEditing(true)}>
                  <Edit3 size={14} /> Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="pp-edit-form">
              <div className="pp-edit-field">
                <label className="pp-edit-label">Full Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={e => setEditData({ ...editData, name: e.target.value })}
                  className="pp-edit-input"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="pp-edit-field">
                <label className="pp-edit-label">Phone Number</label>
                <input
                  type="tel"
                  value={editData.phoneNumber}
                  onChange={e => setEditData({ ...editData, phoneNumber: e.target.value })}
                  className="pp-edit-input"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="pp-action-row">
                <button className="pp-btn-save" onClick={handleSaveProfile}>
                  <Save size={14} /> Save Changes
                </button>
                <button className="pp-btn-cancel" onClick={() => {
                  setIsEditing(false);
                  setEditData({ name: userProfile.name, phoneNumber: userProfile.phoneNumber || '' });
                }}>
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {memberships.length > 0 && (
          <div className="pp-section">
            <div className="pp-section-head">
              <Users size={15} className="pp-section-icon" />
              <h2 className="pp-section-title">Club Memberships</h2>
              <span className="pp-section-count">{memberships.length}</span>
            </div>
            <div className="pp-membership-grid">
              {memberships.map(m => {
                const mColor = getColor(m.club?.clubName || '');
                return (
                  <div key={m.id} className="pp-membership-card">
                    <div className="pp-membership-top">
                      <div
                        className="pp-membership-initial"
                        style={{ background: `${mColor}22`, color: mColor }}
                      >
                        {m.club?.clubName?.charAt(0).toUpperCase()}
                      </div>
                      <Badge role={m.role} size="sm" />
                    </div>
                    <p className="pp-membership-name">{m.club?.clubName}</p>
                    <p className="pp-membership-code">{m.club?.clubCode}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {recentRegistrations.length > 0 && (
          <div className="pp-section">
            <div className="pp-section-head">
              <Ticket size={15} className="pp-section-icon" />
              <h2 className="pp-section-title">Recent Event Registrations</h2>
              <span className="pp-section-count">{recentRegistrations.length}</span>
            </div>
            <div className="pp-reg-list">
              {recentRegistrations.map((reg, idx) => (
                <div key={reg.id} className="pp-reg-row">
                  <div className="pp-reg-index">{idx + 1}</div>
                  <div className="pp-reg-info">
                    <p className="pp-reg-name">{reg.event?.eventName}</p>
                    <div className="pp-reg-meta">
                      {reg.event?.club?.clubName && (
                        <span className="pp-reg-club">{reg.event.club.clubName}</span>
                      )}
                      {reg.event?.eventDateTime && (
                        <>
                          <span className="pp-reg-dot">·</span>
                          <span className="pp-reg-date">
                            <Calendar size={11} />
                            {new Date(reg.event.eventDateTime).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="pp-reg-status">
                    {reg.rating ? (
                      <span className="pp-rating-badge">
                        <Star size={12} fill="#c9a84c" color="#c9a84c" />
                        {reg.rating}
                      </span>
                    ) : (
                      <span className="pp-registered-pill">Registered</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
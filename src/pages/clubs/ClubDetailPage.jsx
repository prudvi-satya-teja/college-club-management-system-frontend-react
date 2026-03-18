import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useAuthStore, { isSuperAdmin } from '../../store/authStore';
import { clubApi } from '../../api/clubApi';
import { eventApi } from '../../api/eventApi';
import { membershipApi } from '../../api/membershipApi';
import { userApi } from '../../api/userApi';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import {
  ArrowLeft, Plus, Calendar, Users, ArrowUpRight,
  Edit3, Trash2, X, Save, UserPlus, ShieldCheck, Crown
} from 'lucide-react';
import toast from 'react-hot-toast';
import './ClubDetailPage.css';

function ConfirmModal({ open, title, message, onConfirm, onClose }) {
  if (!open) return null;
  return (
    <div className="cd-modal-backdrop" onClick={onClose}>
      <div className="cd-modal" onClick={e => e.stopPropagation()}>
        <div className="cd-modal-header">
          <h3 className="cd-modal-title">{title}</h3>
          <button className="cd-modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <p className="cd-modal-msg">{message}</p>
        <div className="cd-modal-footer">
          <button className="cd-modal-btn cd-modal-btn-danger" onClick={onConfirm}>Confirm</button>
          <button className="cd-modal-btn cd-modal-btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function EditClubModal({ open, onClose, onSave, club }) {
  const [clubName, setClubName] = useState('');
  const [clubCode, setClubCode] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && club) {
      setClubName(club.clubName || '');
      setClubCode(club.clubCode || '');
      setImageFile(null);
      setImagePreview(club.clubImage || null);
    }
  }, [open, club]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!clubName.trim()) { toast.error('Club name is required'); return; }
    if (!clubCode.trim()) { toast.error('Club code is required'); return; }
    setSubmitting(true);

    const fd = new FormData();
    fd.append('clubName', clubName);
    fd.append('clubCode', clubCode);
    if (imageFile) fd.append('clubImageFile', imageFile);

    await onSave(fd);
    setSubmitting(false);
  };

  if (!open) return null;
  return (
    <div className="cd-modal-backdrop" onClick={onClose}>
      <div className="cd-modal" onClick={e => e.stopPropagation()}>
        <div className="cd-modal-header">
          <h3 className="cd-modal-title">Edit Club</h3>
          <button className="cd-modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="cd-modal-form">
          <div className="cd-form-field">
            <label className="cd-form-label">Club Name *</label>
            <input
              className="cd-form-input"
              value={clubName}
              onChange={e => setClubName(e.target.value)}
              placeholder="e.g. Coding Club"
            />
          </div>
          <div className="cd-form-field">
            <label className="cd-form-label">Club Code *</label>
            <input
              className="cd-form-input"
              value={clubCode}
              onChange={e => setClubCode(e.target.value)}
              placeholder="e.g. CC01"
            />
          </div>
          <div className="cd-form-field">
            <label className="cd-form-label">Club Image</label>
            <input
              className="cd-form-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ marginTop: '8px', maxHeight: '120px', borderRadius: '8px', objectFit: 'cover' }}
              />
            )}
          </div>
        </div>
        <div className="cd-modal-footer">
          <button className="cd-modal-btn cd-modal-btn-primary" onClick={handleSave} disabled={submitting}>
            <Save size={14} /> {submitting ? 'Saving…' : 'Save Changes'}
          </button>
          <button className="cd-modal-btn cd-modal-btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function AddMemberModal({ open, onClose, onAdd }) {
  const [rollNumber, setRollNumber] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rollNumber.trim()) { toast.error('Enter a roll number'); return; }
    setSubmitting(true);
    await onAdd(rollNumber.trim(), role);
    setSubmitting(false);
    setRollNumber(''); setRole('MEMBER');
  };

  if (!open) return null;
  return (
    <div className="cd-modal-backdrop" onClick={onClose}>
      <div className="cd-modal" onClick={e => e.stopPropagation()}>
        <div className="cd-modal-header">
          <h3 className="cd-modal-title">Add Member</h3>
          <button className="cd-modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="cd-modal-form">
          <div className="cd-form-field">
            <label className="cd-form-label">Roll Number</label>
            <input
              type="text" value={rollNumber}
              onChange={e => setRollNumber(e.target.value)}
              placeholder="e.g. 22B01A0501"
              className="cd-form-input"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <div className="cd-form-field">
            <label className="cd-form-label">Role</label>
            <div className="cd-select-wrap">
              <select value={role} onChange={e => setRole(e.target.value)} className="cd-form-select">
                <option value="MEMBER">Member</option>
                <option value="COORDINATOR">Coordinator</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
        </div>
        <div className="cd-modal-footer">
          <button className="cd-modal-btn cd-modal-btn-primary" onClick={handleSubmit} disabled={submitting}>
            <UserPlus size={14} /> {submitting ? 'Adding…' : 'Add Member'}
          </button>
          <button className="cd-modal-btn cd-modal-btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function EventModal({ open, onClose, onSave, initial, clubId }) {
  const empty = { eventName: '', eventDateTime: '', location: '', details: '', mainTheme: '', guest: '' };
  const [form, setForm] = useState(empty);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm(initial ? { ...empty, ...initial } : empty);
    setImageFile(null);
    setImagePreview(initial?.eventImage || null);
  }, [open]);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!form.eventName.trim() || !form.eventDateTime) {
      toast.error('Event name and date are required'); return;
    }
    if (!initial && !imageFile) {
      toast.error('Event image is required'); return;
    }
    setSubmitting(true);

    const fd = new FormData();
    fd.append('eventName', form.eventName);
    fd.append('eventDateTime', form.eventDateTime);
    fd.append('location', form.location || '');
    fd.append('mainTheme', form.mainTheme || '');
    fd.append('Details', form.details || '');
    fd.append('guest', form.guest || '');
    fd.append('clubId', clubId);
    if (imageFile) fd.append('eventImage', imageFile);

    await onSave(fd);
    setSubmitting(false);
  };

  if (!open) return null;
  return (
    <div className="cd-modal-backdrop" onClick={onClose}>
      <div className="cd-modal cd-modal-wide" onClick={e => e.stopPropagation()}>
        <div className="cd-modal-header">
          <h3 className="cd-modal-title">{initial ? 'Edit Event' : 'Create Event'}</h3>
          <button className="cd-modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="cd-modal-form cd-modal-grid">
          <div className="cd-form-field cd-field-full">
            <label className="cd-form-label">Event Name *</label>
            <input className="cd-form-input" value={form.eventName} onChange={e => upd('eventName', e.target.value)} placeholder="Hackathon 2025" />
          </div>
          <div className="cd-form-field">
            <label className="cd-form-label">Date & Time *</label>
            <input className="cd-form-input" type="datetime-local" value={form.eventDateTime} onChange={e => upd('eventDateTime', e.target.value)} />
          </div>
          <div className="cd-form-field">
            <label className="cd-form-label">Location</label>
            <input className="cd-form-input" value={form.location} onChange={e => upd('location', e.target.value)} placeholder="Seminar Hall A" />
          </div>
          <div className="cd-form-field">
            <label className="cd-form-label">Theme</label>
            <input className="cd-form-input" value={form.mainTheme} onChange={e => upd('mainTheme', e.target.value)} placeholder="Innovation" />
          </div>
          <div className="cd-form-field">
            <label className="cd-form-label">Guest Speaker</label>
            <input className="cd-form-input" value={form.guest} onChange={e => upd('guest', e.target.value)} placeholder="Dr. Ravi Kumar" />
          </div>
          <div className="cd-form-field cd-field-full">
            <label className="cd-form-label">Details</label>
            <textarea className="cd-form-input cd-form-textarea" value={form.details} onChange={e => upd('details', e.target.value)} placeholder="Describe the event…" rows={3} />
          </div>
          <div className="cd-form-field cd-field-full">
            <label className="cd-form-label">Event Image {!initial && '*'}</label>
            <input className="cd-form-input" type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img src={imagePreview} alt="Preview"
                style={{ marginTop: '8px', maxHeight: '130px', borderRadius: '8px', objectFit: 'cover' }} />
            )}
          </div>
        </div>
        <div className="cd-modal-footer">
          <button className="cd-modal-btn cd-modal-btn-primary" onClick={handleSave} disabled={submitting}>
            <Save size={14} /> {submitting ? 'Saving…' : (initial ? 'Save Changes' : 'Create Event')}
          </button>
          <button className="cd-modal-btn cd-modal-btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const extractList = res =>
  res?.data?.content || res?.data?.data || res?.data || [];

const findMyRole = (memberList, userId) => {
  if (!userId || !memberList?.length) return null;
  const mine = memberList.find(
    m => String(m.user?.id ?? '') === String(userId)
  );
  return mine?.role ?? null;
};

export default function ClubDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const [club, setClub]       = useState(null);
  const [events, setEvents]   = useState([]);
  const [members, setMembers] = useState([]);
  const [myRole, setMyRole]   = useState(null);
  const [activeTab, setActiveTab] = useState('events');
  const [loading, setLoading] = useState(true);

  // modals
  const [editClubOpen, setEditClubOpen]   = useState(false);
  const [eventModal, setEventModal]       = useState({ open: false, initial: null });
  const [deleteEvent, setDeleteEvent]     = useState({ open: false, eventId: null, name: '' });
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [removeMember, setRemoveMember]   = useState({ open: false, memberId: null, name: '' });
  const [roleModal, setRoleModal]         = useState({
    open: false, memberId: null, name: '', current: '', clubId: null, userId: null
  });
  const [newRole, setNewRole] = useState('MEMBER');

  // permissions
  const superAdmin = isSuperAdmin(user);
  const canManage  = superAdmin || myRole === 'ADMIN' || myRole === 'COORDINATOR';
  const canAdmin   = superAdmin || myRole === 'ADMIN';

  const fetchEvents = useCallback(async () => {
    try {
      const res = await eventApi.getAllEvents(id, 0, 20);
      setEvents(extractList(res));
    } catch { toast.error('Failed to load events'); }
  }, [id]);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await membershipApi.getAllMemberships(id, 0, 100);
      const list = extractList(res);
      setMembers(list);
      setMyRole(findMyRole(list, user?.userId));
    } catch { toast.error('Failed to load members'); }
  }, [id, user?.userId]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const [clubRes, memberRes, eventsRes] = await Promise.all([
          clubApi.getClubById(id),
          membershipApi.getAllMemberships(id, 0, 100),
          eventApi.getAllEvents(id, 0, 20),
        ]);

        setClub(clubRes.data);
        const memberList = extractList(memberRes);
        setMembers(memberList);
        setMyRole(findMyRole(memberList, user?.userId));
        setEvents(extractList(eventsRes));

      } catch (err) {
        console.error('[ClubDetail] load error:', err);
        toast.error('Failed to load club details');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user?.userId]);

  const handleEditClub = async (formData) => {
    try {
      const res = await clubApi.updateClub(id, formData);
      setClub(res.data);
      toast.success('Club updated!');
      setEditClubOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update club');
    }
  };

  const handleSaveEvent = async (formData) => {
    try {
      if (eventModal.initial) {
        await eventApi.updateEvent(eventModal.initial.eventId, formData);
        toast.success('Event updated!');
      } else {
        await eventApi.createEvent(formData);
        toast.success('Event created!');
      }
      setEventModal({ open: false, initial: null });
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event');
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await eventApi.deleteEvent(deleteEvent.eventId);
      toast.success('Event deleted');
      setDeleteEvent({ open: false, eventId: null, name: '' });
      fetchEvents();
    } catch { toast.error('Failed to delete event'); }
  };

  const handleAddMember = async (rollNumber, role) => {
    try {
      const usersRes = await userApi.getUserByRollNumber(rollNumber);
      const list = usersRes.data;
      const foundUser = Array.isArray(list) ? list[0] : null;
      const userId = foundUser?.id;

      if (!foundUser || !userId) { toast.error('No user found with that roll number'); return; }

      await membershipApi.createMembership(id, userId, role);
      toast.success('Member added!');
      setAddMemberOpen(false);
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'User not found or already a member');
    }
  };

  const handleRemoveMember = async () => {
    try {
      await membershipApi.deleteMembership(removeMember.memberId);
      toast.success('Member removed');
      setRemoveMember({ open: false, memberId: null, name: '' });
      fetchMembers();
    } catch { toast.error('Failed to remove member'); }
  };

  const handleRoleChange = async () => {
    try {
      await membershipApi.updateMembership(
        roleModal.memberId,
        newRole,
        roleModal.clubId,
        roleModal.userId
      );
      toast.success('Role updated!');
      setRoleModal({ open: false, memberId: null, name: '', current: '', clubId: null, userId: null });
      fetchMembers();
    } catch (err) {
      console.log('role change error:', err.response?.data);
      toast.error('Failed to update role');
    }
  };

  const getInitials = (name = '') => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#c9a84c','#4a6cf7','#34c77b','#e05a5a','#9b59b6','#e67e22'];
  const getColor = (str = '') => colors[(str.charCodeAt(0) || 0) % colors.length];

  const fmtDate = dt => {
    if (!dt) return '';
    const d = new Date(dt);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      + ' · ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toInputDT = dt => {
    if (!dt) return '';
    const d = new Date(dt);
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  };

  if (loading) return <div className="cd-wrapper"><div className="cd-spinner-wrap"><Spinner size="lg" /></div></div>;
  if (!club) return (
    <div className="cd-wrapper">
      <Link to="/clubs" className="cd-back-btn"><ArrowLeft size={15} /> Back to Clubs</Link>
      <p className="cd-not-found">Club not found.</p>
    </div>
  );

  return (
    <div className="cd-wrapper">
      <Link to="/clubs" className="cd-back-btn"><ArrowLeft size={15} /> Back to Clubs</Link>

      <div className="cd-header">
        <div className="cd-header-left">
          <p className="cd-eyebrow">Club</p>
          <h1 className="cd-title">{club.clubName}</h1>
          <div className="cd-code-pill">
            <span className="cd-code-label">Code</span>
            <span className="cd-code-val">{club.clubCode}</span>
          </div>
          {myRole && (
            <div className="cd-my-role">
              <span className="cd-my-role-label">Your role</span>
              <Badge role={myRole} size="sm" />
            </div>
          )}
          {superAdmin && (
            <div className="cd-admin-actions">
              <button className="cd-btn-edit" onClick={() => setEditClubOpen(true)}>
                <Edit3 size={13} /> Edit Club
              </button>
            </div>
          )}
        </div>
        <div className="cd-header-right">
          {club.clubImage ? (
            <img src={club.clubImage} alt={club.clubName} className="cd-club-img" />
          ) : (
            <div className="cd-club-avatar" style={{ background: `${getColor(club.clubName)}1a`, color: getColor(club.clubName) }}>
              {getInitials(club.clubName)}
            </div>
          )}
          <div className="cd-header-stats">
            <div className="cd-hstat"><span className="cd-hstat-num">{members.length}</span><span className="cd-hstat-label">Members</span></div>
            <div className="cd-hstat-div" />
            <div className="cd-hstat"><span className="cd-hstat-num">{events.length}</span><span className="cd-hstat-label">Events</span></div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="cd-content">
        <div className="cd-tabs">
          <button className={`cd-tab ${activeTab==='events' ? 'cd-tab-active' : ''}`}
            onClick={() => { setActiveTab('events'); fetchEvents(); }}>
            <Calendar size={15}/> Events {events.length > 0 && <span className="cd-tab-count">{events.length}</span>}
          </button>
          <button className={`cd-tab ${activeTab==='members' ? 'cd-tab-active' : ''}`}
            onClick={() => { setActiveTab('members'); fetchMembers(); }}>
            <Users size={15}/> Members {members.length > 0 && <span className="cd-tab-count">{members.length}</span>}
          </button>
        </div>

        {activeTab === 'events' && (
          <div className="cd-section">
            <div className="cd-section-topbar">
              <div>
                <p className="cd-section-eyebrow">All Events</p>
                <h2 className="cd-section-heading">Club <em>Events</em></h2>
              </div>
              {canManage && (
                <button className="cd-btn-primary" onClick={() => setEventModal({ open: true, initial: null })}>
                  <Plus size={15}/> Create Event
                </button>
              )}
            </div>

            {events.length === 0 ? (
              <div className="cd-empty">
                <div className="cd-empty-icon"><Calendar size={28}/></div>
                <p className="cd-empty-title">No events yet</p>
                <p className="cd-empty-sub">{canManage ? 'Create the first event.' : 'No events posted yet.'}</p>
                {canManage && (
                  <button className="cd-btn-primary" style={{ marginTop: '1rem' }}
                    onClick={() => setEventModal({ open: true, initial: null })}>
                    <Plus size={15}/> Create Event
                  </button>
                )}
              </div>
            ) : (
              <div className="cd-events-grid">
                {events.map(event => {
                  const isPast = new Date(event.eventDateTime) < new Date();
                  return (
                    <div key={event.eventId} className="cd-event-wrap">
                      <Link to={`/events/${event.eventId}`} className="cd-event-card">
                        <ArrowUpRight size={14} className="cd-event-arrow"/>
                        <span className={`cd-event-pill ${isPast ? 'cd-pill-gray' : 'cd-pill-green'}`}>
                          {isPast ? 'Past' : 'Open'}
                        </span>
                        {event.eventImage && <img src={event.eventImage} alt={event.eventName} className="cd-event-img"/>}
                        <div className="cd-event-body">
                          <h3 className="cd-event-name">{event.eventName}</h3>
                          <p className="cd-event-date">{fmtDate(event.eventDateTime)}</p>
                          {event.location && <p className="cd-event-loc">{event.location}</p>}
                        </div>
                      </Link>
                      {canManage && (
                        <div className="cd-event-adminbar">
                          <button className="cd-eab cd-eab-edit"
                            onClick={() => setEventModal({
                              open: true,
                              initial: { ...event, eventDateTime: toInputDT(event.eventDateTime) }
                            })}>
                            <Edit3 size={12}/> Edit
                          </button>
                          {canAdmin && (
                            <button className="cd-eab cd-eab-del"
                              onClick={() => setDeleteEvent({ open: true, eventId: event.eventId, name: event.eventName })}>
                              <Trash2 size={12}/> Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="cd-section">
            <div className="cd-section-topbar">
              <div>
                <p className="cd-section-eyebrow">Club Roster</p>
                <h2 className="cd-section-heading">Club <em>Members</em></h2>
              </div>
              {canAdmin && (
                <button className="cd-btn-primary" onClick={() => setAddMemberOpen(true)}>
                  <UserPlus size={15}/> Add Member
                </button>
              )}
            </div>

            {members.length === 0 ? (
              <div className="cd-empty">
                <div className="cd-empty-icon"><Users size={28}/></div>
                <p className="cd-empty-title">No members yet</p>
                <p className="cd-empty-sub">No one has joined this club yet.</p>
              </div>
            ) : (
              <div className="cd-table-wrap">
                <table className="cd-table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Roll Number</th>
                      <th>Role</th>
                      {canAdmin && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(m => (
                      <tr key={m.participationId}>
                        <td>
                          <div className="cd-member-name-cell">
                            <div className="cd-member-avatar"
                              style={{ background: `${getColor(m.user?.name||'')}1a`, color: getColor(m.user?.name||'') }}>
                              {m.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="cd-member-name">{m.user?.name}</span>
                          </div>
                        </td>
                        <td className="cd-roll">{m.user?.rollNumber || '—'}</td>
                        <td><Badge role={m.role} size="sm"/></td>
                        {canAdmin && (
                          <td>
                            <div className="cd-mem-actions">
                              <button className="cd-mem-btn cd-mem-role"
                                onClick={() => {
                                  setRoleModal({
                                    open: true,
                                    memberId: m.participationId,
                                    name: m.user?.name,
                                    current: m.role,
                                    clubId: m.club?.clubId ?? Number(id),
                                    userId: m.user?.id,
                                  });
                                  setNewRole(m.role);
                                }}>
                                <ShieldCheck size={13}/> Role
                              </button>
                              {String(m.user?.id) !== String(user?.userId) && (
                                <button className="cd-mem-btn cd-mem-remove"
                                  onClick={() => setRemoveMember({
                                    open: true,
                                    memberId: m.participationId,
                                    name: m.user?.name
                                  })}>
                                  <Trash2 size={13}/>
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <EditClubModal
        open={editClubOpen}
        onClose={() => setEditClubOpen(false)}
        onSave={handleEditClub}
        club={club}
      />
      <EventModal
        open={eventModal.open}
        onClose={() => setEventModal({ open: false, initial: null })}
        onSave={handleSaveEvent}
        initial={eventModal.initial}
        clubId={id}
      />
      <ConfirmModal
        open={deleteEvent.open}
        title="Delete Event"
        message={`Delete "${deleteEvent.name}"? This cannot be undone.`}
        onConfirm={handleDeleteEvent}
        onClose={() => setDeleteEvent({ open: false, eventId: null, name: '' })}
      />
      <AddMemberModal
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        onAdd={handleAddMember}
      />
      <ConfirmModal
        open={removeMember.open}
        title="Remove Member"
        message={`Remove ${removeMember.name} from this club?`}
        onConfirm={handleRemoveMember}
        onClose={() => setRemoveMember({ open: false, memberId: null, name: '' })}
      />

      {roleModal.open && (
        <div className="cd-modal-backdrop"
          onClick={() => setRoleModal({ open: false, memberId: null, name: '', current: '', clubId: null, userId: null })}>
          <div className="cd-modal" onClick={e => e.stopPropagation()}>
            <div className="cd-modal-header">
              <h3 className="cd-modal-title">Change Role</h3>
              <button className="cd-modal-close"
                onClick={() => setRoleModal({ open: false, memberId: null, name: '', current: '', clubId: null, userId: null })}>
                <X size={16}/>
              </button>
            </div>
            <div className="cd-modal-form">
              <p className="cd-role-who"><Crown size={13}/> {roleModal.name}</p>
              <div className="cd-role-options">
                {['MEMBER', 'COORDINATOR', 'ADMIN'].map(r => (
                  <button key={r}
                    className={`cd-role-opt ${newRole === r ? 'cd-role-opt-active' : ''}`}
                    onClick={() => setNewRole(r)}>
                    <div className="cd-role-opt-top">
                      <Badge role={r} size="sm"/>
                      {newRole === r && <span className="cd-role-check">✓</span>}
                    </div>
                    <p className="cd-role-desc">
                      {r === 'MEMBER' && 'View & join events'}
                      {r === 'COORDINATOR' && 'Create & manage events'}
                      {r === 'ADMIN' && 'Full club control'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            <div className="cd-modal-footer">
              <button className="cd-modal-btn cd-modal-btn-primary" onClick={handleRoleChange}>
                <Save size={13}/> Save Role
              </button>
              <button className="cd-modal-btn cd-modal-btn-ghost"
                onClick={() => setRoleModal({ open: false, memberId: null, name: '', current: '', clubId: null, userId: null })}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
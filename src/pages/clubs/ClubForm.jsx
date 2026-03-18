import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clubApi } from '../../api/clubApi';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import './ClubForm.css';

export default function ClubForm({ clubId = null, onClose, onSuccess }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clubName: '',
    clubCode: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.clubName.trim() || !formData.clubCode.trim()) {
      toast.error('Club name and code are required');
      return;
    }
    try {
      setLoading(true);
      const form = new FormData();
      form.append('clubName', formData.clubName);
      form.append('clubCode', formData.clubCode);
      if (photoFile) {
        form.append('clubImageFile', photoFile); // matches backend CreateClubRequest field
      }

      if (clubId) {
        await clubApi.updateClub(clubId, form);
        toast.success('Club updated!');
      } else {
        await clubApi.createClub(form);
        toast.success('Club created!');
      }

      if (onSuccess) onSuccess();
      else if (onClose) onClose();
      else navigate('/clubs');

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save club');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (onClose) onClose();
    else navigate('/clubs');
  };

  return (
    <div className="cf-wrapper">
      <div className="cf-container">

        {/* ── HEADER ── */}
        <div className="cf-header">
          <button className="cf-back-btn" onClick={handleBack}>
            <ArrowLeft size={15} /> Back to Clubs
          </button>
          <div>
            <p className="cf-eyebrow">{clubId ? 'Edit' : 'New'} Club</p>
            <h1 className="cf-title">{clubId ? 'Edit Club' : 'Create Club'}</h1>
          </div>
        </div>

        {/* ── FORM ── */}
        <div className="cf-card">
          <div className="cf-form">

            {/* Club Name */}
            <div className="cf-field">
              <label className="cf-label">Club Name <span className="cf-required">*</span></label>
              <input
                type="text"
                name="clubName"
                value={formData.clubName}
                onChange={handleChange}
                className="cf-input"
                placeholder="e.g. Coding Club"
              />
            </div>

            {/* Club Code */}
            <div className="cf-field">
              <label className="cf-label">Club Code <span className="cf-required">*</span></label>
              <input
                type="text"
                name="clubCode"
                value={formData.clubCode}
                onChange={handleChange}
                className="cf-input"
                placeholder="e.g. CC01"
              />
              <p className="cf-hint">Short unique identifier for the club</p>
            </div>

            {/* Image Upload */}
            <div className="cf-field">
              <label className="cf-label">Club Image</label>
              {photoPreview ? (
                <div className="cf-preview-wrap">
                  <img src={photoPreview} alt="Preview" className="cf-preview-img" />
                  <button className="cf-remove-img" onClick={removePhoto}>
                    <X size={14} /> Remove
                  </button>
                </div>
              ) : (
                <label className="cf-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                  />
                  <Upload size={24} className="cf-upload-icon" />
                  <p className="cf-upload-text">Click to upload image</p>
                  <p className="cf-upload-hint">PNG, JPG up to 5MB</p>
                </label>
              )}
            </div>

            {/* Actions */}
            <div className="cf-actions">
              <button
                className="cf-submit-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                <Save size={15} />
                {loading ? 'Saving…' : (clubId ? 'Save Changes' : 'Create Club')}
              </button>
              <button className="cf-cancel-btn" onClick={handleBack}>
                Cancel
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
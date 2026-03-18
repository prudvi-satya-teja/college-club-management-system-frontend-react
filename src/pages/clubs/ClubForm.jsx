import { useState } from 'react';
import { clubApi } from '../../api/clubApi';
import ImageUpload from '../../components/common/ImageUpload';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import './ClubForm.css';

export default function ClubForm({ clubId = null, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clubName: '',
    clubCode: '',
    description: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = file => {
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!formData.clubName.trim() || !formData.clubCode.trim()) {
        toast.error('Club name and code are required');
        return;
      }

      const form = new FormData();
      form.append('clubName', formData.clubName);
      form.append('clubCode', formData.clubCode);
      form.append('description', formData.description);
      if (photoFile) {
        form.append('photoFile', photoFile);
      }

      if (clubId) {
        await clubApi.updateClub(clubId, form);
        toast.success('Club updated successfully');
      } else {
        await clubApi.createClub(form);
        toast.success('Club created successfully');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        onClose?.();
      }
    } catch (err) {
      console.error('Error saving club:', err);
      toast.error(err.response?.data?.message || 'Failed to save club');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        {onClose && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="form-title">{clubId ? 'Edit Club' : 'Create Club'}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">
              Club Name
              <span className="form-required">*</span>
            </label>
            <input
              type="text"
              name="clubName"
              value={formData.clubName}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="e.g., Chess Club"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Club Code
              <span className="form-required">*</span>
            </label>
            <input
              type="text"
              name="clubCode"
              value={formData.clubCode}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="e.g., CHESS"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              rows={4}
              placeholder="Brief description of the club..."
            />
          </div>

          <ImageUpload onChange={handlePhotoChange} preview={photoPreview} />

          <div className="form-actions pt-4">
            <button
              type="submit"
              disabled={loading}
              className="form-submit"
            >
              {loading ? 'Saving...' : 'Save Club'}
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="form-cancel"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

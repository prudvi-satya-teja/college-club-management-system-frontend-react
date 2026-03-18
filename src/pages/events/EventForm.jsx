import { useState } from 'react';
import { eventApi } from '../../api/eventApi';
import ImageUpload from '../../components/common/ImageUpload';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import './EventForm.css';

export default function EventForm({ clubId, eventId = null, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    location: '',
    theme: '',
    guestOfHonor: '',
    eventDetails: '',
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

      if (!formData.eventName.trim() || !formData.eventDate || !formData.location.trim()) {
        toast.error('Event name, date, and location are required');
        return;
      }

      const form = new FormData();
      form.append('eventName', formData.eventName);
      form.append('eventDate', formData.eventDate);
      form.append('location', formData.location);
      form.append('theme', formData.theme);
      form.append('guestOfHonor', formData.guestOfHonor);
      form.append('eventDetails', formData.eventDetails);
      form.append('clubId', clubId);
      if (photoFile) {
        form.append('photoFile', photoFile);
      }

      if (eventId) {
        await eventApi.updateEvent(eventId, form);
        toast.success('Event updated successfully');
      } else {
        await eventApi.createEvent(form);
        toast.success('Event created successfully');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        onClose?.();
      }
    } catch (err) {
      console.error('Error saving event:', err);
      toast.error(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-form-wrapper">
      <div className="event-form-container">
        {onClose && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="event-form-title">{eventId ? 'Edit Event' : 'Create Event'}</h2>
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
            <label className="form-label">Event Name</label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="e.g., Annual Chess Tournament"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Event Date</label>
              <input
                type="datetime-local"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="e.g., Auditorium Hall"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Theme</label>
              <input
                type="text"
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., Rapid Tournament"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Guest of Honor</label>
              <input
                type="text"
                name="guestOfHonor"
                value={formData.guestOfHonor}
                onChange={handleChange}
                className="form-input"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Event Details</label>
            <textarea
              name="eventDetails"
              value={formData.eventDetails}
              onChange={handleChange}
              className="form-textarea"
              rows={4}
              placeholder="Detailed description of the event..."
            />
          </div>

          <ImageUpload onChange={handlePhotoChange} preview={photoPreview} />

          <div className="form-actions pt-4">
            <button
              type="submit"
              disabled={loading}
              className="form-submit"
            >
              {loading ? 'Saving...' : 'Save Event'}
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

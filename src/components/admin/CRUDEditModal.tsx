import React, { useState, useEffect } from 'react';
import { MagneticButton } from '../common/MagneticButton';

interface CRUDEditModalProps {
  isOpen: boolean;
  type: 'services' | 'projects' | 'events' | 'gallery' | 'team' | 'testimonials';
  initialData?: any;
  onClose: () => void;
  onSave: (item: any) => void;
}

export const CRUDEditModal: React.FC<CRUDEditModalProps> = ({
  isOpen,
  type,
  initialData,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      // Default empty object per type
      if (type === 'services') {
        setFormData({ id: `service-${Date.now()}`, title: '', desc: '', icon: '⚡' });
      } else if (type === 'projects') {
        setFormData({
          id: `proj-${Date.now()}`,
          title: '',
          desc: '',
          category: 'Software & AI',
          year: '2081',
          image: '/assets/images/project_smartcampus.jpg',
          link: '#',
          featured: true,
        });
      } else if (type === 'events') {
        setFormData({
          id: `event-${Date.now()}`,
          date: 'OCT 2026',
          title: '',
          desc: '',
          location: 'Main Auditorium, NPI',
        });
      } else if (type === 'gallery') {
        setFormData({
          id: `gallery-${Date.now()}`,
          image: '/assets/images/gallery_tech_event.jpg',
          caption: '',
          category: 'Workshops',
        });
      } else if (type === 'team') {
        setFormData({
          id: `team-${Date.now()}`,
          name: '',
          role: '',
          bio: '',
          image: '/assets/images/team_member.jpg',
          github: '#',
          linkedin: '#',
          email: '',
        });
      } else if (type === 'testimonials') {
        setFormData({
          id: `testi-${Date.now()}`,
          name: '',
          role: 'B.E. Computer Engineering',
          review: '',
        });
      }
    }
  }, [initialData, type, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const getTitle = () => {
    const action = initialData ? 'Edit' : 'Create New';
    switch (type) {
      case 'services':
        return `${action} Service Card`;
      case 'projects':
        return `${action} Project`;
      case 'events':
        return `${action} Timeline Milestone`;
      case 'gallery':
        return `${action} Gallery Item`;
      case 'team':
        return `${action} Executive Committee Member`;
      case 'testimonials':
        return `${action} Testimonial`;
      default:
        return `${action} Item`;
    }
  };

  return (
    <div
      className="modal-overlay active"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-dialog glass-panel" style={{ maxWidth: '600px' }}>
        <button
          type="button"
          className="modal-close"
          aria-label="Close dialog"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="modal-header mb-6">
          <span className="modal-tag space-mono">DATABASE EDITOR</span>
          <h3 className="modal-title font-heading text-xl">{getTitle()}</h3>
        </div>

        <form className="luxury-form" onSubmit={handleSubmit}>
          {type === 'services' && (
            <>
              <div className="form-group">
                <label className="space-grotesk">TITLE</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">EMOJI / ICON</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.icon || ''}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">DESCRIPTION</label>
                <textarea
                  className="form-input form-textarea"
                  rows={3}
                  value={formData.desc || ''}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          {type === 'projects' && (
            <>
              <div className="form-group">
                <label className="space-grotesk">PROJECT TITLE</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">CATEGORY TAG</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">YEAR</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.year || ''}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">IMAGE URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">LINK / REPOSITORY URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.link || ''}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">DESCRIPTION</label>
                <textarea
                  className="form-input form-textarea"
                  rows={3}
                  value={formData.desc || ''}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          {type === 'events' && (
            <>
              <div className="form-group">
                <label className="space-grotesk">EVENT TITLE</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">DATE LABEL (e.g. OCT 2026)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">LOCATION</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">DESCRIPTION</label>
                <textarea
                  className="form-input form-textarea"
                  rows={3}
                  value={formData.desc || ''}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          {type === 'gallery' && (
            <>
              <div className="form-group">
                <label className="space-grotesk">IMAGE URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">CAPTION</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.caption || ''}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">CATEGORY (Workshops, Design, Exhibitions, Hardware)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          {type === 'team' && (
            <>
              <div className="form-group">
                <label className="space-grotesk">FULL NAME</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">ROLE / TITLE</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">IMAGE URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">GITHUB PROFILE URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.github || ''}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">LINKEDIN PROFILE URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.linkedin || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">EMAIL ADDRESS</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">SHORT BIO</label>
                <textarea
                  className="form-input form-textarea"
                  rows={2}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
            </>
          )}

          {type === 'testimonials' && (
            <>
              <div className="form-group">
                <label className="space-grotesk">MEMBER / FACULTY NAME</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">ROLE / AFFILIATION</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="space-grotesk">TESTIMONIAL REVIEW</label>
                <textarea
                  className="form-input form-textarea"
                  rows={3}
                  value={formData.review || ''}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <MagneticButton type="submit" className="btn-primary">
              Save Entry
            </MagneticButton>
          </div>
        </form>
      </div>
    </div>
  );
};

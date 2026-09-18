import React, { useState, useEffect } from 'react';
import type { SiteDatabase } from '../../types/site';
import { MagneticButton } from '../common/MagneticButton';

interface SectionFormsProps {
  activeTab: 'hero' | 'story' | 'services' | 'contact';
  data: SiteDatabase;
  onSave: (updated: SiteDatabase) => Promise<void>;
}

export const SectionForms: React.FC<SectionFormsProps> = ({ activeTab, data, onSave }) => {
  const [formData, setFormData] = useState<SiteDatabase>(data);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await onSave(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="panel active">
      <form className="luxury-form" onSubmit={handleSubmit}>
        {activeTab === 'hero' && (
          <>
            <div className="panel-header mb-6">
              <h2 className="panel-title space-grotesk">Hero Section Configurations</h2>
              <span className="panel-subtitle">Manage primary headline, subtitle, and CTA prompts.</span>
            </div>

            <div className="form-group">
              <label className="space-grotesk">HERO HEADLINE TITLE</label>
              <input
                type="text"
                className="form-input"
                value={formData.hero.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, title: e.target.value },
                  })
                }
                required
              />
              <span className="input-line" />
            </div>

            <div className="form-group">
              <label className="space-grotesk">HERO SUBTITLE</label>
              <input
                type="text"
                className="form-input"
                value={formData.hero.subtitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, subtitle: e.target.value },
                  })
                }
                required
              />
              <span className="input-line" />
            </div>

            <div className="form-group">
              <label className="space-grotesk">EXPANDED MISSION DESCRIPTION</label>
              <textarea
                className="form-input form-textarea"
                rows={3}
                value={formData.hero.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, description: e.target.value },
                  })
                }
                required
              />
              <span className="input-line" />
            </div>

            <div className="form-group">
              <label className="space-grotesk">PRIMARY CTA BUTTON TEXT</label>
              <input
                type="text"
                className="form-input"
                value={formData.hero.exploreBtn}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, exploreBtn: e.target.value },
                  })
                }
                required
              />
              <span className="input-line" />
            </div>
          </>
        )}

        {activeTab === 'story' && (
          <>
            <div className="panel-header mb-6">
              <h2 className="panel-title space-grotesk">Our Story & Pillars</h2>
              <span className="panel-subtitle">Edit institutional origin, mission, vision, purpose, and image.</span>
            </div>

            <div className="form-group">
              <label className="space-grotesk">SECTION BADGE TAG</label>
              <input
                type="text"
                className="form-input"
                value={formData.story.badge}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    story: { ...formData.story, badge: e.target.value },
                  })
                }
                required
              />
              <span className="input-line" />
            </div>

            <div className="form-group">
              <label className="space-grotesk">STORY MAIN TITLE</label>
              <input
                type="text"
                className="form-input"
                value={formData.story.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    story: { ...formData.story, title: e.target.value },
                  })
                }
                required
              />
              <span className="input-line" />
            </div>

            <div className="form-group">
              <label className="space-grotesk">PILLAR 1: MISSION STATEMENT</label>
              <textarea
                className="form-input form-textarea"
                rows={3}
                value={formData.story.mission}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    story: { ...formData.story, mission: e.target.value },
                  })
                }
                required
              />
              <span className="input-line" />
            </div>

            <div className="form-group">
              <label className="space-grotesk">PILLAR 2: VISION STATEMENT</label>
              <textarea
                className="form-input form-textarea"
                rows={3}
                value={formData.story.vision}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    story: { ...formData.story, vision: e.target.value },
                  })
                }
                required
              />
              <span className="input-line" />
            </div>

            <div className="form-group">
              <label className="space-grotesk">PILLAR 3: CLUB PURPOSE</label>
              <textarea
                className="form-input form-textarea"
                rows={3}
                value={formData.story.purpose}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    story: { ...formData.story, purpose: e.target.value },
                  })
                }
                required
              />
              <span className="input-line" />
            </div>

            <div className="form-group">
              <label className="space-grotesk">PILLAR 4: INSTITUTIONAL HISTORY</label>
              <textarea
                className="form-input form-textarea"
                rows={3}
                value={formData.story.history}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    story: { ...formData.story, history: e.target.value },
                  })
                }
                required
              />
              <span className="input-line" />
            </div>

            <div className="form-group">
              <label className="space-grotesk">STORY HERO IMAGE URL</label>
              <input
                type="text"
                className="form-input"
                value={formData.story.image}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    story: { ...formData.story, image: e.target.value },
                  })
                }
                required
              />
              <span className="input-line" />
            </div>
          </>
        )}

        {activeTab === 'services' && (
          <>
            <div className="panel-header mb-6">
              <h2 className="panel-title space-grotesk">Services / Craft Overview</h2>
              <span className="panel-subtitle">Configure header titles and intro text for domain tracks.</span>
            </div>

            <div className="form-group">
              <label className="space-grotesk">SECTION BADGE</label>
              <input
                type="text"
                className="form-input"
                value={formData.whatWeDo.badge}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whatWeDo: { ...formData.whatWeDo, badge: e.target.value },
                  })
                }
                required
              />
              <span className="input-line" />
            </div>

            <div className="form-group">
              <label className="space-grotesk">SECTION TITLE</label>
              <input
                type="text"
                className="form-input"
                value={formData.whatWeDo.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whatWeDo: { ...formData.whatWeDo, title: e.target.value },
                  })
                }
                required
              />
              <span className="input-line" />
            </div>

            <div className="form-group">
              <label className="space-grotesk">DESCRIPTION</label>
              <textarea
                className="form-input form-textarea"
                rows={3}
                value={formData.whatWeDo.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whatWeDo: { ...formData.whatWeDo, description: e.target.value },
                  })
                }
                required
              />
              <span className="input-line" />
            </div>
          </>
        )}

        {activeTab === 'contact' && (
          <>
            <div className="panel-header mb-6">
              <h2 className="panel-title space-grotesk">Contact Directory & Charter Quote</h2>
              <span className="panel-subtitle">Manage campus inquiries, phone numbers, and engineering philosophy.</span>
            </div>

            <div className="form-group">
              <label className="space-grotesk">PUBLIC INQUIRY EMAIL</label>
              <input
                type="email"
                className="form-input"
                value={formData.contact.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, email: e.target.value },
                  })
                }
                required
              />
              <span className="input-line" />
            </div>

            <div className="form-group">
              <label className="space-grotesk">OFFICIAL PHONE NUMBER</label>
              <input
                type="text"
                className="form-input"
                value={formData.contact.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, phone: e.target.value },
                  })
                }
                required
              />
              <span className="input-line" />
            </div>

            <div className="form-group">
              <label className="space-grotesk">PHYSICAL CAMPUS ADDRESS</label>
              <input
                type="text"
                className="form-input"
                value={formData.contact.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, address: e.target.value },
                  })
                }
                required
              />
              <span className="input-line" />
            </div>

            <div className="form-group mt-8">
              <label className="space-grotesk">GUIDING PHILOSOPHY QUOTE</label>
              <textarea
                className="form-input form-textarea"
                rows={3}
                value={formData.quote.text}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quote: { ...formData.quote, text: e.target.value },
                  })
                }
                required
              />
              <span className="input-line" />
            </div>

            <div className="form-group">
              <label className="space-grotesk">QUOTE AUTHOR / CITATION</label>
              <input
                type="text"
                className="form-input"
                value={formData.quote.author}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quote: { ...formData.quote, author: e.target.value },
                  })
                }
                required
              />
              <span className="input-line" />
            </div>
          </>
        )}

        <div className="flex items-center gap-4 mt-6">
          <MagneticButton type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Section Changes'}
          </MagneticButton>

          {saveSuccess && (
            <span className="text-emerald-400 space-mono text-sm">✓ Changes Saved Successfully!</span>
          )}
        </div>
      </form>
    </div>
  );
};

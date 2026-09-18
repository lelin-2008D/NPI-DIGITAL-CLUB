import React, { useState } from 'react';
import type { GalleryItem } from '../../types/site';
import { LightboxModal } from './LightboxModal';

interface GallerySectionProps {
  gallery?: GalleryItem[];
}

const CATEGORIES = [
  { id: 'all', label: 'All Photos' },
  { id: 'workshops', label: 'Workshops' },
  { id: 'design', label: 'Design' },
  { id: 'exhibitions', label: 'Exhibitions' },
  { id: 'hardware', label: 'Hardware' },
];

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery = [] }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredItems =
    activeFilter === 'all'
      ? gallery
      : gallery.filter((item) => item.category?.toLowerCase() === activeFilter.toLowerCase());

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const nextLightbox = () => {
    setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const prevLightbox = () => {
    setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section className="section-padded gallery-section" id="gallery">
      <div className="section-container">
        <div className="section-header center reveal-on-scroll">
          <div className="section-tag space-mono">
            <span className="tag-line" />
            <span>VISUAL ARCHIVE</span>
            <span className="tag-line" />
          </div>
          <h2 className="section-title font-heading">Event & Workshop Gallery</h2>
          <p className="section-desc">
            Snapshots from our technical bootcamps, project hackathons, and guest seminars.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="gallery-filter-bar reveal-on-scroll" role="tablist" aria-label="Gallery category filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-pill space-mono ${activeFilter === cat.id ? 'active' : ''}`}
              role="tab"
              aria-selected={activeFilter === cat.id}
              onClick={() => setActiveFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid" id="gallery-grid-container">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="gallery-item glass-panel reveal-on-scroll"
                onClick={() => openLightbox(idx)}
                role="button"
                tabIndex={0}
                aria-label={`View photo: ${item.caption || 'Event photo'}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(idx);
                  }
                }}
              >
                <img
                  src={item.image || '/assets/images/gallery_tech_event.jpg'}
                  alt={item.caption || 'Gallery Image'}
                  className="gallery-img"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== '/assets/images/gallery_tech_event.jpg') {
                      target.src = '/assets/images/gallery_tech_event.jpg';
                    }
                  }}
                />
                <div className="gallery-overlay">
                  <span className="gallery-caption space-grotesk">{item.caption}</span>
                  <span className="gallery-cat-badge space-mono">{item.category}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state-notice">
              <p>No photos found in this category archive.</p>
            </div>
          )}
        </div>
      </div>

      <LightboxModal
        isOpen={lightboxOpen}
        currentIndex={lightboxIndex}
        items={filteredItems}
        onClose={() => setLightboxOpen(false)}
        onNext={nextLightbox}
        onPrev={prevLightbox}
      />
    </section>
  );
};

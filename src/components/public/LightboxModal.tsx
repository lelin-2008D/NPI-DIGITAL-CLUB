import React, { useEffect } from 'react';
import type { GalleryItem } from '../../types/site';

interface LightboxModalProps {
  isOpen: boolean;
  currentIndex: number;
  items: GalleryItem[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  currentIndex,
  items,
  onClose,
  onNext,
  onPrev,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);

  if (!isOpen || !items[currentIndex]) return null;

  const currentItem = items[currentIndex];

  return (
    <div
      className="lightbox-overlay active"
      id="lightbox-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Photo Gallery Lightbox"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        className="lightbox-close"
        id="lightbox-close"
        aria-label="Close Lightbox"
        onClick={onClose}
      >
        ✕
      </button>

      <button
        type="button"
        className="lightbox-nav-btn prev"
        id="lightbox-prev"
        aria-label="Previous Image"
        onClick={onPrev}
      >
        ‹
      </button>

      <div className="lightbox-content-box">
        <img
          src={currentItem.image || '/assets/images/gallery_tech_event.jpg'}
          alt={currentItem.caption || 'NPI Digital Club Event Photo'}
          className="lightbox-img"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== '/assets/images/gallery_tech_event.jpg') {
              target.src = '/assets/images/gallery_tech_event.jpg';
            }
          }}
        />
        <div className="lightbox-caption-bar">
          <p className="lightbox-caption space-grotesk">{currentItem.caption}</p>
          <span className="lightbox-counter space-mono">
            {currentIndex + 1} / {items.length}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="lightbox-nav-btn next"
        id="lightbox-next"
        aria-label="Next Image"
        onClick={onNext}
      >
        ›
      </button>
    </div>
  );
};

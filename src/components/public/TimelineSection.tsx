import React, { useRef, useState, useEffect } from 'react';
import type { TimelineEvent } from '../../types/site';

interface TimelineSectionProps {
  events?: TimelineEvent[];
  onRSVP: (eventId: string, eventTitle: string) => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ events = [], onRSVP }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollPercent, setScrollPercent] = useState(0);

  const updateProgress = () => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) {
      setScrollPercent(100);
      return;
    }
    const pct = (track.scrollLeft / maxScroll) * 100;
    setScrollPercent(pct);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      track.classList.add('dragging');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      track.classList.remove('dragging');
    };

    const onMouseUp = () => {
      isDown = false;
      track.classList.remove('dragging');
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
      updateProgress();
    };

    track.addEventListener('mousedown', onMouseDown);
    track.addEventListener('mouseleave', onMouseLeave);
    track.addEventListener('mouseup', onMouseUp);
    track.addEventListener('mousemove', onMouseMove);
    track.addEventListener('scroll', updateProgress, { passive: true });

    updateProgress();

    return () => {
      track.removeEventListener('mousedown', onMouseDown);
      track.removeEventListener('mouseleave', onMouseLeave);
      track.removeEventListener('mouseup', onMouseUp);
      track.removeEventListener('mousemove', onMouseMove);
      track.removeEventListener('scroll', updateProgress);
    };
  }, [events]);

  return (
    <section className="section-padded timeline-section" id="events">
      <div className="section-container">
        <div className="section-header reveal-on-scroll">
          <div className="section-tag space-mono">
            <span className="tag-line" />
            <span>ROADMAP & MILESTONES</span>
          </div>
          <h2 className="section-title font-heading">Upcoming Technical Events</h2>
          <p className="section-desc">
            Drag horizontally to navigate upcoming workshops, campus hackathons, and guest seminars.
          </p>
        </div>

        {/* Timeline Progress Line */}
        <div className="timeline-line-container">
          <div className="timeline-line-track">
            <div className="timeline-line-fill" style={{ width: `${scrollPercent}%` }} />
          </div>
        </div>

        {/* Timeline Horizontal Track */}
        <div
          ref={trackRef}
          className="timeline-track"
          id="timeline-track"
          role="region"
          aria-label="Event Timeline Track"
          tabIndex={0}
        >
          <div className="timeline-cards-row" id="timeline-cards-container">
            {events.length > 0 ? (
              events.map((event, idx) => (
                <div key={event.id || idx} className="timeline-card glass-panel">
                  <div className="timeline-card-header">
                    <span className="timeline-date space-mono">{event.date}</span>
                    <span className="timeline-location space-mono">📍 {event.location}</span>
                  </div>
                  <h3 className="timeline-card-title space-grotesk">{event.title}</h3>
                  <p className="timeline-card-desc">{event.desc}</p>
                  <button
                    type="button"
                    className="timeline-rsvp-btn space-mono"
                    onClick={() => onRSVP(event.id || `event-${idx}`, event.title)}
                  >
                    <span>Reserve Seat</span>
                    <span className="btn-icon">↗</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-state-notice">
                <p>New events are currently being scheduled for the upcoming term.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

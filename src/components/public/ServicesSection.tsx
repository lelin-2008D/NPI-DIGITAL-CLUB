import React from 'react';
import type { WhatWeDoData } from '../../types/site';

interface ServicesSectionProps {
  whatWeDo?: WhatWeDoData;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ whatWeDo }) => {
  const badge = whatWeDo?.badge || 'WHAT WE DO';
  const title = whatWeDo?.title || 'Our Craft & Technical Domains';
  const description =
    whatWeDo?.description ||
    'We organize rigorous technical events, build real-world software & IoT solutions, and provide mentorship across key engineering fields.';
  const cards = whatWeDo?.cards || [];

  return (
    <section className="section-padded services-section" id="services">
      <div className="section-container">
        <div className="section-header center reveal-on-scroll">
          <div className="section-tag space-mono" id="services-badge">
            <span className="tag-line" />
            <span>{badge}</span>
            <span className="tag-line" />
          </div>
          <h2 className="section-title font-heading" id="services-title">
            {title}
          </h2>
          <p className="section-desc" id="services-desc">
            {description}
          </p>
        </div>

        <div className="services-grid" id="services-grid-container">
          {cards.length > 0 ? (
            cards.map((card, idx) => (
              <div key={card.id || idx} className="service-card glass-panel reveal-on-scroll">
                <div className="service-icon-box">
                  <span className="service-icon">{card.icon || '⚡'}</span>
                </div>
                <h3 className="service-card-title space-grotesk">{card.title}</h3>
                <p className="service-card-desc">{card.desc}</p>
              </div>
            ))
          ) : (
            <div className="empty-state-notice">
              <p>Domain tracks are currently being updated by the executive committee.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

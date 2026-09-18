import React from 'react';
import type { StoryData } from '../../types/site';

interface StorySectionProps {
  story?: StoryData;
}

export const StorySection: React.FC<StorySectionProps> = ({ story }) => {
  const badge = story?.badge || 'ORIGIN & VISION';
  const title = story?.title || 'Fostering Technological Innovation in Bharatpur';
  const mission =
    story?.mission ||
    'To bridge the divide between theoretical classroom education and cutting-edge industrial technology, cultivating skilled software engineers and hardware innovators.';
  const vision =
    story?.vision ||
    'To establish Nepal Polytechnic Institute as a premier hub for student-led digital product development, research, and technical leadership across Nepal.';
  const purpose =
    story?.purpose ||
    'Providing hands-on workshops, hackathons, open-source collaborative projects, and career mentorship for students.';
  const history =
    story?.history ||
    'Founded by passionate students at Nepal Polytechnic Institute (NPI), Bharatpur, Chitwan, the club has grown into an active community of creators and problem-solvers.';
  const image = story?.image || '/assets/images/story_hero.jpg';

  return (
    <section className="section-padded story-section" id="story">
      <div className="section-container">
        <div className="story-grid">
          {/* Text Columns */}
          <div className="story-content reveal-on-scroll">
            <div className="section-tag space-mono" id="story-badge">
              <span className="tag-line" />
              <span>{badge}</span>
            </div>

            <h2 className="section-title font-heading" id="story-title">
              {title}
            </h2>

            <div className="story-cards-grid">
              <div className="story-pillar-card glass-panel">
                <div className="pillar-header">
                  <span className="pillar-num space-mono">01</span>
                  <h3 className="pillar-title space-grotesk">Our Mission</h3>
                </div>
                <p className="pillar-text" id="story-mission">
                  {mission}
                </p>
              </div>

              <div className="story-pillar-card glass-panel">
                <div className="pillar-header">
                  <span className="pillar-num space-mono">02</span>
                  <h3 className="pillar-title space-grotesk">Our Vision</h3>
                </div>
                <p className="pillar-text" id="story-vision">
                  {vision}
                </p>
              </div>

              <div className="story-pillar-card glass-panel">
                <div className="pillar-header">
                  <span className="pillar-num space-mono">03</span>
                  <h3 className="pillar-title space-grotesk">Our Purpose</h3>
                </div>
                <p className="pillar-text" id="story-purpose">
                  {purpose}
                </p>
              </div>

              <div className="story-pillar-card glass-panel">
                <div className="pillar-header">
                  <span className="pillar-num space-mono">04</span>
                  <h3 className="pillar-title space-grotesk">Our History</h3>
                </div>
                <p className="pillar-text" id="story-history">
                  {history}
                </p>
              </div>
            </div>
          </div>

          {/* Visual Artwork Column */}
          <div className="story-media reveal-on-scroll">
            <div className="story-image-frame glass-panel">
              <img
                src={image}
                alt="NPI Digital Club Collaborative Innovation"
                className="story-image"
                id="story-image"
                width="640"
                height="780"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== '/assets/images/story_hero.jpg') {
                    target.src = '/assets/images/story_hero.jpg';
                  }
                }}
              />
              <div className="story-image-overlay" />
              <div className="story-floating-badge glass-panel space-grotesk">
                <span className="badge-icon">✦</span>
                <div className="badge-texts">
                  <span className="badge-title">Community Driven</span>
                  <span className="badge-sub space-mono">Bharatpur, Chitwan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

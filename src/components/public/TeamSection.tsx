import React from 'react';
import type { TeamMember } from '../../types/site';

interface TeamSectionProps {
  team?: TeamMember[];
}

export const TeamSection: React.FC<TeamSectionProps> = ({ team = [] }) => {
  return (
    <section className="section-padded team-section" id="team">
      <div className="section-container">
        <div className="section-header center reveal-on-scroll">
          <div className="section-tag space-mono">
            <span className="tag-line" />
            <span>LEADERSHIP & COMMITTEE</span>
            <span className="tag-line" />
          </div>
          <h2 className="section-title font-heading">Executive Committee</h2>
          <p className="section-desc">
            Passionate student leaders and coordinators guiding the vision, operations, and technical tracks of NPI Digital Club.
          </p>
        </div>

        <div className="team-grid" id="team-grid-container">
          {team.length > 0 ? (
            team.map((member, idx) => (
              <div key={member.id || idx} className="team-card glass-panel reveal-on-scroll">
                <div className="team-media">
                  <img
                    src={member.image || '/assets/images/team_member.jpg'}
                    alt={member.name}
                    className="team-img"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== '/assets/images/team_member.jpg') {
                        target.src = '/assets/images/team_member.jpg';
                      }
                    }}
                  />
                  <div className="team-overlay">
                    <div className="team-socials">
                      {member.github && member.github !== '#' && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-btn"
                          aria-label={`${member.name} GitHub profile`}
                        >
                          GH
                        </a>
                      )}
                      {member.linkedin && member.linkedin !== '#' && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-btn"
                          aria-label={`${member.name} LinkedIn profile`}
                        >
                          IN
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="social-btn"
                          aria-label={`Email ${member.name}`}
                        >
                          ✉
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="team-body">
                  <h3 className="team-name space-grotesk">{member.name}</h3>
                  <span className="team-role space-mono">{member.role}</span>
                  {member.bio && <p className="team-bio">{member.bio}</p>}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state-notice">
              <p>Executive committee roster is currently being updated for the current academic session.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

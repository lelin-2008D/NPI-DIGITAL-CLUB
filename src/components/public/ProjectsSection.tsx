import React from 'react';
import type { ProjectItem } from '../../types/site';

interface ProjectsSectionProps {
  projects?: ProjectItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects = [] }) => {
  return (
    <section className="section-padded projects-section" id="projects">
      <div className="section-container">
        <div className="section-header center reveal-on-scroll">
          <div className="section-tag space-mono">
            <span className="tag-line" />
            <span>PORTFOLIO & INITIATIVES</span>
            <span className="tag-line" />
          </div>
          <h2 className="section-title font-heading">Featured Student Projects</h2>
          <p className="section-desc">
            Explore innovative hardware, software, and community solutions engineered by NPI Digital Club members.
          </p>
        </div>

        <div className="projects-grid" id="projects-container">
          {projects.length > 0 ? (
            projects.map((project, idx) => (
              <article key={project.id || idx} className="project-card glass-panel reveal-on-scroll">
                <div className="project-media">
                  <img
                    src={project.image || '/assets/images/project_smartcampus.jpg'}
                    alt={project.title}
                    className="project-img"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== '/assets/images/project_smartcampus.jpg') {
                        target.src = '/assets/images/project_smartcampus.jpg';
                      }
                    }}
                  />
                  <div className="project-badges">
                    <span className="project-category space-mono">{project.category}</span>
                    <span className="project-year space-mono">{project.year}</span>
                  </div>
                </div>

                <div className="project-body">
                  <h3 className="project-title space-grotesk">{project.title}</h3>
                  <p className="project-desc">{project.desc}</p>
                  <div className="project-footer">
                    <a
                      href={project.link || '#'}
                      target={project.link && project.link !== '#' ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="project-link space-mono"
                    >
                      <span>Explore Repository</span>
                      <span className="link-arrow">→</span>
                    </a>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state-notice">
              <p>New cohort projects will be published after the upcoming innovation showcase.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

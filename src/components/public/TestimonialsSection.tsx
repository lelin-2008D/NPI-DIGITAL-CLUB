import React from 'react';
import type { TestimonialItem, QuoteData } from '../../types/site';

interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[];
  quote?: QuoteData;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials = [],
  quote,
}) => {
  const quoteText =
    quote?.text ||
    'True engineering innovation occurs when theoretical knowledge is rigorously applied to solve real community and industry problems.';
  const quoteAuthor = quote?.author || '— NPI Digital Club Charter';

  return (
    <section className="section-padded testimonials-section" id="testimonials">
      <div className="section-container">
        <div className="section-header center reveal-on-scroll">
          <div className="section-tag space-mono">
            <span className="tag-line" />
            <span>VOICES & PERSPECTIVES</span>
            <span className="tag-line" />
          </div>
          <h2 className="section-title font-heading">What Our Members Say</h2>
          <p className="section-desc">
            Feedback and experiences from students, alumni, and faculty involved with our technical programs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid" id="testimonials-container">
          {testimonials.length > 0 ? (
            testimonials.map((t, idx) => (
              <div key={t.id || idx} className="testimonial-card glass-panel reveal-on-scroll">
                <div className="quote-mark">“</div>
                <p className="testimonial-review">{t.review}</p>
                <div className="testimonial-author">
                  <h4 className="author-name space-grotesk">{t.name}</h4>
                  <span className="author-role space-mono">{t.role}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state-notice">
              <p>Member testimonials will appear here following the upcoming session evaluation.</p>
            </div>
          )}
        </div>

        {/* Guiding Philosophy Quote Box */}
        <div className="quote-box glass-panel reveal-on-scroll">
          <div className="quote-icon-emblem">✦</div>
          <blockquote className="quote-text font-heading" id="quote-text">
            "{quoteText}"
          </blockquote>
          <cite className="quote-author space-mono" id="quote-author">
            {quoteAuthor}
          </cite>
        </div>
      </div>
    </section>
  );
};

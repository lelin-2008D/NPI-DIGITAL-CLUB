import React, { useEffect, useRef, useState } from 'react';
import type { StoryStat } from '../../types/site';

interface StatsSectionProps {
  stats?: StoryStat[];
}

const StatCounter: React.FC<{ stat: StoryStat }> = ({ stat }) => {
  const [count, setCount] = useState(0);
  const targetNumber = parseInt(stat.number.replace(/\D/g, ''), 10) || 0;
  const isAnimatedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isAnimatedRef.current) {
          isAnimatedRef.current = true;
          let current = 0;
          const duration = 1400;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = targetNumber / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
              setCount(targetNumber);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, stepTime);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [targetNumber]);

  return (
    <div ref={containerRef} className="stat-card glass-panel reveal-on-scroll">
      <div className="stat-number-wrapper">
        <span className="stat-number space-grotesk">{count}</span>
        <span className="stat-suffix space-grotesk">{stat.suffix || '+'}</span>
      </div>
      <p className="stat-label space-mono">{stat.label}</p>
    </div>
  );
};

export const StatsSection: React.FC<StatsSectionProps> = ({ stats = [] }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="section-padded stats-section" id="stats">
      <div className="section-container">
        <div className="stats-grid" id="stats-grid-container">
          {stats.map((stat, idx) => (
            <StatCounter key={stat.id || idx} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

import React, { useEffect, useRef } from 'react';
import type { HeroData } from '../../types/site';
import { MagneticButton } from '../common/MagneticButton';
import { useTheme } from '../../hooks/useTheme';

interface HeroSectionProps {
  hero?: HeroData;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hero }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', onResize);

    const particleCount = Math.min(65, Math.floor((width * height) / 18000));
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 0.8,
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    let mouseActive = false;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseActive = true;
    };

    const onMouseLeave = () => {
      mouseActive = false;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';
      const particleColor = isDark ? 'rgba(212, 168, 83, 0.45)' : 'rgba(184, 134, 11, 0.35)';
      const lineColor = isDark ? 'rgba(212, 168, 83, ' : 'rgba(184, 134, 11, ';

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse attraction
        if (mouseActive) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            p.x += dx * 0.015;
            p.y += dy * 0.015;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * (isDark ? 0.22 : 0.15);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${lineColor}${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  const title = hero?.title || 'NPI DIGITAL CLUB';
  const subtitle = hero?.subtitle || 'Building Digital Innovators';
  const description =
    hero?.description ||
    'Empowering the next generation of engineers, designers, and tech leaders at Nepal Polytechnic Institute.';
  const exploreBtn = hero?.exploreBtn || 'Explore Story';

  return (
    <section className="hero-section" id="hero">
      <canvas ref={canvasRef} className="hero-canvas" id="hero-canvas" />

      <div className="hero-container">
        <div className="hero-badge space-mono">
          <span className="badge-dot" />
          <span>EST. 2081 • POLYTECHNIC EXCELLENCE</span>
        </div>

        <h1 className="hero-title font-heading" id="dynamic-hero-title">
          {title.includes('DIGITAL') ? (
            <>
              {title.split('DIGITAL')[0]}
              <span className="accent-gold">DIGITAL</span>
              {title.split('DIGITAL')[1]}
            </>
          ) : (
            title
          )}
        </h1>

        <p className="hero-subtitle space-grotesk" id="dynamic-hero-subtitle">
          {subtitle}
        </p>

        <p className="hero-desc" id="dynamic-hero-desc">
          {description}
        </p>

        <div className="hero-cta-group">
          <MagneticButton href="#story" className="btn-primary" id="dynamic-hero-btn">
            {exploreBtn}
          </MagneticButton>
          <MagneticButton href="#contact" className="btn-secondary">
            Get in Touch
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};

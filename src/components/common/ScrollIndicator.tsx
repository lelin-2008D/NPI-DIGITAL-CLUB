import React, { useEffect, useRef } from 'react';

export const ScrollIndicator: React.FC = () => {
  const discRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const targetRotationRef = useRef(0);

  useEffect(() => {
    let animationFrameId: number;

    const onScroll = () => {
      const scrollY = window.scrollY;
      targetRotationRef.current = scrollY * 0.28;
    };

    const animate = () => {
      rotationRef.current += (targetRotationRef.current - rotationRef.current) * 0.08;
      if (discRef.current) {
        discRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleClick = () => {
    const nextSection = document.getElementById('story') || document.getElementById('services');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="scroll-indicator"
      id="scroll-indicator"
      aria-hidden="true"
      onClick={handleClick}
    >
      <div ref={discRef} className="indicator-disc" id="indicator-disc">
        <svg viewBox="0 0 100 100" className="indicator-text-svg">
          <path
            id="textPath"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            fill="none"
          />
          <text>
            <textPath href="#textPath" className="space-mono">
              • SCROLL TO DISCOVER • NPI DIGITAL •
            </textPath>
          </text>
        </svg>
      </div>
      <div className="indicator-center-dot" />
    </div>
  );
};

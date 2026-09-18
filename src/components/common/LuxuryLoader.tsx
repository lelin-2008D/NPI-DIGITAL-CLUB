import React, { useEffect, useState } from 'react';

interface LuxuryLoaderProps {
  onComplete?: () => void;
}

export const LuxuryLoader: React.FC<LuxuryLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isFadedOut, setIsFadedOut] = useState(false);

  useEffect(() => {
    let frameId: number;
    const startedAt = performance.now();
    const duration = 650; // smooth luxury load time

    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const current = Math.min(100, (elapsed / duration) * 100);
      setProgress(current);

      if (current < 100) {
        frameId = requestAnimationFrame(tick);
      } else {
        setIsComplete(true);
        setTimeout(() => {
          setIsFadedOut(true);
          setTimeout(() => {
            onComplete?.();
          }, 600);
        }, 200);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [onComplete]);

  if (isFadedOut) {
    return null;
  }

  return (
    <div
      className={`luxury-loader ${isComplete ? 'complete' : ''} ${isFadedOut ? 'fade-out' : ''}`}
      id="loader"
      role="progressbar"
      aria-label="Loading NPI Digital Club website"
      aria-valuenow={Math.floor(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="loader-content">
        <div className="loader-logo-container">
          <img
            src="/assets/images/logonpi.svg"
            alt="NPI Digital Club Emblem"
            className="loader-logo-img"
            width="180"
            height="180"
          />
        </div>
        <div className="loader-info">
          <div className="loader-track">
            <div
              className="loader-bar"
              id="loader-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="loader-perc space-mono" id="loader-perc">
            {Math.floor(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
};

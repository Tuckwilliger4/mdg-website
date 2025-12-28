import { useState, useEffect, useRef, useCallback } from 'react';

export default function Slideshow({ images = [], captions = [] }) {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef(null);
  const transitionDuration = 800; // Corresponds to CSS transition

  const resetTimer = useCallback(() => {
    clearTimeout(timeoutRef.current);
    if (images.length > 1) {
      timeoutRef.current = setTimeout(() => {
        setIndex(prevIndex => (prevIndex + 1) % images.length);
      }, 3000);
    }
  }, [images.length]);

  useEffect(() => {
    resetTimer();
    return () => clearTimeout(timeoutRef.current);
  }, [index, resetTimer]);

  const go = (delta) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    const nextIndex = (index + delta + images.length) % images.length;
    setIndex(nextIndex);

    setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);
  };

  if (images.length === 0) return null;

  return (
    <div id="slide-container">
      <div id="slider">
        {images.map((src, i) => (
          <img
            key={i}
            className={`image-slider fade-transition ${i === index ? 'opacity-change' : 'zero-opacity'}`}
            src={src}
            alt={`Slide ${i + 1}`}
            style={{ zIndex: i === index ? 2 : 1 }}
          />
        ))}
      </div>
      <div id="slide-captions" className="slide-caps">
        {captions.map((cap, i) => (
          <span
            key={i}
            className={`slide-caption ${cap.color || 'white'}`}
            style={{ display: i === index ? 'block' : 'none' }}
          >
            {cap.text}
          </span>
        ))}
      </div>
      <div className="arrow-btns hide-on-mobile">
        <i className="ion-android-arrow-dropleft arrow-btn" onClick={() => go(-1)}></i>
        <i className="ion-android-arrow-dropright arrow-btn" onClick={() => go(1)}></i>
      </div>
    </div>
  );
}

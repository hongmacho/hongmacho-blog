import { useEffect, useRef } from 'react';

interface HeroParallaxProps {
  containerWidth?: number;
  containerHeight?: number;
}

const LERP_FACTOR = 0.10;

export default function HeroParallax({ containerWidth = 400, containerHeight = 300 }: HeroParallaxProps) {
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const lerpXRef = useRef(0);
  const lerpYRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Set CSS var defaults
    const setDefaults = () => {
      document.documentElement.style.setProperty('--mx', '0');
      document.documentElement.style.setProperty('--my', '0');
      document.documentElement.style.setProperty('--mx-pct', '0%');
      document.documentElement.style.setProperty('--my-pct', '0%');
      document.documentElement.style.setProperty('--mx-px', '0px');
      document.documentElement.style.setProperty('--my-px', '0px');
      document.documentElement.style.setProperty('--m-deg', '0deg');
    };

    if (prefersReducedMotion) {
      setDefaults();
      return;
    }

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = e.clientX;
      mouseYRef.current = e.clientY;
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      mouseXRef.current = 0;
      mouseYRef.current = 0;
      lerpXRef.current = 0;
      lerpYRef.current = 0;
      setDefaults();
    };

    // RAF loop for smooth lerp updates
    const updateParallax = () => {
      // Lerp towards target values
      lerpXRef.current += (mouseXRef.current - lerpXRef.current) * LERP_FACTOR;
      lerpYRef.current += (mouseYRef.current - lerpYRef.current) * LERP_FACTOR;

      // Calculate percentage values (0-100%)
      const pctX = Math.max(0, Math.min(100, (lerpXRef.current / window.innerWidth) * 100));
      const pctY = Math.max(0, Math.min(100, (lerpYRef.current / window.innerHeight) * 100));

      // Calculate pixel values relative to center
      const pxX = lerpXRef.current - window.innerWidth / 2;
      const pxY = lerpYRef.current - window.innerHeight / 2;

      // Calculate rotation angle (subtle, max ±5 degrees)
      const deg = (pxX / window.innerWidth) * 5;

      // Update CSS custom properties
      document.documentElement.style.setProperty('--mx', String(Math.round(lerpXRef.current)));
      document.documentElement.style.setProperty('--my', String(Math.round(lerpYRef.current)));
      document.documentElement.style.setProperty('--mx-pct', `${pctX.toFixed(1)}%`);
      document.documentElement.style.setProperty('--my-pct', `${pctY.toFixed(1)}%`);
      document.documentElement.style.setProperty('--mx-px', `${Math.round(pxX)}px`);
      document.documentElement.style.setProperty('--my-px', `${Math.round(pxY)}px`);
      document.documentElement.style.setProperty('--m-deg', `${deg.toFixed(2)}deg`);

      rafIdRef.current = requestAnimationFrame(updateParallax);
    };

    // Start RAF loop
    rafIdRef.current = requestAnimationFrame(updateParallax);

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      setDefaults();
    };
  }, []);

  return (
    <div className="hero-parallax" style={{ width: containerWidth, height: containerHeight }}>
      <svg
        width={containerWidth}
        height={containerHeight}
        viewBox={`0 0 ${containerWidth} ${containerHeight}`}
        className="hero-parallax__svg"
        aria-hidden="true"
      >
        {/* Placeholder SVG: simple tree-like graphic with circles and lines */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Trunk */}
        <line
          x1={containerWidth / 2}
          y1={containerHeight * 0.6}
          x2={containerWidth / 2}
          y2={containerHeight * 0.95}
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.3"
        />

        {/* Main branches */}
        <circle
          cx={containerWidth / 2}
          cy={containerHeight * 0.4}
          r="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.4"
        />
        <circle
          cx={containerWidth * 0.3}
          cy={containerHeight * 0.25}
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.35"
        />
        <circle
          cx={containerWidth * 0.7}
          cy={containerHeight * 0.28}
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.35"
        />
        <circle
          cx={containerWidth * 0.5}
          cy={containerHeight * 0.15}
          r="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.3"
        />

        {/* Accent nodes */}
        <circle
          cx={containerWidth * 0.35}
          cy={containerHeight * 0.5}
          r="3"
          fill="currentColor"
          opacity="0.2"
          filter="url(#glow)"
        />
        <circle
          cx={containerWidth * 0.65}
          cy={containerHeight * 0.45}
          r="3"
          fill="currentColor"
          opacity="0.2"
          filter="url(#glow)"
        />
      </svg>
    </div>
  );
}

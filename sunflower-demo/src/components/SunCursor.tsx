"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function SunCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useGSAP(() => {
    if (!cursorRef.current) return;

    // Use quickTo for buttery smooth cursor tracking
    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.4, ease: "power3.out" });

    // Rotate the sun rays continuously
    gsap.to(".sun-rays", {
      rotation: 360,
      duration: 10,
      repeat: -1,
      ease: "linear"
    });

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      // Offset by half width/height (24px/2 = 12px) to center it
      xTo(e.clientX - 24);
      yTo(e.clientY - 24);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseleave", onMouseLeave);
    document.body.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseleave", onMouseLeave);
      document.body.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible]);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.3s" }}
    >
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Sun Core */}
        <div className="absolute w-4 h-4 bg-[#FFEA00] rounded-full shadow-[0_0_15px_#FFEA00]"></div>
        
        {/* Sun Rays */}
        <svg className="sun-rays absolute w-full h-full text-[#FFEA00] opacity-90" viewBox="0 0 100 100">
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="10"
              x2="50"
              y2="20"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${i * 45} 50 50)`}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

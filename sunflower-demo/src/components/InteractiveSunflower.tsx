"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function InteractiveSunflower() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (!containerRef.current || !wrapperRef.current) return;
    
    // Physics-based smoothing using GSAP quickTo
    const xTo = gsap.quickTo(wrapperRef.current, "rotationY", { duration: 0.8, ease: "power3.out" });
    const yTo = gsap.quickTo(wrapperRef.current, "rotationX", { duration: 0.8, ease: "power3.out" });
    
    // Initial floating animation
    gsap.to(wrapperRef.current, {
      y: -20,
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = containerRef.current!.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const deltaX = (e.clientX - centerX) / width;
      const deltaY = (e.clientY - centerY) / height;
      
      xTo(deltaX * 40); // Max 40deg rotation
      yTo(-deltaY * 40);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, { scope: containerRef });

  // Generate petals
  const petals = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i * 360) / 24;
    return (
      <path
        key={i}
        d="M 0 0 C -20 -40, -15 -80, 0 -100 C 15 -80, 20 -40, 0 0"
        fill="#E8C051"
        transform={`rotate(${angle}) translate(0, -50)`}
        className="drop-shadow-md opacity-95"
      />
    );
  });

  // Generate overlapping back petals
  const backPetals = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i * 360) / 24 + 7.5;
    return (
      <path
        key={`back-${i}`}
        d="M 0 0 C -15 -35, -10 -75, 0 -95 C 10 -75, 15 -35, 0 0"
        fill="#D49520"
        transform={`rotate(${angle}) translate(0, -45)`}
        className="opacity-90"
      />
    );
  });

  return (
    <div 
      ref={containerRef}
      className="w-full h-full min-h-[500px] flex items-center justify-center relative perspective-[1200px] overflow-visible"
    >
      <div 
        ref={wrapperRef}
        className="relative w-64 h-64"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Stem */}
        <div className="absolute top-[50%] left-[50%] w-3 h-80 bg-[#4A5D23] -translate-x-1/2 origin-top rounded-full shadow-inner z-0" style={{ transform: "translateZ(-20px)" }}></div>
        
        {/* Leaves */}
        <div className="absolute top-[120%] left-[50%] w-16 h-8 bg-[#3A4A3F] origin-right -translate-x-full rounded-[0_100%_0_100%] rotate-12 z-0" style={{ transform: "translateZ(-15px)" }}></div>
        <div className="absolute top-[150%] left-[50%] w-20 h-10 bg-[#4A5D23] origin-left rounded-[100%_0_100%_0] -rotate-12 z-0" style={{ transform: "translateZ(-10px)" }}></div>
        
        {/* Flower Head Container */}
        <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ transform: "translateZ(30px)" }}>
          <svg viewBox="-120 -120 240 240" className="w-[150%] h-[150%] overflow-visible">
            <g>
              {/* Back Petals */}
              {backPetals}
              {/* Front Petals */}
              {petals}
              
              {/* Seed Head / Capitulum */}
              <circle cx="0" cy="0" r="50" fill="#2C2618" />
              <circle cx="0" cy="0" r="40" fill="#1A150D" />
              <circle cx="0" cy="0" r="30" fill="#2C2618" />
              
              {/* Dots for seeds */}
              {Array.from({ length: 80 }).map((_, i) => {
                 const r = Math.sqrt(i) * 4.5;
                 const theta = i * 137.5 * (Math.PI / 180);
                 const x = r * Math.cos(theta);
                 const y = r * Math.sin(theta);
                 if (r > 45) return null;
                 return <circle key={`seed-${i}`} cx={x} cy={y} r="1.5" fill="#E8C051" opacity={0.8} />;
              })}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

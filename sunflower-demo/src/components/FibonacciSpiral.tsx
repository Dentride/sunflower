"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface Seed {
  id: number;
  x: number;
  y: number;
  scale: number;
}

export function FibonacciSpiral() {
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const numSeeds = 400;
    const goldenAngle = 137.508 * (Math.PI / 180);
    const c = 12; // Scaling factor

    const newSeeds: Seed[] = [];
    for (let i = 1; i <= numSeeds; i++) {
      const r = c * Math.sqrt(i);
      const theta = i * goldenAngle;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      
      const scale = Math.min(1.5, 0.5 + i / 300);

      newSeeds.push({ id: i, x, y, scale });
    }
    setSeeds(newSeeds);
  }, []);

  useGSAP(() => {
    if (!containerRef.current || seeds.length === 0) return;
    
    // Seed spiral animation on scroll
    gsap.fromTo(
      ".seed-dot",
      { scale: 0, opacity: 0, rotation: -180 },
      {
        scale: (i) => seeds[i].scale,
        opacity: 1,
        rotation: 0,
        stagger: 0.005,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 80%",
          scrub: 1,
        }
      }
    );
    
    // Parallax background
    gsap.to(".spiral-bg", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    });

  }, { scope: containerRef, dependencies: [seeds] });

  return (
    <div 
      className="w-full h-full min-h-[600px] flex items-center justify-center bg-[#1A231C] overflow-hidden group relative"
      ref={containerRef}
    >
      <div className="spiral-bg absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#E8C051_0%,_transparent_60%)] pointer-events-none -top-[50%] h-[200%]"></div>
      
      <div className="relative" ref={wrapperRef}>
        {seeds.map((seed, index) => (
          <div
            key={seed.id}
            className="seed-dot absolute rounded-full"
            style={{
              transform: `translate(calc(${seed.x}px - 50%), calc(${seed.y}px - 50%))`,
              width: "10px",
              height: "10px",
              backgroundColor: index > 350 ? "#4A5D23" : index % 5 === 0 ? "#8B6B2B" : "#D49520",
              zIndex: 1,
            }}
          />
        ))}
      </div>
      
      <div className="absolute bottom-8 right-8 text-[#F9F8F4] opacity-50 font-sans text-sm tracking-widest uppercase flex flex-col items-end z-10">
        <span>Phyllotaxis Matrix</span>
        <span>Scroll Triggered</span>
      </div>
    </div>
  );
}

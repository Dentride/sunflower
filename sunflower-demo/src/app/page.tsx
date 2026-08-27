"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FibonacciSpiral } from "@/components/FibonacciSpiral";
import { InteractiveSunflower } from "@/components/InteractiveSunflower";
import { SunflowerCollageMaker } from "@/components/SunflowerCollageMaker";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Nav reveal
    gsap.from("nav", { y: -20, opacity: 0, duration: 1, ease: "power3.out" });
    
    // Hero text reveal
    gsap.from(".hero-text > *", {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "power4.out",
      delay: 0.2
    });

    // Glassmorphism cards entrance on scroll
    gsap.from(".info-card", {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "back.out(1.2)",
      scrollTrigger: {
        trigger: "#heliotropism",
        start: "top 75%",
      }
    });
    
    // Parallax on macro image
    gsap.to(".macro-image", {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: ".macro-container",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="min-h-screen px-6 py-12 md:px-16 lg:px-24 max-w-7xl mx-auto overflow-hidden">
      {/* Navigation */}
      <nav className="flex justify-between items-center pb-16 border-b border-[#F9F8F4]/20">
        <h1 className="font-serif text-2xl tracking-wide font-medium italic">Helianthus</h1>
        <ul className="flex gap-8 text-sm uppercase tracking-widest font-medium text-[#F9F8F4]/80">
          <li><a href="#botany" className="hover:text-white transition-colors">Botany</a></li>
          <li><a href="#heliotropism" className="hover:text-white transition-colors">Heliotropism</a></li>
          <li><a href="#mathematics" className="hover:text-white transition-colors">Mathematics</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="py-24 flex flex-col lg:flex-row gap-16 items-center">
        <div className="hero-text w-full lg:w-5/12 space-y-8 z-10 shrink-0">
          <p className="text-[#F9F8F4]/70 uppercase tracking-[0.2em] text-sm font-semibold">
            Helianthus annuus
          </p>
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.9] break-words">
            The <br />
            Architecture <br />
            of Light
          </h2>
          <p className="text-lg text-[#F9F8F4]/90 leading-relaxed max-w-md pt-4">
            An interactive masterclass in structural integrity, mathematics, and phototropism. Built with code, precision, and antigravity design principles.
          </p>
        </div>
        
        <div className="w-full lg:w-7/12 relative min-h-[500px] flex items-center justify-center">
          <InteractiveSunflower />
        </div>
      </section>

      {/* Narrative Section: Heliotropism */}
      <section id="heliotropism" className="py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="info-card">
            <h3 className="font-serif text-4xl mb-6">Tracking the Sun</h3>
            <div className="w-12 h-0.5 bg-[#F9F8F4]/40 mb-8"></div>
            <p className="text-[#F9F8F4]/90 leading-loose text-lg">
              During the bud stage, sunflowers exhibit heliotropism. At dawn, the heads face east and track the sun&apos;s movement across the sky until dusk. Overnight, they reorient themselves to face east.
            </p>
            <p className="text-[#F9F8F4]/90 leading-loose text-lg mt-6">
              This circadian rhythm is driven by the differential growth of the stem, maximizing photosynthetic efficiency during early development.
            </p>
          </div>
          <div className="info-card relative bg-[#1A231C] text-[#F9F8F4] rounded-3xl p-12 flex flex-col transform transition-transform hover:-translate-y-4 duration-700 shadow-2xl">
            <div>
              <h4 className="font-serif text-3xl italic mb-2">The Mature Bloom</h4>
              <p className="text-xs uppercase tracking-widest text-[#F9F8F4]/70 font-bold">Behavioral Shift</p>
            </div>
            <p className="text-lg leading-relaxed mt-16 text-white/80">
              Once anthesis occurs and the flower opens fully, heliotropism ceases. The mature flower head remains fixed facing east. This adaptation warms the capitulum faster in the morning, making it highly attractive to pollinators.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive 3D Model Section */}
      <section id="interactive-3d" className="py-32">
        <div className="flex flex-col items-center gap-12">
          <p className="text-[#F9F8F4]/70 uppercase tracking-[0.2em] text-sm font-semibold">
            Phyllotaxis
          </p>
          <h3 className="font-serif text-5xl md:text-7xl leading-tight text-center">
            The Golden Ratio <br />in Organic Form
          </h3>
          <p className="text-[#F9F8F4]/90 leading-loose text-lg text-center max-w-2xl mb-12">
            The florets within the circular head are arranged in a precise pattern of interconnecting spirals driven by the Fibonacci sequence. Scroll down to see the seeds populate according to the Golden Angle (137.5&deg;).
          </p>
          <div className="w-full rounded-[2rem] overflow-hidden relative shadow-2xl border border-[#F9F8F4]/20">
            <FibonacciSpiral />
          </div>
        </div>
      </section>

      {/* Macro Image Section */}
      <section className="py-32 macro-container overflow-hidden">
        <div className="w-full h-[600px] relative rounded-[2rem] overflow-hidden shadow-2xl">
          <Image
            src="/images/seeds.jpg"
            alt="Macro photography of sunflower seeds"
            fill
            className="macro-image object-cover opacity-90 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D2420]/80 to-transparent flex items-end justify-center pb-24">
            <p className="font-serif text-5xl text-[#F9F8F4] italic drop-shadow-xl">137.5&deg;</p>
          </div>
        </div>
      </section>

      {/* Story Collage Maker Section */}
      <section id="collage-maker" className="py-32 border-t border-[#F9F8F4]/10">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <p className="text-[#F9F8F4]/70 uppercase tracking-[0.2em] text-sm font-semibold mb-12">
            Interactive Experience
          </p>
          <SunflowerCollageMaker />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 mt-12 border-t border-[#F9F8F4]/20 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-serif text-xl italic">Helianthus</p>
        <p className="text-xs uppercase tracking-widest text-[#F9F8F4]/60">
          &copy; {new Date().getFullYear()} Antigravity Design Expert
        </p>
      </footer>
    </main>
  );
}

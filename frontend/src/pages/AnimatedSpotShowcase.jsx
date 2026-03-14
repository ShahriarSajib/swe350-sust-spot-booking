import { useEffect, useState } from "react";

import spot1 from "../assets/central_auditorium.png";
import spot2 from "../assets/mini_auditorium.png";
import spot3 from "../assets/central_field.jpg";
import spot4 from "../assets/handball_ground.png";
import spot5 from "../assets/basketball_ground.png";

const spots = [
  { name: "Central Auditorium", image: spot1 },
  { name: "Mini Auditorium", image: spot2 },
  { name: "Central Field", image: spot3 },
  { name: "Handball Ground", image: spot4 },
  { name: "Basketball Ground", image: spot5 },
];

const AnimatedSpotShowcase = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % spots.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden h-screen bg-[#1a1c20]">
      
      {/* 1. PRIMARY GLASSOMORPHIC LAYER (The "Prominent" Blur) */}
      {spots.map((spot, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-60" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${spot.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(80px) saturate(150%)', // High blur + high saturation for prominent effect
          }}
        />
      ))}

      {/* 2. OVERLAY GRADIENT (Replacing solid black with soft charcoal/gray) */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-[#1a1c20]/80 to-slate-900/60 z-0" />

      {/* 3. CONTENT CONTAINER */}
      <div className="relative z-10 text-center px-10">
        <div className="relative inline-block">
          {/* Main Circular Image */}
          <div
            className="w-80 h-80 rounded-full border-[6px] border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-all duration-1000 ease-in-out"
            style={{
              backgroundImage: `url(${spots[current].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          {/* Glassy Floating Ring */}
          <div className="absolute -inset-4 rounded-full border border-white/5 bg-white/5 backdrop-blur-md -z-10 animate-pulse" />
        </div>

        {/* Text Section with Glassmorphism shadow */}
        <div key={current} className="mt-12 animate-in fade-in zoom-in-95 duration-700">
          <h3 className="text-white text-4xl font-black tracking-tighter uppercase drop-shadow-2xl">
            {spots[current].name}
          </h3>
          <div className="h-1.5 w-16 bg-blue-500 mx-auto mt-4 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          <p className="text-white/50 mt-6 text-[10px] font-black uppercase tracking-[0.5em]">
            SUST Spot Booking System
          </p>
        </div>
      </div>

      {/* 4. MODERN PAGINATION BARS */}
      <div className="absolute bottom-12 flex gap-4 z-20">
        {spots.map((_, i) => (
          <div 
            key={i}
            className={`h-1.5 rounded-full transition-all duration-700 ${
              i === current 
                ? "w-12 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" 
                : "w-3 bg-white/10 backdrop-blur-sm"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedSpotShowcase;

import React, { useEffect, useState } from 'react';

export function CrystalLoader({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; top: string; delay: string; duration: string }>>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: `${20 + Math.random() * 60}%`,
      top: `${20 + Math.random() * 60}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${2 + Math.random() * 2}s`,
    }));
    setParticles(newParticles);
  }, []);

  const isLight = theme === 'light';

  return (
    <div className={`relative flex items-center justify-center w-full min-h-[300px] bg-transparent`}>
      
      {/* Container to enforce centered breathing */}
      <div 
        className="relative flex items-center justify-center w-[120px] h-[120px]"
        style={{ animation: 'breathing 4s ease-in-out infinite' }}
      >
        
        {/* Core Geometric Crystal / Wireframe */}
        <svg 
          width="120" 
          height="120" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Outer Hexagon Glow Base */}
          <polygon 
            points="50,5 90,25 90,75 50,95 10,75 10,25" 
            fill={isLight ? "rgba(0,255,255,0.05)" : "rgba(0,255,255,0.02)"} 
          />
          
          {/* Wireframe Outline */}
          <polygon 
            points="50,5 90,25 90,75 50,95 10,75 10,25" 
            stroke="#00FFFF" 
            strokeWidth="1.5" 
            fill="none" 
            strokeOpacity={isLight ? 0.7 : 0.9} 
          />

          {/* Internal Geometric Web */}
          <line x1="10" y1="25" x2="90" y2="75" stroke="#00FFFF" strokeWidth="1" strokeOpacity={isLight ? 0.4 : 0.6} />
          <line x1="10" y1="75" x2="90" y2="25" stroke="#00FFFF" strokeWidth="1" strokeOpacity={isLight ? 0.4 : 0.6} />
          <line x1="50" y1="5" x2="50" y2="95" stroke="#00FFFF" strokeWidth="1" strokeOpacity={isLight ? 0.4 : 0.6} />

          {/* Core Fractal Diamond */}
          <polygon 
            points="50,25 70,50 50,75 30,50" 
            fill={isLight ? "rgba(0,255,255,0.1)" : "rgba(0,255,255,0.05)"} 
            stroke="#00FFFF" 
            strokeWidth="1.5" 
          />
          
          {/* Center Energy Node */}
          <circle cx="50" cy="50" r="3" fill="#00FFFF" />
        </svg>

        {/* Ambient Particle Trail Field */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute w-[2px] h-[2px] rounded-full bg-[#00FFFF]"
              style={{
                left: p.left,
                top: p.top,
                boxShadow: '0 0 4px #00FFFF',
                animation: `float-particle ${p.duration} ease-in-out ${p.delay} infinite`,
              }}
            />
          ))}
        </div>
        
      </div>
    </div>
  );
}

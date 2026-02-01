"use client";

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import GLOBE from 'vanta/dist/vanta.globe.min'; // Using GLOBE effect

interface VantaBackgroundProps {
  children?: React.ReactNode;
  effect?: any; // To allow passing different Vanta effects
  [key: string]: any; // To allow passing additional Vanta options
}

const VantaBackground: React.FC<VantaBackgroundProps> = ({ children, effect = GLOBE, ...props }) => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        effect({
          el: vantaRef.current,
          THREE: THREE,
          // Default Vanta options, can be overridden by props
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x4a4a82, // Darker blue/purple
          color2: 0x892dc4, // Purple tone
          backgroundColor: 0x191919,
          size: 1.00,
          ...props, // Spread additional props to customize Vanta effect
        })
      );
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect, effect, props]);

  // Apply absolute positioning and z-index to ensure Vanta background is behind content
  return (
    <div className="relative w-full h-full min-h-screen">
      <div ref={vantaRef} className="absolute inset-0 z-0" />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default VantaBackground;

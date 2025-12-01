import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  volume: number; // 0 to 1
  isActive: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ volume, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const baseRadius = 50;
    
    const render = () => {
      // Resize
      canvas.width = canvas.parentElement?.clientWidth || 300;
      canvas.height = canvas.parentElement?.clientHeight || 300;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isActive) {
        // Idle state: gentle pulse
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(75, 85, 99, 0.5)'; // gray-600
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(75, 85, 99, 0.3)';
        ctx.fill();
        return;
      }

      // Active state: Dynamic waves
      // Draw multiple rings
      const numRings = 4;
      for (let i = 0; i < numRings; i++) {
        ctx.beginPath();
        
        // Radius fluctuates with volume and time
        const dynamicRadius = baseRadius + (i * 20) + (Math.sin(time + i) * 10) + (volume * 100);
        
        ctx.arc(centerX, centerY, dynamicRadius, 0, Math.PI * 2);
        
        // Color shifts based on volume intensity
        const alpha = Math.max(0.1, 1 - (i / numRings) - (Math.sin(time) * 0.2));
        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`; // blue-500
        ctx.lineWidth = 3 + (volume * 5);
        ctx.stroke();
      }
      
      // Core circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius + (volume * 20), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(37, 99, 235, ${0.8 + volume * 0.2})`; // blue-600
      ctx.fill();

      time += 0.05;
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [volume, isActive]);

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      {/* Icon overlay or branding could go here */}
    </div>
  );
};
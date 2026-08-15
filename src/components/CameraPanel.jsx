import React, { useRef, useState, useEffect } from 'react';
import { Camera, Video, Grid, Sliders, Crop } from 'lucide-react';

export default function CameraPanel({ activeShot, onCaptureFrame }) {
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  
  const [hudGrid, setHudGrid] = useState(true);
  const [focalLength, setFocalLength] = useState('50mm'); // 24mm, 50mm, 85mm
  const [povPreset, setPovPreset] = useState('neon'); // 'neon', 'beach', 'kitchen'
  const [recTime, setRecTime] = useState(0);
  const [isRecording, setIsRecording] = useState(true);
  const [focusPos, setFocusPos] = useState({ x: 50, y: 50 }); // Focus target reticle position in %
  const [aspectRatio, setAspectRatio] = useState('16:9'); // '16:9' | '2.39:1' | '9:16'

  // Focus simulation & scale levels
  const zoomScale = {
    '24mm': 0.8,
    '50mm': 1.2,
    '85mm': 2.0
  };

  // Recording counter
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatRecTime = (sec) => {
    const mins = Math.floor(sec / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `00:${mins}:${secs}`;
  };

  // Interactive HUD background simulator using standard canvas 
  useEffect(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let frame = 0;

    // Simulated camera noise & shapes
    const drawSimulation = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw simulated HUD backgrounds based on preset
      if (povPreset === 'neon') {
        // Dark background
        ctx.fillStyle = '#060814';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Cyber grids/perspective lines
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.15)';
        ctx.lineWidth = 1;
        const horizon = canvas.height * 0.55;
        
        // Horizontal lines
        for (let i = 0; i < 5; i++) {
          const y = horizon + Math.pow(i, 2.2) * 5;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Perspective vanishing point lines
        const vpX = canvas.width / 2;
        const vpY = horizon;
        for (let i = -6; i <= 6; i++) {
          ctx.beginPath();
          ctx.moveTo(vpX, vpY);
          ctx.lineTo(vpX + i * 120, canvas.height);
          ctx.stroke();
        }

        // Rising cyber neon cubes
        ctx.fillStyle = 'rgba(236, 72, 153, 0.4)'; // Pink/neon magenta
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
        const cubes = [
          { x: 100, y: 320, size: 40 + Math.sin(frame * 0.02) * 5 },
          { x: 420, y: 280, size: 30 + Math.cos(frame * 0.03) * 5 },
          { x: 260, y: 350, size: 60 + Math.sin(frame * 0.01) * 8 }
        ];

        cubes.forEach(c => {
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(frame * 0.005);
          ctx.strokeRect(-c.size/2, -c.size/2, c.size, c.size);
          ctx.fillStyle = 'rgba(236, 72, 153, 0.06)';
          ctx.fillRect(-c.size/2, -c.size/2, c.size, c.size);
          ctx.restore();
        });

        // Floating particle dots
        ctx.fillStyle = '#0ea5e9';
        for (let i = 0; i < 15; i++) {
          const px = (Math.sin(frame * 0.002 + i) * 0.5 + 0.5) * canvas.width;
          const py = ((frame * 0.2 + i * 40) % canvas.height);
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#0ea5e9';
        ctx.font = '9px monospace';
        ctx.fillText('POV SIMULATOR: NEON CHASE', 20, 30);

      } else if (povPreset === 'beach') {
        // Sunset orange theme
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#f97316'); // Orange
        grad.addColorStop(0.5, '#ea580c'); // Deep orange
        grad.addColorStop(1, '#1e293b'); // Ocean dark slate
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Sun disc
        ctx.fillStyle = '#fef08a'; // yellow
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 40;
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2 + 20, 60, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow

        // Ocean waves reflection
        ctx.fillStyle = 'rgba(254, 240, 138, 0.2)';
        for (let i = 0; i < 4; i++) {
          const w = 150 - i * 20;
          ctx.fillRect(canvas.width/2 - w/2, canvas.height/2 + 40 + i * 25 + Math.sin(frame * 0.05 + i) * 5, w, 2);
        }

        // Rising ambient embers
        ctx.fillStyle = 'rgba(251, 191, 36, 0.6)';
        for (let i = 0; i < 10; i++) {
          const px = (Math.cos(frame * 0.005 + i) * 0.4 + 0.5) * canvas.width;
          const py = canvas.height - ((frame * 0.3 + i * 50) % canvas.height);
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#fef08a';
        ctx.font = '9px monospace';
        ctx.fillText('POV SIMULATOR: SUNSET BEACH', 20, 30);

      } else if (povPreset === 'kitchen') {
        // Warm green/beige theme
        ctx.fillStyle = '#1c1917'; // dark stone
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid backsplash
        ctx.strokeStyle = '#292524';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 40) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 40) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }

        // Steaming pots and vegetables
        ctx.strokeStyle = '#84cc16'; // Lime green
        ctx.lineWidth = 2;
        ctx.strokeRect(180, 160, 280, 160); // cutting board
        
        ctx.fillStyle = '#ef4444'; // Red tomato circular blocks
        ctx.beginPath(); ctx.arc(280, 220, 15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(310, 240, 12, 0, Math.PI * 2); ctx.fill();

        // Rising steam vectors
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 3; i++) {
          const sx = 220 + i * 90 + Math.sin(frame * 0.04 + i) * 6;
          const sy = 120 + Math.sin(frame * 0.05 + i) * 10;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx - 5, sy - 30);
          ctx.stroke();
        }

        ctx.fillStyle = '#84cc16';
        ctx.font = '9px monospace';
        ctx.fillText('POV SIMULATOR: CHEF KITCHEN', 20, 30);
      }

      // Focal indicator text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`LENS: ${focalLength}`, canvas.width - 20, 30);
      ctx.textAlign = 'left';

      // Digital scanlines
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for (let y = (frame % 8); y < canvas.height; y += 8) {
        ctx.fillRect(0, y, canvas.width, 2);
      }

      animationId = requestAnimationFrame(drawSimulation);
    };

    drawSimulation();

    return () => cancelAnimationFrame(animationId);
  }, [povPreset, focalLength]);

  // Capture current frame
  const captureShot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set matching dimensions
    canvas.width = 640;
    canvas.height = 480;

    if (overlayCanvasRef.current) {
      ctx.drawImage(overlayCanvasRef.current, 0, 0, canvas.width, canvas.height);
      
      // Draw crop masks on snapshot image
      ctx.fillStyle = 'black';
      if (aspectRatio === '2.39:1') {
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.18);
        ctx.fillRect(0, canvas.height * 0.82, canvas.width, canvas.height * 0.18);
      } else if (aspectRatio === '9:16') {
        ctx.fillRect(0, 0, canvas.width * 0.31, canvas.height);
        ctx.fillRect(canvas.width * 0.69, 0, canvas.width * 0.31, canvas.height);
      }
    }

    const dataUrl = canvas.toDataURL('image/jpeg');
    onCaptureFrame(dataUrl);
  };

  const handleViewfinderClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setFocusPos({ x, y });
  };

  return (
    <div className="hud-panel glass-container">
      {/* HUD Header */}
      <div className="hud-header">
        <div className="flex-row justify-between items-center w-full">
          <div className="flex-row items-center gap-2">
            <Video className="icon-green animate-pulse" size={16} />
            <span className="hud-title font-semibold tracking-wider">SCRIBEGLASS HUD v2.4</span>
          </div>
          <div className="flex-row items-center gap-2">
            <span className="dot-red blink-active"></span>
            <span className="rec-timer font-mono text-sm">{formatRecTime(recTime)}</span>
          </div>
        </div>
      </div>

      {/* Main Viewfinder Port */}
      <div 
        className="viewfinder-container relative overflow-hidden cursor-crosshair"
        onClick={handleViewfinderClick}
      >
        {/* Hidden capture canvas */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Canvas feed */}
        <canvas 
          ref={overlayCanvasRef} 
          width={640} 
          height={480}
          className="webcam-feed"
          style={{ 
            display: 'block',
            transform: `scale(${zoomScale[focalLength]})`,
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />

        {/* Grid lines overlay */}
        {hudGrid && (
          <div className="hud-grid-overlay absolute inset-0 pointer-events-none">
            <div className="grid-h-1 absolute w-full left-0 border-t border-dashed border-sky-400/20" style={{ top: '33.33%' }} />
            <div className="grid-h-2 absolute w-full left-0 border-t border-dashed border-sky-400/20" style={{ top: '66.66%' }} />
            <div className="grid-v-1 absolute h-full top-0 border-l border-dashed border-sky-400/20" style={{ left: '33.33%' }} />
            <div className="grid-v-2 absolute h-full top-0 border-l border-dashed border-sky-400/20" style={{ left: '66.66%' }} />
          </div>
        )}

        {/* Cinematic Aspect Ratio Mask Overlays */}
        {aspectRatio === '2.39:1' && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
            <div className="w-full bg-slate-950/85 border-b border-slate-900" style={{ height: '18%' }} />
            <div className="w-full bg-slate-950/85 border-t border-slate-900" style={{ height: '18%' }} />
          </div>
        )}

        {aspectRatio === '9:16' && (
          <div className="absolute inset-0 pointer-events-none flex justify-between">
            <div className="h-full bg-slate-950/85 border-r border-slate-900" style={{ width: '31%' }} />
            <div className="h-full bg-slate-950/85 border-l border-slate-900" style={{ width: '31%' }} />
          </div>
        )}

        {/* Target HUD Reticle (Positioned dynamically on click) */}
        <div 
          className="hud-reticle absolute pointer-events-none"
          style={{
            top: `${focusPos.y}%`,
            left: `${focusPos.x}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div className="reticle-circle" />
          <div className="reticle-crosshair" />
        </div>

        {/* Dynamic focus box helper */}
        {activeShot && (
          <div className="absolute border border-dashed border-emerald-400/50 pointer-events-none active-shot-focus animate-pulse"
            style={{
              width: '120px',
              height: '80px',
              top: activeShot.composition === 'rule-of-thirds' ? '25%' : activeShot.composition === 'diagonal-motion' ? '45%' : '38%',
              left: activeShot.composition === 'rule-of-thirds' ? '20%' : activeShot.composition === 'diagonal-motion' ? '55%' : '38%',
              transition: 'all 0.5s ease-in-out'
            }}
          >
            <span className="absolute top-1 left-1 text-[8px] text-emerald-400/70 font-mono">
              TARGET: {activeShot.shotType?.substring(0, 12)}
            </span>
          </div>
        )}

        {/* Lower lens readouts */}
        <div className="hud-metadata absolute bottom-3 left-3 right-3 pointer-events-none flex-row justify-between text-[10px] font-mono text-cyan-400/75 z-10">
          <span>RES: 4K DCI</span>
          <span>SHUTTER: 1/48</span>
          <span>ISO: 400</span>
          <span>COMP: {activeShot ? activeShot.composition.toUpperCase() : 'FREEFORM'}</span>
        </div>
      </div>

      {/* Control Console */}
      <div className="console-controls flex flex-col gap-3 p-3">
        {/* Toggle Preset Inputs */}
        <div className="flex-row items-center justify-between gap-2">
          <span className="label-dim text-xs font-semibold">VIEWFINDER POV</span>
          <div className="button-group flex-row gap-1">
            <button 
              className={`btn-sm btn-hud ${povPreset === 'neon' ? 'active' : ''}`}
              onClick={() => setPovPreset('neon')}
            >
              Neon Alley
            </button>
            <button 
              className={`btn-sm btn-hud ${povPreset === 'beach' ? 'active' : ''}`}
              onClick={() => setPovPreset('beach')}
            >
              Beach
            </button>
            <button 
              className={`btn-sm btn-hud ${povPreset === 'kitchen' ? 'active' : ''}`}
              onClick={() => setPovPreset('kitchen')}
            >
              Kitchen
            </button>
          </div>
        </div>

        {/* Aspect Ratio Crop Preset */}
        <div className="flex-row justify-between items-center">
          <div className="flex-row items-center gap-1">
            <Crop size={12} className="text-cyan-400" />
            <span className="label-dim text-xs">CINEMA CROP</span>
          </div>
          <div className="button-group flex-row gap-1">
            {[
              { id: '16:9', label: '16:9 TV' },
              { id: '2.39:1', label: '2.39:1 Film' },
              { id: '9:16', label: '9:16 Spatial' }
            ].map(aspect => (
              <button
                key={aspect.id}
                className={`btn-sm btn-hud font-mono text-xs px-2 ${aspectRatio === aspect.id ? 'active' : ''}`}
                onClick={() => setAspectRatio(aspect.id)}
              >
                {aspect.label}
              </button>
            ))}
          </div>
        </div>

        {/* focal & utilities */}
        <div className="flex-row justify-between items-center">
          <div className="flex-row items-center gap-1">
            <Sliders size={12} className="text-cyan-400" />
            <span className="label-dim text-xs">FOCAL DEPTH</span>
          </div>
          <div className="button-group flex-row gap-1">
            {['24mm', '50mm', '85mm'].map(len => (
              <button
                key={len}
                className={`btn-sm btn-hud font-mono text-xs px-2 ${focalLength === len ? 'active' : ''}`}
                onClick={() => setFocalLength(len)}
              >
                {len}
              </button>
            ))}
          </div>
        </div>

        {/* Grid and Action button */}
        <div className="flex-row justify-between items-center gap-2 mt-1">
          <button 
            className={`btn-icon ${hudGrid ? 'active' : ''}`}
            onClick={() => setHudGrid(!hudGrid)}
            title="Toggle Grid Lines"
          >
            <Grid size={14} />
          </button>
          
          <button 
            className="btn-primary flex-1 py-2 font-semibold tracking-wider flex-row justify-center items-center gap-2"
            onClick={captureShot}
          >
            <Camera size={16} />
            SNAP VIEW TO SHOT
          </button>
        </div>
      </div>
    </div>
  );
}

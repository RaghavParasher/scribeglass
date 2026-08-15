import React, { useRef, useState, useEffect } from 'react';
import { Camera, Maximize, Play, RotateCcw, Video, Grid, Sliders, Eye } from 'lucide-react';

export default function CameraPanel({ activeShot, onCaptureFrame }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  
  const [streamActive, setStreamActive] = useState(false);
  const [hudGrid, setHudGrid] = useState(true);
  const [focalLength, setFocalLength] = useState('50mm'); // 24mm, 50mm, 85mm
  const [povPreset, setPovPreset] = useState('neon'); // 'camera', 'neon', 'beach', 'kitchen'
  const [recTime, setRecTime] = useState(0);
  const [isRecording, setIsRecording] = useState(true);

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

  // Webcam access
  const startCamera = async () => {
    setPovPreset('camera');
    try {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 }, 
          audio: false 
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreamActive(true);
      }
    } catch (err) {
      console.warn("Webcam access denied/unavailable. Reverting to custom 3D vector simulation.");
      setPovPreset('neon');
      setStreamActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
  };

  // Interactive HUD background simulator using standard canvas 
  useEffect(() => {
    if (povPreset === 'camera') return;
    
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
          // Simulate 3D tilt
          ctx.translate(c.x, c.y);
          ctx.rotate(frame * 0.005);
          ctx.strokeRect(-c.size/2, -c.size/2, c.size, c.size);
          ctx.fillStyle = 'rgba(236, 72, 153, 0.06)';
          ctx.fillRect(-c.size/2, -c.size/2, c.size, c.size);
          ctx.restore();
        });

        // Focal target marker
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, 40 + Math.sin(frame * 0.05) * 3, 0, Math.PI * 2);
        ctx.stroke();

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

        ctx.fillStyle = '#fef08a';
        ctx.font = '9px monospace';
        ctx.fillText('POV SIMULATOR: SUNSET BEACH', 20, 30);

      } else if (povPreset === 'kitchen') {
        // Warm green/beige theme
        ctx.fillStyle = '#1c1917'; // dark brown/stone
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
        ctx.strokeRect(180, 160, 280, 160); // simulated cutting board
        
        ctx.fillStyle = '#ef4444'; // Red tomato circular blocks
        ctx.beginPath(); ctx.arc(280, 220, 15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(310, 240, 12, 0, Math.PI * 2); ctx.fill();

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

    if (povPreset === 'camera' && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    } else if (overlayCanvasRef.current) {
      // Draw custom simulator content
      ctx.drawImage(overlayCanvasRef.current, 0, 0, canvas.width, canvas.height);
    }

    const dataUrl = canvas.toDataURL('image/jpeg');
    onCaptureFrame(dataUrl);
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
      <div className="viewfinder-container relative overflow-hidden">
        {/* Hidden capture canvas */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Video feed */}
        <video 
          ref={videoRef} 
          className="webcam-feed" 
          style={{ 
            display: povPreset === 'camera' ? 'block' : 'none',
            transform: `scale(${zoomScale[focalLength]})`,
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }} 
          muted 
          playsInline
        />

        {/* Canvas feed fallback */}
        <canvas 
          ref={overlayCanvasRef} 
          width={640} 
          height={480}
          className="webcam-feed"
          style={{ 
            display: povPreset !== 'camera' ? 'block' : 'none',
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

        {/* Target HUD Reticle */}
        <div className="hud-reticle absolute pointer-events-none">
          <div className="reticle-circle" />
          <div className="reticle-crosshair" />
        </div>

        {/* Dynamic focus box helper */}
        {activeShot && (
          <div className="absolute border border-dashed border-emerald-400/50 pointer-events-none active-shot-focus animate-pulse"
            style={{
              width: '120px',
              height: '80px',
              top: activeShot.composition === 'rule-of-thirds' ? '30%' : activeShot.composition === 'diagonal-motion' ? '50%' : '38%',
              left: activeShot.composition === 'rule-of-thirds' ? '25%' : activeShot.composition === 'diagonal-motion' ? '60%' : '40%',
              transition: 'all 0.5s ease-in-out'
            }}
          >
            <span className="absolute top-1 left-1 text-[8px] text-emerald-400/70 font-mono">
              TARGET: {activeShot.shotType?.substring(0, 12)}
            </span>
          </div>
        )}

        {/* Lower lens readouts */}
        <div className="hud-metadata absolute bottom-3 left-3 right-3 pointer-events-none flex justify-between text-[10px] font-mono text-cyan-400/75">
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
              className={`btn-sm btn-hud ${povPreset === 'camera' ? 'active' : ''}`}
              onClick={startCamera}
            >
              <Camera size={12} />
              Webcam
            </button>
            <button 
              className={`btn-sm btn-hud ${povPreset === 'neon' ? 'active' : ''}`}
              onClick={() => { stopCamera(); setPovPreset('neon'); }}
            >
              Neon Alley
            </button>
            <button 
              className={`btn-sm btn-hud ${povPreset === 'beach' ? 'active' : ''}`}
              onClick={() => { stopCamera(); setPovPreset('beach'); }}
            >
              Beach
            </button>
            <button 
              className={`btn-sm btn-hud ${povPreset === 'kitchen' ? 'active' : ''}`}
              onClick={() => { stopCamera(); setPovPreset('kitchen'); }}
            >
              Kitchen
            </button>
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
        <div className="flex justify-between items-center gap-2 mt-1">
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

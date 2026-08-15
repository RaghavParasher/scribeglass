import React, { useRef, useState, useEffect } from 'react';
import { Camera, Video, Grid, Sliders, Crop } from 'lucide-react';

const VIDEO_SOURCES = {
  neon: 'https://assets.mixkit.co/videos/preview/mixkit-tokyo-street-at-night-with-neon-lights-40082-large.mp4',
  beach: 'https://assets.mixkit.co/videos/preview/mixkit-sunset-on-a-sandy-beach-with-gentle-waves-41968-large.mp4',
  kitchen: 'https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-vegetables-close-up-41962-large.mp4'
};

export default function CameraPanel({ activeShot, onCaptureFrame }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
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

  // Capture current frame from HTML5 video element
  const captureShot = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set matching dimensions
    canvas.width = 640;
    canvas.height = 480;

    // Draw the current video frame onto canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Draw crop masks on snapshot image
    ctx.fillStyle = 'black';
    if (aspectRatio === '2.39:1') {
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.18);
      ctx.fillRect(0, canvas.height * 0.82, canvas.width, canvas.height * 0.18);
    } else if (aspectRatio === '9:16') {
      ctx.fillRect(0, 0, canvas.width * 0.31, canvas.height);
      ctx.fillRect(canvas.width * 0.69, 0, canvas.width * 0.31, canvas.height);
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

        {/* Realistic Looping Video Loop */}
        <video 
          ref={videoRef}
          src={VIDEO_SOURCES[povPreset]}
          className="webcam-feed"
          autoPlay
          loop
          muted
          playsInline
          key={povPreset} // Force reload on preset change
          style={{ 
            display: 'block',
            transform: `scale(${zoomScale[focalLength]})`,
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            objectFit: 'cover'
          }}
        />

        {/* Grid lines overlay */}
        {hudGrid && (
          <div className="hud-grid-overlay absolute inset-0 pointer-events-none">
            <div className="grid-h-1 absolute w-full left-0 border-t border-dashed" style={{ top: '33.33%', borderColor: 'rgba(14, 165, 233, 0.2)' }} />
            <div className="grid-h-2 absolute w-full left-0 border-t border-dashed" style={{ top: '66.66%', borderColor: 'rgba(14, 165, 233, 0.2)' }} />
            <div className="grid-v-1 absolute h-full top-0 border-l border-dashed" style={{ left: '33.33%', borderColor: 'rgba(14, 165, 233, 0.2)' }} />
            <div className="grid-v-2 absolute h-full top-0 border-l border-dashed" style={{ left: '66.66%', borderColor: 'rgba(14, 165, 233, 0.2)' }} />
          </div>
        )}

        {/* Cinematic Aspect Ratio Mask Overlays */}
        {aspectRatio === '2.39:1' && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
            <div className="w-full" style={{ height: '18%', backgroundColor: 'rgba(2, 6, 23, 0.9)', borderBottom: '1px solid rgba(14, 165, 233, 0.15)' }} />
            <div className="w-full" style={{ height: '18%', backgroundColor: 'rgba(2, 6, 23, 0.9)', borderTop: '1px solid rgba(14, 165, 233, 0.15)' }} />
          </div>
        )}

        {aspectRatio === '9:16' && (
          <div className="absolute inset-0 pointer-events-none flex justify-between">
            <div className="h-full" style={{ width: '31%', backgroundColor: 'rgba(2, 6, 23, 0.9)', borderRight: '1px solid rgba(14, 165, 233, 0.15)' }} />
            <div className="h-full" style={{ width: '31%', backgroundColor: 'rgba(2, 6, 23, 0.9)', borderLeft: '1px solid rgba(14, 165, 233, 0.15)' }} />
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
          <div className="absolute border border-dashed pointer-events-none active-shot-focus animate-pulse"
            style={{
              width: '120px',
              height: '80px',
              top: activeShot.composition === 'rule-of-thirds' ? '25%' : activeShot.composition === 'diagonal-motion' ? '45%' : '38%',
              left: activeShot.composition === 'rule-of-thirds' ? '20%' : activeShot.composition === 'diagonal-motion' ? '55%' : '38%',
              transition: 'all 0.5s ease-in-out',
              borderColor: 'rgba(16, 185, 129, 0.5)'
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

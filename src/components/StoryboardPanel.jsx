import React, { useRef, useEffect } from 'react';
import { Film, Trash2, Move, AlertCircle, Edit3 } from 'lucide-react';

export default function StoryboardPanel({ 
  cards, 
  activeCardId, 
  onSelectCard, 
  onUpdateCard, 
  onDeleteCard,
  onReorderCards 
}) {
  const dragItem = useRef();
  const dragOverItem = useRef();

  // Handle HTML5 Drag and Drop reordering
  const handleDragStart = (e, index) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    dragOverItem.current = index;
  };

  const handleDrop = () => {
    const listCopy = [...cards];
    const dragIdx = dragItem.current;
    const overIdx = dragOverItem.current;
    
    if (dragIdx === undefined || overIdx === undefined || dragIdx === overIdx) return;

    // Swap positions
    const draggedItemContent = listCopy[dragIdx];
    listCopy.splice(dragIdx, 1);
    listCopy.splice(overIdx, 0, draggedItemContent);

    dragItem.current = undefined;
    dragOverItem.current = undefined;
    onReorderCards(listCopy);
  };

  return (
    <div className="storyboard-workspace flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="panel-header flex-row items-center justify-between border-b border-slate-800/60 pb-3">
        <div className="flex-row items-center gap-2">
          <Film className="text-cyan-400" size={18} />
          <span className="panel-title font-semibold tracking-wider text-sm">STORYBOARD SHOT GRID</span>
        </div>
        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
          {cards.length} SHOTS TOTAL
        </span>
      </div>

      {/* Cards List container */}
      {cards.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 border border-dashed border-slate-800/80 rounded-xl bg-slate-900/10">
          <AlertCircle className="text-slate-500 mb-2" size={32} />
          <span className="text-sm font-semibold text-slate-400 mb-1">No Storyboard Shots Generated</span>
          <p className="text-xs text-slate-500 text-center max-w-xs">
            Enter a prompt or select a preset in the creator console to automatically build your shot structure.
          </p>
        </div>
      ) : (
        <div className="storyboard-list flex flex-col gap-3 overflow-y-auto max-h-[70vh] pr-1">
          {cards.map((card, idx) => (
            <StoryboardCard
              key={card.id}
              card={card}
              index={idx}
              isActive={card.id === activeCardId}
              onSelect={() => onSelectCard(card.id)}
              onUpdate={(updatedData) => onUpdateCard(card.id, updatedData)}
              onDelete={() => onDeleteCard(card.id)}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={handleDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* --- Internal Storyboard Card Item Component --- */
function StoryboardCard({ 
  card, 
  index, 
  isActive, 
  onSelect, 
  onUpdate, 
  onDelete,
  onDragStart,
  onDragOver,
  onDrop 
}) {
  const thumbnailCanvasRef = useRef(null);

  // Render composition preview grid lines if no captured image is available
  useEffect(() => {
    if (card.image) return; // Use captured webcam frame if available

    const canvas = thumbnailCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set mock card size
    canvas.width = 180;
    canvas.height = 110;

    // Dark grey canvas background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(14, 165, 233, 0.25)'; // Cyan accent
    ctx.lineWidth = 1;

    // Draw composition markers
    if (card.composition === 'rule-of-thirds') {
      // Horizontal grid lines
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.33);
      ctx.lineTo(canvas.width, canvas.height * 0.33);
      ctx.moveTo(0, canvas.height * 0.66);
      ctx.lineTo(canvas.width, canvas.height * 0.66);
      
      // Vertical grid lines
      ctx.moveTo(canvas.width * 0.33, 0);
      ctx.lineTo(canvas.width * 0.33, canvas.height);
      ctx.moveTo(canvas.width * 0.66, 0);
      ctx.lineTo(canvas.width * 0.66, canvas.height);
      ctx.stroke();

      // Focus intersection circles
      ctx.fillStyle = 'rgba(16, 185, 129, 0.4)'; // green dot
      ctx.beginPath();
      ctx.arc(canvas.width * 0.33, canvas.height * 0.33, 3, 0, Math.PI*2);
      ctx.arc(canvas.width * 0.66, canvas.height * 0.66, 3, 0, Math.PI*2);
      ctx.fill();
    } else if (card.composition === 'diagonal-motion') {
      // Perspective line indicators
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.8);
      ctx.lineTo(canvas.width, canvas.height * 0.2);
      ctx.moveTo(canvas.width * 0.2, canvas.height);
      ctx.lineTo(canvas.width * 0.8, 0);
      ctx.stroke();

      // Motion vectors
      ctx.strokeStyle = '#f43f5e'; // Rose pink motion
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.3, canvas.height * 0.7);
      ctx.lineTo(canvas.width * 0.6, canvas.height * 0.4);
      ctx.stroke();
      
      // Arrow head
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.6, canvas.height * 0.4);
      ctx.lineTo(canvas.width * 0.55, canvas.height * 0.45);
      ctx.lineTo(canvas.width * 0.58, canvas.height * 0.38);
      ctx.fill();
    } else if (card.composition === 'center-focus') {
      // Concentric circles
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, 20, 0, Math.PI*2);
      ctx.arc(canvas.width/2, canvas.height/2, 40, 0, Math.PI*2);
      ctx.stroke();

      // Reticle center hairs
      ctx.beginPath();
      ctx.moveTo(canvas.width/2 - 10, canvas.height/2);
      ctx.lineTo(canvas.width/2 + 10, canvas.height/2);
      ctx.moveTo(canvas.width/2, canvas.height/2 - 10);
      ctx.lineTo(canvas.width/2, canvas.height/2 + 10);
      ctx.stroke();
    }

    // Small thumbnail texts overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '8px monospace';
    ctx.fillText(card.shotType?.substring(0, 16), 10, 20);

  }, [card.composition, card.image, card.shotType]);

  const handleChange = (field, val) => {
    onUpdate({ [field]: val });
  };

  return (
    <div 
      className={`storyboard-card glass-panel flex-row gap-4 p-3 relative ${isActive ? 'card-highlight' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onSelect}
    >
      {/* Drag handle */}
      <div className="drag-handle flex items-center justify-center cursor-grab text-slate-600 hover:text-cyan-400">
        <Move size={14} />
      </div>

      {/* Shot Thumbnail Column */}
      <div className="card-thumb-column relative">
        <span className="shot-num absolute top-1.5 left-1.5 bg-slate-950/80 border border-slate-700/50 px-1.5 py-0.5 rounded font-mono text-[9px] font-bold text-cyan-400 z-10">
          SHOT #{index + 1}
        </span>
        {card.image ? (
          <img src={card.image} alt={`Shot ${index + 1}`} className="card-thumbnail-img" />
        ) : (
          <canvas ref={thumbnailCanvasRef} className="card-thumbnail-canvas" />
        )}
      </div>

      {/* Editing Data Columns */}
      <div className="card-data-fields flex-1 flex flex-col gap-2">
        <div className="flex-row items-center justify-between gap-2">
          {/* Shot Type select */}
          <select
            className="input-select-hud font-bold text-xs"
            value={card.shotType}
            onChange={(e) => handleChange('shotType', e.target.value)}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="EXTREME WIDE SHOT">ESTABLISHING / EXTREME WIDE</option>
            <option value="WIDE SHOT">WIDE SHOT</option>
            <option value="MEDIUM SHOT">MEDIUM SHOT</option>
            <option value="MEDIUM CLOSE SHOT">MEDIUM CLOSE</option>
            <option value="CLOSE-UP SHOT">CLOSE-UP</option>
            <option value="EXTREME CLOSE-UP">EXTREME CLOSE-UP</option>
            <option value="TRACKING SHOT">TRACKING CAMERA</option>
            <option value="REVERSE CLOSE-UP">REVERSE CLOSE-UP</option>
          </select>

          {/* Location slug */}
          <input
            type="text"
            className="input-text-hud flex-1 font-mono text-[10px]"
            value={card.location}
            onChange={(e) => handleChange('location', e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="SCENE HEADER"
          />
        </div>

        {/* Action descriptions */}
        <div className="flex-row items-start gap-1">
          <Edit3 size={11} className="text-slate-500 mt-1" />
          <textarea
            className="input-textarea-hud text-xs flex-1"
            value={card.action}
            onChange={(e) => handleChange('action', e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Describe the action and environment..."
            rows={2}
          />
        </div>

        {/* Dialogue and audio notes row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="label-tiny">DIALOGUE</span>
            <input
              type="text"
              className="input-text-hud font-mono text-[10px]"
              value={card.dialogue}
              onChange={(e) => handleChange('dialogue', e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="e.g. CHARACTER: 'Line'"
            />
          </div>
          <div className="flex flex-col">
            <span className="label-tiny">AUDIO CUES / SFX</span>
            <input
              type="text"
              className="input-text-hud font-mono text-[10px]"
              value={card.audio}
              onChange={(e) => handleChange('audio', e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Sound effects, synth background"
            />
          </div>
        </div>
      </div>

      {/* Delete button wrapper */}
      <div className="card-delete-button flex justify-center items-center">
        <button
          className="btn-delete p-1.5 rounded hover:bg-rose-500/10 text-slate-500 hover:text-rose-400"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete shot"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Sparkles, Wand2, FileText, Activity, Terminal, AlertTriangle } from 'lucide-react';

const DRAFTS = [
  {
    label: "Cyberpunk Alley Chase",
    text: "First an extreme wide shot of cyberpunk neon alleyways with heavy rain. A security drone zooms close up on the corner. Then, tracking shot of the rogue runner darting through the wet puddles, shouting 'They've located the signal. I'm running out of grid sectors!' A shadowy alcove where the runner hides as the search light sweeps by."
  },
  {
    label: "Dramatic Sunset Beach",
    text: "Establishing wide shot of a sandy beach at sunset, warm orange hues, soft piano music. Sarah looks down, 'We spent five years building this system. You can't just walk away now.' Close up of Mark closing his eyes, 'It was never about the system, Sarah. It was about who we became while building it.' Reverse close up of Sarah reaching her hand out in silence."
  },
  {
    label: "Artisanal Cooking Lesson",
    text: "Extreme close up of a chef's knife swiftly chopping fresh green basil on a cutting board, rhythmic chop sound. Close up of red cherry tomatoes tossed into a hot pan with steam rising. Chef turns to camera, 'High heat is key here. We want to blister the skin, trapping all that sweet moisture inside.' Medium shot of pan flipping."
  }
];

export default function DictationConsole({ onProcessDictation, isProcessing, critique }) {
  const [inputText, setInputText] = useState("");

  const handleApplyDraft = (text) => {
    setInputText(text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() === "") return;
    onProcessDictation(inputText);
  };

  return (
    <div className="dictation-panel glass-container mt-4">
      {/* Header */}
      <div className="panel-header flex-row items-center justify-between border-b border-slate-800/60 pb-3 mb-3">
        <div className="flex-row items-center gap-2">
          <Sparkles className="text-amber-400 animate-pulse" size={16} />
          <span className="panel-title font-semibold tracking-wider">CREATOR DICTATION DIALOG</span>
        </div>
      </div>

      {/* Preset Draft Cards */}
      <div className="preset-drafts flex flex-col gap-2 mb-3">
        <span className="label-dim text-xs font-semibold">PRESET CONCEPT DRAFTS</span>
        <div className="flex-row gap-2 flex-wrap">
          {DRAFTS.map((draft, idx) => (
            <button
              key={idx}
              type="button"
              className="btn-sm btn-draft flex-row items-center gap-1.5"
              onClick={() => handleApplyDraft(draft.text)}
              disabled={isProcessing}
            >
              <FileText size={12} className="text-slate-400" />
              {draft.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main text input form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          className="dictation-textarea text-sm"
          placeholder="Type your storyboard concepts or click a preset draft above. E.g. 'EXT. NEON STREET. Close up of character running...'"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={6}
          disabled={isProcessing}
        />

        {/* Buttons Action bar */}
        <div className="flex justify-end items-center gap-3">
          <button
            type="submit"
            className="btn-accent flex-1 py-2 font-semibold flex-row justify-center items-center gap-2"
            disabled={isProcessing || inputText.trim() === ""}
          >
            {isProcessing ? (
              <>
                <div className="spinner-sm" />
                <span>AI FORMATTING...</span>
              </>
            ) : (
              <>
                <Wand2 size={16} />
                <span>PROCESS SCENE CODES</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Option 1: AI Director's Critique & Pacing Analyst Panel */}
      {critique && (
        <div className="critique-panel mt-4 p-3 border border-cyan-400/20 bg-cyan-950/10 rounded-lg relative overflow-hidden">
          {/* Subtle neon side accent */}
          <div className="absolute top-0 left-0 h-full w-1 bg-cyan-400" />

          {/* Title row */}
          <div className="flex-row justify-between items-center mb-2.5">
            <div className="flex-row items-center gap-1.5 text-cyan-400 text-xs font-semibold tracking-wider font-mono">
              <Terminal size={12} />
              <span>AI DIRECTORS NOTES</span>
            </div>
            
            <div className="flex-row items-center gap-1">
              <span className="text-[10px] text-cyan-400/90 font-semibold font-mono bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/25">
                {critique.pacingLabel.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Metric Bar Row */}
          <div className="flex-col gap-1 mb-2.5">
            <div className="flex-row justify-between text-[10px] font-mono text-slate-400">
              <span>PACING VELOCITY INDEX</span>
              <span className="text-cyan-400 font-bold">{critique.pacingIndex}%</span>
            </div>
            {/* Horizontal gauge meter */}
            <div className="w-full h-1.5 bg-slate-950 rounded overflow-hidden">
              <div 
                className="h-full bg-cyan-400 shadow-[0_0_8px_#0ea5e9]"
                style={{ 
                  width: `${critique.pacingIndex}%`,
                  transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)' 
                }} 
              />
            </div>
          </div>

          {/* Critique analysis content */}
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans mb-2">
            {critique.analysis}
          </p>

          {/* Recommendations block */}
          {critique.recommendations && (
            <div className="border-t border-slate-800/60 pt-2 flex-col gap-1">
              <div className="flex-row items-center gap-1 text-[9px] font-bold text-amber-500/80 font-mono tracking-wider">
                <AlertTriangle size={10} />
                <span>SUGGESTED REVISION</span>
              </div>
              <p className="text-[10px] text-slate-400 italic leading-snug pl-1">
                "{critique.recommendations}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

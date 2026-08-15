import React, { useRef } from 'react';
import { FileCode, Printer, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function ScriptPanel({ cards }) {
  const [copied, setCopied] = useState(false);
  const printAreaRef = useRef();

  // Deconstruct cards to standard Screenplay text
  const generateScriptText = () => {
    let script = "";
    let currentLoc = "";

    cards.forEach((card, index) => {
      // 1. Scene location header (only if location changes)
      const locHeader = card.location?.toUpperCase().trim() || "EXT. SCENE - DAY";
      if (locHeader !== currentLoc) {
        currentLoc = locHeader;
        script += `\n${currentLoc}\n\n`;
      }

      // 2. Action description
      script += `${card.action || "Action description here."}\n\n`;

      // 3. Dialogue
      if (card.dialogue && card.dialogue.includes(":")) {
        const parts = card.dialogue.split(":");
        const speaker = parts[0].trim().toUpperCase();
        const speech = parts[1].replace(/['"]/g, "").trim();
        script += `\t\t\t\t${speaker}\n\t\t\t${speech}\n\n`;
      } else if (card.dialogue) {
        script += `\t\t\t\tCHARACTER\n\t\t\t${card.dialogue}\n\n`;
      }

      // 4. Audio/SFX cues
      if (card.audio) {
        script += `(SFX: ${card.audio})\n\n`;
      }
    });

    return script;
  };

  const handleCopyClipboard = () => {
    const text = generateScriptText();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="script-workspace flex flex-col gap-4 h-full">
      {/* Header toolbar */}
      <div className="panel-header flex-row items-center justify-between border-b border-slate-800/60 pb-3">
        <div className="flex-row items-center gap-2">
          <FileCode className="text-emerald-400" size={18} />
          <span className="panel-title font-semibold tracking-wider text-sm">CINEMATIC SCREENPLAY VIEWER</span>
        </div>

        <div className="flex-row items-center gap-2">
          <button
            className="btn-sm btn-secondary flex-row items-center gap-1.5"
            onClick={handleCopyClipboard}
            disabled={cards.length === 0}
          >
            {copied ? (
              <>
                <Check size={12} className="text-emerald-400" />
                <span>COPIED!</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>COPY TEXT</span>
              </>
            )}
          </button>
          
          <button
            className="btn-sm btn-accent flex-row items-center gap-1.5"
            onClick={handlePrint}
            disabled={cards.length === 0}
          >
            <Printer size={12} />
            <span>PRINT SCRIPT</span>
          </button>
        </div>
      </div>

      {/* Screenplay paper container */}
      <div className="screenplay-paper-wrapper flex-1 overflow-y-auto max-h-[70vh] bg-slate-950 p-4 border border-slate-800 rounded-xl">
        {cards.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-slate-500 font-mono text-xs">
            Script will generate automatically based on storyboard cards...
          </div>
        ) : (
          <div 
            ref={printAreaRef}
            className="screenplay-paper select-text print-screenplay-target"
          >
            {/* Title / Cover info */}
            <div className="screenplay-header font-mono text-center text-xs pb-8 border-b border-dashed border-slate-800/80 mb-8 print:hidden">
              <h2 className="text-sm font-bold text-slate-300">SCRIBEGLASS STORYBOARD PROJECT</h2>
              <p className="text-[10px] text-slate-500 mt-1">FORMATTED TO HOLLYWOOD SCREENPLAY STANDARDS</p>
            </div>

            {/* Screenplay Content Body */}
            <div className="screenplay-body font-mono text-sm leading-relaxed">
              {cards.map((card, idx) => {
                const parts = card.dialogue && card.dialogue.includes(":") 
                  ? card.dialogue.split(":") 
                  : [null, card.dialogue];
                
                const speaker = parts[0] ? parts[0].trim().toUpperCase() : null;
                const speech = parts[1] ? parts[1].replace(/['"]/g, "").trim() : null;

                return (
                  <div key={card.id} className="scene-block mb-6 print:break-inside-avoid">
                    {/* Scene boundary tag (index) */}
                    <span className="scene-marker-tag text-[9px] font-bold text-cyan-500/60 block mb-2 font-mono print:hidden">
                      SHOT {idx + 1} ({card.shotType})
                    </span>

                    {/* Location Slug */}
                    <div className="scene-heading uppercase font-bold text-slate-100 mb-3">
                      {card.location || "EXT. SCENE - DAY"}
                    </div>

                    {/* Action Block */}
                    <div className="scene-action text-slate-300 mb-3 pl-0 pr-8">
                      {card.action}
                    </div>

                    {/* Dialogue Blocks */}
                    {speech && (
                      <div className="scene-dialogue flex flex-col items-center my-4">
                        <div className="speaker-name uppercase font-semibold text-slate-100 mb-0.5 tracking-wider w-[120px] text-center">
                          {speaker || "CHARACTER"}
                        </div>
                        <div className="speech-text text-slate-300 text-center max-w-[340px]">
                          "{speech}"
                        </div>
                      </div>
                    )}

                    {/* Audio note cues */}
                    {card.audio && (
                      <div className="scene-audio text-[11px] italic text-slate-500 mb-2">
                        [AUDIO: {card.audio}]
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

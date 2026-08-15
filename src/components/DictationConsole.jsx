import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Play, Sparkles, Wand2, FileText } from 'lucide-react';

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

export default function DictationConsole({ onProcessDictation, isProcessing }) {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState(null);
  const [micError, setMicError] = useState(false);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
      };

      rec.onerror = (err) => {
        console.error("Speech Recognition Error:", err);
        setMicError(true);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognitionInstance(rec);
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionInstance) {
      alert("Web Speech API is not supported in this browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionInstance.stop();
      setIsListening(false);
    } else {
      setMicError(false);
      try {
        recognitionInstance.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        setIsListening(false);
      }
    }
  };

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
          <Sparkles className="text-amber-400" size={16} />
          <span className="panel-title font-semibold tracking-wider">CREATOR DICTATION DIALOG</span>
        </div>
        {recognitionInstance && (
          <span className="text-[10px] text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
            VOICE CAPABLE
          </span>
        )}
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
            >
              <FileText size={12} className="text-slate-400" />
              {draft.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main text input form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <textarea
            className="dictation-textarea text-sm"
            placeholder="Type your storyboard concepts or click 'Start Ambient Mic' to dictate scenes verbally. E.g. 'EXT. NEON STREET. Close up of character running...'"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={6}
            disabled={isProcessing}
          />
          
          {/* Micro indicator overlay */}
          {isListening && (
            <div className="absolute top-2 right-2 flex-row items-center gap-1.5 bg-rose-500/25 border border-rose-500/40 px-2 py-0.5 rounded text-[10px] font-mono text-rose-300">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              LISTENING...
            </div>
          )}
        </div>

        {/* Buttons Action bar */}
        <div className="flex justify-between items-center gap-3">
          <button
            type="button"
            className={`btn-secondary py-2 px-3 flex-row items-center gap-2 ${isListening ? 'listening-active' : ''}`}
            onClick={toggleListening}
            disabled={isProcessing}
            title={recognitionInstance ? "Start/Stop audio dictation" : "Voice dictation not supported on this browser"}
          >
            {isListening ? (
              <>
                <MicOff size={16} className="text-rose-400" />
                <span>STOP MIC</span>
              </>
            ) : (
              <>
                <Mic size={16} className="text-cyan-400" />
                <span>AMBIENT MIC</span>
              </>
            )}
          </button>

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
    </div>
  );
}

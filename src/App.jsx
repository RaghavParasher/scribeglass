import React, { useState } from 'react';
import CameraPanel from './components/CameraPanel';
import DictationConsole from './components/DictationConsole';
import StoryboardPanel from './components/StoryboardPanel';
import ScriptPanel from './components/ScriptPanel';
import { parseDictation } from './utils/mockAi';
import { Eye, Film, FileCode } from 'lucide-react';

export default function App() {
  // Pre-load with the cyberpunk script template
  const [cards, setCards] = useState(() => parseDictation('cyberpunk').cards);
  const [activeCardId, setActiveCardId] = useState(() => {
    const initial = parseDictation('cyberpunk').cards;
    return initial.length > 0 ? initial[0].id : null;
  });
  const [critique, setCritique] = useState(() => parseDictation('cyberpunk').critique);
  
  const [activeTab, setActiveTab] = useState('storyboard'); // 'storyboard' | 'script'
  const [isProcessing, setIsProcessing] = useState(false);

  // Active card selector helper
  const getActiveCard = () => {
    return cards.find(c => c.id === activeCardId) || cards[0] || null;
  };

  // Handle AI parsing
  const handleProcessDictation = (text) => {
    setIsProcessing(true);
    
    // Simulate high-fidelity AI parsing latency
    setTimeout(() => {
      const result = parseDictation(text);
      if (result.cards.length > 0) {
        setCards(result.cards);
        setActiveCardId(result.cards[0].id);
        setCritique(result.critique);
      }
      setIsProcessing(false);
    }, 1200);
  };

  // Update card properties
  const handleUpdateCard = (id, updatedFields) => {
    setCards(prev => prev.map(card => {
      if (card.id === id) {
        return { ...card, ...updatedFields };
      }
      return card;
    }));
  };

  // Delete card from sequence
  const handleDeleteCard = (id) => {
    setCards(prev => {
      const filtered = prev.filter(c => c.id !== id);
      // Adjust active card selection if deleted
      if (activeCardId === id) {
        setActiveCardId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  // Capture frame overlay onto active card
  const handleCaptureFrame = (dataUrl) => {
    const active = getActiveCard();
    if (active) {
      handleUpdateCard(active.id, { image: dataUrl });
    } else {
      // Create new shot card at the end of the script
      const newId = `custom-snap-${Date.now()}`;
      const newCard = {
        id: newId,
        shotType: "WIDE SHOT",
        location: "EXT. CAPTURED AREA - DAY",
        action: "Visual frame snapped from smart glasses HUD console.",
        dialogue: "",
        audio: "Ambient room tone.",
        composition: "rule-of-thirds",
        image: dataUrl
      };
      setCards(prev => [...prev, newCard]);
      setActiveCardId(newId);
    }
  };

  return (
    <div className="app-container min-h-screen">
      {/* App Header */}
      <header className="flex-row justify-between items-center border-b border-slate-800/80 pb-4 mb-4 print:hidden">
        <div className="flex-col">
          <div className="flex-row items-center gap-2">
            <span className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400">
              🕶️ SCRIBEGLASS
            </span>
            <span className="text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-400/30 px-2 py-0.5 rounded font-mono">
              CUTC TRANSFORM HACKATHON
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Spatial Storyboarding & Ambient Scriptwriting Suite
          </p>
        </div>
        {/* Removed deadline text block */}
      </header>

      {/* Main Grid Section */}
      <main className="app-grid">
        {/* Left Side: Viewer Port & Input Dialog */}
        <div className="flex-col gap-4">
          <CameraPanel 
            activeShot={getActiveCard()}
            onCaptureFrame={handleCaptureFrame}
          />
          <DictationConsole 
            onProcessDictation={handleProcessDictation}
            isProcessing={isProcessing}
            critique={critique}
          />
        </div>

        {/* Right Side: Workspaces Tabs Layout */}
        <div className="glass-container flex-col">
          {/* Tabs bar */}
          <div className="view-tabs-header flex-row border-b border-slate-800/60 print:hidden">
            <button
              className={`tab-btn ${activeTab === 'storyboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('storyboard')}
            >
              <Film size={14} />
              Storyboard Grid
            </button>
            <button
              className={`tab-btn ${activeTab === 'script' ? 'active' : ''}`}
              onClick={() => setActiveTab('script')}
            >
              <FileCode size={14} />
              Cinematic Screenplay
            </button>
          </div>

          {/* Tab Workspaces */}
          <div className="workspace-tab-body flex-1 p-4">
            {activeTab === 'storyboard' ? (
              <StoryboardPanel 
                cards={cards}
                activeCardId={activeCardId}
                onSelectCard={setActiveCardId}
                onUpdateCard={handleUpdateCard}
                onDeleteCard={handleDeleteCard}
                onReorderCards={setCards}
              />
            ) : (
              <ScriptPanel 
                cards={cards}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

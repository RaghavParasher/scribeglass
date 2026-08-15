/**
 * Mock AI Agent for parsing natural language dictations into structured screenplay cards and critiques.
 */

const PRESETS = {
  cyberpunk: {
    cards: [
      {
        id: "card-1",
        shotType: "EXTREME WIDE SHOT",
        location: "EXT. NEON ALLEYWAY - NIGHT (RAIN)",
        action: "An extreme wide shot of cyberpunk neon alleyways with heavy rain.",
        dialogue: "",
        audio: "Distant hum of flying vehicles, heavy synth bass and rainfall.",
        composition: "rule-of-thirds"
      },
      {
        id: "card-2",
        shotType: "CLOSE-UP SHOT",
        location: "EXT. NEON ALLEYWAY - NIGHT (RAIN)",
        action: "A security drone zooms close up on the corner.",
        dialogue: "",
        audio: "High-pitched digital scan sounds, drone motor hum.",
        composition: "center-focus"
      },
      {
        id: "card-3",
        shotType: "TRACKING SHOT",
        location: "EXT. NEON ALLEYWAY - NIGHT (RAIN)",
        action: "A tracking shot of the rogue runner darting through the wet puddles.",
        dialogue: "Runner: 'They've located the signal. I'm running out of grid sectors!'",
        audio: "Puddles splashing, high-paced electronic percussion kicks in.",
        composition: "diagonal-motion"
      },
      {
        id: "card-4",
        shotType: "MEDIUM CLOSE SHOT",
        location: "EXT. SHADOWY ALCOVE - NIGHT (RAIN)",
        action: "A shadowy alcove where the runner hides as the search light sweeps by.",
        dialogue: "",
        audio: "Music drops to a tense, low drone. The search light sweeps by.",
        composition: "rule-of-thirds"
      }
    ],
    critique: {
      pacingIndex: 94,
      pacingLabel: "High Tension / Action",
      analysis: "Excellent transition from establishing Shot #1 (Extreme Wide) to Shot #2 (Close-up) to build immediate tension. The rapid camera cuts match the hectic chase dialogue.",
      recommendations: "Consider inserting a brief tracking shot of the drone searchlight sweeping the ground before the runner hides in Shot #4 to smooth out the chase velocity."
    }
  },
  drama: {
    cards: [
      {
        id: "card-1",
        shotType: "WIDE SHOT",
        location: "EXT. SANDY BEACH - SUNSET",
        action: "Establishing wide shot of a sandy beach at sunset, warm orange hues, soft piano music.",
        dialogue: "",
        audio: "Soothing sound of ocean waves, a melancholic piano theme playing softly.",
        composition: "rule-of-thirds"
      },
      {
        id: "card-2",
        shotType: "MEDIUM SHOT",
        location: "EXT. SANDY BEACH - SUNSET",
        action: "Sarah looks down, struggling to find the words.",
        dialogue: "Sarah: 'We spent five years building this system. You can't just walk away now.'",
        audio: "Wind blowing gently, ocean swell.",
        composition: "center-focus"
      },
      {
        id: "card-3",
        shotType: "CLOSE-UP SHOT",
        location: "EXT. SANDY BEACH - SUNSET",
        action: "Close up of Mark closing his eyes.",
        dialogue: "Mark: 'It was never about the system, Sarah. It was about who we became while building it.'",
        audio: "Piano music grows slightly louder, introducing a cello note.",
        composition: "rule-of-thirds"
      },
      {
        id: "card-4",
        shotType: "REVERSE CLOSE-UP",
        location: "EXT. SANDY BEACH - SUNSET",
        action: "Reverse close up of Sarah reaching her hand out in silence.",
        dialogue: "",
        audio: "Waves crashing loudly, covering the silence.",
        composition: "diagonal-motion"
      }
    ],
    critique: {
      pacingIndex: 58,
      pacingLabel: "Slow / Melancholic",
      analysis: "Pacing matches the emotional beat. The sequence moves from a distant wide shot establishing isolation, down to close-ups to capture subtle facial reactions during dialogue, ending on a silent reverse shot.",
      recommendations: "The transition from Sarah's dialogue card directly to Mark's close-up is very standard. Suggest adding a medium close-up of Mark's hands fidgeting to emphasize his hesitation."
    }
  },
  cooking: {
    cards: [
      {
        id: "card-1",
        shotType: "EXTREME CLOSE-UP",
        location: "INT. KITCHEN - DAY",
        action: "Extreme close up of a chef's knife swiftly chopping fresh green basil on a cutting board, rhythmic chop sound.",
        dialogue: "",
        audio: "Rapid rhythmic chopping sounds on wood, light acoustic guitar background.",
        composition: "center-focus"
      },
      {
        id: "card-2",
        shotType: "CLOSE-UP SHOT",
        location: "INT. KITCHEN - DAY",
        action: "Close up of red cherry tomatoes tossed into a hot pan with steam rising.",
        dialogue: "",
        audio: "Loud sizzling and popping of oil, guitar music continues.",
        composition: "rule-of-thirds"
      },
      {
        id: "card-3",
        shotType: "MEDIUM SHOT",
        location: "INT. KITCHEN - DAY",
        action: "Chef turns to camera.",
        dialogue: "Chef: 'High heat is key here. We want to blister the skin, trapping all that sweet moisture inside.'",
        audio: "Sizzle continues, music swelling.",
        composition: "center-focus"
      },
      {
        id: "card-4",
        shotType: "MEDIUM SHOT",
        location: "INT. KITCHEN - DAY",
        action: "Medium shot of pan flipping.",
        dialogue: "",
        audio: "Pan clanking, sizzle drops briefly, then resumes.",
        composition: "diagonal-motion"
      }
    ],
    critique: {
      pacingIndex: 76,
      pacingLabel: "Instructional / Rhythmic",
      analysis: "Highly rhythmic pacing. Close-ups focus attention on culinary details (knife cuts, oil steam) while the dialogue card provides instructional voice-over pacing.",
      recommendations: "Suggest adding a slow pan shot showing the final plated dish to conclude the sequence with a visual payoff."
    }
  }
};

/**
 * Parses raw text input into a structured array of cards.
 * Uses basic heuristic keyword matching to make custom inputs feel "smart".
 * @param {string} text 
 * @returns {Object} { cards: Array, critique: Object }
 */
export function parseDictation(text) {
  if (!text || text.trim() === "") return { cards: [], critique: null };

  // Check if it matches presets
  const cleanText = text.toLowerCase().trim();
  if (cleanText.includes("cyberpunk") || cleanText.includes("neon alley") || cleanText.includes("security drone")) {
    return JSON.parse(JSON.stringify(PRESETS.cyberpunk));
  }
  if (cleanText.includes("beach") || cleanText.includes("sarah") || cleanText.includes("sunset")) {
    return JSON.parse(JSON.stringify(PRESETS.drama));
  }
  if (cleanText.includes("kitchen") || cleanText.includes("chef") || cleanText.includes("tomato") || cleanText.includes("cooking")) {
    return JSON.parse(JSON.stringify(PRESETS.cooking));
  }

  // Fallback: Parse custom text by sentences
  const sentences = text.split(/[.;]+/).map(s => s.trim()).filter(s => s.length > 5);
  
  if (sentences.length === 0) {
    const cards = [
      {
        id: `custom-1`,
        shotType: "WIDE SHOT",
        location: "EXT. STAGE - DAY",
        action: text,
        dialogue: "",
        audio: "Ambient audio",
        composition: "rule-of-thirds"
      }
    ];
    return {
      cards,
      critique: {
        pacingIndex: 60,
        pacingLabel: "Custom Flow",
        analysis: "Custom scene generated from text. Single shot block sequence.",
        recommendations: "Add dialogue lines or music cues to build standard script pacing."
      }
    };
  }

  const cards = sentences.map((sentence, idx) => {
    let shotType = "MEDIUM SHOT";
    let composition = "rule-of-thirds";
    let location = "EXT. SCENE - DAY";
    let dialogue = "";
    let audio = "Ambient sound design.";

    const lowerSentence = sentence.toLowerCase();

    // 1. Detect Shot Type & Composition
    if (lowerSentence.includes("close up") || lowerSentence.includes("closeup") || lowerSentence.includes("close-up")) {
      shotType = "CLOSE-UP SHOT";
      composition = "center-focus";
    } else if (lowerSentence.includes("extreme wide") || lowerSentence.includes("drone") || lowerSentence.includes("establishing")) {
      shotType = "EXTREME WIDE SHOT";
      composition = "rule-of-thirds";
    } else if (lowerSentence.includes("wide")) {
      shotType = "WIDE SHOT";
      composition = "rule-of-thirds";
    } else if (lowerSentence.includes("tracking") || lowerSentence.includes("follow") || lowerSentence.includes("camera moves")) {
      shotType = "TRACKING SHOT";
      composition = "diagonal-motion";
    } else if (lowerSentence.includes("extreme close")) {
      shotType = "EXTREME CLOSE-UP";
      composition = "center-focus";
    } else if (lowerSentence.includes("medium shot") || lowerSentence.includes("waist shot")) {
      shotType = "MEDIUM SHOT";
      composition = "center-focus";
    }

    // 2. Detect Location cues
    if (lowerSentence.includes("inside") || lowerSentence.includes("room") || lowerSentence.includes("kitchen") || lowerSentence.includes("office") || lowerSentence.includes("house") || lowerSentence.includes("hallway")) {
      location = "INT. INDOOR LOCATION - DAY";
    } else if (lowerSentence.includes("night") || lowerSentence.includes("dark") || lowerSentence.includes("evening")) {
      location = "EXT. STREET LOCATION - NIGHT";
    } else if (lowerSentence.includes("beach") || lowerSentence.includes("forest") || lowerSentence.includes("park") || lowerSentence.includes("mountain")) {
      location = "EXT. OUTDOOR LOCATION - DAY";
    }

    // 3. Extract Dialogue (anything in quotes)
    const quoteMatches = sentence.match(/"([^"]+)"|'([^']+)'/);
    if (quoteMatches) {
      const spokeText = quoteMatches[1] || quoteMatches[2];
      const nameParts = sentence.substring(0, sentence.indexOf(quoteMatches[0])).trim().split(/\s+/);
      const speaker = nameParts.length > 0 && nameParts[nameParts.length - 1].match(/^[A-Z][a-z]+/) 
        ? nameParts[nameParts.length - 1] 
        : "CHARACTER";
      dialogue = `${speaker.toUpperCase()}: '${spokeText}'`;
    }

    // 4. Extract Audio/SFX cues
    if (lowerSentence.includes("music") || lowerSentence.includes("sound") || lowerSentence.includes("sfx") || lowerSentence.includes("exploding") || lowerSentence.includes("crashing")) {
      if (lowerSentence.includes("piano")) {
        audio = "Soft piano instrumental chord plays.";
      } else if (lowerSentence.includes("loud") || lowerSentence.includes("explosion")) {
        audio = "Loud crash sound effect with ringing tail.";
      } else {
        audio = "Dramatic cinematic score building up tension.";
      }
    }

    // 5. Clean Action Text
    let action = sentence;
    if (quoteMatches) {
      action = sentence.replace(quoteMatches[0], "").trim();
      action = action.replace(/\s+(says|shouts|whispers|replies|cries)\s*$/, "").trim();
    }

    return {
      id: `custom-${idx + 1}`,
      shotType,
      location,
      action: action.charAt(0).toUpperCase() + action.slice(1),
      dialogue,
      audio,
      composition
    };
  });

  return {
    cards,
    critique: {
      pacingIndex: Math.min(60 + cards.length * 7, 98),
      pacingLabel: cards.length > 3 ? "Dynamic Narrative Flow" : "Informative Pace",
      analysis: `Custom script parsed into ${cards.length} shots. Sequence moves through specified visual locations.`,
      recommendations: "Ensure visual establishing setups are followed by closer details for dialogue cards."
    }
  };
}

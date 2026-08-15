/**
 * Mock AI Agent for parsing natural language dictations into structured screenplay cards.
 */

const PRESETS = {
  cyberpunk: [
    {
      id: "card-1",
      shotType: "EXTREME WIDE SHOT",
      location: "EXT. NEON ALLEYWAY - NIGHT (RAIN)",
      action: "Massive skyscrapers loom overhead, covered in blinking holographic advertisements. Rain slicked streets reflect neon signs.",
      dialogue: "",
      audio: "Distant hum of flying vehicles, heavy synth bass and rainfall.",
      composition: "rule-of-thirds"
    },
    {
      id: "card-2",
      shotType: "TRACKING SHOT",
      location: "EXT. NEON ALLEYWAY - NIGHT (RAIN)",
      action: "A rogue runner in a reflective cybernetic jacket darts through the wet puddles, glancing frantically behind.",
      dialogue: "Runner: (panting) 'They've located the signal. I'm running out of grid sectors!'",
      audio: "Puddles splashing, high-paced electronic percussion kicks in.",
      composition: "diagonal-motion"
    },
    {
      id: "card-3",
      shotType: "CLOSE-UP SHOT",
      location: "EXT. NEON ALLEYWAY - NIGHT (RAIN)",
      action: "A chrome-plated security drone rounds the corner, its lens glowing a hostile neon red as it sweeps the alley.",
      dialogue: "",
      audio: "High-pitched digital scan sounds, drone motor hum.",
      composition: "center-focus"
    },
    {
      id: "card-4",
      shotType: "MEDIUM CLOSE SHOT",
      location: "EXT. SHADOWY ALCOVE - NIGHT (RAIN)",
      action: "The runner presses back against a rusted metal pipe structure, holding their breath as the red light sweeps inches away.",
      dialogue: "",
      audio: "Music drops to a tense, low drone. The runner's rapid heartbeat is audible.",
      composition: "rule-of-thirds"
    }
  ],
  drama: [
    {
      id: "card-1",
      shotType: "WIDE SHOT",
      location: "EXT. SANDY BEACH - SUNSET",
      action: "Golden sun dipping below the ocean horizon. Gentle waves wash over the shoreline. Two figures stand fifty feet apart.",
      dialogue: "",
      audio: "Soothing sound of ocean waves, a melancholic piano theme playing softly.",
      composition: "rule-of-thirds"
    },
    {
      id: "card-2",
      shotType: "MEDIUM SHOT",
      location: "EXT. SANDY BEACH - SUNSET",
      action: "SARAH looks down, digging her bare toes into the wet sand, struggling to find the words.",
      dialogue: "Sarah: 'We spent five years building this system. You can't just walk away now.'",
      audio: "Wind blowing gently, ocean swell.",
      composition: "center-focus"
    },
    {
      id: "card-3",
      shotType: "CLOSE-UP SHOT",
      location: "EXT. SANDY BEACH - SUNSET",
      action: "MARK closes his eyes, sighing. A single tear rolls down his cheek, catching the golden sunset light.",
      dialogue: "Mark: 'It was never about the system, Sarah. It was about who we became while building it.'",
      audio: "Piano music grows slightly louder, introducing a cello note.",
      composition: "rule-of-thirds"
    },
    {
      id: "card-4",
      shotType: "REVERSE CLOSE-UP",
      location: "EXT. SANDY BEACH - SUNSET",
      action: "Sarah looks up, surprised. She reaches out a hand, but hesitates, leaving it hovering in the air.",
      dialogue: "",
      audio: "Waves crashing loudly, covering the silence.",
      composition: "diagonal-motion"
    }
  ],
  cooking: [
    {
      id: "card-1",
      shotType: "EXTREME CLOSE-UP",
      location: "INT. MODERN KITCHEN - DAY",
      action: "A chef's knife swiftly chops fresh basil leaves on a dark wooden cutting board. Green juices stain the wood.",
      dialogue: "",
      audio: "Rapid rhythmic chopping sounds on wood, light acoustic guitar background.",
      composition: "center-focus"
    },
    {
      id: "card-2",
      shotType: "CLOSE-UP SHOT",
      location: "INT. MODERN KITCHEN - DAY",
      action: "Fresh red cherry tomatoes are tossed into a hot pan with olive oil. Plumes of white steam rise immediately.",
      dialogue: "Chef: 'High heat is key here. We want to blister the skin, trapping all that sweet moisture inside.'",
      audio: "Loud sizzling and popping of oil, guitar music continues.",
      composition: "rule-of-thirds"
    },
    {
      id: "card-3",
      shotType: "MEDIUM SHOT",
      location: "INT. MODERN KITCHEN - DAY",
      action: "The chef grabs the pan and tosses the tomatoes high in the air, catching them cleanly. A bright smile on his face.",
      dialogue: "",
      audio: "Pan clanking, sizzle drops briefly, then resumes.",
      composition: "diagonal-motion"
    }
  ]
};

/**
 * Parses raw text input into a structured array of cards.
 * Uses basic heuristic keyword matching to make custom inputs feel "smart".
 * @param {string} text 
 * @returns {Array<Object>}
 */
export function parseDictation(text) {
  if (!text || text.trim() === "") return [];

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
  // Split by periods or semicolons, filtering empty strings
  const sentences = text.split(/[.;]+/).map(s => s.trim()).filter(s => s.length > 5);
  
  if (sentences.length === 0) {
    return [
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
  }

  return sentences.map((sentence, idx) => {
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
      // Try to find a character name
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
      // Remove trailing verbs like "says" or "shouts"
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
}

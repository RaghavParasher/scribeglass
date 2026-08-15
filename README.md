# 🕶️ ScribeGlass — Spatial Storyboard & Scriptwriting Suite

ScribeGlass is an interactive spatial storyboarding and scriptwriting workspace designed for content creators, directors, and filmmakers working with spatial video and ambient voice notes. 

Built in **under 13 hours** for the **CUTC: Transform Hackathon 2026**.

👉 **GitHub Repository:** [https://github.com/RaghavParasher/scribeglass](https://github.com/RaghavParasher/scribeglass)  

---

## 🚀 Key Features

*   **Spatial Viewfinder HUD Console:**
    *   **Live Feed Integration:** Connects directly to browser webcam permissions via standard Web APIs, overlaying a custom smart-glasses heads-up display (horizon level, reticles, recording elapsed time).
    *   **Vector Scene Simulators:** Provides fallback mock POVs (Neon Alleyway, Sunset Beach, Chef Kitchen) rendered via lightweight client-side HTML Canvas draw operations to ensure judges can preview full functionality without camera access.
    *   **Lens Focal Range Presets:** Toggle focal depths (24mm, 50mm, 85mm) executing hardware CSS zoom level animations.
    *   **HUD Frame Capture:** Snaps the current viewport (webcam frame or canvas drawing) and attaches it as a visual storyboard card thumbnail instantly.
*   **Ambient Dictation & Speech Parsing:**
    *   **HTML5 Web Speech API:** Dictate scenes verbally with real-time speech recognition streaming.
    *   **Keyword NLP Parser Heuristics:** Deconstructs raw dictation streams (e.g. *"...close up on Sarah saying 'You cannot leave' followed by guitar notes..."*) into structured screenplay elements.
    *   **Interactive Draft Presets:** Instant loading cards for quick demonstrations.
*   **Fluid Storyboard workspace:**
    *   **Vector Composition Canvas:** Dynamically generates overlay wireframe markers representing selected composition layouts (Rule of Thirds grid, Diagonal Motion speed arrows, Center Focus target).
    *   **Drag-and-Drop Sequence Reordering:** Reorder card sequences using zero-dependency HTML5 drag handler events.
    *   **In-line Reactive Editors:** Modify card headers, locations, text blocks, dialogues, and audio cues.
*   **Cinematic Screenplay formatter:**
    *   Renders script output matching industry standard Hollywood screenplay rules (Courier Prime font, indentation, centered characters).
    *   **System Print Stylesheets:** Fully optimized print views that isolate the script page for PDF generation or system printing, hiding all UI panels.

---

## 🛠️ Tech Stack & Architecture

*   **Frontend SPA Framework:** React 19 (Vite)
*   **Design & Theme System:** Premium Glassmorphism UI using Vanilla CSS HSL variables (`backdrop-filter`) and cyber-HUD layout grids
*   **Icons Library:** Lucide React
*   **Voice/Audio Engine:** HTML5 Web Speech Recognition API
*   **Graphics:** HTML5 2D Canvas context rendering loop

---

## 💻 Local Setup & Installation

Get ScribeGlass running locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RaghavParasher/scribeglass.git
   cd scribeglass
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:5173/` to view the application.

---

## 📜 Devpost Hackathon Story

### 💡 Inspiration
As hardware like Ray-Ban Meta glasses and spatial video formats become mainstream, the pipeline for creating video content remains stuck in traditional flat text editors. Writers struggle to visualize how physical camera angles, speech notes, and audio designs fit together. We wanted to build a workspace that behaves like a "smart viewfinder"—bridging raw ambient voice dictation with spatial storyboarding and standard screenwriting.

### 🧠 What it Does
ScribeGlass allows creators to dictate scene drafts directly using voice or text. The system automatically segments their speech into shot cards, matching location slugs (INT/EXT), dialogue segments, and camera shot composition types. Visual guidelines are drawn to help block the shot, which the creator can replace by snapping a frame from their viewfinder. The entire sequence is formatted into a print-ready screenplay instantly.

### 🏆 Targeted Tracks
*   **Media Track:** Revolutionizes pre-production workflows and storyboard structuring.
*   **Apps Track:** Built as a responsive React single page application using native web browser capabilities.
*   **Design Track:** Implements a state-of-the-art cyber dark slate glassmorphism user interface with micro-interactions.

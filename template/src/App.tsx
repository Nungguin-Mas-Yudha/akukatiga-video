import CustomEditorApp from "../engine/custom-editor/src/App";
import "../engine/custom-editor/src/app.css";

// Entry for AI Studio: the page is the same editor the channel runs locally (npm run custom-editor),
// which itself plays engine/full-visual/src/Reel.tsx with the video's own plans and assets.
export default function App() {
  return <CustomEditorApp />;
}

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import i18n configuration (must be before App)
import "./i18n/i18n";

createRoot(document.getElementById("root")!).render(<App />);

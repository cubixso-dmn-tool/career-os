import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set document title
document.title = "CareerPath - EdTech Platform for Indian Students";

// Add metadata
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'CareerPath is an EdTech platform for Indian students offering career guidance, skill development, and networking.';
document.head.appendChild(metaDescription);

// Add Inter font
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
document.head.appendChild(fontLink);

createRoot(document.getElementById("root")!).render(<App />);

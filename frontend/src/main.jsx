import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.jsx'
import '@/styles/tokens.css'
import '@/styles/global.css'

// If any image link is dead, show a friendly paw placeholder instead of a broken-image icon.
const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='#E3F2E7'/>" +
      "<g fill='#397653' opacity='.55'><ellipse cx='200' cy='185' rx='48' ry='40'/><ellipse cx='140' cy='120' rx='20' ry='26'/>" +
      "<ellipse cx='185' cy='95' rx='20' ry='27'/><ellipse cx='235' cy='95' rx='20' ry='27'/><ellipse cx='280' cy='120' rx='20' ry='26'/></g></svg>"
  );
document.addEventListener(
  'error',
  (e) => {
    const el = e.target;
    if (el && el.tagName === 'IMG' && !el.dataset.fallback) {
      el.dataset.fallback = '1';
      el.src = PLACEHOLDER;
    }
  },
  true
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
<<<<<<< HEAD
import { StorageProvider } from './context/StorageContext.jsx';
=======
import '@fortawesome/fontawesome-free/css/all.min.css';  
import { StorageProvider } from './context/StorageContext';
>>>>>>> aa80a669f20626b94ce61983f7f51cf2d8888024
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <StrictMode>
      <StorageProvider>
        <App />
      </StorageProvider>
    </StrictMode>
  </HelmetProvider>
);

// ── Prerender signal ──
// Tells @prerenderer/renderer-puppeteer that this route is painted and its
// <head> is final, so it can snapshot. Two nested rAFs, not one: the first
// fires before the browser paints, the second after — by which point React
// has committed and react-helmet-async has written its title/meta/canonical
// into document.head. Fire too early and you snapshot an empty #root with
// default meta tags.
// In a real browser this is a harmless no-op — nothing listens for it.
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.dispatchEvent(new Event('custom-render-trigger'));
  });
});
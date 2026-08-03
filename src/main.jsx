import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { StorageProvider } from './context/StorageContext';
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

import { createContext, useContext, useState, useEffect } from 'react';

export const LANGUAGES = [
	{ code: 'en', label: 'English' },
	{ code: 'hi', label: 'हिन्दी' },
	{ code: 'ta', label: 'தமிழ்' },
	{ code: 'te', label: 'తెలుగు' },
];

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
	const [langCode, setLangCode] = useState(() => {
		const saved = typeof window !== 'undefined' ? localStorage.getItem('dq_lang') : null;
		return LANGUAGES.find(l => l.code === saved)?.code || 'en';
	});

	const activeLang = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0];

	const forceHideBannerNow = () => {
		document.body.style.top = '0px';
		document.documentElement.style.top = '0px';
		document
			.querySelectorAll('.goog-te-banner-frame, iframe.skiptranslate, iframe[id^="goog-te-banner-frame"]')
			.forEach((el) => {
				el.style.display = 'none';
				el.style.visibility = 'hidden';
				el.style.height = '0px';
			});
	};

	const setLanguage = (code) => {
		if (!LANGUAGES.some(l => l.code === code)) return;
		setLangCode(code);
		localStorage.setItem('dq_lang', code);

		// Drive Google Translate's hidden combo box
		const applyGoogleTranslate = () => {
			const combo = document.querySelector('select.goog-te-combo');
			if (combo) {
				combo.value = code === 'en' ? 'en' : code;
				combo.dispatchEvent(new Event('change'));
				// Banner reappears a beat after the change fires — sweep for longer to be safe
				let sweeps = 0;
				const sweepInterval = setInterval(() => {
					forceHideBannerNow();
					sweeps++;
					if (sweeps > 30) clearInterval(sweepInterval); // ~4.5s of active sweeping
				}, 150);
				return true;
			}
			return false;
		};

		// Google Translate loads async — retry briefly if not ready yet
		if (!applyGoogleTranslate()) {
			let attempts = 0;
			const interval = setInterval(() => {
				attempts++;
				if (applyGoogleTranslate() || attempts > 20) clearInterval(interval);
			}, 250);
		}
	};

	// Re-apply saved language once Google Translate finishes initializing
	useEffect(() => {
		if (langCode === 'en') return;
		let attempts = 0;
		const interval = setInterval(() => {
			const combo = document.querySelector('select.goog-te-combo');
			attempts++;
			if (combo) {
				combo.value = langCode;
				combo.dispatchEvent(new Event('change'));
				clearInterval(interval);
			} else if (attempts > 40) {
				clearInterval(interval);
			}
		}, 250);
		return () => clearInterval(interval);
	}, []); // run once on mount

	// Google Translate keeps re-injecting its top banner iframe and
	// resetting `body.style.top` every time the language changes.
	// This watches the DOM/body and forces it back to hidden/0 immediately.
	useEffect(() => {
		forceHideBannerNow();

		const styleObserver = new MutationObserver(forceHideBannerNow);
		styleObserver.observe(document.body, {
			attributes: true,
			attributeFilter: ['style'],
		});
		styleObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['style'],
		});

		// Also catch the banner iframe itself, wherever it gets inserted
		const bodyObserver = new MutationObserver(() => forceHideBannerNow());
		bodyObserver.observe(document.body, { childList: true, subtree: true });

		// Google's script also fires slightly after the change event — catch that too
		const interval = setInterval(forceHideBannerNow, 300);

		return () => {
			styleObserver.disconnect();
			bodyObserver.disconnect();
			clearInterval(interval);
		};
	}, []);

	return (
		<LanguageContext.Provider value={{ activeLang, langCode, setLanguage, LANGUAGES }}>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => {
	const ctx = useContext(LanguageContext);
	if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
	return ctx;
};
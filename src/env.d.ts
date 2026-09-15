interface ImportMetaEnv {
	/** Public Cloudflare Turnstile site key used by the Contact page. */
	readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

/** Injected by Cloudflare's Turnstile script on the Contact page. */
interface Window {
	turnstile?: {
		reset: (widget?: string | HTMLElement) => void;
	};
}

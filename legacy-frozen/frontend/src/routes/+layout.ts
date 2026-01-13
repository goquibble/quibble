import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';

// vercel analytics
injectAnalytics({ mode: dev ? 'development' : 'production' });

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Load API key from environment. Do NOT commit your API key to source control.
const googleApiKey = process.env.GOOGLE_API_KEY;

if (!googleApiKey && process.env.NODE_ENV === 'development') {
  console.warn(
    'Warning: GOOGLE_API_KEY is not set. GenKit Google plugin will not be able to call the Google AI APIs until you set the key in your environment.'
  );
}

// Pass the key into the plugin (plugin option name `apiKey` is commonly supported).
// If the plugin expects a different config shape, update accordingly using the plugin docs.
export const ai = genkit({
  plugins: [googleAI({ apiKey: googleApiKey })],
  model: 'googleai/gemini-2.5-flash',
});

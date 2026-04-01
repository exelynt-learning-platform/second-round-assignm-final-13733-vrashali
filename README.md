# ChatGPT — React chat app

Vite + React chat UI with Redux Toolkit. Messages are sent to the [OpenAI Chat Completions](https://platform.openai.com/docs/guides/chat) endpoint **`https://api.openai.com/v1/chat/completions`** with **token streaming** (responses appear progressively like ChatGPT), **markdown** (GFM: lists, tables, `code` fences), and multi-turn context (last 30 messages).

## Setup

1. `npm install`
2. In the **project root** (next to `package.json`), edit `.env` and set **`VITE_OPENAI_API_KEY=sk-...`**
3. Optional: **`VITE_OPENAI_MODEL`** — defaults to **`gpt-4o-mini`**; use **`gpt-3.5-turbo`** if you prefer.
4. **No quotes** around values; **no spaces** around `=`. Do not leave the key empty or use placeholders like `your_api_key_here`.
5. **Restart** the dev server (`Ctrl+C`, then `npm run dev`). Vite reads `.env` only at startup.
6. Open [http://localhost:5173](http://localhost:5173)

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — serves the build
- `npm run lint` — ESLint
- `npm test` — Jest + React Testing Library

## API key security

- This app calls OpenAI directly from the browser, so `VITE_OPENAI_API_KEY` is exposed in built client JS.
- For real products, keep secrets on a **server** or serverless API and call OpenAI from there.

## Behavior

- **Loading:** While the API request is in flight, the input disables and a typing indicator appears.
- **Errors:** Failed requests show a dismissible banner (missing key, invalid key, rate limits, network, timeout, etc.).

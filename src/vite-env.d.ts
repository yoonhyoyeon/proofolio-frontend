/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Cloud Text-to-Speech browser API key (restrict by API + referrer). */
  readonly VITE_GC_TTS_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

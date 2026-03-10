/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KP_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

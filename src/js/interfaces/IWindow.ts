declare global {
  interface Window {
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
    mozAudioContext: typeof AudioContext;
  }
}

export {};

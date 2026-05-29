import { createContext } from "react";

// Shared mutable object: { playing: HTMLAudioElement | null }
// Stored in a ref at ExcursionDetails level and passed as context value.
// Components call manager.current.playing.pause() before starting a new track.
export const AudioManagerContext = createContext(null);

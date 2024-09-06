export interface PianoProps {}

export type PianoHandle = {
  playMusic: (music: number[][]) => void;
  songs: {
    1: number[][];
    2: number[][];
  };
};

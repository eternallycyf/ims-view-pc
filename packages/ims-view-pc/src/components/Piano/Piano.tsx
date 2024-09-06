import React, {
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ForwardRefRenderFunction,
} from 'react';
import { song1, song2 } from './constant';
import './index.css';
import type { PianoHandle, PianoProps } from './interface';

const Piano: ForwardRefRenderFunction<PianoHandle, PianoProps> = (props, ref) => {
  const keys: Record<string, { frequency: number }> = {
    A: { frequency: 196 },
    S: { frequency: 220 },
    D: { frequency: 246 },
    F: { frequency: 261 },
    G: { frequency: 293 },
    H: { frequency: 329 },
    J: { frequency: 349 },
    K: { frequency: 392 },
    L: { frequency: 440 },
    Z: { frequency: 493 },
    X: { frequency: 523 },
    C: { frequency: 587 },
    V: { frequency: 659 },
  };

  const context = useMemo(() => new AudioContext(), []);

  const play = (key: string) => {
    const frequency = keys[key]?.frequency;
    if (!frequency) return;

    const osc = context.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = frequency;

    const gain = context.createGain();
    osc.connect(gain);
    gain.connect(context.destination);

    gain.gain.setValueAtTime(0, context.currentTime);
    gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.01);

    osc.start(context.currentTime);

    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1);
    osc.stop(context.currentTime + 1);

    const keyElement = document.getElementById(`key-${key}`);
    keyElement?.classList.add('pressed');
    setTimeout(() => {
      keyElement?.classList.remove('pressed');
    }, 100);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      play(e.key.toUpperCase());
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const map: Record<number, string> = {
    1: 'A',
    2: 'S',
    3: 'D',
    4: 'F',
    5: 'G',
    6: 'H',
    7: 'J',
    8: 'K',
    9: 'L',
    10: 'Z',
    11: 'X',
    12: 'C',
    13: 'V',
  };

  useImperativeHandle(ref, () => ({
    playMusic,
    songs: {
      1: song1,
      2: song2,
    },
  }));

  function playMusic(music: number[][]) {
    let startTime = 0;
    music.forEach((item) => {
      setTimeout(() => {
        play(map[item[0]]);
      }, startTime * 0.5);
      startTime += item[1];
    });
  }

  return (
    <div>
      <section className="keys-container">
        {Object.keys(keys).map((item) => (
          <div className="key" key={item} id={`key-${item}`} onClick={() => play(item)}>
            <span>{item}</span>
          </div>
        ))}
      </section>
    </div>
  );
};
export default forwardRef(Piano);

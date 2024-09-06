import { Button, Spin } from 'antd';
import { Piano } from 'ims-view-pc';
import React, { useRef, useState, type ElementRef } from 'react';

const Demo = () => {
  const PinaoRef = useRef<ElementRef<typeof Piano>>(null!);

  const simplifiedSong = [
    [8, 800],
    [8, 800],
    [8, 800],
    [9, 400],
    [9, 400],
    [10, 200],
    [10, 200],
    [12, 200],
    [12, 200],
    [13, 200],
    [13, 200],
    [8, 800],
    [9, 400],
    [9, 400],
    [10, 200],
    [10, 200],
    [12, 200],
    [12, 200],
    [8, 800],
    [10, 200],
    [9, 400],
    [9, 400],
    [8, 800],
    [8, 800],
    [8, 800],
    [9, 400],
    [9, 400],
    [10, 200],
    [10, 200],
    [12, 200],
    [12, 200],
    [13, 200],
    [13, 200],
    [8, 800],
    [9, 400],
    [9, 400],
    [10, 200],
    [10, 200],
    [12, 200],
    [12, 200],
    [8, 800],
    [10, 200],
    [9, 400],
    [9, 400],
  ];

  return (
    <>
      <Piano ref={PinaoRef} />

      <button type="button" onClick={() => PinaoRef.current.playMusic(PinaoRef.current.songs[1])}>
        世上只有妈妈好
      </button>
      <button type="button" onClick={() => PinaoRef.current.playMusic(PinaoRef.current.songs[2])}>
        奢香夫人
      </button>
      <button type="button" onClick={() => PinaoRef.current.playMusic(simplifiedSong)}>
        光年之外
      </button>
    </>
  );
};
export default Demo;

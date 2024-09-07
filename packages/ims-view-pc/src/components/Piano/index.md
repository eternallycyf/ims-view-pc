---
title: Piano
description: 钢琴
group:
  title: 其他
  order: 9999
toc: content
---

## Piano 钢琴

一个简单的钢琴组件，可以播放音乐。

## 示例

<code src="./demo/index.tsx">钢琴</code>

## API

### PianoHandle

| 参数      | 说明                                                       | 类型                              | 默认值 |
| --------- | ---------------------------------------------------------- | --------------------------------- | ------ |
| playMusic | 音乐数组，每个数组代表一首音乐，数组内每个数字代表一个音符 | `playMusic: number[][]) => void;` | -      |
| songs     | 内置歌曲                                                   | number[]                          | -      |

---
title: AudioPlayer
description: 音频播放器： 提供音频文件的播放、控制等
toc: content
group:
  title: 文件
  order: 5
demo:
  cols: 2
---

## AudioPlayer 音频播放器

AudioPlayer 是一个用于播放音频文件的组件，提供用户友好的音频控制界面。

### 何时使用

- 播放单个音频文件或音频列表。
- 提供基本的音频控制功能，如播放、暂停、音量调节等。
- 支持自定义样式和主题以满足项目需求。

### 如何使用

在需要显示音频播放器的地方引入 `AudioPlayer` 组件，并传入相应的音频源和配置项。例如：

## demo

<code description="网页中播放音频" src="./demo/base.tsx">基本使用</code>

<code description="调整大小" src="./demo/size.tsx">size</code>

<code src="./demo/style.tsx">最简洁版本</code>

:::info{title=提示}
通过设置 `controlVolume=false` 去掉音量控制按钮；`controlProgress=false` 去掉进度控制；`displayTime=false` 去掉时间
:::

<code src="./demo/rate.tsx" description='通过设置 `playbackRate="1.0"` 设置默认播放速度通过设置 `playbackRates=["2.0", "1.0", "0.5"]` 设置播放速度选择列表`'>支持调节播放速度</code>

<code description="调整大小" src="./demo/download.tsx">支持下载</code>

## API

| 属性            | 说明                          | 类型                      | 默认值    |
| --------------- | ----------------------------- | ------------------------- | --------- |
| className       | 设置类名                      | String                    | ''        |
| controlVolume   | 是否需要手动控制音量          | Boolean                   | true      |
| controlProgress | 是否需要手动控制播放进度      | Boolean                   | true      |
| displayTime     | 是否显示时间                  | Boolean                   | true      |
| download        | 是否需要下载按钮              | Boolean                   | false     |
| src             | 音频元素的当前来源            | String                    | ''        |
| title           | 鼠标 hover 之后展示的音频描述 | String                    | ''        |
| size            | 设置音频播放器的大小          | Enum {'small', 'default'} | 'default' |

支持常用的 H5 audio 标签属性和事件

| 属性             | 说明                                                                                                                                                                                                                                                         | 类型                                                                     | 默认值                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ---------------------------------------------- |
| autoPlay         | 设置是否在加载完成后随即播放音频                                                                                                                                                                                                                             | Boolean                                                                  | false                                          |
| loop             | 设置音频是否应在结束时重新播放                                                                                                                                                                                                                               | Boolean                                                                  | false                                          |
| muted            | 设置音频是否静音                                                                                                                                                                                                                                             | Boolean                                                                  | false                                          |
| onAbort          | 当音频的加载已放弃时(如切换到其他资源)的回调                                                                                                                                                                                                                 | (e) => Void                                                              | -                                              |
| onCanPlay        | 当浏览器能够开始播放音频时的回调                                                                                                                                                                                                                             | (e) => Void                                                              | -                                              |
| onCanPlayThrough | 当浏览器可在不因缓冲而停顿的情况下进行播放时的回调                                                                                                                                                                                                           | (e) => Void                                                              | -                                              |
| onEnded          | 当目前的播放列表已结束时的回调                                                                                                                                                                                                                               | (e) => Void                                                              | -                                              |
| onError          | 当在音频加载期间发生错误时的回调                                                                                                                                                                                                                             | (e) => Void                                                              | -                                              |
| onLoadedMetadata | 当浏览器已加载音频的元数据时的回调                                                                                                                                                                                                                           | (e) => Void                                                              | -                                              |
| onPause          | 当音频暂停时的回调                                                                                                                                                                                                                                           | (e) => Void                                                              | -                                              |
| onPlay           | 当音频已开始或不再暂停时的回调                                                                                                                                                                                                                               | (e) => Void                                                              | -                                              |
| onSeeked         | 当用户已移动/跳跃到音频中的新位置时的回调                                                                                                                                                                                                                    | (e) => Void                                                              | -                                              |
| preload          | 音频是否应该在页面加载后进行加载。 可选值有：`auto`指示一旦页面加载，则开始加载音频；`metadata`指示当页面加载后仅加载音频的元数据；`none` 指示页面加载后不应加载音频。                                                                                       | Enum {'auto', 'metadata', 'none'}                                        | 'metadata'                                     |
| volume           | 设置音频的当前音量, 必须是介于 0.0 与 1.0 之间的数字。例如：1.0 是最高音量（默认）0.5 是一半音量 （50%）0.0 是静音                                                                                                                                           | Number                                                                   | 1.0                                            |
| rateOptions      | rateOptions.value，设置音频的默认播放速度，值为假值时播放速度为 1 ，但不展示播放速度；rateOptions.suffix，设置展示的播放速度的单位；rateOptions.decimal，设置展示的播放速度的数字精度；rateOptions.range，设置音频播放速度的选择范围，值为[]时不展示选择范围 | {value: Number, suffix: String, decimal: Number, range: Array\<Number\>} | {value: 0, suffix: 'x', decimal: 1, range: []} |

其他 H5 audio 属性和事件配置参见 [H5 audio 属性说明](http://www.w3school.com.cn/jsref/dom_obj_audio.asp)。

## FAQ

- 确保音频文件路径或链接正确，支持的音频格式包括 MP3、WAV 等。
- 针对移动端，考虑兼容性和性能问题。
- 根据需要，可选择添加自定义控制按钮或样式。

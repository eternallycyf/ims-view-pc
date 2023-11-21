---
title: VideoViewer
description: 视频播放器 播放视频
toc: content
group:
  title: 文件
  order: 5
demo:
  cols: 2
---

## VideoViewer 视频查看器

VideoViewer 是一个用于展示和控制视频播放的组件，提供用户友好的界面和交互功能。

### 何时使用

- 显示单个视频或视频列表。
- 提供播放、暂停、快进、快退等基本视频控制功能。
- 自定义样式以适应项目设计风格。

### 如何使用

在需要显示视频的地方引入 `VideoViewer` 组件，并传入相应的视频源和配置项。例如：

## demo

### 播放器

<code src='./demo/cover.tsx' description='demo 播放器组件`VideoViewer.Video`，`poster`指定播放器封面'>带封面的播放器</code>

<code src='./demo/noCover.tsx' description="播放器组件`VideoViewer.Video`。不指定封面时，默认展示视频第一帧">不带封面的播放器</code>

### 缩略图

<code src='./demo/normal.tsx' description="`VideoViewer`组件封装了`VideoViewer.VideoModal`和`VideoViewer.Video`，实现了点击缩略图在模态框中播放视频。 `modalProps` 传入`VideoViewer.VideoModal`的参数；`videoProps`传入`VideoViewer.Video`的参数">正常状态</code>

<code src='./demo/other.tsx' description="当视频由于某些原因无法播放时，通过 `failedMessage` 展示缩略图的其他状态, 当设置了`failedMessage`时，缩略图将不可点击并播放">其他状态</code>

### 自行控制视频

<code src='./demo/custom.tsx' description="可以用自定义的等组件，将播放器模态框`VideoViewer.VideoModal`和播放器`VideoViewer.Video`配合使用，自行控制视频。">自行控制视频</code>

## API

### VideoViewer

| 属性          | 说明                                                                                                             | 类型             | 默认值 |
| ------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------- | ------ |
| width         | 缩略图的宽度                                                                                                     | String \| Number | 240    |
| height        | 缩略图的高度                                                                                                     | String \| Number | 135    |
| poster        | 缩略图背景画面。通常传入一个 URL                                                                                 | String           | ''     |
| failedMessage | 当视频不能正常播放的描述信息。注意：当值为 null 时，缩略图可以正常点击并播放视频，传入其他值则不可点击并播放视频 | String           | null   |
| modalProps    | `VideoViewer.VideoModal`参数对象                                                                                 | Object           | -      |
| videoProps    | `VideoViewer.Video`参数对象                                                                                      | Object           | -      |
| onThumbClick  | 点击缩略图的回调                                                                                                 | (e) => Void      | -      |

### VideoViewer.VideoModal

| 属性       | 说明                                 | 类型             | 默认值 |
| ---------- | ------------------------------------ | ---------------- | ------ |
| width      | 设置模态框的宽度                     | String \| Number | 640    |
| afterClose | 模态框关闭的回调                     | (e) => Void      | —      |
| draggable  | 模态框是否支持拖动                   | Boolean          | false  |
| mask       | 模态框关闭的遮罩是否可见             | Boolean          | false  |
| onCancel   | 点击遮罩层或右上角叉或取消按钮的回调 | (e) => Void      | -      |
| open       | 模态框是否可见                       | Boolean          | false  |

### VideoViewer.Video

| 属性          | 说明                                                                                                                 | 类型                              | 默认值 |
| ------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ------ |
| width         | 设置视频播放器的宽度                                                                                                 | String \| Number                  | 640    |
| height        | 设置视频播放器的高度                                                                                                 | String \| Number                  | 360    |
| poster        | 播放前显示的视频画面，播放开始之后自动移除。通常传入一个 URL（如果未设置该属性，将使用视频的第一帧来代替）           | String                            | ''     |
| source        | 资源文件，详情见 [videojs](https://docs.videojs.com/tutorial-options.html#sources)                                   | Array                             | []     |
| autoplay      | 播放器准备好之后，是否自动播放                                                                                       | Boolean                           | false  |
| loop          | 是否循环播放                                                                                                         | Boolean                           | false  |
| muted         | 是否静音                                                                                                             | Boolean                           | false  |
| preload       | 预加载('auto':自动; 'metadata':元数据信息,比如视频长度，尺寸等; 'none':不预加载任何数据，直到用户开始播放才开始下载) | Enum {'auto', 'none', 'metadata'} | 'auto' |
| download      | 是否显示下载按钮                                                                                                     | Boolean                           | false  |
| downloadSrc   | 下载地址                                                                                                             | String                            | ''     |
| bigPlayButton | 是否显示开始大按钮                                                                                                   | Boolean                           | true   |
| keepFocus     | 是否保持视频聚焦。多个视频同时播放时会抢夺焦点，建议关闭                                                             | Boolean                           | true   |

#### 方法

| 名称           | 描述               |
| -------------- | ------------------ |
| getVideoPlayer | 获取视频播放器对象 |

更多 videojs 配置项及配置项详情，请查看 [`videojs配置`](https://docs.videojs.com/tutorial-options.html#standard-video-element-options)。

## FAQ

- VideoViewer.Video 是基于 [videojs](https://docs.videojs.com/)实现, 如有配置疑问，请参考[videojs 文档](https://docs.videojs.com/)
- 如果有特殊需求，也可以使用原生 video 标签或者第三方视频组件代替 VideoViewer.Video 作为模态框内容。
- 确保视频文件路径或链接正确，支持的视频格式包括 MP4、WebM 等。
- 针对移动端，考虑兼容性和性能问题。
- 根据需要，可选择添加自定义控制按钮或样式。

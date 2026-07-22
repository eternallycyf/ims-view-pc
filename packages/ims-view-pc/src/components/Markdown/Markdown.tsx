import { CodeHighlighter, Welcome } from '@ant-design/x'
import type { ComponentProps, XMarkdownProps } from '@ant-design/x-markdown'
import XMarkdown from '@ant-design/x-markdown'
import latexExtensionsFactory from '@ant-design/x-markdown/plugins/Latex/index.js'
import { Image as AntdImage, Skeleton, Tooltip } from 'antd'
import React, { memo, useEffect, useMemo, useState } from 'react'
import './index.less'
import '@ant-design/x-markdown/themes/light.css'
import { variables } from '../../styles/variables'

/**
 * 超过该长度时默认 defer 到空闲帧一次性解析，避免主线程长时间阻塞。
 * 旧版按字符切片 + 反复 parse 对大表格反而更慢，故默认改为 deferred。
 */
const LARGE_CONTENT_DEFER_THRESHOLD = 1800

export type MarkdownRenderMode = 'auto' | 'immediate' | 'deferred' | 'typewriter'

/** 在浏览器空闲时调度，不支持 requestIdleCallback 时回退 setTimeout(0) */
function scheduleIdleTask(cb: () => void): () => void {
  if (typeof requestIdleCallback === 'function') {
    const id = requestIdleCallback(cb, { timeout: 120 })
    return () => cancelIdleCallback(id)
  }
  const id = window.setTimeout(cb, 0)
  return () => window.clearTimeout(id)
}

/** 图片加载失败占位（极小透明 PNG，避免把大 base64 打进 bundle） */
const MARKDOWN_IMAGE_FALLBACK =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

export type CustomImageProps = ComponentProps | (React.ComponentPropsWithoutRef<'img'> & { node?: unknown })

function isXMarkdownComponentProps(p: CustomImageProps): p is ComponentProps {
  return typeof p === 'object' && p !== null && 'domNode' in p
}

function resolveMarkdownImageSrc(src: string | undefined) {
  if (!src) return undefined
  if (/^(https?:|data:|blob:)/i.test(src)) return src
  return src
}

function styleStringToObject(style: string): React.CSSProperties {
  const out: Record<string, string> = {}
  for (const segment of style.split(';')) {
    const idx = segment.indexOf(':')
    if (idx === -1) continue
    const rawKey = segment.slice(0, idx).trim()
    const val = segment.slice(idx + 1).trim()
    if (!rawKey || !val) continue
    const camel = rawKey.replace(/-([a-z])/gi, (_, c: string) => c.toUpperCase())
    out[camel] = val
  }
  return out as React.CSSProperties
}

function sanitizeElementProps(props: ComponentProps): Record<string, unknown> {
  const { domNode: _d, streamStatus: _s, lang: _l, block: _b, style, ...rest } = props
  let nextStyle: React.CSSProperties | undefined
  const rawStyle = style as unknown
  if (typeof rawStyle === 'string') {
    nextStyle = rawStyle.trim() ? styleStringToObject(rawStyle) : undefined
  } else if (rawStyle && typeof rawStyle === 'object') {
    nextStyle = rawStyle as React.CSSProperties
  }
  return { ...rest, ...(nextStyle ? { style: nextStyle } : {}) }
}

/** XMarkdown 的 `img` 与历史 `<img>` 用法统一入口（外部已引用 CustomImage） */
export function CustomImage(props: CustomImageProps) {
  if (isXMarkdownComponentProps(props)) {
    const { src, alt, className, children: _ch, ...rest } = sanitizeElementProps(props)
    const imageUrl = resolveMarkdownImageSrc(typeof src === 'string' ? src : undefined)
    return (
      <AntdImage
        {...(rest as React.ComponentProps<typeof AntdImage>)}
        className={className as string | undefined}
        src={imageUrl}
        alt={typeof alt === 'string' ? alt : undefined}
        fallback={MARKDOWN_IMAGE_FALLBACK}
      />
    )
  }
  const { src, alt, ...restProps } = props
  const imageUrl = resolveMarkdownImageSrc(src)
  return (
    <AntdImage
      {...(restProps as React.ComponentProps<typeof AntdImage>)}
      src={imageUrl}
      alt={alt}
      fallback={MARKDOWN_IMAGE_FALLBACK}
    />
  )
}


function MarkdownMultiImage(props: ComponentProps) {
  const { children, ...imageProps } = props
  return (
    <>
      <CustomImage {...imageProps} />
      {children}
    </>
  )
}

const CustomCode: React.FC<ComponentProps> = (props) => {
  const { className, children } = props
  const lang = className?.match(/language-(\w+)/)?.[1] || ''

  if (typeof children !== 'string') return null
  return <CodeHighlighter lang={lang}>{children}</CodeHighlighter>
}

function MarkdownWelcome(props: ComponentProps) {
  const p = props as Record<string, unknown>
  return (
    <Welcome
      styles={{ icon: { flexShrink: 0 } }}
      icon={p['data-icon'] as string | undefined}
      title={p.title as string | undefined}
      description={p['data-description'] as string | undefined}
    />
  )
}

const IncompleteImageSkeleton = () => <Skeleton.Image active style={{ width: 60, height: 60 }} />
const IncompleteTableSkeleton = () => <Skeleton.Node active style={{ width: 160 }} />
const IncompleteHtmlSkeleton = () => <Skeleton.Node active style={{ width: 383, height: 120 }} />

function IncompleteLink(props: ComponentProps) {
  const text = decodeURIComponent(String(props['data-raw'] || ''))
  const linkTextMatch = text.match(/^\[([^\]]*)\]/)
  const displayText = linkTextMatch ? linkTextMatch[1] : text.slice(1)
  return (
    <a style={{ pointerEvents: 'none' }} href="#">
      {displayText}
    </a>
  )
}

function IncompleteEmphasis(props: ComponentProps) {
  const text = decodeURIComponent(String(props['data-raw'] || ''))
  const match = text.match(/^([*_]{1,3})([^*_]*)/)
  if (!match || !match[2]) return null
  const [, symbols, content] = match
  const level = symbols.length
  if (level === 1) return <em>{content}</em>
  if (level === 2) return <strong>{content}</strong>
  if (level === 3)
    return (
      <em>
        <strong>{content}</strong>
      </em>
    )
  return null
}

function IncompleteInlineCode(props: ComponentProps) {
  const rawData = String(props['data-raw'] || '')
  if (!rawData) return null
  const decodedText = decodeURIComponent(rawData).slice(1)
  return <code className="inline-code">{decodedText}</code>
}

const MarkdownTable = memo(function MarkdownTable(props: ComponentProps) {
  const { children: rawChildren, ...rest } = sanitizeElementProps(props)
  const children = rawChildren as React.ReactNode
  return (
    <div className="reference-markdown-table-wrapper">
      <table {...(rest as React.HTMLAttributes<HTMLTableElement>)}>{children}</table>
    </div>
  )
})

/** 从单元格 ReactNode 提取纯文本，供 Tooltip 展示 */
function extractReactNodeText(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractReactNodeText).join('')
  if (React.isValidElement(node)) {
    return extractReactNodeText((node.props as { children?: React.ReactNode }).children)
  }
  return ''
}

function mergeTableCellClassName(className: unknown) {
  return ['markdown-table-cell', className].filter(Boolean).join(' ')
}

/** 单元格内容省略 + Tooltip（样式在 td/th 上约束宽度，避免 table max-content 撑开） */
function renderMarkdownTableCell(Tag: 'th' | 'td', props: ComponentProps) {
  const sanitized = sanitizeElementProps(props)
  const { children: rawChildren, className, ...rest } = sanitized
  const children = rawChildren as React.ReactNode
  const text = extractReactNodeText(children)
  const cellProps = {
    ...(rest as React.HTMLAttributes<HTMLTableCellElement>),
    className: mergeTableCellClassName(className),
  }
  const inner = <span className="markdown-table-cell-ellipsis">{children}</span>

  return (
    <Tag {...cellProps}>
      {text.trim() ? (
        <Tooltip
          title={text}
          mouseEnterDelay={0.15}
          destroyTooltipOnHide
          overlayInnerStyle={{ maxWidth: 480, wordBreak: 'break-all' }}
        >
          {inner}
        </Tooltip>
      ) : (
        children
      )}
    </Tag>
  )
}

const MarkdownTr = memo(function MarkdownTr(props: ComponentProps) {
  const { children: rawChildren, ...rest } = sanitizeElementProps(props)
  const children = rawChildren as React.ReactNode
  return <tr {...(rest as React.HTMLAttributes<HTMLTableRowElement>)}>{children}</tr>
})

const MarkdownTh = memo(function MarkdownTh(props: ComponentProps) {
  return renderMarkdownTableCell('th', props)
})

const MarkdownTd = memo(function MarkdownTd(props: ComponentProps) {
  return renderMarkdownTableCell('td', props)
})

const streamPlaceholderComponents: NonNullable<XMarkdownProps['components']> = {
  'incomplete-image': IncompleteImageSkeleton,
  'incomplete-link': IncompleteLink,
  'incomplete-table': IncompleteTableSkeleton,
  'incomplete-html': IncompleteHtmlSkeleton,
  'incomplete-emphasis': IncompleteEmphasis,
  'incomplete-inline-code': IncompleteInlineCode,
}

const defaultMarkdownComponents: NonNullable<XMarkdownProps['components']> = {
  ...streamPlaceholderComponents,
  img: CustomImage,
  multiimage: MarkdownMultiImage,
  multimage: MarkdownMultiImage,
  code: CustomCode,
  welcome: MarkdownWelcome,
  table: MarkdownTable,
  tr: MarkdownTr,
  th: MarkdownTh,
  td: MarkdownTd,
}

export type MarkdownProps = {
  content: string
  components?: XMarkdownProps['components']
  /**
   * 长文渲染策略。
   * - auto（默认）：短文本立即渲染；长文本 defer 到空闲帧一次性解析
   * - immediate：始终全量立即渲染
   * - deferred：始终 defer
   * - typewriter：打字机渐进（大表格场景慎用，会反复 parse）
   */
  renderMode?: MarkdownRenderMode
}

const MARKDOWN_MARKED_CONFIG: XMarkdownProps['config'] = {
  extensions: latexExtensionsFactory(),
}

function resolveMarkdownRenderMode(full: string, renderMode: MarkdownRenderMode): Exclude<MarkdownRenderMode, 'auto'> {
  if (renderMode !== 'auto') return renderMode
  return full.length > LARGE_CONTENT_DEFER_THRESHOLD ? 'deferred' : 'immediate'
}

const INCOMPLETE_MARKDOWN_COMPONENT_MAP: NonNullable<
  NonNullable<XMarkdownProps['streaming']>['incompleteMarkdownComponentMap']
> = {
  image: 'incomplete-image',
  link: 'incomplete-link',
  table: 'incomplete-table',
  html: 'incomplete-html',
  emphasis: 'incomplete-emphasis',
  'inline-code': 'incomplete-inline-code',
}

function useMarkdownRender(full: string, renderMode: MarkdownRenderMode = 'auto') {
  const mode = resolveMarkdownRenderMode(full, renderMode)
  const [deferredReady, setDeferredReady] = useState(mode !== 'deferred')
  const [revealedLen, setRevealedLen] = useState(() => (mode === 'typewriter' ? 0 : full.length))

  useEffect(() => {
    if (mode !== 'deferred') {
      setDeferredReady(true)
      return
    }

    setDeferredReady(false)
    return scheduleIdleTask(() => setDeferredReady(true))
  }, [full, mode])

  useEffect(() => {
    if (mode !== 'typewriter') {
      setRevealedLen(full.length)
      return
    }

    let cancelled = false
    let len = 0
    let last = 0

    setRevealedLen(0)

    const perFrame = Math.max(64, Math.min(260, Math.ceil(full.length / 32)))

    const tick = () => {
      if (cancelled) return

      const now = performance.now()

      if (now - last > 50) {
        last = now
        len = Math.min(full.length, len + perFrame)
        setRevealedLen(len)
      }

      if (len < full.length) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)

    return () => {
      cancelled = true
    }
  }, [full, mode])

  const pending = mode === 'deferred' && !deferredReady
  const display = mode === 'typewriter' ? full.slice(0, revealedLen) : pending ? '' : full
  const inProgress = mode === 'typewriter' && revealedLen < full.length

  const streaming = useMemo((): XMarkdownProps['streaming'] | undefined => {
    if (!inProgress) return undefined
    return {
      enableAnimation: true,
      hasNextChunk: true,
      tail: true,
      incompleteMarkdownComponentMap: INCOMPLETE_MARKDOWN_COMPONENT_MAP,
    }
  }, [inProgress])

  return { display, streaming, pending }
}

export const Markdown = memo(function Markdown(props: MarkdownProps) {
  const { content, components, renderMode = 'auto' } = props
  const normalizedContent = useMemo(() => String(content ?? '').replace(/\r\n/g, '\n'), [content])
  const { display, streaming, pending } = useMarkdownRender(normalizedContent, renderMode)
  const token = variables

  const mergedComponents = useMemo(
    () => ({
      ...defaultMarkdownComponents,
      ...components,
    }),
    [components],
  )

  const customVars = useMemo(
    () =>
      ({
        '--primary-color': token?.colorPrimary,
        '--primary-color-hover': token?.colorPrimaryHover,
        '--border-color': token?.colorBorderSecondary,
      }) as React.CSSProperties,
    [token?.colorBorderSecondary, token?.colorPrimary, token?.colorPrimaryHover],
  )

  return (
    <div className="reference-markdown markdown-body h-full w-full">
      {pending ? <Skeleton active paragraph={{ rows: 10 }} className="reference-markdown-pending" /> : null}
      {!pending ? (
        <XMarkdown
          style={customVars}
          className="x-markdown-light x-markdown-custom h-full w-full"
          content={display}
          components={mergedComponents}
          streaming={streaming}
          config={MARKDOWN_MARKED_CONFIG}
          paragraphTag="div"
          openLinksInNewTab
          dompurifyConfig={{ ADD_ATTR: ['icon', 'description'] }}
        />
      ) : null}
    </div>
  )
})

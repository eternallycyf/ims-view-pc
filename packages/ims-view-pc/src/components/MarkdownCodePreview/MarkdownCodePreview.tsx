import React, { forwardRef, useCallback, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'
import clsx from 'classnames'
import MdEditor from 'react-markdown-editor-lite'
import type { XMarkdownProps } from '@ant-design/x-markdown'
import 'react-markdown-editor-lite/lib/index.css'
import { Markdown } from '../Markdown'
import '../Markdown/index.less'
import './index.less'

/** 超过该长度时，进入编辑器默认收起右侧 HTML 预览（避免首屏 XMarkdown 过重） */
const LONG_MD_DEFAULT_HIDE_HTML_PREVIEW = 5000

export type MarkdownCodePreviewProps = {
  /** 受控 Markdown 文本 */
  value?: string
  /** 非受控初始内容 */
  defaultValue?: string
  /** Form.Item / 受控：`string => void` */
  onChange?: (markdown: string) => void
  className?: string
  style?: React.CSSProperties
  /** 与 antd `Form.Item` 的 `disabled` 对齐 */
  disabled?: boolean
  readOnly?: boolean
  placeholder?: string
  /** 传给预览区 `Markdown`（XMarkdown 自定义标签映射，如知识库内链 `a`） */
  markdownComponents?: XMarkdownProps['components']
  /**
   * 编辑器区域高度（默认 min-height 见样式）
   * @example 480、'50vh'
   */
  height?: number | string
  /** 透传 `react-markdown-editor-lite`（不含 value / onChange / renderHTML） */
  mdEditorProps?: Omit<
    React.ComponentProps<typeof MdEditor>,
    'value' | 'defaultValue' | 'onChange' | 'renderHTML' | 'readOnly'
  >
}

export type MarkdownCodePreviewHandle = {
  /** 当前 Markdown 源码 */
  getMarkdown: () => string
  /** 预览区渲染后的 HTML 字符串（由 MdEditor 生成） */
  getHtml: () => string
  /** 设置全文并触发变更（勿在 onChange 内调用） */
  setMarkdown: (markdown: string) => void
}

function normalizeMd(s: string) {
  return String(s ?? '').replace(/\r\n/g, '\n')
}

export const MarkdownCodePreview = forwardRef<MarkdownCodePreviewHandle, MarkdownCodePreviewProps>(
  function MarkdownCodePreview(props, ref) {
    const {
      value: valueProp,
      defaultValue = '',
      onChange,
      className,
      style,
      disabled = false,
      readOnly = false,
      placeholder,
      markdownComponents,
      height,
      mdEditorProps,
    } = props

    const {
      className: mdLiteClassName,
      style: mdLiteStyle,
      view: userViewFromProps,
      ...restMdEditorProps
    } = mdEditorProps ?? {}

    const isControlled = valueProp !== undefined
    const [internalValue, setInternalValue] = useState(() => normalizeMd(defaultValue))

    const markdown = isControlled ? normalizeMd(valueProp) : internalValue

    const editorRef = useRef<React.ElementRef<typeof MdEditor> | null>(null)

    const [panelView, setPanelView] = useState(() => ({
      menu: true,
      md: true,
      html: true,
    }))

    const longPreviewCollapsedRef = useRef(false)
    useLayoutEffect(() => {
      if (longPreviewCollapsedRef.current) return
      if (markdown.length <= LONG_MD_DEFAULT_HIDE_HTML_PREVIEW) return
      longPreviewCollapsedRef.current = true
      setPanelView((v) => ({ ...v, html: false }))
      requestAnimationFrame(() => {
        const inst = editorRef.current as unknown as {
          setView?: (p: { html?: boolean }) => void
        } | null
        inst?.setView?.({ html: false })
      })
    }, [markdown])

    const handleChange = useCallback(
      ({ text }: { html: string; text: string }) => {
        const next = normalizeMd(text)
        if (!isControlled) {
          setInternalValue(next)
        }
        onChange?.(next)
      },
      [isControlled, onChange],
    )

    useImperativeHandle(
      ref,
      () => ({
        getMarkdown: () => editorRef.current?.getMdValue() ?? markdown,
        getHtml: () => editorRef.current?.getHtmlValue() ?? '',
        setMarkdown: (md: string) => {
          editorRef.current?.setText(normalizeMd(md))
        },
      }),
      [markdown],
    )

    const renderHTML = useCallback(
      (plainText: string) => {
        return (
          <div className="markdown-code-preview__html-root">
            <Markdown content={plainText} components={markdownComponents} />
          </div>
        )
      },
      [markdownComponents],
    )

    const mergedStyle = useMemo(() => {
      const h = height ?? undefined
      return {
        ...style,
        ...(h !== undefined ? { height: typeof h === 'number' ? `${h}px` : h } : {}),
      }
    }, [height, style])

    const readOnlyMerged = disabled || readOnly

    return (
      <div className={clsx('markdown-body', 'markdown-code-preview-wrap', className)}>
        <MdEditor
          {...restMdEditorProps}
          ref={editorRef}
          value={markdown}
          readOnly={readOnlyMerged}
          placeholder={placeholder}
          renderHTML={renderHTML}
          onChange={handleChange}
          view={{ ...panelView, ...userViewFromProps }}
          htmlClass={clsx('custom-html-style', 'markdown-code-preview__html-pane')}
          className={clsx('markdown-code-preview__editor-lite', mdLiteClassName)}
          style={{ ...mdLiteStyle, ...mergedStyle }}
        />
      </div>
    )
  },
)

MarkdownCodePreview.displayName = 'MarkdownCodePreview'

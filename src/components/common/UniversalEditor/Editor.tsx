/**
 * @desc General universal editor
 * @author Surmon <https://github.com/surmon-china>
 */

import classnames from 'classnames'
import React, { useRef, useState, useMemo, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import { Button, Select, Space, Typography, Spin } from 'antd'
import * as Icon from '@ant-design/icons'
import Editor from '@monaco-editor/react'
import { saveFile } from '@/services/file'
import { timestampToYMD } from '@/transforms/date'
import { markdownToHTML } from '@/transforms/markdown'
import { editor, KeyMod, KeyCode } from './monaco'
import { UEditorLanguage, UEditorLanguages, UEditorLanguageMap, setUEditorCache } from './shared'

import styles from './style.module.less'

export * from './shared'

export interface UniversalEditorProps {
  value?: string
  onChange?(value?: string): void
  placeholder?: string
  disbaled?: boolean
  loading?: boolean
  /** 编辑器高度（行数） */
  rows?: number
  /** 编辑区域唯一 ID，默认为 `window.location.pathname` */
  eid?: string
  /** 初始化使用语言 */
  defaultLanguage?: UEditorLanguage
  /** 是否禁用顶部工具栏 */
  disabledToolbar?: boolean
  /** 是否禁用编辑器 minimap */
  disabledMinimap?: boolean
  /** 是否禁用草稿缓存 */
  disabledCacheDraft?: boolean
  /** 自定义 Toolbar 扩展渲染 */
  renderToolbarExtra?(language: UEditorLanguage): React.ReactNode
  /** 是否在 UI 上响应 Form 状态 */
  formStatus?: boolean
  style?: React.CSSProperties
}

export const UniversalEditor: React.FC<UniversalEditorProps> = (props) => {
  const placeholder = props.placeholder ?? '请输入内容...'
  const propValue = props.value ?? ''
  const editorID = props.eid || window.location.pathname
  const ueditor = useRef<editor.IStandaloneCodeEditor>()
  const [isFullscreen, setFullscreen] = useState(false)
  const [isPreviewing, setPreviewing] = useState<boolean>(false)
  const [language, setLanguage] = useState<UEditorLanguage>(
    props.defaultLanguage || UEditorLanguage.Markdown
  )

  const editorOptions: editor.IStandaloneEditorConstructionOptions = useMemo(() => {
    return {
      tabSize: 2,
      fontSize: 14,
      lineHeight: 24,
      smoothScrolling: true,
      readOnly: Boolean(props.disbaled),
      minimap: {
        enabled: !props.disabledMinimap
      },
      folding: true, // 文件夹
      contextmenu: false, // 禁用右键菜单
      roundedSelection: false, // 选中区域直角
      scrollBeyondLastLine: false, // 底部不留空
      wordBasedSuggestions: true, // 根据已有单词自动提示
      acceptSuggestionOnEnter: 'on', // 回车命中选中词
      scrollbar: {
        // `alwaysConsumeMouseWheel: false` 用于确保滚动事件始终可冒泡至外层
        // MARK: updateOptions 对 scrollbar.alwaysConsumeMouseWheel 暂时是无效的
        // https://github.com/suren-atoyan/monaco-react/issues/262
        // https://github.com/microsoft/monaco-editor/issues/859
        alwaysConsumeMouseWheel: false
      }
    }
  }, [props.disbaled, props.disabledMinimap])

  const editorHeight = useMemo<React.CSSProperties>(() => {
    const rows = props.rows || 34
    const lineHeight = editorOptions.lineHeight || 24
    return { height: isFullscreen ? '100%' : `${rows * lineHeight}px` }
  }, [props.rows, editorOptions.lineHeight, isFullscreen])

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    ueditor.current = editor
    // Only bind command when editor is focused.
    // https://github.com/microsoft/monaco-editor/issues/2947#issuecomment-1422265201
    ueditor.current.onDidFocusEditorText(() => {
      // Command + S = save content
      ueditor.current?.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, handleSaveContent)
      // Esc = exit fullscreen
      ueditor.current?.addCommand(KeyCode.Escape, () => setFullscreen(false))
    })
  }

  const handleContentChange = (newValue?: string) => {
    if (!props.disabledCacheDraft) {
      setUEditorCache(editorID, newValue || '')
    }
    props.onChange?.(newValue)
  }

  const handleSaveContent = () => {
    const time = timestampToYMD(Date.now())
    const fileExt = UEditorLanguageMap.get(language)!.ext
    const fileName = `${editorID}-${time}.${fileExt}`
    saveFile(propValue, fileName)
  }

  // effects when fullscreen change
  useEffect(() => {
    if (isFullscreen) {
      ueditor.current?.focus()
      document.body.classList.add('fullscreen')
    } else {
      document.body.classList.remove('fullscreen')
    }
  }, [isFullscreen])

  return (
    <div
      style={props.style}
      className={classnames(
        styles.universalEditor,
        props.formStatus && styles.formStatus,
        isFullscreen && styles.fullScreen
      )}
    >
      {!props.disabledToolbar && (
        <div className={styles.toolbar}>
          <Space className={styles.left} wrap>
            <Typography.Text type="secondary" strong={true} className={styles.logo}>
              UEditor
            </Typography.Text>
            <Button
              size="small"
              disabled={props.disbaled}
              icon={<Icon.DownloadOutlined />}
              onClick={handleSaveContent}
            />
          </Space>
          <Space className={styles.right} wrap>
            {props.renderToolbarExtra?.(language)}
            {language === UEditorLanguage.Markdown && (
              <Button
                size="small"
                disabled={props.disbaled}
                icon={isPreviewing ? <Icon.EyeInvisibleOutlined /> : <Icon.EyeOutlined />}
                onClick={() => setPreviewing(!isPreviewing)}
              />
            )}
            <Select
              size="small"
              className={styles.language}
              value={language}
              onChange={setLanguage}
              disabled={props.disbaled || isPreviewing}
              options={UEditorLanguages.map((lang) => ({
                label: lang.name,
                value: lang.id
              }))}
            />
            <Button
              size="small"
              disabled={props.disbaled}
              icon={isFullscreen ? <Icon.FullscreenExitOutlined /> : <Icon.FullscreenOutlined />}
              onClick={() => setFullscreen(!isFullscreen)}
            />
          </Space>
        </div>
      )}
      <Spin
        spinning={Boolean(props.loading)}
        indicator={<Icon.LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        <div className={styles.container}>
          <Editor
            // for editor wrapper <section>
            wrapperProps={{
              'data-placeholder': placeholder,
              'data-nonempty': Boolean(propValue),
              className: styles.editorWrapper,
              style: {
                width: isPreviewing ? '50%' : '100%',
                ...editorHeight
              }
            }}
            // for manaco editor
            className={styles.editor}
            theme="vs-dark"
            language={language}
            value={propValue}
            options={editorOptions}
            onChange={handleContentChange}
            onMount={handleEditorDidMount}
          />
          <CSSTransition
            in={isPreviewing}
            timeout={200}
            unmountOnExit={true}
            classNames="fade-fast"
          >
            <div className={classnames(styles.preview)}>
              <div
                className={styles.markdown}
                dangerouslySetInnerHTML={{
                  __html: markdownToHTML(propValue)
                }}
              ></div>
            </div>
          </CSSTransition>
        </div>
      </Spin>
    </div>
  )
}

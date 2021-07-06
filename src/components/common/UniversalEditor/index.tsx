import { debounce } from 'lodash';
import classnames from 'classnames';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useWatch } from '@/veact';
import { Button, Select, Space, Typography, Spin } from 'antd';
import {
  FullscreenOutlined,
  DownloadOutlined,
  EyeOutlined,
  LoadingOutlined,
  EyeInvisibleOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons';
import { useGeneralState } from '@/state/general';
import { saveFile } from '@/services/file';
import storage from '@/services/storage';
import { timestampToYMD } from '@/transformers/date';
import { markdownToHTML } from '@/transformers/markdown';
import { editor, KeyMod, KeyCode } from './monaco';

import styles from './style.module.less';

export enum UEditorLanguage {
  Markdown = 'markdown',
  Json = 'json',
}
const fileExtMap = new Map([
  [UEditorLanguage.Markdown, 'md'],
  [UEditorLanguage.Json, 'json'],
]);

const TOOLBAR_HEIGHT = 48;
const SINGLE_LINE_HEIGHT = 24;
const MIN_ROWS = 34;
const MAX_ROWS = 40;

const getEditorCacheStorageKey = (id: string) => {
  return `ueditor-${id}`;
};

const setUEditorCache = debounce((id: string, content: string) => {
  return storage.set(getEditorCacheStorageKey(id), content);
}, 666);

export const getUEditorCache = (id: string) => {
  return storage.get(getEditorCacheStorageKey(id));
};

export interface UniversalEditorProps {
  value?: string;
  onChange?(value?: string): void;
  placeholder?: string;
  disbaled?: boolean;
  loading?: boolean;
  minRows?: number;
  maxRows?: number;
  // 编辑区域唯一 ID，默认为 window.location.pathname
  cacheID?: string | false;
  /** 是否禁用顶部工具栏 */
  disabledToolbar?: boolean;
  /** 是否禁用编辑器 minimap */
  disabledMinimap?: boolean;
  /** 是否禁用草稿缓存 */
  disabledCacheDraft?: boolean;
  /** 是否在 UI 上响应 Form 状态 */
  formStatus?: boolean;
  language?: UEditorLanguage;
  style?: React.CSSProperties;
}
export const UniversalEditor: React.FC<UniversalEditorProps> = (props) => {
  const placeholder = props.placeholder || '请输入内容...';
  const propValue = props.value || '';
  const cacheID = props.cacheID || window.location.pathname;
  const generalState = useGeneralState();
  const containerRef = useRef<HTMLDivElement>(null);
  const ueditor = useRef<editor.IStandaloneCodeEditor>();
  const [isPreview, setPreview] = useState<boolean>(false);
  const [language, setLanguage] = useState<UEditorLanguage>(
    props.language || UEditorLanguage.Markdown
  );

  const handleSaveContent = () => {
    const time = timestampToYMD(Date.now());
    const fileExt = fileExtMap.get(language);
    const fileName = `${cacheID}-${time}.${fileExt}`;
    saveFile(propValue, fileName);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleResizeWidth = () => {
    const widthRatio = isPreview ? 0.5 : 1;
    const layoutInfo = ueditor.current?.getLayoutInfo()!;
    ueditor.current?.layout({
      width: generalState.data.fullscreen
        ? window.innerWidth * widthRatio
        : containerRef.current!.clientWidth * widthRatio,
      height: layoutInfo.height,
    });
  };

  const handleResizeHeight = useCallback(() => {
    if (!ueditor.current) {
      return false;
    }

    const layoutInfo = ueditor.current.getLayoutInfo()!;
    let targetHeight: number = 0;

    if (generalState.data.fullscreen) {
      targetHeight = window.innerHeight - TOOLBAR_HEIGHT;
    } else {
      // 非全屏，则计算高度
      const maxHeight = (props.maxRows ?? MAX_ROWS) * SINGLE_LINE_HEIGHT;
      const minHeight = (props.minRows ?? MIN_ROWS) * SINGLE_LINE_HEIGHT;
      const contentHeight = ueditor.current.getContentHeight()!;
      const lineCount = ueditor.current.getModel()?.getLineCount()!;
      if (contentHeight) {
        if (contentHeight > maxHeight) {
          targetHeight = maxHeight;
        } else {
          const linesHeight = lineCount * SINGLE_LINE_HEIGHT;
          if (linesHeight < minHeight) {
            targetHeight = minHeight;
          } else {
            targetHeight = linesHeight;
          }
        }
      }
    }

    if (layoutInfo.height !== targetHeight) {
      ueditor.current.layout({
        width: layoutInfo.width,
        height: targetHeight,
      });
    }
  }, [generalState.data.fullscreen, props.maxRows, props.minRows]);

  const createEditor = () => {
    const ueditor = editor.create(containerRef.current!, {
      value: propValue,
      language: language,
      theme: 'vs-dark',
      tabSize: 2,
      fontSize: 14,
      lineHeight: SINGLE_LINE_HEIGHT,
      smoothScrolling: true,
      readOnly: Boolean(props.disbaled),
      minimap: {
        enabled: !props.disabledMinimap,
      },
      // 性能不好，非完全受控 > 不使用
      // automaticLayout: true,
      // 文件夹
      folding: true,
      // 禁用右键菜单
      contextmenu: false,
      // 选中区域直角
      roundedSelection: false,
      // 底部不留空
      scrollBeyondLastLine: false,
      // 根据已有单词自动提示
      wordBasedSuggestions: true,
      // 回车命中选中词
      acceptSuggestionOnEnter: 'on',
      scrollbar: {
        // MARK: updateOptions 对 scrollbar.alwaysConsumeMouseWheel 暂时是无效的
        // https://github.com/microsoft/vscode/pull/127788
        // 滚动事件可冒泡至外层
        alwaysConsumeMouseWheel: false,
      },
    });

    // Command + S = save content
    ueditor.addCommand(KeyMod.CtrlCmd | KeyCode.KEY_S, handleSaveContent);
    return ueditor;
  };

  // fullscreen change
  useWatch(
    () => generalState.data,
    () => handleResizeHeight()
  );

  // preview change
  useEffect(() => {
    handleResizeWidth();
  }, [handleResizeWidth, isPreview]);

  // language change
  useEffect(() => {
    const model = ueditor.current?.getModel();
    if (model && language) {
      editor.setModelLanguage(model, language);
    }
  }, [language]);

  // disbaled change
  useEffect(() => {
    ueditor.current?.updateOptions({ readOnly: props.disbaled });
  }, [props.disbaled]);

  // prop value change
  useEffect(() => {
    if (props.value !== ueditor.current?.getValue()) {
      ueditor.current?.setValue(props.value || '');
    }
  }, [props.value]);

  useEffect(() => {
    ueditor.current = createEditor();
    // content height change
    const sizeDisposer = ueditor.current.onDidContentSizeChange(handleResizeHeight);
    // editor value change
    const modelDisposer = ueditor.current.onDidChangeModelContent(() => {
      const newValue = ueditor.current!.getValue();
      if (!props.disabledCacheDraft) {
        setUEditorCache(cacheID, newValue);
      }
      if (newValue !== props.value) {
        props.onChange?.(newValue);
      }
    });

    return () => {
      sizeDisposer.dispose();
      modelDisposer.dispose();
      ueditor.current?.dispose?.();
    };
  }, []);

  return (
    <div
      style={props.style}
      className={classnames(
        styles.universalEditor,
        props.formStatus && styles.formStatus,
        generalState.data.fullscreen && styles.fullScreen
      )}
    >
      {!props.disabledToolbar && (
        <div className={styles.toolbar}>
          <Space className={styles.left}>
            <Typography.Text type="secondary" strong={true} className={styles.logo}>
              UEditor
            </Typography.Text>
            <Button
              size="small"
              disabled={props.disbaled}
              icon={<DownloadOutlined />}
              onClick={handleSaveContent}
            />
          </Space>
          <Space className={styles.right}>
            {language === UEditorLanguage.Markdown && (
              <Button
                size="small"
                disabled={props.disbaled}
                icon={isPreview ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                onClick={() => setPreview(!isPreview)}
              />
            )}
            <Select
              size="small"
              value={language}
              onChange={setLanguage}
              disabled={props.disbaled}
              className={styles.language}
              options={[
                {
                  label: 'Markdown',
                  value: UEditorLanguage.Markdown,
                },
                {
                  label: 'Json',
                  value: UEditorLanguage.Json,
                },
              ]}
            />
            <Button
              size="small"
              disabled={props.disbaled}
              icon={
                generalState.data.fullscreen ? (
                  <FullscreenExitOutlined />
                ) : (
                  <FullscreenOutlined />
                )
              }
              onClick={() => generalState.setFullscreen(!generalState.data.fullscreen)}
            />
          </Space>
        </div>
      )}
      <Spin
        spinning={Boolean(props.loading)}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        <div className={styles.container}>
          <div
            id="container"
            ref={containerRef}
            className={classnames(styles.editor, !props.value && styles.placeholder)}
            placeholder={placeholder}
          ></div>
          <CSSTransition
            in={isPreview}
            timeout={200}
            unmountOnExit={true}
            classNames="fade-fast"
          >
            <div className={classnames(styles.preview)}>
              <div
                className={styles.markdown}
                dangerouslySetInnerHTML={{
                  __html: markdownToHTML(propValue),
                }}
              ></div>
            </div>
          </CSSTransition>
        </div>
      </Spin>
    </div>
  );
};

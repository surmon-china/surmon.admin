import classnames from 'classnames';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useWatch } from '@/veact';
import { Button, Select, Space, Drawer } from 'antd';
import {
  FullscreenOutlined,
  DownloadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons';
import { useGeneralState } from '@/state/general';
import { saveFile } from '@/services/file';
import { timestampToYMD } from '@/transformers/date';
import { markdownToHTML } from '@/transformers/markdown';
import { editor, KeyMod, KeyCode } from './monaco';

import styles from './style.module.less';

// TODO: 本地缓存

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

export interface UniversalEditorProps {
  value?: string;
  onChange?(value?: string): void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  cacheId?: string | false;
  disabledToolbar?: boolean;
  disabledMinimap?: boolean;
  language?: UEditorLanguage;
  style?: React.CSSProperties;
}
export const UniversalEditor: React.FC<UniversalEditorProps> = (props) => {
  const placeholder = props.placeholder || '请输入内容...';
  const generalState = useGeneralState();
  const containerRef = useRef<HTMLDivElement>(null);
  const ueditor = useRef<editor.IStandaloneCodeEditor>();
  const [isPreview, setPreview] = useState<boolean>(false);
  const [language, setLanguage] = useState<UEditorLanguage>(
    props.language || UEditorLanguage.Markdown
  );

  const handleSaveContent = () => {
    const content = props.value || '';
    const cacheId = props.cacheId || '';
    const shortContent = content.slice(0, 10);
    const time = timestampToYMD(Date.now());
    const fileExt = fileExtMap.get(language);
    const fileName = `${cacheId}-${shortContent}-${time}.${fileExt}`;
    saveFile(content, fileName);
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
      value: props.value || '',
      language: language,
      theme: 'vs-dark',
      tabSize: 2,
      fontSize: 14,
      lineHeight: SINGLE_LINE_HEIGHT,
      smoothScrolling: true,
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

  // value change
  useEffect(() => {
    ueditor.current?.executeEdits(null, [
      {
        text: props.value || '',
        range: ueditor.current?.getModel()?.getFullModelRange()!,
      },
    ]);
  }, [props.value]);

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

  useEffect(() => {
    ueditor.current = createEditor();
    // content height change
    const sizeDisposer = ueditor.current.onDidContentSizeChange(handleResizeHeight);
    // value change
    const modelDisposer = ueditor.current.onDidChangeModelContent(() => {
      const newValue = ueditor.current!.getValue();
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
      className={classnames(
        styles.universalEditor,
        generalState.data.fullscreen && styles.fullScreen
      )}
      style={props.style}
    >
      {!props.disabledToolbar && (
        <div className={styles.toolbar}>
          <Space className={styles.left}>
            {language === UEditorLanguage.Markdown && (
              <Button
                size="small"
                icon={isPreview ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                onClick={() => setPreview(!isPreview)}
              />
            )}
          </Space>
          <Space className={styles.right}>
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={handleSaveContent}
            />
            <Select
              size="small"
              value={language}
              onChange={setLanguage}
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
      <div className={styles.container}>
        <div
          id="container"
          ref={containerRef}
          className={classnames(styles.editor, !props.value && styles.placeholder)}
          placeholder={placeholder}
        ></div>
        <Drawer
          className={classnames(styles.preview)}
          width="50%"
          getContainer={false}
          closable={false}
          mask={false}
          destroyOnClose={true}
          visible={isPreview}
        >
          <div
            className={styles.markdown}
            dangerouslySetInnerHTML={{
              __html: isPreview ? markdownToHTML(props.value || '') : '',
            }}
          ></div>
        </Drawer>
      </div>
    </div>
  );
};

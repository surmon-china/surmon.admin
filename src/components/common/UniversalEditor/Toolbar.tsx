import React from 'react'
import { Button, Select, Space, Typography, Flex } from 'antd'
import * as Icon from '@ant-design/icons'
import { UnEditorLanguage, UnEditorLanguages } from './shared'
import { UniversalEditorProps } from './'

import styles from './style.module.less'

export interface EditorToolbarProps {
  title: string
  disbaled?: boolean
  language: UnEditorLanguage
  isPreviewing: boolean
  isFullscreen: boolean
  disabledLanguageSelect?: boolean
  onPressSaveContent(): void
  onLanguageChange(language: UnEditorLanguage): void
  onPreviewingChange(state: boolean): void
  onFullscreenChange(state: boolean): void
  renderToolbarExtra?: UniversalEditorProps['renderToolbarExtra']
}

export const EditorToolbar: React.FC<EditorToolbarProps> = (props) => {
  return (
    <Flex className={styles.editorToolbar} justify="space-between" align="center">
      <Space className={styles.left} wrap>
        <Typography.Text type="secondary" strong={true} className={styles.logo}>
          {props.title}
        </Typography.Text>
        <Button
          size="small"
          disabled={props.disbaled}
          icon={<Icon.DownloadOutlined />}
          onClick={props.onPressSaveContent}
        />
      </Space>
      <Space className={styles.right} wrap>
        {props.renderToolbarExtra?.(props.language)}
        {props.language === UnEditorLanguage.Markdown && (
          <Button
            size="small"
            disabled={props.disbaled}
            icon={props.isPreviewing ? <Icon.EyeInvisibleOutlined /> : <Icon.EyeOutlined />}
            onClick={() => props.onPreviewingChange?.(!props.isPreviewing)}
          />
        )}
        <Select
          size="small"
          className={styles.language}
          value={props.language}
          onChange={props.onLanguageChange}
          disabled={props.disbaled || props.isPreviewing || props.disabledLanguageSelect}
          options={UnEditorLanguages.map((lang) => ({
            label: lang.name,
            value: lang.id
          }))}
        />
        <Button
          size="small"
          disabled={props.disbaled}
          icon={
            props.isFullscreen ? <Icon.FullscreenExitOutlined /> : <Icon.FullscreenOutlined />
          }
          onClick={() => props.onFullscreenChange(!props.isFullscreen)}
        />
      </Space>
    </Flex>
  )
}

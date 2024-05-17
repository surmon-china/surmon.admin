import React from 'react'
import { Space, Typography, Flex, Divider, Tooltip } from 'antd'
import { SnippetsOutlined, NumberOutlined } from '@ant-design/icons'
import { useTranslation, Trans } from '@/i18n'
import { EditorStates } from './Core'

import styles from './style.module.less'

export interface EditorStatesBarProps {
  id: string
  states?: EditorStates
  enabledCache?: boolean
}

export const EditorStatesBar: React.FC<EditorStatesBarProps> = (props) => {
  const { i18n } = useTranslation()

  return (
    <Flex className={styles.editorStatesBar} justify="space-between" align="center">
      <Space size="small">
        {props.enabledCache ? (
          <Tooltip title={i18n.t('component.universal_editor.cacheable_title')}>
            <SnippetsOutlined className={styles.icon} />
          </Tooltip>
        ) : (
          <NumberOutlined className={styles.icon} />
        )}
        <Typography.Text type="secondary" className={styles.text}>
          {props.id}
        </Typography.Text>
      </Space>
      <div>
        <Typography.Text type="secondary" className={styles.text}>
          <Trans i18nKey="component.universal_editor.state.length" />
          <span> </span>
          {props.states?.length}
        </Typography.Text>
        <Divider type="vertical" />
        <Typography.Text type="secondary" className={styles.text}>
          <Trans i18nKey="component.universal_editor.state.line_count" />
          <span> </span>
          {props.states?.lineCount}
        </Typography.Text>
        <Divider type="vertical" />
        <Typography.Text type="secondary" className={styles.text}>
          <Trans i18nKey="component.universal_editor.state.selected_count" />
          <span> </span>
          {props.states?.selectedCount}
        </Typography.Text>
        <Divider type="vertical" />
        <Typography.Text type="secondary" className={styles.text}>
          <Trans i18nKey="component.universal_editor.state.selected_length" />
          <span> </span>
          {props.states?.selectedLength}
        </Typography.Text>
      </div>
    </Flex>
  )
}

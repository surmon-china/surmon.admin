/**
 * @file Disqus synchornize page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Card, Space } from 'antd'
import { APP_LAYOUT_SPACE_SIZE } from '@/config'
import { DisqusToNodePress } from './DisqusToNodePress'
import { NodePresstoDisqus } from './NodePresstoDisqus'

export const DisqusSynchronizePage: React.FC = () => {
  return (
    <Space direction="vertical" size={APP_LAYOUT_SPACE_SIZE} style={{ width: '100%' }}>
      <Card title="Synchronize NodePress to Disqus" variant="borderless">
        <NodePresstoDisqus />
      </Card>
      <Card title="Synchronize Disqus To NodePress" variant="borderless">
        <DisqusToNodePress />
      </Card>
    </Space>
  )
}

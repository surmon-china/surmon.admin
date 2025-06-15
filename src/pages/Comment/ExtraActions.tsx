import React from 'react'
import { useShallowReactive } from 'veact'
import { Button, Divider, Modal, Space, message } from 'antd'
import * as Icons from '@ant-design/icons'
import * as api from '@/apis/comment'
import { Comment } from '@/constants/comment'
import { getBlogGuestbookUrl } from '@/transforms/url'

export interface ExtraActionsProps extends React.PropsWithChildren {
  comments: Comment[]
  loading: boolean
}

export const ExtraActions: React.FC<ExtraActionsProps> = (props) => {
  const ipLocationTask = useShallowReactive({
    done: [] as string[],
    fail: [] as string[],
    todo: [] as string[],
    running: false
  })

  const runIPLocationTask = () => {
    const doRevise = async (commentId: string) => {
      try {
        await api.reviseCommentIPLocation(commentId)
        ipLocationTask.done.push(commentId)
      } catch (error) {
        ipLocationTask.fail.push(commentId)
      } finally {
        ipLocationTask.todo = ipLocationTask.todo.slice().filter((id) => id !== commentId)
      }
    }

    if (ipLocationTask.todo.length) {
      ipLocationTask.running = true
      doRevise(ipLocationTask.todo[0]).then(() => {
        // 延时 3 秒
        window.setTimeout(() => runIPLocationTask(), 3000)
      })
    } else {
      ipLocationTask.running = false
      const messages = [
        '任务结束',
        `done: ${ipLocationTask.done.length}`,
        `fail: ${ipLocationTask.fail.length}`
      ]
      message.info(messages.join('，'))
    }
  }

  const startComemntsIPLocationTask = () => {
    const todoCommentIds = props.comments
      .filter((c) => Boolean(c.ip) && !c.ip_location?.region_code)
      .map((c) => c._id!)
    if (todoCommentIds.length) {
      ipLocationTask.todo.push(...todoCommentIds)
      runIPLocationTask()
      message.info(`开始任务，共 ${todoCommentIds.length} 条数据`)
    } else {
      message.info('没有需要修正的数据')
    }
  }

  return (
    <Space wrap>
      <Space.Compact>
        {ipLocationTask.running && (
          <Button
            size="small"
            onClick={() => {
              Modal.info({
                title: '任务详情',
                content: JSON.stringify(ipLocationTask, null, 2)
              })
            }}
          >
            TODO: {ipLocationTask.todo.length}
            <Divider type="vertical" />
            DONE: {ipLocationTask.done.length}
            <Divider type="vertical" />
            FAIL: {ipLocationTask.fail.length}
          </Button>
        )}
        <Button
          size="small"
          icon={<Icons.GlobalOutlined />}
          disabled={ipLocationTask.running || props.loading}
          loading={ipLocationTask.running}
          onClick={() => startComemntsIPLocationTask()}
        >
          修正本页评论的 IP location 数据
        </Button>
      </Space.Compact>
      <Button
        type="primary"
        size="small"
        target="_blank"
        icon={<Icons.RocketOutlined />}
        href={getBlogGuestbookUrl()}
      >
        去留言板
      </Button>
    </Space>
  )
}

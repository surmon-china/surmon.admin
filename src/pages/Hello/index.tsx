/**
 * @file Login page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import { useReactive } from 'veact'
import { Spin } from 'antd'
import * as Icon from '@ant-design/icons'
import tokenService from '@/services/token'
import { useLoading } from 'veact-use'
import { authLogin } from '@/store/auth'
import { RouteKey, rc } from '@/routes'

import styles from './style.module.less'

export const HelloPage: React.FC = () => {
  const navigate = useNavigate()
  const loading = useLoading(false)
  const inputState = useReactive({
    value: '',
    isEdit: false
  })

  const toEditMode = () => {
    inputState.isEdit = true
  }

  const quitEdit = () => {
    inputState.isEdit = false
  }

  const login = (password: string) => {
    loading
      .promise(authLogin(password))
      .then((newAuth) => {
        tokenService.setToken(newAuth.access_token, newAuth.expires_in)
        navigate(rc(RouteKey.Dashboard).path)
      })
      .catch((error) => {
        console.warn('登陆系统失败！', error)
        return Promise.reject(error)
      })
  }

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    inputState.value = (event.target as any).value
  }

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Escape') {
      quitEdit()
    }
    if (event.key === 'Enter') {
      if (inputState.value) {
        login(inputState.value)
      }
    }
  }

  return (
    <div className={styles.helloPage}>
      <Spin spinning={loading.state.value} indicator={<Icon.LoadingOutlined />}>
        <SwitchTransition mode="out-in">
          <CSSTransition
            classNames="fade-fast"
            key={Number(inputState.isEdit)}
            addEndListener={(node, done) => {
              node.addEventListener('transitionend', done, false)
            }}
          >
            {inputState.isEdit ? (
              <input
                type="password"
                id="password"
                className={styles.input}
                autoComplete="true"
                autoFocus={true}
                disabled={loading.state.value}
                value={inputState.value}
                onInput={handleInputChange}
                onBlur={quitEdit}
                onKeyDownCapture={handleInputKeyDown}
              />
            ) : (
              <div className={styles.title} onClick={toEditMode} onTouchEnd={toEditMode}>
                🤘
              </div>
            )}
          </CSSTransition>
        </SwitchTransition>
      </Spin>
    </div>
  )
}

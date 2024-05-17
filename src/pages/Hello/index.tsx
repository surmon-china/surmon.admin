/**
 * @file Login page
 * @author Surmon <https://github.com/surmon-china>
 */

import classnames from 'classnames'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spin, Input } from 'antd'
import * as Icon from '@ant-design/icons'

import tokenService from '@/services/token'
import { RoutesKey, RoutesPath } from '@/routes'
import { authLogin } from '@/apis/auth'

import styles from './style.module.less'

export const HelloPage: React.FC = () => {
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('')
  const [isInputing, setInputing] = useState(false)
  const [isLoggingIn, setLoggingIn] = useState(false)

  const switchToInput = () => setInputing(true)
  const switchToIcon = () => setInputing(false)

  const login = async (password: string) => {
    try {
      setLoggingIn(true)
      const newAuth = await authLogin(password)
      tokenService.setToken(newAuth.access_token, newAuth.expires_in)
      navigate(RoutesPath[RoutesKey.Dashboard])
    } catch (error) {
      console.warn('Login failed！', error)
      return Promise.reject(error)
    } finally {
      setLoggingIn(false)
    }
  }

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Escape') {
      switchToIcon()
    }
    if (event.key === 'Enter') {
      if (inputValue) {
        login(inputValue)
      }
    }
  }

  const lockIcon = (
    <div className={styles.icon} onClick={switchToInput} onTouchEnd={switchToInput}>
      🔐
    </div>
  )

  const passwordInput = (
    <Input.Password
      className={styles.input}
      id="password"
      size="large"
      autoFocus={true}
      disabled={isLoggingIn}
      value={inputValue}
      visibilityToggle={false}
      onBlur={switchToIcon}
      onKeyDownCapture={handleInputKeyDown}
      onInput={(event) => setInputValue((event.target as any).value)}
    />
  )

  return (
    <div className={classnames(styles.helloPage, isInputing ? styles.inputing : styles.normal)}>
      <Spin spinning={isLoggingIn} indicator={<Icon.LoadingOutlined />}>
        {isInputing ? passwordInput : lockIcon}
      </Spin>
    </div>
  )
}

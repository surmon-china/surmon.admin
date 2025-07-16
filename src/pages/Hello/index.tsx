/**
 * @file Login page
 * @author Surmon <https://github.com/surmon-china>
 */

import classnames from 'classnames'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { Spin, Input } from 'antd'
import * as Icons from '@ant-design/icons'
import { RoutesKey, RoutesPath } from '@/routes'
import { authLogin } from '@/apis/admin'
import tokenService from '@/services/token'

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
      const { access_token, expires_in } = await authLogin(password)
      tokenService.setToken(access_token, expires_in)
      console.info('Login successful')
      navigate(RoutesPath[RoutesKey.Dashboard])
    } catch (error) {
      console.warn('Login failed！', error)
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
    <div className={styles.iconWrapper} onClick={switchToInput} onTouchEnd={switchToInput}>
      <Icons.LockOutlined className={classnames(styles.icon, styles.lockIcon)} />
      <Icons.UnlockOutlined className={classnames(styles.icon, styles.unlockIcon)} />
    </div>
  )

  const passwordInput = (
    <Input.Password
      className={styles.input}
      id="password"
      size="large"
      autoComplete="off"
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
      <Spin spinning={isLoggingIn} indicator={<Icons.LoadingOutlined />}>
        {isInputing ? passwordInput : lockIcon}
      </Spin>
    </div>
  )
}

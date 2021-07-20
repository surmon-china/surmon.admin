/**
 * @file Login page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react';
import { useHistory } from 'react-router-dom';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useReactive } from '@/veact/src';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import tokenService from '@/services/token';
import { useLoading } from '@/services/loading';
import { authLogin } from '@/store/auth';
import { RouteKey, rc } from '@/route';

import styles from './style.module.less';

export const HelloPage: React.FC = () => {
  const history = useHistory();
  const loading = useLoading(false);
  const inputState = useReactive({
    value: '',
    isEdit: false,
  });

  const toEditMode = () => {
    inputState.isEdit = true;
  };

  const quitEdit = () => {
    inputState.isEdit = false;
  };

  const login = (password: string) => {
    loading
      .promise(authLogin(password))
      .then((newAuth) => {
        tokenService.setToken(newAuth.access_token, newAuth.expires_in);
        history.push(rc(RouteKey.Dashboard).path);
      })
      .catch((error) => {
        console.warn('登陆系统失败！', error);
        return Promise.reject(error);
      });
  };

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    inputState.value = (event.target as any).value;
  };

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Escape') {
      quitEdit();
    }
    if (event.key === 'Enter') {
      if (inputState.value) {
        login(inputState.value);
      }
    }
  };

  return (
    <div className={styles.helloPage}>
      <Spin spinning={loading.state.value} indicator={<LoadingOutlined />}>
        <SwitchTransition mode="out-in">
          <CSSTransition
            classNames="fade-fast"
            key={Number(inputState.isEdit)}
            addEndListener={(node, done) => {
              node.addEventListener('transitionend', done, false);
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
              <div
                className={styles.title}
                onClick={toEditMode}
                onTouchEnd={toEditMode}
              >
                🤘
              </div>
            )}
          </CSSTransition>
        </SwitchTransition>
      </Spin>
    </div>
  );
};

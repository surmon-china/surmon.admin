/**
 * @desc App auth interceptor component
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRef, onMounted, onBeforeUnmount } from 'veact';
import { useLoading } from 'veact-use';
import { notification, Typography } from 'antd';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

import { RouteKey, rc } from '@/route';
import { renewalToken, checkTokenValidity } from '@/store/auth';
import {
  getTokenCountdown,
  setToken,
  removeToken,
  isTokenValid,
} from '@/services/token';

import styles from './style.module.less';

let renewalTimer: null | number = null;

export const AppAuth: React.FC = (props) => {
  const history = useHistory();
  const loading = useLoading();
  const isLogined = useRef(false);

  // 停止 Token 续约
  const stopRenewalToken = (): void => {
    if (typeof renewalTimer === 'number') {
      window.clearTimeout(renewalTimer);
    }
  };

  // 自动续约 Token
  const runRenewalToken = (): void => {
    stopRenewalToken();
    const countdown = getTokenCountdown();
    const seconds = countdown - 10;
    console.info(`Token 自动续约正在工作，Token 将在 ${seconds}s 后自动更新！`);
    renewalTimer = window.setTimeout(() => {
      renewalToken().then((auth) => {
        setToken(auth.access_token, auth.expires_in);
        runRenewalToken();
      });
    }, seconds * 1000);
  };

  onMounted(async () => {
    try {
      // 程序初始化时检查本地 Token
      console.info('Token 校验中...');
      // Token 本地校验
      await (isTokenValid() ? Promise.resolve() : Promise.reject('本地 Token 无效'));
      // Token 远程校验
      await loading.promise(checkTokenValidity());
      // 通过验证，则初始化 APP
      console.info('Token 验证成功，正常工作');
      // 开始自动续约 Token
      runRenewalToken();
      // 需要一个延时效果
      setTimeout(() => {
        isLogined.value = true;
      }, 668);
    } catch (error) {
      console.warn('Token 被验证是无效的，跳登陆页：', error);
      notification.info({
        message: '好久不见！',
        description: '你还好吗？',
      });
      removeToken();
      history.push(rc(RouteKey.Hello).path);
    }
  });

  onBeforeUnmount(() => {
    stopRenewalToken();
  });

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        classNames="fade"
        key={Number(isLogined.value)}
        addEndListener={(node, done) => {
          node.addEventListener('transitionend', done, false);
        }}
      >
        {isLogined.value ? (
          <div className={styles.authContainer}>{props.children}</div>
        ) : (
          <div className={styles.loading}>
            <div className={styles.animation}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <Typography.Text className={styles.text} disabled>
              {loading.state.value ? '校验 Token...' : '初始化...'}
            </Typography.Text>
          </div>
        )}
      </CSSTransition>
    </SwitchTransition>
  );
};

/**
 * @file App entry
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import ReactDOM from 'react-dom/client'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

import '@/styles/app.less'
import { App } from './App'

console.info('系统启动中...')

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)

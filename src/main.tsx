/**
 * @file App entry
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import ReactDOM from 'react-dom'

import '@/styles/app.less'

import { App } from './App'

console.info('系统启动中...')

ReactDOM.render(<App />, document.getElementById('root'))

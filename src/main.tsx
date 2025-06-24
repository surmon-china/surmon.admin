/**
 * @file App entry
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { APP_VERSION, APP_PRIMARY_LANGUAGE, VITE_MODE } from './config'
import { ThemeProvider, Theme } from '@/contexts/Theme'
import { LocaleProvider, Language } from '@/contexts/Locale'
import { initI18next } from './i18n'
import { locales } from './locales'

import '@/styles/app.less'
import { App } from './App'

// init library
dayjs.extend(duration)

// init i18next
const i18n = initI18next({ fallbackLanguage: APP_PRIMARY_LANGUAGE })

// init config
const INIT_LANGUAGE = (i18n.resolvedLanguage as Language) ?? APP_PRIMARY_LANGUAGE
const INIT_THEME = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? Theme.Dark
  : Theme.Light

// bind i18n with libs
const handleLocaleChange = (language: Language) => {
  // Other side effects when the i18next language changed.
  return i18n.changeLanguage(language).then(() => {
    dayjs.locale(locales[language].dayjs)
  })
}

console.group('🔵 App booting up...')
console.table({ APP_VERSION, VITE_MODE, INIT_THEME, INIT_LANGUAGE })
console.groupEnd()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <LocaleProvider initLanguage={INIT_LANGUAGE} onChange={handleLocaleChange}>
    <ThemeProvider initTheme={INIT_THEME}>
      <App />
    </ThemeProvider>
  </LocaleProvider>
)

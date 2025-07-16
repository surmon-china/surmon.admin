import { DataRouter } from 'react-router'

declare global {
  interface Window {
    router: DataRouter
  }
}

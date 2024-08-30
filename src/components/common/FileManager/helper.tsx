import React from 'react'
import * as Icons from '@ant-design/icons'
import { StaticFileObject } from '@/apis/static'

export interface StaticFolderItem {
  isFolder: true
  prefix: string
  key: string
}

export type StaticListDataItem = StaticFolderItem | StaticFileObject

export const isFolder = (item: StaticListDataItem): item is StaticFolderItem => {
  return (item as any).isFolder
}

export const transformSizeToKb = (size: number) => {
  return `${(size / 1024).toFixed(2)}kb`
}

export const isImageTypeKey = (key: string) => {
  return ['jpg', 'jpeg', 'png', 'webp', 'svg', 'ico'].some((ext) =>
    key.toLowerCase().endsWith(ext)
  )
}

export const isAudioTypeKey = (key: string) => {
  return ['mp3', 'wma', 'wav', 'ape', 'flac'].some((ext) => key.toLowerCase().endsWith(ext))
}

export const isVideoTypeKey = (key: string) => {
  return ['mp4', 'wmv', 'mov', 'webp'].some((ext) => key.toLowerCase().endsWith(ext))
}

export const getFileIcon = (key: string) => {
  if (isImageTypeKey(key)) {
    return <Icons.FileImageOutlined />
  } else if (isVideoTypeKey(key)) {
    return <Icons.FileOutlined />
  } else if (isAudioTypeKey(key)) {
    return <Icons.FileOutlined />
  } else if (key.toLowerCase().endsWith('html')) {
    return <Icons.FileTextOutlined />
  } else if (key.toLowerCase().endsWith('pdf')) {
    return <Icons.FilePdfOutlined />
  } else {
    return <Icons.FileOutlined />
  }
}

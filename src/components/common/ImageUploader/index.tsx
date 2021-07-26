/**
 * @desc General image uploader
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useRef, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { Upload, notification, Input, Space } from 'antd'
import { PlusOutlined, LoadingOutlined, FileImageOutlined } from '@ant-design/icons'
import moment from 'moment'
import * as OSS from 'ali-oss'

import { STATIC_URL, ALIYUN_OSS_REGION, ALIYUN_OSS_BUCKET } from '@/config'
import { getOSSUpToken, AliYunOSSUpToken } from '@/store/system'
import styles from './style.module.less'

const UPLOAD_FILE_SIZE_LIMIT = 3000000

export interface ImageUploaderProps {
  value?: string
  onChange?(value: string): void
}

export const ImageUploader: React.FC<ImageUploaderProps> = (props) => {
  const loading = useLoading()
  const uploading = useLoading()
  const uploadInProgress = useRef(false)
  const uploadProgress = useRef(0)
  const token = useRef<AliYunOSSUpToken | null>(null)
  const fetchToken = async () => {
    loading.promise(getOSSUpToken()).then((resultToken) => {
      token.value = resultToken
    })
  }

  // 如果上传时 Token 过期，则拉取最新 Token
  const beforeUpload = async (file: File) => {
    const isDied = moment(token.value?.Expiration).isBefore(moment())
    if (isDied) {
      await fetchToken()
    }
    return file
  }

  // 上传文件
  const uploadFile = async (file: File) => {
    // 大于限定尺寸，不上传
    if (file?.size! > UPLOAD_FILE_SIZE_LIMIT) {
      notification.error({
        message: '上传失败',
        description: '文件不合法！',
      })
      return false
    }

    // 如果图片小于 8K，则输出 base64，否则上传
    if (file.size <= 1000 * 8) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imgBase64 = (event as any).target.result
        props.onChange?.(imgBase64)
      }
      reader.readAsDataURL(file)
      return false
    }

    const ossStore = new OSS({
      region: ALIYUN_OSS_REGION,
      bucket: ALIYUN_OSS_BUCKET,
      accessKeyId: token.value?.AccessKeyId!,
      accessKeySecret: token.value?.AccessKeySecret!,
      stsToken: token.value?.SecurityToken!,
      secure: true,
    })

    uploadInProgress.value = true
    uploadProgress.value = 0
    notification.info({
      message: '开始上传',
      description: '文件开始上传',
    })

    try {
      console.log('[uploadFile] 开始上传')
      const result = await uploading.promise(
        ossStore.multipartUpload(`thumbnail/${file.name.replace(/ /gi, '')}`, file, {
          progress(progress) {
            console.info('上传有一个新进度', progress)
            uploadInProgress.value = true
            uploadProgress.value = progress * 100
          },
        })
      )
      const imageUrl = `${STATIC_URL}/${result.name}`
      props.onChange?.(imageUrl)
      console.info('[uploadFile] 上传完成', imageUrl)
      notification.success({
        message: '上传成功',
        description: imageUrl,
      })
    } catch (error) {
      console.warn('[uploadFile] 上传失败', error)
      notification.error({
        message: '上传失败',
        description: String(error),
      })
    } finally {
      uploadInProgress.value = false
    }
  }

  const handleFileRemove = () => {
    props.onChange?.('')
  }

  onMounted(() => {
    fetchToken()
  })

  return (
    <Space direction="vertical" className={styles.imageUploader}>
      <Upload
        name="file"
        listType="picture-card"
        className={styles.uploader}
        maxCount={1}
        showUploadList={false}
        disabled={loading.state.value}
        beforeUpload={beforeUpload}
        onRemove={handleFileRemove}
        customRequest={(options) => {
          if (options.file) {
            uploadFile(options.file as File)
          }
        }}
      >
        {props.value ? (
          <img className={styles.image} src={props.value} alt={props.value} />
        ) : (
          <div className={styles.tigger}>
            {uploading.state.value ? <LoadingOutlined /> : <PlusOutlined />}
            <p className={styles.uploadText}>
              {uploading.state.value ? 'Uploading' : 'Upload'}
            </p>
          </div>
        )}
      </Upload>
      <Input
        allowClear={true}
        placeholder="可以直接输入地址"
        prefix={<FileImageOutlined />}
        value={props.value}
        onChange={(event) => props.onChange?.(event.target.value)}
      />
    </Space>
  )
}

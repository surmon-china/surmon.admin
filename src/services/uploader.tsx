/**
 * @desc General file uploader
 * @author Surmon <https://github.com/surmon-china>
 */

import { useRef } from 'veact'
import { useLoading } from 'veact-use'
import moment from 'moment'
import OSS from 'ali-oss'
import { getStaticFileUrl } from '@/transforms/url'
import { AliYunOSSUpToken } from '@/store/system'
import { ALIYUN_OSS_REGION, ALIYUN_OSS_BUCKET } from '@/config'

const UPLOAD_FILE_SIZE_LIMIT = 3000000

export const isExpirationToken = (token: AliYunOSSUpToken) => {
  return moment(token.Expiration).isBefore(moment())
}

export enum UploadErrorCode {
  Expiration = 'expiration',
  FileSizeLimit = 'fileSizeLimit',
  Failure = 'failure',
}
export const useUploader = () => {
  const uploading = useLoading()
  const progressing = useRef(false)
  const progress = useRef(0)
  const token = useRef<AliYunOSSUpToken | null>(null)
  const client = useRef<OSS | null>(null)

  const init = (osstoken: AliYunOSSUpToken) => {
    token.value = osstoken
    client.value = new OSS({
      region: ALIYUN_OSS_REGION,
      bucket: ALIYUN_OSS_BUCKET,
      accessKeyId: osstoken.AccessKeyId,
      accessKeySecret: osstoken.AccessKeySecret,
      stsToken: osstoken.SecurityToken,
      secure: true,
    })
  }

  const upload = (file: File, fileName?: string) => {
    // expiration
    if (!token.value || isExpirationToken(token.value)) {
      return Promise.reject({ code: UploadErrorCode.Expiration })
    }

    // file size
    if (file.size > UPLOAD_FILE_SIZE_LIMIT) {
      return Promise.reject({ code: UploadErrorCode.FileSizeLimit })
    }

    // client
    if (!client.value) {
      return Promise.reject({ code: UploadErrorCode.Failure })
    }

    progressing.value = true
    progress.value = 0

    // upload file
    const _fileName = (fileName || file.name).replace(/ /gi, '')
    console.info('[upoader]', '开始上传：', _fileName)
    return uploading.promise(
      client.value
        .multipartUpload(_fileName, file, {
          progress(_progress) {
            console.info('[upoader]', '上传有一个新进度', _progress)
            progressing.value = true
            progress.value = _progress * 100
          },
        })
        .then((result) => {
          const url = getStaticFileUrl(result.name)
          console.info('[upoader]', '上传完成', url)
          return { ...result, url }
        })
        .catch((error) => {
          console.warn('[upoader]', '上传失败', error)
          return Promise.reject({
            code: UploadErrorCode.Failure,
            error,
          })
        })
        .finally(() => {
          progressing.value = false
        })
    )
  }

  return {
    init,
    upload,
    client,
    uploading,
    progressing,
    progress,
  }
}

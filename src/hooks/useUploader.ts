/**
 * @desc General file uploader hook based on veact
 * @author Surmon <https://github.com/surmon-china>
 */

import { useRef } from 'veact'
import { useLoading } from 'veact-use'
import { uploadStaticToNodePress } from '@/apis/static'

const UPLOAD_FILE_SIZE_LIMIT = 3000000

export enum UploadErrorCode {
  FileSizeLimit = 'fileSizeLimit',
  Failure = 'failure'
}

export interface UploaderOptions {
  onProgress?(percent: number): void
}

export const useUploader = () => {
  const uploading = useLoading()
  const progressing = useRef(false)
  const progress = useRef(0)

  const resetProgress = () => {
    progressing.value = false
    progress.value = 0
  }

  const upload = (
    file: File,
    fileName: string | null = null,
    onProgress?: (percent: number) => void
  ) => {
    // file size
    if (file.size > UPLOAD_FILE_SIZE_LIMIT) {
      return Promise.reject({ code: UploadErrorCode.FileSizeLimit })
    }

    progressing.value = true
    progress.value = 0

    // rename file
    const _fileName = (fileName ?? file.name).replace(/ /gi, '')
    console.debug('[upoader]', 'Start uploading:', _fileName)

    // upload file
    return uploading.promise(
      uploadStaticToNodePress(file, _fileName, (_progress) => {
        console.debug('[upoader]', 'New upload progress:', _progress)
        progressing.value = true
        progress.value = _progress * 100
        onProgress?.(_progress)
      })
        .then((result) => {
          console.debug('[upoader]', 'Upload completed:', result.url)
          return result
        })
        .catch((error) => {
          console.warn('[upoader]', 'Upload failed:', error)
          return Promise.reject({
            code: UploadErrorCode.Failure,
            error
          })
        })
        .finally(() => resetProgress())
    )
  }

  return {
    upload,
    uploading,
    progressing,
    progress
  }
}

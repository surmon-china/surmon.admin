/**
 * @file File utilities
 * @author Surmon <macichong@bytedance.com>
 */

export const fileToDataURL = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = (event) => {
      const base64 = (event as any).target.result
      resolve(base64)
    }
    reader.readAsDataURL(file)
  })
}

export const saveFile = (
  content: string,
  fileName: string,
  fileType: string = 'text/plain'
): void => {
  const blob = new Blob([content], { type: fileType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName

  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  })

  link.dispatchEvent(event)
  URL.revokeObjectURL(url)
}

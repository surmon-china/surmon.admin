/**
 * @file File service
 * @module service.file
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

export const saveFile = (content: string, fileName: string, fileType?: string) => {
  const blob = new Blob([content], { type: fileType || 'text/plain' })
  if ((window as any).saveAs) {
    ;(window as any).saveAs(blob, fileName)
  } else if ((navigator as any).saveBlob) {
    ;(navigator as any).saveBlob(blob, fileName)
  } else {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    const event = document.createEvent('MouseEvents')
    event.initMouseEvent(
      'click',
      true,
      true,
      window as any,
      1,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    )
    link.dispatchEvent(event)
  }
}

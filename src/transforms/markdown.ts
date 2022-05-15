/**
 * @file Markdown
 * @author Surmon <https://github.com/surmon-china>
 */

import { marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'

import 'highlight.js/styles/github-dark.css'

hljs.registerLanguage('css', css)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)

const renderer = new marked.Renderer()

renderer.link = (href, title, text) => {
  const textIsImage = text.includes('<img')
  const linkHtml = `
    <a
      href="${href}"
      target="_blank"
      class="${textIsImage ? 'image-link' : 'link'}"
      title="${title || (textIsImage ? href : text)}"
    >
      ${text}
    </a>
  `
  return linkHtml.replace(/\s+/g, ' ').replace(/\n/g, ' ')
}

marked.setOptions({
  renderer,
  gfm: true,
  breaks: false,
  pedantic: false,
  smartLists: true,
  smartypants: false,
  highlight(code, language) {
    return hljs.getLanguage(language)
      ? hljs.highlight(code, { language }).value
      : hljs.highlightAuto(code).value
  },
})

export const markdownToHTML = marked

export const imageURLToMarkdown = (url: string) => `![](${url})`

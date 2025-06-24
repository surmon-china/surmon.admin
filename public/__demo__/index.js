// JSON actions
const fetchJSON = (filePath) => {
  const base = (window.DEMO_BASE_URL || '').replace(/\/+$/, '')
  const url = `${base}/__demo__/mock/${filePath}.json`
  return fetch(url).then((response) => response.json())
}

// first fetch cache data map
const _cacheData = new Map()
const ensureJSON = async (filePath) => {
  if (_cacheData.has(filePath)) {
    return _cacheData.get(filePath)
  } else {
    const data = await fetchJSON(filePath)
    _cacheData.set(filePath, data)
    return data
  }
}

// mock token
console.info('mock token')
window.localStorage.setItem('id_token', 'veact_admin.mock.token')

// mock by axios adapter
console.info('mock axios')
window.__axiosAdapter = (config) => {
  console.debug('mock request:', config)
  // 1. Only handle all GET requests.
  // 2. Except necessary POST requests related to authentication.
  // 3. Return an error for all requests with a DEMO error message.
  const handlers = {
    '/auth/login': {
      post: () => ensureJSON('auth/login')
    },
    '/auth/check': {
      post: () => ensureJSON('auth/check')
    },
    '/auth/admin': {
      get: () => ensureJSON('auth/admin')
    },
    '/extension/statistic': {
      get: () => ensureJSON('extension/statistic')
    },
    '/extension/uptoken': {
      get: () => ensureJSON('extension/uptoken')
    },
    '/vote': {
      get: () => ensureJSON('vote')
    },
    '/feedback': {
      get: () => ensureJSON('feedback')
    },
    '/announcement': {
      get: () => ensureJSON('announcement')
    },
    '/category/all': {
      get: () => ensureJSON('category/all')
    },
    '/tag': {
      get: () => ensureJSON('tag')
    },
    '/tag/all': {
      get: () => ensureJSON('tag/all')
    },
    '/comment': {
      get: () => ensureJSON('comment/list')
    },
    '/comment/calendar': {
      get: () => ensureJSON('comment/calendar')
    },
    '/disqus/config': {
      get: () => ensureJSON('disqus/config')
    },
    '/option': {
      get: () => ensureJSON('option')
    },
    '/article': {
      get: () => ensureJSON('article/list')
    },
    '/article/calendar': {
      get: () => ensureJSON('article/calendar')
    },
    '/article/612c81321a53290533a7b782': {
      get: () => ensureJSON('article/612c81321a53290533a7b782')
    },
    '/article/610c29438a907384c63fef00': {
      get: () => ensureJSON('article/610c29438a907384c63fef00')
    },
    '/article/61030f5fcf1faa098ee126b2': {
      get: () => ensureJSON('article/61030f5fcf1faa098ee126b2')
    }
  }

  return new Promise(async (resolve) => {
    const target = handlers?.[config.url]?.[config.method]
    if (target) {
      return resolve({
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json'
        },
        data: await target()
      })
    } else {
      return resolve({
        status: 400,
        statusText: 'ERROR',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          status: 'error',
          message: 'API request error',
          error: 'The demo site cannot operate this data',
          result: null
        }
      })
    }
  })
}

// JSON actions
const fetchJSON = (filePath) => {
  return fetch(`/__demo__/mock/${filePath}.json`).then((response) => response.json())
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
  // 1. 仅处理所有 Get 请求
  // 2. Auth 相关的必要 Post 请求除外
  // 3. 所有请求返回错误，提示：Demo 站点无法操作数据
  const handlers = {
    '/auth/login': {
      post: () => ensureJSON('auth/login'),
    },
    '/auth/check': {
      post: () => ensureJSON('auth/check'),
    },
    '/auth/admin': {
      get: () => ensureJSON('auth/admin'),
    },
    '/expansion/statistic': {
      get: () => ensureJSON('expansion/statistic'),
    },
    '/expansion/google-token': {
      get: () => ensureJSON('expansion/google-token'),
    },
    '/expansion/uptoken': {
      get: () => ensureJSON('expansion/uptoken'),
    },
    '/announcement': {
      get: () => ensureJSON('announcement'),
    },
    '/category': {
      get: () => ensureJSON('category'),
    },
    '/tag': {
      get: () => ensureJSON('tag'),
    },
    '/comment': {
      get: () => ensureJSON('comment'),
    },
    '/option': {
      get: () => ensureJSON('option'),
    },
    '/article': {
      get: () => ensureJSON('article/list'),
    },
    '/article/612c81321a53290533a7b782': {
      get: () => ensureJSON('article/612c81321a53290533a7b782'),
    },
    '/article/610c29438a907384c63fef00': {
      get: () => ensureJSON('article/610c29438a907384c63fef00'),
    },
    '/article/61030f5fcf1faa098ee126b2': {
      get: () => ensureJSON('article/61030f5fcf1faa098ee126b2'),
    },
  }

  return new Promise(async (resolve) => {
    const target = handlers?.[config.url]?.[config.method]
    if (target) {
      return resolve({
        status: 200,
        statusText: 'OK',
        data: await target(),
      })
    } else {
      return resolve({
        status: 500,
        statusText: 'ERROR',
        data: {
          status: 'error',
          message: '操作失败',
          error: 'Demo 站点不支持数据操作',
          result: null,
        },
      })
    }
  })
}

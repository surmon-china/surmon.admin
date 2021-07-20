# Veact

![vue](https://img.shields.io/badge/MADE%20WITH-VEACT-42a97a?style=for-the-badge&labelColor=35495d)
[![GitHub stars](https://img.shields.io/github/stars/veactjs/veact.svg?style=for-the-badge)](https://github.com/veactjs/veact/stargazers)
[![GitHub issues](https://img.shields.io/github/issues-raw/veactjs/veact.svg?style=for-the-badge)](https://github.com/veactjs/veact/issues)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/veactjs/veact/Deploy?label=deploy&style=for-the-badge)](https://github.com/veactjs/veact/actions?query=workflow:%22Deploy%22)
[![GitHub license](https://img.shields.io/github/license/veactjs/veact.svg?style=for-the-badge)](https://github.com/veactjs/veact/blob/master/LICENSE)

> Mutable state enhancer library for [React](https://github.com/facebook/react) by [`@vuejs/reactivity`](https://github.com/vuejs/vue-next).

> 适用于 [React](https://github.com/facebook/react) 的可变式状态管理库，使用 [`@vuejs/reactivity`](https://github.com/vuejs/vue-next) 进行开发。

**🔥 Who is using this library**

Already used in production for these project :

- **[veact-admin](https://github.com/surmon-china/surmon.me.native)** Blog admin | 博客管理后台
- ...

---

### Installation

```bash
npm install veact --save

# or
yarn add veact
```

### Usage

```ts
import { ref, useRef } from 'veact'

export component = () => {
  const count = useRef(0)
  const increment = () => {
    data.value ++
  }

  return (
    <div>
      <span>{count.value}</span>
      <Button onClick={increment}>increment</Button>
    </div>
  )
}
```

## Development

```bash
# install dependencies
yarn

# serve with hot reload at localhost:4200
yarn dev

# lint
yarn lint

# build
yarn build

# preview
yarn serve
```

### Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/veactjs/veact/blob/master/CHANGELOG.md).

### License

[MIT](https://github.com/veactjs/veact/blob/master/LICENSE)

# Veact

![vue](https://img.shields.io/badge/MADE%20WITH-VEACT-42a97a?style=for-the-badge&labelColor=35495d)
[![GitHub stars](https://img.shields.io/github/stars/veactjs/veact.svg?style=for-the-badge)](https://github.com/veactjs/veact/stargazers)
[![GitHub issues](https://img.shields.io/github/issues-raw/veactjs/veact.svg?style=for-the-badge)](https://github.com/veactjs/veact/issues)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/veactjs/veact/Deploy?label=deploy&style=for-the-badge)](https://github.com/veactjs/veact/actions?query=workflow:%22Deploy%22)
[![GitHub license](https://img.shields.io/github/license/veactjs/veact.svg?style=for-the-badge)](https://github.com/veactjs/veact/blob/master/LICENSE)

> Mutable state enhancer library for [React](https://github.com/facebook/react) by [`@vuejs/reactivity`](https://github.com/vuejs/vue-next).

> 适用于 [React](https://github.com/facebook/react) 的可变式状态管理库，基于 [`@vuejs/reactivity`](https://github.com/vuejs/vue-next) 进行开发。

**🔥 Who is using this library**

Already used in production for these project :

- **[veact-admin](https://github.com/surmon-china/veact-admin)** Blog admin | 博客管理后台
- ...

---

### Installation

```bash
npm install veact react react-dom --save

# or
yarn add veact react react-dom
```

### Usage

**Base**

```ts
import { useRef } from 'veact'

export component = () => {
  const count = useRef(0)
  const increment = () => {
    count.value ++
  }

  return (
    <div>
      <span>{count.value}</span>
      <Button onClick={increment}>increment</Button>
    </div>
  )
}
```

**Reactivity**

transform any object to reactivity.

```ts
import { ref, useReactivity } from 'veact'

const _count = useRef(0)

export component = () => {
  const count = useReactivity(() => _count)
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

**Watch**

```ts
import { useReactive, useWatch } from 'veact'

export component = () => {
  const data = useReactive({
    count: 0
  })
  const increment = () => {
    data.count ++
  }

  useWatch(data, (newData) => {
    console.log('data changed', newData)
  })

  useWatch(() => data.count, (newCount) => {
    console.log('count changed', newCount)
  })

  return (
    <div>
      <span>{data.count}</span>
      <Button onClick={increment}>increment</Button>
    </div>
  )
}
```

**Lifecycle**

```ts
import { onMounted, onBeforeUnmount, onUpdated } from 'veact'

export component = () => {

  onMounted(() => {
    console.log('component mounted')
  })

  onUpdated(() => {
    console.log('component updated')
  })

  onBeforeUnmount(() => {
    console.log('component will unmount')
  })

  return (
    <div>component</div>
  )
}
```

### API

```ts
import {
  // veact APIs
  //
  // lifecycle
  onMounted, // lifecycle for react mounted
  onBeforeUnmount, // lifecycle for react will unmount
  onUpdated, // lifecycle for react updated
  //
  // data
  useRef, // ref hook
  useShallowRef, // shallowRef hook
  useReactive, // reactive hook
  useShallowReactive, // shallowReactive hook
  useComputed, // computed hook
  //
  // watch
  watch, // watch for reactivity data
  useWatch, // watch hook
  watchEffect, // watchEffect for reactivity data
  useWatchEffect, // watchEffect hook
  //
  // ehancer
  useReactivity, // any object data to reactivity data
  batchedUpdates, // batchedUpdates === ReactDOM.unstable_batchedUpdates

  // @vue/reactivity API
  // ...
} from "veact";
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

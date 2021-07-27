# veact-admin

[![veact](https://img.shields.io/badge/WITH-VEACT-42a97a?style=for-the-badge&labelColor=35495d)](https://github.com/veactjs/veact)
[![nodepress](https://img.shields.io/badge/NODE-PRESS-83BA2F?style=for-the-badge&labelColor=90C53F)](https://github.com/surmon-china/nodepress)
[![GitHub stars](https://img.shields.io/github/stars/surmon-china/veact-admin.svg?style=for-the-badge)](https://github.com/surmon-china/veact-admin/stargazers)
[![GitHub issues](https://img.shields.io/github/issues-raw/surmon-china/veact-admin.svg?style=for-the-badge)](https://github.com/surmon-china/veact-admin/issues)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/surmon-china/veact-admin/Deploy?label=deploy&style=for-the-badge)](https://github.com/surmon-china/veact-admin/actions?query=workflow:%22Deploy%22)
[![GitHub license](https://img.shields.io/github/license/surmon-china/veact-admin.svg?style=for-the-badge)](https://github.com/surmon-china/veact-admin/blob/main/LICENSE)

> **Admin client for [surmon.me](https://github.com/surmon-china/surmon.me) blog, powered by [`React`](https://github.com/facebook/react) and [`Veact`](https://github.com/veactjs/veact).**

> **适用于 [surmon.me](https://github.com/surmon-china/surmon.me) 博客的管理员后台应用，使用 [`React`](https://github.com/facebook/react) 和 [`Veact`](https://github.com/veactjs/veact) 进行开发。**

**其他相关项目：**

- **[nodepress](https://github.com/surmon-china/nodepress)** - RESTful API service for Blog | 博客服务端
- **[surmon.me](https://github.com/surmon-china/surmon.me)** - SSR blog website | 博客前端
- **[surmon.me.native](https://github.com/surmon-china/surmon.me.native)** - Blog native app | 博客 App

**更新记录：[CHANGELOG.md](https://github.com/surmon-china/veact-admin/blob/main/CHANGELOG.md#changelog)**

## Screenshot

![](https://raw.githubusercontent.com/surmon-china/veact-admin/main/presses/thumbnail.png)

## Development setup

```bash
# install dependencies
yarn

# serve with hot reload at localhost:4200
yarn dev

# lint
yarn lint

# build
yarn build

# local preview
yarn serve
```

## Actions setup

**Rule:**

- `any PR open` → `CI:Build test`
- `new tag v*` → `CI:Create Release`
- `release create` → `CI:Deploy` → `CI:Bundler` → `CI:Execute server script`

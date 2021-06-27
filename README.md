<p align="center">
  <a href="https://github.com/facebook/react/" target="blank">
    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K" height="90" alt="React logo" />
  </a>
  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
  <a href="https://github.com/surmon-china/nodepress" target="blank">
    <img src="https://raw.githubusercontent.com/surmon-china/veact-admin/master/public/images/profile/logo.png" height="90" alt="nodepress logo" />
  </a>
</p>

---

# Veact Admin

[![nodepress](https://img.shields.io/badge/NODE-PRESS-83BA2F?style=for-the-badge&labelColor=90C53F)](https://github.com/surmon-china/nodepress)
[![GitHub stars](https://img.shields.io/github/stars/surmon-china/veact-admin.svg?style=for-the-badge)](https://github.com/surmon-china/veact-admin/stargazers)
[![GitHub issues](https://img.shields.io/github/issues-raw/surmon-china/veact-admin.svg?style=for-the-badge)](https://github.com/surmon-china/veact-admin/issues)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/surmon-china/veact-admin/Deploy?label=deploy&style=for-the-badge)](https://github.com/surmon-china/veact-admin/actions?query=workflow:%22Deploy%22)
[![GitHub license](https://img.shields.io/github/license/surmon-china/veact-admin.svg?style=for-the-badge)](https://github.com/surmon-china/veact-admin/blob/master/LICENSE)

**Admin client for [surmon.me](https://github.com/surmon-china/surmon.me) blog, powered by [React](https://github.com/facebook/react) and [veactjs](https://github.com/veactjs).**

**适用于 [surmon.me](https://github.com/surmon-china/surmon.me) 管理员后台的前端应用，使用 [React](https://github.com/facebook/react) 和 [veactjs](https://github.com/veactjs) 进行开发。**

**其他相关项目：**

- **RESTful API service:** [nodepress](https://github.com/surmon-china/nodepress) powered by [nestjs](https://github.com/nestjs/nest)
- **web client for user:** [surmon.me](https://github.com/surmon-china/surmon.me) powered by [Vue (3)](https://vuejs.org/)
- **native app client:** [surmon.me.native](https://github.com/surmon-china/surmon.me.native) powered by [react-native](https://github.com/facebook/react-native)

**更新记录：[CHANGELOG.md](https://github.com/surmon-china/veact-admin/blob/master/CHANGELOG.md#changelog)**

## Screenshot

![](https://raw.githubusercontent.com/surmon-china/veact-admin/master/presses/thumbnail.jpg)

## Development setup

```bash
# install dependencies
yarn

# serve with hot reload at localhost:4200
yarn dev

# lint
yarn lint

# test
yarn test
yarn e2e

# build
yarn build

# CD (local build)
yarn local:build:tar
# CD (remote deploy)
yarn local:deploy
```

## Actions setup

**Rule:**

- `any PR open` → `CI:Build test`
- `master PR close & merged` → `CI:Deploy to server`

**Example:**

- `local:develop(local:build:tar)` → `remote:develop` → `CI:Build test`
- `remote:develop/master` → `remote:master` → `merged` → `CI:Deploy to server`

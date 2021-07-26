<p align="center">
  <a href="https://github.com/facebook/react/" target="blank">
    <img src="https://raw.githubusercontent.com/surmon-china/veact-admin/main/presses/react.svg" height="90" alt="React logo" />
  </a>
  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
  <a href="https://github.com/surmon-china/nodepress" target="blank">
    <img src="https://raw.githubusercontent.com/surmon-china/veact-admin/main/public/images/profile/logo.png" height="90" alt="nodepress logo" />
  </a>
</p>

---

# Veact Admin

[![nodepress](https://img.shields.io/badge/NODE-PRESS-83BA2F?style=for-the-badge&labelColor=90C53F)](https://github.com/surmon-china/nodepress)
[![GitHub stars](https://img.shields.io/github/stars/surmon-china/veact-admin.svg?style=for-the-badge)](https://github.com/surmon-china/veact-admin/stargazers)
[![GitHub issues](https://img.shields.io/github/issues-raw/surmon-china/veact-admin.svg?style=for-the-badge)](https://github.com/surmon-china/veact-admin/issues)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/surmon-china/veact-admin/Deploy?label=deploy&style=for-the-badge)](https://github.com/surmon-china/veact-admin/actions?query=workflow:%22Deploy%22)
[![GitHub license](https://img.shields.io/github/license/surmon-china/veact-admin.svg?style=for-the-badge)](https://github.com/surmon-china/veact-admin/blob/main/LICENSE)

**Admin client for [surmon.me](https://github.com/surmon-china/surmon.me) blog, powered by [React](https://github.com/facebook/react) and [veactjs](https://github.com/veactjs/veact).**

**适用于 [surmon.me](https://github.com/surmon-china/surmon.me) 博客的管理员后台应用，使用 [React](https://github.com/facebook/react) 和 [veactjs](https://github.com/veactjs/veact) 进行开发。**

**其他相关项目：**

- **[nodepress](https://github.com/surmon-china/nodepress)** 😎 RESTful API service | 博客服务端
- **[surmon.me](https://github.com/surmon-china/surmon.me)** 🆒 Frontend blog site | 博客前端
- **[surmon.me.native](https://github.com/surmon-china/surmon.me.native)** 📱Native app client | 博客 App

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

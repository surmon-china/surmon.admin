# veact-admin

[![veact](https://img.shields.io/badge/WITH-VEACT-42a97a?style=for-the-badge&labelColor=35495d)](https://github.com/veactjs/veact)
&nbsp;
[![nodepress](https://raw.githubusercontent.com/surmon-china/nodepress/main/badge.svg)](https://github.com/surmon-china/nodepress)
&nbsp;
[![GitHub stars](https://img.shields.io/github/stars/surmon-china/veact-admin.svg?style=for-the-badge)](https://github.com/surmon-china/veact-admin/stargazers)
&nbsp;
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/surmon-china/veact-admin/Deploy?label=deploy&style=for-the-badge)](https://github.com/surmon-china/veact-admin/actions?query=workflow:%22Deploy%22)
&nbsp;
[![GitHub license](https://img.shields.io/github/license/surmon-china/veact-admin.svg?style=for-the-badge)](/LICENSE)

**Admin client for [surmon.me](https://github.com/surmon-china/surmon.me) blog, powered by [`React`](https://github.com/facebook/react) and [`Veact`](https://github.com/veactjs/veact).**

**适用于 [surmon.me](https://github.com/surmon-china/surmon.me) 博客的管理员后台应用，使用 [`React`](https://github.com/facebook/react) 和 [`Veact`](https://github.com/veactjs/veact) 进行开发。**

> **👁 在线预览：[Online DEMO site](https://github.surmon.me/veact-admin)**

> **📝 更新记录：[CHANGELOG.md](/CHANGELOG.md#changelog)**

---

**🔥 其他 [相关项目](https://github.com/stars/surmon-china/lists/surmon-me)：**

- **[`nodepress`](https://github.com/surmon-china/nodepress)** - RESTful API service for Blog | 博客服务端
- **[`surmon.me`](https://github.com/surmon-china/surmon.me)** - SSR blog website | 博客前端
- **[`surmon.me.native`](https://github.com/surmon-china/surmon.me.native)** - Blog native app | 博客 App

## Screenshot

![](https://raw.githubusercontent.com/surmon-china/veact-admin/main/presses/dashboard.png)

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
- `release create` → `CI:Deploy` → `release branch & demo branch`

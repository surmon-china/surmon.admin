# surmon.admin

[![nodepress](https://raw.githubusercontent.com/surmon-china/nodepress/main/badge.svg)](https://github.com/surmon-china/nodepress)
&nbsp;
[![veact](https://img.shields.io/badge/WITH-VEACT-42a97a?style=for-the-badge&labelColor=35495d)](https://github.com/veactjs/veact)
&nbsp;
[![GitHub stars](https://img.shields.io/github/stars/surmon-china/surmon.admin.svg?style=for-the-badge)](https://github.com/surmon-china/surmon.admin/stargazers)
&nbsp;
[![GitHub issues](https://img.shields.io/github/issues/surmon-china/surmon.admin.svg?style=for-the-badge)](https://github.com/surmon-china/surmon.admin/issues)
&nbsp;
[![GitHub license](https://img.shields.io/github/license/surmon-china/surmon.admin.svg?style=for-the-badge)](/LICENSE)

Admin client for [surmon.me](https://github.com/surmon-china/surmon.me) blog, powered by [`React`](https://github.com/facebook/react) and [`Veact`](https://github.com/veactjs/veact).

**适用于 [surmon.me](https://github.com/surmon-china/surmon.me) 博客的管理员后台应用，使用 [`React`](https://github.com/facebook/react) 和 [`Veact`](https://github.com/veactjs/veact) 进行开发。**

**在线预览：[Online demo site](https://github.surmon.me/surmon.admin)**

---

**其他 [相关项目](https://github.com/stars/surmon-china/lists/surmon-me)：**

- **[`nodepress`](https://github.com/surmon-china/nodepress)** - RESTful API service for Blog | 博客服务端
- **[`surmon.me`](https://github.com/surmon-china/surmon.me)** - SSR blog website | 博客前端
- **[`surmon.me.native`](https://github.com/surmon-china/surmon.me.native)** - Blog native app | 博客 App

## Screenshot

![](/screenhots/dashboard.png)

## Development setup

```bash
# install dependencies
pnpm i

# serve with hot reload at localhost:4200
pnpm run dev

# lint
pnpm run lint

# build
pnpm run build

# local preview
pnpm run serve
```

## Actions setup

**Rule:**

- Any PR opend → `CI:Build test`
- New tag `v*` → `CI:Create Release`
- Release created → `CI:Deploy` → `release to product branch (release / demo)`

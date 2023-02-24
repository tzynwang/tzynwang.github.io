---
title: yarn install --production=false 與 package.json 中的 resolutions
date: 2023-02-21 20:11:34
categories:
  - [Package Manager]
---

## 總結

在安裝專案套件時因 `.env` 中的 `NODE_ENV=production` 踩了坑，解法是在透過 yarn 安裝套件時加上 `--production=false` 避免問題。另外此篇筆記也記錄一下 package.json 中 `resolutions` 欄位的作用。

## 筆記

### 執行 `yarn install` 時沒有安裝 package.json 中的 `devDependencies`

情境：有時為了測試打包腳本，會將 `.env` 中的 `NODE_ENV` 值設定為 `production` 以便模擬正式打包環境，打包腳本測完了卻忘記把 `NODE_ENV` 改回 `development`。在這個情境下執行 `yarn install` 的話，會發現 package.json 中的 `devDependencies` 都沒有被安裝。

解決方式：透過 yarn 安裝套件時執行 `yarn install --production=false` 即可在 `NODE_ENV=production` 的狀況下依舊安裝 `devDependencies`。

> [yarn official doc](https://classic.yarnpkg.com/en/docs/cli/install#toc-yarn-install-production-true-false): Yarn will not install any package listed in `devDependencies` if the `NODE_ENV` environment variable is set to `production`. Use this flag to instruct Yarn to ignore NODE_ENV and take its production-or-not status from this flag instead.

### 透過 package.json `resolutions` 指定套件版本

情境：目前專案使用的其中一個 `套件Ａ` 依賴 `套件Ｂ`，但 `套件Ａ` 指定使用的 `套件Ｂ` 版本過舊，該過舊版本的 `套件Ｂ` 造成專案必須額外安裝一些目前已經不再必要的 JavaScript syntax polyfill 套件。開發者想直接指定使用較新版本的 `套件Ｂ`。

解決方式：在 package.json 中新增一欄位 `resolutions` 來指定套件版本：

```json
{
  "resolutions": {
    "package-b": "^3.2.0"
  }
}
```

補充說明：上方註明套件版本需為 `^3.2.0` 的意思是「容許該套件的版本大於等於 `3.2.0`，但必須小於 `4.0.0`」。

> [npm official doc](https://docs.npmjs.com/cli/v6/using-npm/semver#caret-ranges-123-025-004): Allows changes that do not modify the left-most non-zero digit in the `[major, minor, patch]` tuple.

## 參考文件

- [yarnpkg/yarn: \*bug\* Yarn will not install devDependencies when NODE_ENV=production](https://github.com/yarnpkg/yarn/issues/2739)
- [Yarn: Selective dependency resolutions](https://classic.yarnpkg.com/en/docs/selective-version-resolutions/)
- [Yarn: `yarn install --production[=true|false]`](https://classic.yarnpkg.com/en/docs/cli/install#toc-yarn-install-production-true-false)
- [npm Docs: semver -- Caret Ranges](https://docs.npmjs.com/cli/v6/using-npm/semver#caret-ranges-123-025-004)

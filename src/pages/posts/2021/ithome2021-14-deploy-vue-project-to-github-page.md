---
layout: '@Components/SinglePostLayout.astro'
title: 30天挑戰：「將Vue project部屬至GitHub Pages」相關筆記
date: 2021-08-31 10:05:53
tag:
  - [Vue]
  - [2021鐵人賽]
---

## 總結

記錄將 Vue project 部屬到 Github Pages 的相關步驟

## 版本與環境

```
@vue/cli: 4.5.13
os: Windows_NT 10.0.18363 win32 x64
```

## 步驟

1. 在專案**根目錄**建立`vue.config.js`
1. 填入以下內容

```js
// in vue.config.js

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/my-project/'
    : '/'
}
```

- 注意事項：
  - If you are deploying to `https://<USERNAME>.github.io/` or to a custom domain, you can omit `publicPath` as it defaults to `"/"`.
  - If you are deploying to `https://<USERNAME>.github.io/<REPO>/`, (i.e. your repository is at `https://github.com/<USERNAME>/<REPO>`), set `publicPath` to `"/<REPO>/"`.

1. 在專案**根目錄**建立`deploy.sh`，填入以下內容

```bash
#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# 下面這區根據實際情況調整，不會用到的話，就維持註解狀態
# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 下面這區根據實際情況調整，不會用到的話，就維持註解狀態
# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# 下面這區根據實際情況調整，不會用到的話，就維持註解狀態
# if you are deploying to https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages
# 最後成功時，用的是.git/config中的[remote "origin"] url = https://github.com/<USERNAME>/<REPO-NAME>.git
git push -f https://github.com/<USERNAME>/<REPO-NAME>.git master:gh-pages

cd -
```

1. 打開 Git Bash，cd 到專案目錄，記得路徑要用`''`包起來（比如`cd 'C:\Projects'`）
1. 先輸入`chmod +x deploy.sh`，再輸入`./deploy.sh`來執行腳本
   ![執行畫面](/2021/ithome2021-14-deploy-vue-project-to-github-page/gitBash.png)
1. 腳本執行完畢後，repo 上會出現`gh-pages`這個 branch，去 pages 設定讓 GitHub Pages 抓取該 branch 即可

## 參考文件

- [Vue CLI: Deployment to GitHub Pages](https://cli.vuejs.org/guide/deployment.html#github-pages)

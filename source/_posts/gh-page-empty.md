---
title: repository明明有東西，gh-page卻是一片空白
date: 2021-02-12 09:35:11
categories:
- hexo
tags:
- hexo deploy
- Windows
---

症狀描述：
執行了`hexo deploy`後，確認與gh-page關聯的分支（branch）內有檔案，並檔案內容皆正確，但連線到「https://<github使用者名稱>.github.io」卻只看到一片空白。

簡答：
- 更新hexo-deployer-git至3.0.0版
- node.js版本需維持在12-13版之間

詳細搜尋結果與參考資料內收

<!-- more -->

## 關於hexo-deployer-git
參考[deploy responds but cannot deploy #4634](https://github.com/hexojs/hexo/issues/4634)，根據建議更新`hexo-deployer-git`到3.0.0版。不過更新之後，有時執行完`hexo deploy`（repository上確定有最新資料）還是會遇到gh-page一片空白的問題。
再進行一些搜尋後，發現原來node.js版本也可能是問題肇因，如下述🤪


## 關於node.js版本
請使用12或13版。
If you're using Node.js 14, please downgrade to 13 or 12.
![Please use node.js with version 12 or 13](node-js-version-suggestion.png)

2021年2月才開始學著用hexo架部落格，一開始僅注意到[hexo官方文件建議node.js「最低要求10.13，建議12.0或以上」](https://hexo.io/docs/#Requirements)，故一開始裝了node.js當下最新的第14版。
降回12.20.2後就一切正常了🥳

參考資料：
- [hexo 產生空白的 HTML](http://blog.roy4801.tw/2020/05/17/tutorial/hexo-blank/)
- [hexo generates empty files #4267](https://github.com/hexojs/hexo/issues/4267)


## 在Windows環境中降版node.js
個人做法：土法煉鋼，先解除原本安裝在Windows上的node.js第14版，重開機後，下載12.20.2版的node.js並安裝。
👉 node.js官方過去版本下載連結：[https://nodejs.org/en/download/releases/](https://nodejs.org/en/download/releases/)
因為個人使用的是Windows環境，故選擇下載.msi格式的檔案。
![Download .msi for Windows environment](node-js-msi.png)

安裝完12.20.2版的node.js後，開啟cmd.exe並移動到hexo blog位置，輸入`node -v`與`hexo -v`檢查版本。
執行`hexo -v`後，cmd.exe印出錯誤訊息如下：
```
err: Error: Missing binding C:\Projects\hexo_blog\node_modules\node-sass\vendor\win32-x64-72\binding.node
  Node Sass could not find a binding for your current environment: Windows 64-bit with Node.js 12.x

  Found bindings for the following environments:
    - Windows 64-bit with Node.js 14.x

  This usually happens because your environment has changed since running `npm install`.
  Run `npm rebuild node-sass` to download the binding for your current environment.
```
直接根據提示執行了`npm rebuild node-sass`，完成後再執行一次`hexo -v`，無錯誤訊息。
更新了文章內容後試圖執行`hexo deploy`，順利部屬到repository上，並gh-page有正常顯示部落格內容。
Q.E.D 😮‍💨
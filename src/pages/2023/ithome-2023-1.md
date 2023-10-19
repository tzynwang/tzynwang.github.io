---
layout: '@Components/pages/SinglePostLayout.astro'
title: 捨棄 create-react-app 之餘還架了個 astro blog 昭告天下：關於今年主題
date: 2023-09-16 07:10:39
tag:
  - [2023鐵人賽]
banner: /2023/ithome-2023-1/miguel-a-amutio-27QOmh18KDc-unsplash.jpg
summary: 2023 鐵人賽開始了，今年來聊聊前端基礎建設以及如何用 astro 架部落格。
draft:
---

大家好，這半年來印象比較深刻、又能集結成文章分享的開發主題分別是：

- 從零開始的前端專案基礎建設
- [技術部落格](https://tzynwang.github.io/)改版，從 [hexo](https://hexo.io/index.html) 改用 [astro](https://astro.build/)

並且大綱寫著寫著，發現兩個題目合併起來剛好可以湊滿 30 天的內容，於是今年的鐵人賽主題就撒尿牛丸化了。

而接下來 29 天為了提供良好的閱讀體驗，前半段會集中討論「前端專案基礎建設」這個題目，後半段則是說明「如何使用 astro 架設、部署部落格到 GitHub 上」。

以下是兩邊主題的大綱，還請參考 ( ´∀ ｀)つ t[ ]

## 內容簡介

### 前端專案基礎建設

大綱如下，這基本上也是我在設定一個全新專案時的工作順序：

- 從 package.json 開始，設定依賴套件、環境版本、腳本
- 設定 tsconfig.json
- 鋪設專案架構，同時也會分享我如何規劃專案的資料夾結構
- 處理開發用的 webpack 設定
- 設定 jest 與 cypress 來執行單元測試及 e2e 測試
- 處理打包、部署流程
- 寫文件拯救其他人（包括未來的自己）

### 使用 astro 架設部落格

大綱如下：

- 建立並介紹 astro 的專案結構
- 如何透過 astro 將 .md 檔轉為靜態網頁
- 撰寫腳本來透過 command line 快速建立文章
- 如何使用 astro 提供的 dynamic route
- 埋設 GA4
- 打包、部署到 GitHub Pages
- 資源分享：如何尋找靈感、下班後的進修方向

## 目標讀者

- （前半）覺得 create-react-app eject 後有點笨重、但又不確定從零開始處理專案基礎建設該怎麼開始的人
- （前半）想知道其他前端工程師都是怎麼管理專案資料夾結構的人
- （後半）想知道用 astro 架部落格大概需要做哪些事情的人

## 小結

以上就是今年鐵人賽的主題簡介，有興趣的讀者歡迎訂閱系列文。

如果針對文章內容有任何疑惑也歡迎留言。

感謝你看到這裡 (ゝ ∀･)

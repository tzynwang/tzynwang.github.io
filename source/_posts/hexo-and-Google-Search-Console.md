---
title: 讓Google可以搜尋到GitHub Page上的hexo部落格
date: 2021-02-11 17:03:29
categories:
  - hexo
tags:
  - Google Search Console
  - google-site-verification
  - SEO
  - Windows
---


提問：如何讓Google Search可以搜尋到部屬在GitHub Page上的hexo部落格？
簡答：去[Google Search Console](https://search.google.com/search-console/welcome)對Google Search註冊你的hexo部落格

大部分解🔫內收

<!-- more -->

## 本篇用語說明
- hexo blog：意指[Setup](https://hexo.io/docs/setup)時，透過`hexo init <folder>`產生，存放hexo內容的資料夾
- cmd.exe：Windows內建的命令列直譯器，按住鍵盤上的Windos鍵（通常在鍵盤左下角）加上R鍵，輸入cmd後Enter即可開啟cmd.exe
- GitHub Page：指已經完成`hexo deploy`，被部屬到GitHub Page的hexo部落格；可以透過「https://<github使用者名稱>.github.io」這個網址瀏覽。


## 步驟
1. 開啟[Google Search Console](https://search.google.com/search-console/welcome)
1. 在「網頁前置字元」輸入GitHub Page的網址
1. 選擇「其他驗證方法」中的「HTML 標記」，複製由Google提供的中繼標記
1. 進入hexo部落格在本機的資料夾
1. 進入themes資料夾→（主題名稱資料夾）→layout→_partial
1. 開啟head檔案，將前一個步驟複製起來的Google中繼標記貼到<head></head>標籤之中
1. 開啟cmd.exe，移動到`hexo blog`（`cd <hexo blog的路徑>`），執行`hexo generate --deploy`
1. 使用瀏覽器Chrome或Brave開啟「https://<github使用者名稱>.github.io」，按下F12呼叫開發者工具，確認<head></head>之間有包含Google中繼標記
1. 回到Google Search Console，點選驗證；驗證成功即代表網站註冊完成


## 筆記
提問：為什麼要把中繼標記貼到themes資料夾裡面的head檔案中？
答：每次執行hexo generate時，才會確保中繼標記都有被包進最後要部屬上GitHub的檔案裡面

提問：沒有把中繼標記的內容存下來，哪裡可以找回來？
答：
1. 進入Google Search Console，左側欄位往下捲，點選「設定」
1. 右側面板點選「使用者和權限」，點選擁有者右側的三點按鈕，點選「管理資源擁有者」，會另開新視窗
1. 點選新視窗中的「詳細資料」複製中繼標記


## 參考資料
### 整體流程
- [hexo-generator-sitemap](https://brooke01.github.io/tecblog/2020/04/26/hexo-generator-sitemap/)
- [輕鬆地提交 Hexo 部落格的 Sitemap.xml 到 Google Search Console](https://askie.today/upload-sitemap-google-search-console-seo-hexo-blog/)
### 插入meta tag的方法
- [Hexo博客Next主题SEO优化方法](https://hoxis.github.io/Hexo+Next%20SEO%E4%BC%98%E5%8C%96.html)
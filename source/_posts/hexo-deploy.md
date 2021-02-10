---
title: Windows環境：hexo從寫完第一篇文章到deploy至GitHub Page
date: 2021-02-10 19:00:23
categories: hexo
tags: hexo-deploy, Windows
---

這篇文章的主要目的：幫助初學者完成hexo deploy to GitHub Page，盡力做到詳細描述。
順便記錄把hexo blog部屬到github page過程中踩到的坑，以及如何爬出來。


## 必要前置需求
為了完成部屬（deploy），請先在電腦上安裝`git`。


## 本篇用語說明
- hexo blog：意指[Setup](https://hexo.io/docs/setup)時，透過`hexo init <folder>`產生，存放hexo內容的資料夾
- cmd.exe：Windows內建的命令列直譯器，按住鍵盤上的Windos鍵（通常在鍵盤左下角）加上R鍵，輸入cmd後Enter即可開啟cmd.exe
- GitHub Page：只要把repository設定為public，就可以免費將本機的hexo blog內容部屬到GitHub repository上，產生（線上的）blog
- 大於小於符號（<>）包起來的內容：請依照實際情況自行代換為正確的資訊、或自由發揮


## 如何建立新blog文章？
1. 確認hexo blog的路徑
1. 開啟cmd.exe，輸入`cd <hexo blog的路徑>`確保移動到hexo blog
1. 輸入`hexo new <new post的檔案名稱，不需加上.md>`；[hexo預設會產生layout為post的檔案](https://hexo.io/docs/writing)，新增的檔案會出現在`hexo blog\source\_posts`資料夾內
    - 舉例：輸入`hexo new hellow-world-post`，資料夾_posts內會出現一個新檔案：hellow-world-post.md
1. 檔案建立完畢後就可以打開來開始填內容了，~~每次開始寫文章之前都會有「這次絕對會灌出一隻恐遭鵝權協會抗議的過肥鵝肝」的幻覺~~ 🤗

以下開始說明如何把本機的hexo blog部屬到GitHub Page上🛫


<!-- more -->


## 需先調整_config.yml內容
開啟hexo blog資料夾中的`_config.yml`檔案，url、root與deploy設定請參考以下：
```
# URL
url: https://<github使用者名稱>.github.io
root: /

# Deployment
deploy:
  type: git
  repo: https://github.com/<github使用者名稱>/<github使用者名稱>.github.io.git
  branch: master
```

舉例：github使用者名為「JorgeLuisBorges」的話，`_config.yml`中的url、root與deploy分別輸入：
```
# URL
url: https://JorgeLuisBorges.github.io
root: /

# Deployment
deploy:
  type: git
  repo: https://github.com/JorgeLuisBorges/JorgeLuisBorges.github.io.git
  branch: master
```


## 開始deploy到GitHub Page
1. 登入GitHub，新建一個repository，名稱格式須為「<github使用者名稱>.github.io」，並設定為public repository
    - 舉例：github使用者名為「JorgeLuisBorges」，請把repository取名為「JorgeLuisBorges.github.io」
1. 參照[hexo官方文件的步驟2](https://hexo.io/docs/github-pages)，檢查hexo blog中的package.json是否已經填入必須內容
    - 備註：hexo 5.3版似乎已經在package.json自帶步驟2的內容
1. 確認cmd.exe目前的位置還在hexo blog內（沒有請先`cd <hexo blog的路徑>`）
1. 輸入`git init`，如果[Windows的資料夾設定為「顯示隱藏的檔案、資料夾和磁碟機」的話](https://support.microsoft.com/zh-tw/windows/%E5%9C%A8-windows-10-%E4%B8%AD%E6%AA%A2%E8%A6%96%E9%9A%B1%E8%97%8F%E7%9A%84%E6%AA%94%E6%A1%88%E5%92%8C%E8%B3%87%E6%96%99%E5%A4%BE-97fbc472-c603-9d90-91d0-1166d1d9f4b5)，這時候hexo blog資料夾中會出現一個叫做.git的資料夾
1. 輸入`git add .`，意思是**準備**把hexo blog中所有的東西（除了.gitignore檔案內列出的例外）都推上GitHub
1. 輸入`git commit -m "<輸入commit訊息>"`，commit訊息之後會顯示在repository上
1. 輸入`git push https://github.com/<github使用者名稱>/<github使用者名稱>.github.io.git source`
    - 舉例：github使用者名為「JorgeLuisBorges」，請輸入`git push https://github.com/JorgeLuisBorges/JorgeLuisBorges.github.io.git source`
1. 以上步驟成功的話，repository裡面會出現一支叫做`source`的分支（branch）
1. 參照[hexo官方文件的步驟4](https://hexo.io/docs/github-pages)，在repository中新增檔案「.github/workflows/pages.yml」，檔案內容從hexo官方文件中複製貼上即可
1. 在cmd.exe輸入`hexo clean && hexo deploy`
1. `hexo deploy`後，repository上會出現一個叫`master`的分支
1. 切換到repository的Settings分頁，GitHub Pages的Source請選擇`master`（即`hexo deploy`後新出現的master分支），並按下`Save`
1. 以上完成後，blog會出現在「https://<github使用者名稱>.github.io/」


## hexo deploy後GitHub Page沒有出現東西，嘗試修正過的內容
1. _config.yml設定theme的時候，不需要用`""`把值包起來。
一開始輸入`theme: "next"`，執行了`hexo deploy`後，就在GitHub綁定的email信箱收到Page build warning
把`""`拿掉後就正常了
不過設定成`theme: "next"`時，在localhost:4000時沒有出現任何問題🤔
1. 把_config.yml的root參數設定為`"/"`
跟theme一起把`""`拿掉並重新執行`hexo deploy`後，即可在GitHub Page上瀏覽blog，部屬成功😭
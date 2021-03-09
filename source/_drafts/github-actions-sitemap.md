---
title: 使用GitHub Actions來產生sitemap.xml
date: 2021-03-09 10:54:00
categories:
tags:
---

## 總結
使用GitHub Actions搭配`git push`指令，在每次更新網頁後自動產生sitemap.xml

## 版本與環境

## 過程紀錄
1. 在GitHub repository根目錄中建立資料夾`.github/workflows`，並在其中建立`.yml`格式的檔案來存放腳本
1. 腳本內容如下：
```YAML
name: Generate xml sitemap
# name會出現在Action標籤點開後，左側workflows的列表中

on:
  push:
    branches:
      - main # git push到main分支的時候，啟動以下腳本

jobs:
  sitemap_job:
    runs-on: ubuntu-latest
    name: Generate a sitemap
    steps:
    - name: Checkout the repo
      uses: actions/checkout@v2
      with:
        fetch-depth: 0 
    - name: Generate new sitemap
    # 參考cicirello/generate-sitemap的文件，將base-url-path的值設定為要產生sitemap的URL
      id: sitemap
      uses: cicirello/generate-sitemap@v1.6.1
      with:
        base-url-path: https://tzynwang.github.io/action-practice/
    - name: Push sitemap to repository
    # 根據cicirello/generate-sitemap文件的說明，使用者需另找方法處理透過腳本產生的sitemap.xml
    # 故追加一段git腳本內容，把方才產生出來的sitemap透過git push放到repository中
      run: |
        git config --global user.name "tzyn (GitHub Actions sitemap gen)"
        git config --global user.email "tzyn.wang@gmail.com"
        git add sitemap.xml
        git commit -m "add sitemap.xml"
        git push
```
1. 在本機執行`git push`將commit內容推到GitHub上
1. 進入repository的Actions標籤，確認腳本有在執行
1. 執行完成，確認sitemap.xml也有被加到repository中
1. 執行`git pull`將sitemap.xml拉回本機


## 參考文件
- [cicirello/generate-sitemap](https://github.com/cicirello/generate-sitemap#generate-sitemap)
- [Quickstart for GitHub Actions](https://docs.github.com/en/actions/quickstart)
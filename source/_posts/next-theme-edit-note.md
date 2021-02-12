---
title: 但是我不想拒絕修改CSS
date: 2021-02-12 15:23:22
categories:
- [hexo, next (hexo theme)]
tags:
---

因`_config.next.yml`無法滿足更新部落格文章字體大小的需求，故修改了`themes\next\source\css`內的檔案。
記錄一下本次更新了哪些值。


## themes\next\source\css\_variables\base.styl
```
// Color system
// --------------------------------------------------
$whitesmoke   = #F5F3ED;
$blue         = #ADBDC4;
```
套用了[elegant-and-classic](https://www.schemecolor.com/elegant-and-classic.php)的色票。

```
// Global text color on <body>
$text-color                   = $black-dim;
```
修改變數為`$black-dim`讓整體的文字顏色深一點。

```
// Font size
$font-size-medium         = .95em;
$font-size-large          = 1em;
$font-size-larger         = 1.125em;
$font-size-largest        = 1.25em;
```
把字體進行整體縮小。

## themes\next\source\css\_variables\Pisces.styl
```
// Settings for some of the most global styles.
// --------------------------------------------------
$body-bg-color                = #CFC9BD;
```
套用了[elegant-and-classic](https://www.schemecolor.com/elegant-and-classic.php)的色票。

```
// Sidebar
// --------------------------------------------------
$site-author-image-border-width   = 0px;
$site-author-image-border-color   = #CFC9BD;
```
覺得左側欄大頭貼邊界以整體視覺上來說有些突兀，決定拔掉。
將邊界寬度設定為0px。
前後對照如下圖：
![Author image with and without the border](author-image-border-adjust.png)

## 參考資料
[hexo(Next主题)修改文字大小](https://blog.csdn.net/dpdpdppp/article/details/102387532)
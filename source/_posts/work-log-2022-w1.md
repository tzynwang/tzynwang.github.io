---
title: 2022 第1週 學習記錄
date: 2022-01-07 23:25:47
categories:
- [React]
tags:
---

## 總結


## 筆記
### create-react-app@5.0.0
本週執行 `npx create-react-app <app-name>` 時遇到以下問題：
```
We are running `create-react-app` 4.0.3, 
which is behind the latest release (5.0.0).

We no longer support global installation of Create React App.
```

但我並沒有在 global 環境安裝 `create-react-app`，故也無從更新起，搜尋關鍵字後得到以下兩種解決方式：
1. 輸入 `npx create-react-app@5.0.0 <app-name>` ，直接標註出要使用的版本
2. 先輸入 `npx clear-npx-cache` 後再執行 `npx create-react-app@ <app-name>`

<iframe width="560" height="315" src="https://www.youtube.com/embed/Q7i8kDJGyHE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Declarative programming, Imperative programming
- Declarative programming: what you want from the program (React)
- Imperative programming: how should the program work, how you solve the problem (the algorithm, the steps to reach the goal)


## 參考文件
- [We no longer support global installation of Create React App](https://dev.to/arjuncodes/we-no-longer-support-global-installation-of-create-react-app-2p)

- [Imperative vs Declarative Programming](https://youtu.be/yOBBkIJBEL8)
- [HTML IS a Programming Language (Imperative vs Declarative) - Computerphile](https://youtu.be/4A2mWqLUpzw)
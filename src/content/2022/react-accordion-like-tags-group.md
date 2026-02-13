---
title: 2022 第27週 實作筆記：手風琴 (accordion) 分組元件
date: 2022-07-10 10:26:37
tag:
  - [React]
---

## 總結

負責的專案未來有類似需求，試做一下練個手感

![accordion demo](/2022/react-accordion-like-tags-group/demo.png)

展示：[https://tzynwang.github.io/react-accordion-like-tags-group/](https://tzynwang.github.io/react-accordion-like-tags-group/)
完整原始碼：[https://github.com/tzynwang/react-accordion-like-tags-group](https://github.com/tzynwang/react-accordion-like-tags-group)

## 開發思路

<script src="https://gist.github.com/tzynwang/fd1bcbd91bfe5216b06bcb6c4e48b789.js"></script>

- 11 至 54 行：模擬後端回傳的組 (parent) 與標籤 (tags) 資料
- 55 行：設定畫面上每三個「組」為「一行」資料
- 86 至 98 行：模擬透過 api 取得組與標籤資料，並將之保存到元件的 states 中
- 99 至 131 行：
  - 首先將組 (parent) 分割為「行」（每三組一行，使用 `lodash.chunk` 協助將資料切為三塊一組）
  - 於 101 至 129 行將「每一行」的「三組資料」做成「三組 UI 介面」，並於 106 行綁上 `handleGroupClick` 讓使用者可與其互動
  - `handleGroupClick` 的行為參考 68 至 76 行：觸發時會一併設定「使用者現在點擊了哪一行 (`setCurrentRow(row);`)」與「使用者點擊了哪一組 (`setCurrentGroup(/* ... */);`)」這兩類資料
  - 在這邊準備好的 `rows` 資料會在第 142 行展開，並每一行 (`row`) 會在第 152 行被渲染在畫面上
- 156 至 186 行：這邊負責渲染「使用者點選『組』後會看到該組全部『標籤』」的容器（參考螢幕截圖中灰底的部份）
  - 目前的邏輯是「一次只會展開一組標籤容器」，所以 156 行會根據 `currentGroup` 的值以及 `currentRow === rowsIndex` 與否來決定容器是否該呈現在畫面上
- 以上邏輯的整體表現：使用者點選「組」時，會展開該行下方的標籤容器，標籤容器會包含該「組」所有的標籤；並目前的畫面一次只會展開一個標籤容器

### 其他

這次使用 `.nvmrc` 來進行 node 版本控制：先透過 `nvm use {version}` 來切換到需求版本，再透過 `node -v > .nvmrc` 將版本寫入 `.nvmrc` 即可

## 參考文件

- [How to write a .nvmrc file which automatically change node version](https://stackoverflow.com/questions/57110542/how-to-write-a-nvmrc-file-which-automatically-change-node-version)

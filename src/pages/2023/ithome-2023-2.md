---
layout: '@Components/pages/SinglePostLayout.astro'
title: 捨棄 create-react-app 之餘還架了個 astro blog 昭告天下：設定 package.json
date: 2023-09-17 08:31:14
tag:
	- [2023鐵人賽]
banner: /2023/ithome-2023-2/jessica-ruscello-OQSCtabGkSY-unsplash.jpg
summary: 面對全新全空的專案資料夾，首先從設定 package.json 開始。今天的範圍是語意化版本（semantic versioning）以及 Node.js 的環境管理器（version manager）
draft:
---

今天是捨棄 create-react-app template 的第一天。面對全新全空的專案資料夾，首先從設定 package.json 開始。

提示：本次鐵人賽關於 package.json 的設定內容，基本上都是根據過去開發經驗累積出來的結論，一定包含主觀內容。我的設定內容歡迎你參考，但如果有讓你感覺疑惑、或是「這樣寫根本弄錯了吧？」的部分，也非常歡迎留言討論 (`・ω・´)

## 本文

### 設定 name 與 version

首先設定專案名稱（name）與版本（version）資訊。另外在專案沒有要作為套件發佈到 [npm](https://www.npmjs.com/) 時，設定為 `private: true`

```json
{
  "name": "ithome-2023",
  "version": "1.0.0",
  "private": true
}
```

個人習慣開場時直接將版號設定為 `1.0.0`，代表在專案正式上線之前的更動都不會納入版號計算中。

而針對上線後的版號跳號，規則如下（基本等同 [npm Docs](https://docs.npmjs.com/about-semantic-versioning) 的做法）：

1. 直接修正正式站（master branch）的錯誤時，進最小版號，比如 `1.0.0` 變為 `1.0.1`
2. 遵循通常的新功能發布流程時，進中間版號，比如 `1.0.0` 變為 `1.1.0`
3. 整個專案有架構上的打掉重練、外觀完全翻修等大規模的改動時，改最大版號，比如 `1.0.0` 變為 `2.0.0`

### 指定環境版本

透過 `engines` `node` 鍵值可以指定「本專案使用的 JavaScript 環境版本」資訊：

```json
{
  "name": "ithome-2023",
  "version": "1.0.0",
  "private": true,
  "engines": {
    "node": "20"
  }
}
```

撰文當下最新的長期支援（LTS, Long-term support）版本為 Node.js 20（參考[官方網站](https://nodejs.dev/en/about/releases/)）。除非有特殊需求、或是專案使用的套件有額外限制，不然會盡量讓專案的開發環境能搭上官方最新的長期支援版本。

可直接在終端輸入 `node -v` 來確認現在的環境版本為何。而當目前的環境與專案開發指定的版本不一致時，可透過版本管理器（Version Manager）來依照需求切換環境版本。

### 使用版本管理器切換環境

常見的 Node.js 版本管理器為 `nvm`。安裝完畢、移動到目的地資料夾時，只要該資料夾內有 `.nvmrc` 檔案，於終端執行 `nvm use` 後，即會將環境切換到 `.nvmrc` 指定的版本。

以上是簡化非常多的說明，完整的安裝與工具操作指南請參考[官方文件](https://github.com/nvm-sh/nvm#readme)。

---

給真的沒空讀完官方文件的人的 take away：可以將 `nvm` 設定成「移動到資料夾時，自動偵測 `.nvmrc` 並切換至對應的 Node.js 版本」，自動指令請從[官方說明](https://github.com/nvm-sh/nvm#deeper-shell-integration)複製，並根據你的終端使用 `bash` `zsh` 或 `fish` 在檔案 `$HOME/.zshrc` 中貼上不同內容。

---

除了 `nvm` 以外，個人最近也有嘗試使用 Rust 撰寫的 [fnm](https://github.com/Schniz/fnm)，速度飛快，體驗極度良好，且也支援自動偵測＋切換。有興趣的朋友可以給個機會 (ゝ ∀･)

### 記得存擋

現在資料夾裡有些東西了，如果你還沒 `git init` 的話，現在差不多可以開始存檔了。

## 總結

本日重點回顧：能根據套件修改內容來更新合適版號，並且能透過 `engines` `node` 來指定專案的 Node.js 環境版本。還有記得存檔（`git`）。

![no auto save in real life](/2023/ithome-2023-2/neir-automata-no-auto-save.jpg)

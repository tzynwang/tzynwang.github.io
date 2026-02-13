---
title: 如何指南：透過 git hook pre-commit 處理程式碼自動格式化（format），再見了 npm run format
date: 2024-11-02 11:06:14
tag:
  - [git]
banner: /2024/how-to-git-hook-pre-commit-prettier/josh-calabrese-zcYRw547Dps-unsplash.jpg
summary: 此篇筆記會說明如何使用 git hook pre-commit 來自動格式化「處於 git stage 階段的檔案」，確保被 git commit 的都是已經格式化後的內容
draft:
---

## 懶人包

這篇筆記會告訴你如何設定 git hook `pre-commit` 來讓 prettier （或其他任何你偏好的 format/lint 工具）自動在檔案被 git stage 時，先格式化其內容，確保最終 commit 的程式碼都已經整理妥當。~~可以捨棄 package.json 裡的 `npm run format` 啦。~~

簡單來說只有兩個步驟：

1. 設定 git 的 hooksPath 路徑
2. 設定 .git/hooks/pre-commit 指令

## 設定步驟

1. 安裝 prettier （或任何你要拿來執行 format/lint 的工具）
2. 進入需要自動排序的 repo 資料夾中，透過指令 `git config --local core.hooksPath .git/hooks` 來設定此 repo 的 git hook 腳本路徑位置
3. 開啟該 repo 的 pre-commit 檔（如果只有找到名為 pre-commit.sample 的檔案，請刪掉名稱中的 .sample 字樣），並貼上以下腳本（注意如果格式化工具不是 prettier，則 `./node_modules/.bin/prettier --write` 請換成該工具的腳本）：

```bash
#!/bin/bash
FILES=$(git diff --name-only --cached --diff-filter=ACMR | sed 's| |\\ |g')
[ -z "$FILES" ] && exit 0

echo "$FILES" | xargs ./node_modules/.bin/prettier --write

echo "$FILES" | xargs git add

exit 0
```

存擋，然後執行指令 `chmod +x .git/hooks/pre-commit` 來開啟執行此腳本的權限。好了，就這樣 🌚

## 其他你可能想知道的

### IT DOES NOT WORK

🤨 我把檔案 git stage 並且 commit 了，但自動格式化沒有發生欸？

👉 可檢查項目：

1. 確認 git hook 腳本檔案名稱的 .sample 已經刪掉
2. 先修改一些檔案，然後在 repo 的根目錄直接執行 `.git/hooks/pre-commit`，看格式化是否有發生；若有，請檢查 `git core.hooksPath` 是否設定正確（應該要是 `.git/hooks`）

### 腳本逐行解說

`FILES=$(git diff --name-only --cached --diff-filter=ACMR | sed 's| |\\ |g')`

- `git diff --name-only --cached --diff-filter=ACMR` 代表「過濾出那些被 git stage 起來，並改動屬於 Add/Copied/Modified/Renamed 的檔案」，然後把符合這個條件的檔案們保存到變數 `FILES` 中
- `sed 's| |\\ |g'` 負責處理檔名中的空白符（若有）

---

`[ -z "$FILES" ] && exit 0`

代表如果 `FILES` 為空，就終止腳本（結束程序）。

---

`echo "$FILES" | xargs ./node_modules/.bin/prettier --write`

代表對 `FILES` 中的每一個檔案執行 `./node_modules/.bin/prettier --write`（實際執行格式化的是這行程式碼）。如果你用的不是 prettier 那 `prettier --write` 請替換成該工具的指令。

---

`echo "$FILES" | xargs git add`

這行會將所有排序後的檔案加回 git stash 中。最後透過 `exit 0` 結束整個「在 git commit 前，先對所有被 git stage 起來的檔案執行格式化」的程序。

## 參考文件

- [Prettier Pre-commit Hook: Shell script](https://prettier.io/docs/en/precommit.html#option-4-shell-script)
- [git pre- and post- commit hooks not running](https://stackoverflow.com/a/49912720)
- [Git list of staged files](https://stackoverflow.com/a/33610683)

---
title: 如何讓人認真看待你的 PR？或是你其實可以拒看過胖的 PR 嗎？
date: 2024-10-31 19:28:49
tag:
	- [General]
banner: /2024/how-to-code-review/christian-rucinski-9-emauS-yBQ-unsplash.jpg
summary: 此篇是 NDC Oslo 議程 Looks GREAT To Me 的自用筆記。講者針對 PR/MR 的作者（author）和審查者（reviewer）分別提出了一些 Dos 和 Don'ts。
draft: 
---

此篇是 NDC Oslo 2024 議程 [👍 Looks GREAT To Me: Getting Past Bare Minimum Code Reviews - Adrienne Braganza Tacke](https://www.youtube.com/watch?v=zxHRYRxBNVE&ab_channel=NDCConferences) 的自用筆記。講者針對 PR/MR 的作者（author）和審查者（reviewer）分別提出了一些 Dos 和 Don'ts。

## 此篇筆記中的名詞定義

- PR: pull request
- MR: merge request
- 作者（author）：發起 PR/MR 的開發者
- 審查者（reviewer）：決定該 PR/MR 是否能被合併的開發者

## 筆記本體

### PR/MR 作者應該做到的事情

重點：在指定審查者之前，**作者要先檢查該 PR/MR 是否確實已經達到「可以被審查」的狀態**。

「寫完」跟「這段程式碼已經準備好被審查」是兩碼子事。「寫完」代表完成功能、修好 bug，但不一定代表這些程式碼已經被整理到「可以讓其他人**專注於檢查程式碼品質**，確認其是否達到能合併的程度」。

以下是一些「雖然程式碼確實已經寫完，但會讓審查者頭很大」的例子：

- 過於籠統的 MR/PR 標題（「修正電話號碼檢查問題」）與描述（「修正日文版網站付款問題」）
- 沒有遵守規定好的 lint/format 格式（或是任何團隊開發規範）
- 在一隻 PR/MR 製造過量（比如超過 500 行或 20 個檔案）的有意義改動

在要求審查以前，可以執行以下檢查來確保你的程式碼能收到應有的回饋：

- 在標題具體說明這隻 MR/PR 的目標（「修正在日文版網站的付款流程中，沒有阻擋使用者輸入非日本區電話號碼的問題」），並在描述區提供脈絡（需求從何而來、合併後的預期結果、關聯的 issue 或設計稿等⋯⋯）
- 透過自動化工具、腳本來處理掉 lint/format 之類的工作，不要讓審查者花心思在那些能自動化處理的事情上
- 確保 MR/PR **只有一個目標**，所有的程式碼、改動都只為了達成該目標；如果一個 MR/PR 的**改動範圍大到連你自己都沒有耐性看完，那就下修到你能看完的程度**

### PR/MR 審查者應該做到的事情

重點：專注於確保程式碼的**品質**，並**確實審查每一行程式碼**。

這兩件事可以先從提供**具體**的回饋開始。如果你希望作者修改程式碼，就**明確指出**何處應該被修改，並說明**為什麼**應該要修改——所有的修改都要帶來**明確、能量化的改善**（而不是因為「我感覺這樣寫比較好」所以「你應該要改」）。

議程中介紹了 request/rationale/result （需求、理由、預期結果）的建議模板，如果你完全沒有頭緒，可以參考以下「建議將某 method 移到更合適的位置」與「建議使用更有辨識度的變數命名」的範例：

![example: moving a method](/2024/how-to-code-review/example-moving-a-method.png)

![example: a more meaningful variable name](/2024/how-to-code-review/example-a-more-meaningful-variable-name.png)

再來，查程式碼並**不是一個讓審查者展現自己有多厲害的場合**，審查的目的是確保程式碼的品質足夠合回去。因此，如果該 PR/MR 的改動範圍實在太大，審查者應該主動要求作者進行拆分，而不是眼睛一閉直接按下去。

請記得審查者本身也有責任避免 repo 中出現有問題的程式碼，而不是雙手一攤讓提出 PR/MR 的作者承擔出現 bug 的全部責任。

## 參考

[👍 Looks GREAT To Me: Getting Past Bare Minimum Code Reviews - Adrienne Braganza Tacke](https://www.youtube.com/watch?v=zxHRYRxBNVE&ab_channel=NDCConferences)

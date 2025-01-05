---
title: 工程師的易用性測試（Usability Testing）筆記
date: 2023-11-11 15:15:24
tag:
- [MWC 2023]
- [Product Design]
banner: /2023/mwc-2023-usability-testing/ignacio-amenabar-2dkgXTfPfTg-unsplash.jpg
summary: 早一點進行易用性測試，少一點機會回頭修改做好的東西 🫠
draft: 
---

## 總結

此篇筆記是根據 MWC 2023 議程「[易用性測試-你的程式不在乎使用者，所以你的使用者不在乎你的程式](https://modernweb.tw/2023/session-page/2449)」加上個人理解而產出的筆記。會提到易用性測試的定義、與用戶驗收測試（User Acceptance Testing）的差異，以及前端工程師如何能受惠於易用性測試。

## 筆記

### 何謂易用性測試

- 確認產品對使用者來說是「好用」的
- 可以在開發階段的任何週期執行，**可以在工程師執行開發前執行**
- 可以重複執行

### 何謂用戶驗收測試

- 確保產品符合規格需求，功能沒有少、沒有錯誤
- 通常在正式發佈前執行

但用戶驗收測試僅會檢驗產品的功能是否正確，不關心產品是否「好用」。

以前端開發舉例：工程師做了符合規格要求的「書籤」——使用者點擊書籤按鈕後，會透過 api 通知後端「使用者將某資源保存到書籤中」，並畫面上會有對應的動畫提示。但使用者按下書籤後，卻不曉得自己可以到哪裡查看所有已經加到書籤的內容，或使用者根本不明白「書籤」到底代表什麼。

這樣的產品能通過用戶驗收測試，但大概無法通過易用性測試。

### 如何執行易用性測試

個人認為前端工程師不需要執行完整的易用性測試——重點是在**實際動手開發**前，確保設計稿不會有太誇張的易用性問題（比如按鈕太擠導致在手機上不好操作、或是使用者根本不知道原來那是一顆可以互動的按鈕），避免東西做好，但使用者不會用，讓工程師得再花時間進行修改。

濃縮版本的易用性測試重點如下：

1. 確認測試範圍，列出自己想要測驗設計稿中的哪些部分
2. 定義測試情境，以及何謂測試成功
3. 根據測試結果，將待改善項目根據重要（嚴重）程度進行排序
4. 將測試結果分享給團隊

時間有限，重點要放在改善最要命的問題上。且要與團隊分享測試結論，讓大家都知道現在發生什麼事情、以及接下來會有哪些代辦事項。

## 參考文件

- [Interaction Design Foundation: Usability Testing](https://www.interaction-design.org/literature/topics/usability-testing)
- [Stanford University: User Acceptance Testing](https://uit.stanford.edu/pmo/UAT)
- [YouTube: How to Conduct Usability Testing](https://www.youtube.com/watch?v=xuq4mTh50p4&ab_channel=MasterUXResearch)

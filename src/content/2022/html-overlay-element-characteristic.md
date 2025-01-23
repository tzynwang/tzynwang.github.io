---
title: 2022 第46週 閱讀筆記：Dialogs, modality and popovers seem similar. How are they different?
date: 2022-11-20 10:39:09
tag:
- [HTML]
---

## 總結

參考文章 [Dialogs, modality and popovers seem similar. How are they different?](https://hidde.blog/dialog-modal-popover-differences/) 的內容，整理了一些 UI 特性與實作元件的筆記。

## 筆記

### 特性

#### modal/modality

當一個有 modal 特性的元件在被開啟時，使用者無法與該元件以外的內容進行互動（沒有包含在 modal 元件中的內容會進入 inert 狀態），等於使用者的注意力被強制停留在元件上。

modal 特性的元件會有流程中斷的效果，除非必要，不然不應該經常讓有 modal 特性的元件來干擾使用者與產品的互動。

#### top layer, backdrop

top layer 讓元件必定出現在畫面最上方，而根據 [Fullscreen API](https://fullscreen.spec.whatwg.org/#top-layer) 文件內容，每一個在 top layer 中的元件都會附帶一個 `::backdrop` 偽元件。

> [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/::backdrop): The `::backdrop` CSS pseudo-element is a box the size of the viewport which is rendered immediately beneath any element being presented in fullscreen mode. This includes both elements which have been placed in fullscreen mode using the Fullscreen API and `<dialog>` elements.

使用 `<dialog>` 標籤搭配 `HTMLDialogElement.showModal()` 來開啟元件時，支援此標籤的瀏覽器除了在畫面最上方繪製對話框元件外，也會為此元件附上 `::backdrop` 偽元件作為背景。

#### inert

使用者無法與帶有 `inert` 屬性的元件互動：

> MDN: The HTMLElement property `inert` is a boolean value that, when present, makes the browser **"ignore" user input events for the element**, including **focus events** and events from assistive technologies. The browser may also ignore page search and text selection in the element. This can be useful when building UIs such as modals where you would want to "trap" the focus inside the modal when it's visible.

#### explicit/light dismiss

- explicit dismiss: 當使用者點擊元件上的關閉鈕或按下鍵盤 esc 時，關閉該元件
- light dismiss: 滿足一定條件時，元件會自動關閉。比如 toast 元件會在時間倒數完畢後自動消失，或是參考以下動畫，當使用者移動到不同的功能按鈕（或點擊選單範圍外的地方）時，下方的選單會自動關閉：

![explicit dismiss and light dismiss](/2022/html-overlay-element-characteristic/light-dismiss-example.gif)

### 元件

#### dialog

dialog 元件不一定會有 modal 特性，參考以下兩張螢幕截圖：

![example of modal dialog](/2022/html-overlay-element-characteristic/dialog-modal.png)

這是 slack 在設定連結時會開啟的對話框元件，擁有 modal 特性，除非使用者設定完連結或是主動點及關閉按鈕，否則無法與畫面剩下的部分進行互動。

![example of non modal dialog](/2022/html-overlay-element-characteristic/dialog-non-modal.png)

這是 gmail 的 non-modal 類對話框元件，使用者即使開啟了「撰寫信件」的對話框，依舊可以與畫面剩下的部分進行互動。

#### popover

在 [open-ui.org 現階段的提案](https://open-ui.org/components/popup.research.explainer)中，被視為一種新的「屬性」（不像 `dialog` 是元件）。擁有此類屬性的元件通常會有以下特徵：

- 會出現在畫面最上層，不會被其他內容覆蓋
- 不會一直維持可見度，參考上方的 light dismiss 範例，在一定情況下會自動從畫面上消失
- 通常一次只會顯示一個有此屬性的元件

Material UI 中的 [Menu](https://mui.com/material-ui/react-menu/#main-content) 與 [Tooltip](https://mui.com/material-ui/react-tooltip/#main-content) 元件都是帶有 popover 屬性的元件。而提案中的 popover 屬性即是希望能透過 HTML 原生元件來滿足這類型 UI 的需求（而不是透過 lib 來實現）。

## 參考文件

- [Dialogs, modality and popovers seem similar. How are they different?](https://hidde.blog/dialog-modal-popover-differences/)
- [MDN: dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [MDN: ::backdrop](https://developer.mozilla.org/en-US/docs/Web/CSS/::backdrop)
- [MDN: HTMLDialogElement.showModal()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal)

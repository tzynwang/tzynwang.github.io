---
title: 何謂危險操作（dangerous action）？如何避免？
date: 2024-10-05 15:06:33
tag:
	- [Product Design]
banner: 2024/product-design-dangerous-action/sandy-millar-yvpexJFLTSU-unsplash.jpg
summary: 此篇為 How To Manage Dangerous Actions In User Interfaces 的閱讀筆記，記錄了一些「能減少使用者執行危險操作」的產品開發心法。
draft: 
---

此篇為 [How To Manage Dangerous Actions In User Interfaces](https://www.smashingmagazine.com/2024/09/how-manage-dangerous-actions-user-interfaces/) 的閱讀筆記，記錄了一些「能減少使用者執行危險操作」的產品開發心法。

## 何謂危險操作

指「一旦執行，狀態就不容易復原」的行為。比如：

- 寄出電子郵件
- 轉帳
- 在沒存檔的情況下關閉瀏覽器
- 刪除檔案、權限、帳號
- 在購物網站下訂單

## 如何避免危險操作

產品應設計成**不易讓使用者犯錯**的形式：

> Good error messages are important, but the best designs carefully **prevent problems from occurring** in the first place. Either **eliminate (remove) error-prone conditions** or check for them and present users with a confirmation option before they commit to the action.

產品也應該要有**回復狀態（軟刪除、延後執行、版本控制）**的功能。如果使用者的操作可逆，那麼即使執行不正確的操作，也不會造成永久性傷害。

但不是每個舊有產品（legacy product/code）都有辦法追加回復狀態的功能，所以產品介面上的提示還是有其必要 🌚 這類提示可以分成兩大類：

- 透過 modal/inline guard/verify code（輸入驗證碼來推進流程）來**中斷操作流程**，讓使用者~~冷靜一下~~確定他真的要執行某行為；注意**常用功能不該被提示打斷流程**，這會讓使用者養成忽略提示的習慣 😡
- 將危險操作**集中到一處**（比如 GitLab 的 danger zone），讓使用者意識到此處的操作都會造成不易復原的影響

最後，透過**多人決議制**（比如 mr/pr 時一定要指定審核者）也能降低犯錯的風險。

---

以筆記最上方提到的行為為例，它們可以透過以下方式來化解使用者的危險操作：

- 寄出電子郵件：回復狀態（延後執行）
- 轉帳：中斷操作流程（輸入驗證碼）
- 在沒存檔的情況下關閉瀏覽器：中斷操作流程（執行 window.alert）
- 刪除檔案、權限、帳號：中斷、集中操作流程
- 在購物網站下訂單：回復狀態（取消訂單）

---
layout: '@Components/pages/SinglePostLayout.astro'
title: 閱讀筆記：The Programmer's Brain Chapter 7 Misconceptions -- Bugs in thinking
date: 2023-07-31 20:06:27
tag:
  - [General]
---

## 總結

此篇是 Good Code, Bad Code: Think like a software engineer 第七章（Misconceptions: Bugs in thinking）的閱讀筆記。

本章超過一半的篇幅在討論「（工程師在）已學會一種程式語言的前提下，學習第二套程式語言是否會更簡單」（答案是不一定，腦中的模型可能會幫助工程師理解、也可能讓工程師帶著錯誤的預設立場來學習新的語言）。但個人比較有興趣的重點如下：

- 一段被認為應該要能動的程式卻出錯，一個可能的理由是代表工程師對該段程式碼的理解出現誤解（misconception）
- 誤解很難被直接移除，修正誤解比較有效的方式是「以正確的新概念取代舊的錯誤概念」

## 筆記

> ...bugs can also have a deeper underlying reason, where you **made a faulty assumption about the code at hand**. When you are sure your code will work, but it still fails, chances are that you are suffering from a **misconception**.

程式碼運行不如預期時，代表工程師對該段程式碼的假設有誤。而要修正腦中錯誤的假設，僅僅認知到「我的假設不對」並不會特別有幫助。真正有效的做法是要找出一個「正確的新觀念」來取代過去做出的錯誤假設。參考書中敘述：

> Misconceptions are **faulty ways of thinking held with great confidence**. Often, it is not enough to point out the flaw in their thinking. Instead, to change a misconception, the faulty way of thinking **needs to be replaced with a new way of thinking**.

這部分令人回想起快思慢想中關於 system 1 與 system 2 ：人腦中的 system 1 反應迅速，但給出的答案卻不一定正確。慢想（system 2）耗費力氣，但比較能做出合理、正確的解答。

<hr />

最後的重點：如果已知程式碼部分段落會讓工程師產生誤解，那麼加上測試與文件會是消除誤解的有效方式。

> If you’ve discovered a misconception, in addition to **adding a test**, you might also want to **add documentation in relevant places** to prevent yourself and other people from falling into the same trap.

個人經驗：修 bug 時，在發生修改的位置留下註解說明修改的前因後果、並附上關聯 issue 可以有效避免過了幾個月後出現「我想不起來當初為什麼要這樣改，現在如果又加新東西，到底危不危險」的問題。

當然如果可以的話，留下註解以及追加單元測試是最保險的。

## 參考文件

- [Manning: The Programmer's Brain](https://www.manning.com/books/the-programmers-brain)
- [維基百科：學習遷移](https://zh.wikipedia.org/zh-tw/%E5%AD%A6%E4%B9%A0%E8%BF%81%E7%A7%BB)

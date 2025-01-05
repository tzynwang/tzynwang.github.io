---
title: 閱讀筆記：The Programmer's Brain Chapter 2 Speed reading for code
date: 2023-06-25 14:40:31
tag:
- [General]
---

## 總結

此篇文章是 Good Code, Bad Code: Think like a software engineer 第二章（Speed reading for code）的閱讀筆記。雖然章節標題是「速讀程式碼」，但實際讀後的重點歸納感覺是：

1. 人的短期記憶容量極短，需要長期記憶中的內容來協助閱讀、理解程式碼
2. 增加長期記憶中關於程式碼的知識，可以幫助降低閱讀程式碼時的困難度
3. 撰寫程式碼時，透過設計模式（design patter）、註解（comments）與顯著信標（explicit beacons）也有助於降低理解程式碼的困難度

## 筆記

### 為何需要速讀

書中引用的數據表示工程師有超過半數的工時是花在「閱讀既有的程式碼」而非「撰寫程式碼」，因此，較強的閱讀理解力能夠幫助工程師更快地完成工作。

> Research indicates that **almost 60% of programmers’ time is spent understanding rather than writing code**. Thus, improving how quickly you can read code, without losing accuracy, can help you improve your programming skills substantially.

本書作者認為工程師讀 code 通常不出以下幾種理由：

1. 尋找合適的位置來實作新功能
2. 找出 bug 發生的位置
3. 為了得知某個功能當初是如何實作的

### 閱讀時的認知活動

閱讀程式碼同時需要短期記憶與長期記憶的互相配合。短期記憶負責保存閱讀途中看到的變數，長期記憶負責幫助你理解程式碼的語法（比如迴圈或是 `Array.push()` 等概念）。

而如果一段程式碼中充斥太多長期記憶中沒有的內容，就會造成理解困難。因為人類的短期記憶容量極其有限，閱讀時需要透過長期記憶中的內容來幫助「分塊（chunking）」接收到的內容。能夠被分塊的內容越多，理解起來就會越容易。

可參考以下三張圖，這三張圖中的符號「種類數量」與每種符號的「出現數量」都是一致的，但要背誦三張圖的內容難易度卻有所不同。最後一張的「cat loves cake」最容易記憶，理由是：我們可以透過「分塊」來把圖中的符號變成有意義的內容，背誦就不再困難。

![chunking 1](/2023/the-programmers-brain-ch2-speed-reading-for-code/CH02_F03_UN01_Hermans2.png)

![chunking 2](/2023/the-programmers-brain-ch2-speed-reading-for-code/CH02_F03_UN02_Hermans2.png)

![chunking 3](/2023/the-programmers-brain-ch2-speed-reading-for-code/CH02_F03_UN03_Hermans2.png)

> The more information you have stored about a specific topic, the easier it is to effectively divide information into chunks.

### 如何寫出好理解的程式碼

書中提到三種可以讓人更好理解程式碼的寫扣技巧：

1. 使用設計模式（design patter）：透過長期記憶中的知識，讀者可以透過辨認模式來降低短期記憶中需要承載的內容
2. 提供高層次資訊的註解（comments）：能夠提供關於功能摘要、或是商業邏輯的註解能夠幫助理解程式碼。如果只是單純把程式碼翻譯成人類文字（比如 `increase x by one here` 這類）反而會降低閱讀時的流暢度
3. 使用顯著信標（explicit beacons）：書中對於此類提示的解釋是「能夠幫助讀者理解該段程式碼的關鍵內容、關鍵字」

> Beacons are parts of a program that **help a programmer understand what the code does**. You can think of a beacon like a line of code, or even part of a line of code, that your eye falls on which makes you think, “Aha, now I see.”

參考以下的 python 範例，本書作者認為下方程式碼中的 `self.left` `self.right` `root` 與 `print("Contents of the tree are")` 都能歸納到「顯著信標」這個類別中。

```python
# A class that represents a node in a tree

class Node:
   def __init__(self, key):
       self.left = None
       self.right = None
       self.val = key


# A function to do in-order tree traversal
def print_in_order(root):
   if root:

       # First recur on left child
       print_in_order(root.left)

       # then print the data of node
       print(root.val)

       # now recur on right child
       print_in_order(root.right)


print("Contents of the tree are")
print_in_order(tree)
```

## 參考文件

- [Manning: The Programmer's Brain](https://www.manning.com/books/the-programmers-brain)

---
layout: '@Components/pages/SinglePostLayout.astro'
title: ALPHA Camp 2-1 S1作業：技術筆記
date: 2021-04-20 09:42:02
tag:
  - [JavaScript]
---

2021/4/21 更新：
經同學提醒`replace()`只會處理目標字串中的「第一組」目標，亦即：當我要處理的字串中包含重複的字母時，使用`replace()`來處理字串可能會導致非預期結果（因為`replace()`只會處理「符合目標的第一個字母」），故追加新解法。

## 總結

記錄 2021 年 ALPHA Camp 學期 2-1（四月班）第一週課程「JavaScript 核心觀念」作業中有使用到的技術與相關筆記。

使用到的`methods`一覽：

- [Math.floor()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor)：取最大整數
- [Math.random()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)：注意`Math.random() * X`的範圍是`0`到`X - 1`（不包含`X`本身）
- [String.fromCharCode()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode)：根據傳入 Unicode 回傳相對應的 string
- [String.prototype.padStart()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart)：補位用
- [String.prototype.replace()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)：將字串中符合比對的段落更換為指定內容後，回傳新字串
- [String.prototype.charAt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt)：回傳位在指定 index 位置的字串
- [String.prototype.substring()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring)：回傳指定範圍內的字串
- [String.prototype.indexOf()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf)：回傳第一個符合搜尋目標的 index
- [Array.prototype.splice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)：在本次作業情境中，被用來刪除陣列內容（沒有執行插入）
- [Array.prototype.includes()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)：檢查陣列中是否有指定內容
- [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)：將所有傳入的內容進行篩選動作，回傳符合篩選條件的內容
- [Array.prototype.indexOf()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)：回傳第一個符合搜尋目標的 index
- [Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)：對陣列中的每一個項目執行傳入的 function
- [Array.prototype.push()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)：新增一內容到陣列最尾端
- [Array.prototype.pop()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)：移除陣列「最末端」的「一個」內容

<!-- more -->

## A1 部分作業

### Q1：產生隨機英數字串組

要求：

- 分別、獨立產生六個字符
- 前兩個字符為大寫英文字母
- 後四個字符為數字

解題邏輯：

- 大寫字母有兩種產生方式：
  - 宣告一組全大寫字母的字串`ABCDEFGHIJKLMNOPQRSTUVWXYZ`，配合`Math.floor(Math.random() * 26)`來隨機挑選字母
    ```js
    let ticket = ''
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    ticket += letters[Math.floor(Math.random() * 26)] // 隨機挑選letters字串中的字母
    ```
  - 使用`Math.floor(Math.random() * 25) + 1`搭配`String.fromCharCode()`將數字轉換為大寫字母
    ```js
    let ticketChar1 = Math.floor(Math.random() * 25) + 1
    ticketChar1 = String.fromCharCode(64 + ticketChar1)
    ```
    - [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode) `String.fromCharCode()`: returns a string created from the specified sequence of **UTF-16 code units**.
    - [UTF-16 Table](https://asecuritysite.com/coding/asc2)
- 產生四位數字：使用`Math.floor(Math.random() * 10000)`隨機產生 0-9999 的數值，並搭配`.toString().padStart(4, '0')`將未滿四位數的數值補 0

解法（直接包裝為函式）：

```js
function generateTicket () {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const ticketLetters = `${letters[Math.floor(Math.random() * 26)]}${letters[Math.floor(Math.random() * 26)]}`
  const ticketNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `${ticketLetters}${ticketNum}` // 回傳「兩個大寫英文字母＋四位數字組合」的彩券號碼
}
```

筆記：

- `Math.random()`會隨機產生 0（不含）至 1（不含）之間的任意小數
- 將`Math.random()`得到的結果乘以`x`並搭配`Math.floor()`，即可隨機產生一個「不大於`x`的整數」
- 舉例：`Math.floor(Math.random() * 7)`會回傳 0-6 之間的任意整數

### Q2：加密姓名

要求：

```js
// input
let name = 'Bernard'

// output should be 'Be*****'
console.log(name)
```

- 名字的總長度不變
- 顯示前兩個字母
- 剩下改成`*`

解題邏輯：

- 遍歷字串
- 字串中除了首二位的字母外，其他字母都替換為`*`

2021/4/21 更新：
以下「舊版解法」不盡然正確，因為`replace()`只會處理「第一個」符合目標的字母。
如果`name`中有重複的單字，那麼「其餘的」字母都不會被處理到；在這裡使用`replace()`來進行字串操作並不是最佳解。

舊版解法：

```js
for (const n in name) {
  if (n > 1) name = name.replace(name.charAt(n),'*')
}
console.log(name) // Be*****
```

舊版解法包裝為函式：

```js
function encodeName (name, replaceTo, startIndex = 2, endIndex = name.length) {
  for (const n in name) {
    if (n >= startIndex && n < endIndex) name = name.replace(name.charAt(n), replaceTo)
  }
  return name
}

console.log(encodeName('Bernard', '*')) // Be*****
```

- `name`：傳入需打碼的名字
- `replaceTo`：代表要以何種字符遮蔽`name`的內容
- `startIndex`：代表`name`需從哪一個字母開始進行打碼動作
  - index 為 zero-based；比如「Morgan」的 M 其 index 為 0、M 後面的 o 其 index 為 1⋯⋯ 以此類推
  - 預設從第三個（index = 2）字母開始打碼，可透過傳入其他值來調整打碼範圍
- `endIndex`：代表`name`的打碼到哪一個字母停止
  - index 為 zero-based
  - 預設打碼到最後一個字母為止，可透過傳入其他值來調整打碼範圍

筆記：

- `name.replace(name.CharAt(n), replaceTo)`白話文如下：
  將`name`位於 index `n`（`CharAt(n)`）的字母替換為`replaceTo`內容
- 一個函式「擁有預設值的 parameters」要放在「沒有預設值的 parameters」之後，以下為例

  ```js
  function encodeName (name, startIndex = 2, endIndex = name.length, replaceTo) {...}
  // encodeName('Morgan', '*')會導致startIndex被覆蓋為*，導致函示無法回傳預期結果

  function encodeName (name, replaceTo, startIndex = 2, endIndex = name.length) {...}
  // 將擁有預設值的parameters往後挪，這樣encodeName('Morgan', '*')即可正常執行，不會覆蓋到startIndex與endIndex的預設值
  ```

- 可參考[MDN: Parameters without defaults after default parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters#parameters_without_defaults_after_default_parameters)
- 舊版解法的問題：

  - 假設我要從「第三個」字母以後開始打碼：

  ```js
  let name = 'Bernard'
  for (const n in name) {
    if (n > 2) name = name.replace(name.charAt(n),'*')
  }

  console.log(name)) // Be***r*
  ```

  舊版的解法會輸出`Be***r*`，因為：

  - 當`name`遍歷到`name.charAt(5)`的時候，取得的字母是「r」
  - `replace()`收到的指示是「把`r`替換為`*`」，但`replace()`的特性是「抓到第一個符合條件的結果後，後續一致的結果都不會去理會他」
  - 結果`Bernard`中的第一個`r`（不應該被替換）被`replace()`替換了，而第二個（應該要被替換的）`r`還是維持原狀

2021/4/21 追加新解法（直接包裝為函示）

```js
function encodeName (name, replaceTo = '*', startIndex = 0, endIndex = 2) {
  const partialName = name.substring(startIndex, endIndex)
  const replace = replaceTo.repeat(name.length - endIndex)
  return `${partialName}${replace}`
}

name = encodeName(name)
console.log(name) // Be*****
```

解析：

- 使用`substring()`來取得「保留原狀、不打碼」的段落
- 使用`repeat()`來根據「`name`扣除不打碼部位後，剩下的長度」來產生相對應數量的`*`

### Q3：加密信箱

要求：

```js
// input
let email = 'bernard@example.com'

// output should be 'ber...@example.com'
console.log(email)
```

- 顯示`@`後的資訊
- 把`@`前的字母覆蓋掉一半，隱藏的部分一律用三個點`...`取代
- 如果測試字串的長度是單數，例如 5，則只會保留前 2 個字母，其餘以`...`取代

解題邏輯：

- 姓名部分的打碼規則與 Q2 不同，函式無法直接沿用，需修改
- email 的網域部分不需做任何打碼處理

解法：

```js
let namePartial = email.substring(0, email.indexOf('@') / 2)
email = `${namePartial}...${email.substring(email.indexOf('@'), email.length )}`

console.log(email) // ber...@example.co
```

包裝為函式：

```js
function getEmailName (email) {
  return email.substring(0, email.indexOf('@'))
}

function getEmailDomain (email) {
  return email.substring(email.indexOf('@'), email.length)
}

function encodeNameForEmail (name, replaceTo = '...', keepStartIndex = 0, keepEndIndex = name.length / 2) {
  return `${name.substring(keepStartIndex, keepEndIndex)}${replaceTo}`
}

function encodeEmail (email) {
  const name = getEmailName(email)
  const encodeName = encodeNameForEmail(name)
  const domain = getEmailDomain(email)
  return `${encodeName}${domain}`
}

console.log(encodeEmail('bernard@example.com'))  // ber...@example.com
console.log(encodeEmail('info@example.com'))     // in...@example.com
console.log(encodeEmail('genie@example.com'))    // ge...@example.com
console.log(encodeEmail('eva_chan@example.com')) // eva_...@example.com
```

- `getEmailName(email)`：任務是「取得 email 中『姓名』的部分」
- `getEmailDomain(email)`：任務是「取得 email 中『網域』（包含@）的部分」
- `encodeNameForEmail(name, replaceTo = '...', keepStartIndex = 0, keepEndIndex = name.length / 2)`：任務是「將傳入的 name 保留指定部位、加上指定的替代字元後，回傳打碼後的 name」
- `encodeEmail(email)`：任務是「將傳入的 email 打碼，回傳打碼後的 email」

筆記：

- `str.substring(indexStart[, indexEnd])`：會回傳「位在`indexStart`」到「`indexEnd`**前**」（不包含`indexEnd`）的所有字母
  - 比如`'Morgan'.substring(0, 3)`會回傳「`Mor`」，不包含 index = 3 的`g`
  - [MDN 原文](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring#description)：`substring()` extracts characters from `indexStart` up to but **not including** `indexEnd`.
- 採用 functional programming 的概念來規劃這些函式，一個函式只做一件事情
- functional programming 的入門概念影片如下：
  <iframe width="560" height="315" src="https://www.youtube.com/embed/e-5obm1G_FY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## A2 部分作業

### 參加者與黑名單皆為單純陣列

第一版解法：兩層迴圈會讓時間複雜度升高，還有優化空間

```js
for (let i = 0; i < blackList.length; i ++) {
  for (let j = 0; j < players.length; j ++) {
    if (blackList[i] === players[j]) {
      players.splice(j, 1)
    }
  }
}
```

觀摩後改良：從參加者陣列的尾部開始遍歷並移除黑名單對象，就不用擔心`splice()`影響陣列長度，且只需遍歷參加者陣列、不用遍歷黑名單

```js
// 直接包裝為函式
// 此函式會直接修改players的內容，而不會回傳一個新陣列
function playersRemoveBlackListArray (players, blackList) {
  for (let i = players.length - 1; i >= 0; i --) {
    if (blackList.includes(players[i])) players.splice(i, 1)
  }
}
```

### 參加者與黑名單皆為包含物件的陣列

第一版解法：雙迴圈處理（邏輯與單純陣列的第一版解法一致，此處不再重複列出）
觀摩到的解法：使用`filter()`過濾掉位在黑名單中的名字

```js
const playersAllowed = players.filter(player => player.name !== 'Tim' && player.name !== 'Walter')
console.log(playersAllowed)
```

但以上的程式碼是直接上黑名單手動輸入到`filter()`中，日後黑名單若擴充還需更新程式碼內容，彈性不夠好。
於是改良第三版：

```js
function getPermittedUsers (users, blackList) {
  const black = getBlackListNames(blackList)
  const pass = users.filter(user => black.indexOf(user.name) === -1)
  return pass
}

function getBlackListNames (blackList) {
  const names = []
  blackList.forEach(black => names.push(black.name))
  return names // 會得到 ['Tim', 'Walter']
}

const permittedUsers = getPermittedUsers(players, blackList)
console.log(permittedUsers)
/*
輸出結果如下：
[
  { name: 'Bernard', email: 'bernard@example.com', ticket: 'XL3558' },
  { name: 'Youchi', email: 'youchi@example.com', ticket: 'AH9188' },
  { name: 'Yenting', email: 'yenting@example.com', ticket: 'LO9903' },
  { name: 'Angela', email: 'angela@example.com', ticket: 'HY7212' },
  { name: 'Yvonne', email: 'yvonne@example.com', ticket: 'CH7684' },
  { name: 'Ellen', email: 'ellen@example.com', ticket: 'BB1750' },
  { name: 'Kevin', email: 'kevin@example.com', ticket: 'TT1804' },
  { name: 'Russell', email: 'russell@example.com', ticket: 'SI0305' }
]
*/
```

- `getBlackListNames(blackList)`會回傳一個陣列，該陣列的內容是`blackList`中的所有名字
- `getPermittedUsers(users, blackList)`：`users`是包含所有使用者的陣列（內容為物件），`blackList`是黑名單陣列（內容為物件）
  - 首先透過`const black = getBlackListNames(blackList)`來取得`blackList`中的所有名字
  - `const pass = users.filter(user => black.indexOf(user.name) === -1)`這行的意思是：
    - 通過`filter()`的篩選條件為：`user.name`不可以存在於`black`這個陣列中
    - 符合以上條件才可加入`pass`陣列內
    - 若`black.indexOf(user.name)`回傳`-1`，則代表`black`裡面沒有該`user`
    - 將通過篩選的全部`user`都加入`pass`中
  - 最後回傳`pass`，內容是「所有不在黑名單中的使用者」
- `const permittedUsers = getPermittedUsers(players, blackList)`：宣告一個變數`permittedUsers`來接住`getPermittedUsers()`回傳的內容
- `console.log(permittedUsers)`：將結果輸出到 console 上

## A5 部分作業

<script src="https://gist.github.com/tzynwang/adbb90bce5cac0f7aa50333eda4c5011.js"></script>

### 第一版 drawWinner()

- 第 18-23 行
- 使用`Math.floor(Math.random() * players.length)`來決定要「抽到誰」之後，透過`splice()`來移除陣列中特定 index 的內容
- 一旦`splice()`修改的部位是「陣列中的第一個內容」，那麼時間複雜度就會是`O(n)`，因為陣列中所有的內容都要往前移動一個 index
  > We can use the `Array.splice()` method to remove an element and/or insert elements at any position in an array. When we use this method, the number of indices that need to be changed depend on which index you splice. But in the worst case scenario which is if you splice at the very start is `O(n)`.
  > 引用來源：[Time Complexities Of Common Array Operations In JavaScript](https://medium.com/@ashfaqueahsan61/time-complexities-of-common-array-operations-in-javascript-c11a6a65a168)

### 第二版 drawWinner()

- 第 25-33 行
- 先透過`swap()`來把「被抽到的人」移動到陣列最尾端，再透過`pop()`把「被抽到的人」從陣列中移除
- `pop()`的時間複雜度是`O(1)`，因為：
  - 固定刪除陣列中最末端的內容，使用`array.length`即可計算出陣列最末端的 index
  - 且最末端內容被刪除後，其他還在陣列中的內容不需要調整 index

### swap()

- 36 行：使用`buffer`儲存陣列中最尾端的內容
- 37 行：把「要搬到最尾端的內容」搬到最尾端
- 38 行：把`buffer`內容搬到「搬走的內容」位置中

### announceMsg()

將得獎者相關資料輸出到 console 上，此為題目預設的內容，不更動

### encodeName()

為配合`announceMsg()`，修改`replaceTo`將其內容預設為`*`

### getEmailName()、getEmailDomain()、encodeNameForEmail()、encodeEmail()、generateTicket()

解題思考流程請參考本篇文章上半部

### assignTicket()

- 85 行：額外準備一個`used`陣列來檢查`generateTicket()`產生的彩券號碼是否已經使用過
- 95 行：使用`includes()`來檢查`used`中有無重複內容，（-97 行）若有則產生新的彩券號碼，直到與`used`既有的內容不重複
- 98 行：使用過的彩券號碼存到`used`中，供之後檢查是否重複
- 100 行：執行`player.number = ticket`把確認沒有使用過的彩券號碼分配使用者

### 分配參加獎

- 112 行：使用`forEach()`為沒有被抽選為頭獎、貳獎、參獎的使用者全部賦予參加獎選項

## bonus track：時間複雜度（Time complexity）

以下筆記參考中文維基百科與 CS50 2018 Lecture 0：

<iframe width="560" height="315" src="https://www.youtube.com/embed/5azaK2cBKGw?start=1430" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

「時間複雜度」：指的是某一演算法的**執行時間**

- O(1)：「[常數時間](https://zh.wikipedia.org/wiki/%E5%B8%B8%E6%95%B8%E6%99%82%E9%96%93)」，代表某演算法的時間複雜度是**固定**的，不會根據演算的資料量多寡而改變
  - 透過陣列的 index 來取陣列內容，時間複雜度是 O(1)
  - 想尋找無序陣列內最小的值，需要找遍整個陣列，時間複雜度就不是 O(1)，而是 O(n)
- O(n)：[線性時間](https://zh.wikipedia.org/wiki/%E7%B7%9A%E6%80%A7%E6%99%82%E9%96%93)，時間複雜度會根據輸入的資料量進行變化
  - 舉例：如果一個「搜尋對象 X 是否位於電話簿中」的演算法是「從第一頁開始翻，如果沒有，翻到下一頁，直到找到對象 X 的號碼」，那這個演算法的時間複雜度就是 O(n)，n 根據電話簿的厚度決定，因為可能要翻遍一整本電話簿才能知道對象 X 是否位在電話簿中
- O(log n)：對數時間，比如透過[二分搜尋演算法（折半搜尋演算法）](https://zh.wikipedia.org/wiki/%E4%BA%8C%E5%88%86%E6%90%9C%E5%B0%8B%E6%BC%94%E7%AE%97%E6%B3%95)來進行猜數字遊戲
  - 舉例：玩家 A 從 1 至 100 中選取一數字，玩家 B 可從 50 開始猜，玩家 A 回覆他選定的數字比 50 大或小
  - 若玩家 A 選定的數字比 50 大，玩家 B 可猜 51-100 範圍內位在「正中央」的數字
  - 若玩家 A 選定的數字比 50 小，玩家 B 可猜 1-49 範圍內位在「正中央」的數字
  - 只要還未猜到玩家 A 選定的數字，玩家 B 都可在剩下的數字範圍內取「正中央」的數字來猜，因為這樣可以最大限度地淘汰不需要的數字

## 參考資料

- [演算法筆記：Algorithm](http://web.ntnu.edu.tw/~algo/Algorithm.html)

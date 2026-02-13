---
title: 「Jeremy Keith | In And Out Of Style | CSS Day 2022」影片筆記
date: 2022-06-19 13:53:41
tag:
  - [CSS]
  - [HTML]
---

## 總結

記錄一下 CSS Day 2022 演講「In And Out Of Style」中提及，但過去沒有特別留意到的概念
筆記內容基本上是觀影後自行得出的結論與反思，直接引用的資料會額外備註

<iframe width="560" height="315" src="https://www.youtube.com/embed/CdZZcbZG83o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 筆記

### Shared-context (in communication)

- 溝通的前提是建立在雙方存在共同的情境（shared-context）
  - 「？」「！」
  - 因為作家與出版商擁有共同的情境，故只透過電報傳送了驚嘆號與問號也能進行交流
- 剛好最近在閱讀的 [《人間地獄 語言為器》](https://www.chiuko.com.tw/product/%E4%BA%BA%E9%96%93%E5%9C%B0%E7%8D%84%E3%80%80%E8%AA%9E%E8%A8%80%E7%82%BA%E5%99%A8/) 也有類似概念
  - 「從嘴裡說出的話」事實上已經排除了太多細節：當我說了「路上有條狗」，我透過視覺收集到的整幅圖像資訊已經被簡化，剩下路邊與狗的概念，聽者甚至不知道這隻狗是什麼樣子
  - 溝通是如此模糊，以致於在需要精確定義的場合，文字內容就會變得異常地複雜又難以閱讀，想想各種契約與合約內容

### Inertia

- Definition from Google search: a tendency to **do nothing** or to **remain unchanged**.
- 人腦是懶惰的，良好的比喻或符號通常是根據那些早已熟悉的現實場景轉化而來
- 延伸關鍵字：Path dependence
  - Wikipedia: Path dependence is a concept in economics and the social sciences, referring to processes where past events or decisions constrain later events or decisions. It can be used to refer to outcomes at a single point in time or to long-run equilibria of a process. Path dependence has been used to describe institutions, technical standards, patterns of economic or social development, organizational behavior, and more.
  - 比如類比時鐘（有兩根指針與十二格刻度的時鐘，而非數位時鐘），其外型與兩根指針皆是借用自日晷

### Standard == Agreement

Standard is what everyone agree.

### Material Honesty

- 在前端開發的情境下，「material honesty」意味著使用原生的開發工具來達成需要的效果
  - 舉例：使用 HTML 原生的 `<input type="date" />` 來製作 calendar picker
  - 承上，如果只是要滿足功能需求，這不是問題；問題通常出在開發者在使用 CSS 試圖調校這個原生元件外觀的過程中
  - 於是開發者可能會求助於 libs 來解決這個困境
  - 使用 libs 沒有不對，但開發者應該意識到這並非是一個最優質的解決方案
- 延伸資源：[Open UI](https://open-ui.org/)
  - 在這邊可以觀摩一些 libs 如何調校原生元件的外觀
  - From Open UI: The purpose of Open UI to the web platform is to allow web developers to **style and extend built-in web UI controls**, such as `<select>` dropdowns, checkboxes, radio buttons, and date/color pickers.

## 參考文件

- [YouTube: Jeremy Keith | In And Out Of Style | CSS Day 2022](https://youtu.be/CdZZcbZG83o)
- [Speaking at CSS Day 2022](https://adactio.com/journal/19016)

---
layout: '@Components/pages/SinglePostLayout.astro'
title: Plugin -- hexo-tag-figure
date: 2021-02-15 15:11:42
tag:
  - [hexo]
---

## Summary of this post

This post is my notes for the following topics:

1. hexo plugin: [hexo-tag-figure](https://github.com/chawyehsu/hexo-tag-figure)
1. adding additional CSS style settings to NexT theme (by configuring `custom_file_path` in the file `_config.next.yml`)

此篇主要是記錄`hexo-tag-figure`的使用心得，以及如何使用`_config.next.yml`中的`custom_file_path`參數設定來增加自定義 CSS 設定內容的相關筆記。

## Environment

```
hexo-tag-figure: 0.4.1
NexT: 8.2.1
hexo: 5.3.0
hexo-cli: 4.2.0
os: Windows_NT 10.0.18363 win32 x64
```

## hexo-tag-figure

### GitHub

[hexo-tag-figure](https://github.com/chawyehsu/hexo-tag-figure)

### Example

![Book cover of Confessions of a Young Novelist](/2021/hexo-tag-figure/book-cover.jpg)

### Code

![Book cover of Confessions of a Young Novelist](/2021/hexo-tag-figure/book-cover.jpg)

- `figure--center`: the `class name` of the figure element.
  This is the **required** argument, though in the end I didn't apply customized CSS style to this class, this argument can not be skipped.
- `hexo-tag-figure/book-cover.jpg`: the image path.
  Check the source code to find the path logic:
  ![Screenshot of checking the image path through DevTools](/2021/hexo-tag-figure/image-path.png)
  (update on Feb 16 2021: I change the `permalink` setting from `:year/:month/:day/:title/` to `:title/`, thus the image path needs to be updated too. The image path in the screenshot includes `:year/:month/:day/:title/` since I previously set the `permalink` in this form 😅)
  Aad the permalink `:title/` as prefix to load the image.
  文件沒有特別針對 image path 做說明，從 DevTools 觀察了一下其他還沒使用 hexo-tag-figure 插入的圖片路徑，測試後發現 image path 要加上 permalink。
- `300`: the image width. I skip the height setting.
- `Confessions of a Young Novelist`: the title text that is placed in `figcaption` element.
  Add customized font color and font size to this element.
- `Book cover of Confessions of a Young Novelist`: the alt text for this image.

### CSS

1. According to [NexT's document](https://theme-next.js.org/docs/advanced-settings/custom-files.html), extra CSS settings can be added by enable the `custom_file_path` in theme config file (in my case the `_config.next.yml` in root folder). This is my configuration:

```yaml
# Define custom file paths.
# Create your custom files in site directory `source/_data` and uncomment needed files below.
custom_file_path:
  #head: source/_data/head.njk
  #header: source/_data/header.njk
  #sidebar: source/_data/sidebar.njk
  #postMeta: source/_data/post-meta.njk
  #postBodyEnd: source/_data/post-body-end.njk
  #footer: source/_data/footer.njk
  #bodyEnd: source/_data/body-end.njk
  #variable: source/_data/variables.styl
  #mixin: source/_data/mixins.styl
  style: source/_data/styles.styl # Enable this option by removing the '#' in the beginning of the line
```

1. Add the `styles.styl` file in the path `C:\Projects\hexo_blog\source\_data`
1. Add CSS settings for `figcaption` element, remove each image's bottom margin by setting the `margin-button` to 0px. With `margin-button` set as 0px, the text underneath (the `figcaption`) will be closer to the image.

```css
figcaption {
    color: #999;
    text-align: center;
    font-size: 14px; # Set to 14px to make the font size same as the text in table of content
}

.post-body img {
    margin-bottom: 0px;
}
```

![margin-bottom 20px](/2021/hexo-tag-figure/margin-bottom-20px.jpg)
![margin-bottom 0px](/2021/hexo-tag-figure/margin-bottom-0px.jpg)

1. Save the configuration and run `hexo generate` and `hexo deploy`, done ☕

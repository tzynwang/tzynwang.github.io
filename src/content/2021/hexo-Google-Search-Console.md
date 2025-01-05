---
title: Submit to Google Search Console, SEO settings
date: 2021-02-11 17:03:29
tag:
- [hexo]
---

## Summary of this post

Q: How to make sure Google Search can find my hexo blog that has been deployed on GitHub Page?
A: Submit your hexo blog to [Google Search Console](https://search.google.com/search-console/welcome) by:

1. Add `HTML tag` into hexo blog's `<head></head>`
2. Provide hexo blog's `sitemap.xml` to Google

為了讓 Google 可以搜尋到 hexo 部落格，需把`HTML tag`（HTML 標記、中繼標籤）加到`<head></head>`，並提交`sitemap.xml`給[Google Search Console](https://search.google.com/search-console/welcome)。

## Enviroment

```
hexo: 5.3.0
NexT: 8.2.1
os: Windows_NT 10.0.18363 win32 x64
```

## About \_config.next.yml

I use [Alternate Theme Config](https://theme-next.js.org/docs/getting-started/configuration.html#config-name-yml) to apply the theme modification according to the suggestion from NexT official document.

## Add HTML tag

1. Visit [Google Search Console](https://search.google.com/search-console/welcome), enter the URL of hexo blog into right hand side column.
   ![Enter hexo blog URL](/2021/hexo-Google-Search-Console/Enter-hexo-blog-URL-to-Google-Search-Console.png)
1. Select and copy the HTML tag.
   ![Select and copy the HTML tag provide by Google Search Console](/2021/hexo-Google-Search-Console/Copy-HTML-tag.png)
1. Open the file `_config.next.yml`, navigate to the part `# SEO Settings`, paste the HTML tag "content" part as the value of the key `google_site_verification`
   For example, this is the whole HTML tag contents you've copied:
   `<meta name="google-site-verification" content="(a string includes letters, numbers and _)" />`
   Just paste the content part into `_config.next.yml`, like the below code block shows:

```yaml
# ---------------------------------------------------------------
# SEO Settings
# See: https://theme-next.js.org/docs/theme-settings/seo
# ---------------------------------------------------------------

# Google Webmaster tools verification.
google_site_verification: (a string includes letters, numbers and _) />
```

1. Launch cmd.exe, move to the hexo blog folder, run `hexo clean && hexo generate`
1. Open the file `index.html` in `public` folder, the HTML tag should appear between the `<head></head>` tag
1. Run `hexo deploy` to deploy modification to GitHub Page
1. Back to Google Search Console and click "Verify"
   ![Click the Verify button after adding the HTML tag](/2021/hexo-Google-Search-Console/Verify-hexo-blog-after-adding-HTML-tag.png)
1. One of the two parts of Google SEO setting has finished, have a cup of tea ☕

個人目前使用的是 8.2.1 版的 NexT，`_config.next.yml`已內建支援`google_site_verification`。
在 Google Search Console 取得 HTML tag 後，將 content 的內容貼上即可。

`_config.next.yml`若沒有這個參數的話，則手動將整個 HTML tag 貼到`\themes\hexo-theme-next\layout\_partials\head`資料夾的`head`檔案中，如下圖：
![Manually add the Google Search Console HTML tag into NexT theme css head file](/2021/hexo-Google-Search-Console/Manually-add-HTML-tag-to-NexT-theme.png)

## Provide sitemap.xml

1. Launch cmd.exe, move to the hexo blog folder, run `npm install hexo-generator-sitemap --save`
1. Open the `_config.yml` file in the root of hexo blog, enter the following contents:

```yaml
sitemap:
  path: sitemap.xml
  template: # Custom template path. Leave it as blank if no custom template is used
  rel: false
    true
  tag: true
```

1. run `hexo generate` to generate the file `sitemap.xml`
1. Upload `sitemap.xml` to hexo blog's GitHub repository `master` branch
1. Visit Google Search Console. Enter "sitemap.xml" and click "Submit"
   ![Provide sitemap.xml to Googls Search Console](/2021/hexo-Google-Search-Console/Submit-sitemap.png)
1. Done. The whole Google SEO setting has completed 🎉

## Run Mobile-Friendly Test

Got an error message when running Google's [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) in the first time:

> Refused to apply style from (tl;dr) because its MIME type ('text/html') is not a supported stylesheet MIME type, and strict MIME checking is enabled.

![Mobile-Friendly Test error message](/2021/hexo-Google-Search-Console/Mobile-Friendly-Test-error-message.png)

Q: How I fixed this problem?
A: Open `_config.next.yml` and update the `host` value in `# Font Settings` part correctly.

```yaml
font:
  enable: true

  # Uri of fonts host, e.g. https://fonts.googleapis.com (Default).
  host: https://fonts.googleapis.com/css2?family=Noto+Sans+TC&family=Roboto&display=swap

  # Font options:
  # `external: true` will load this font family from `host` above.
  # `family: Times New Roman`. Without any quotes.
  # `size: x.x`. Use `em` as unit. Default: 1 (16px)

  # Global font settings used for all elements inside <body>.
  global:
    external: true
```

Run the test again and get greenlight.
![Pass the Mobile-Friendly Test without andy error message](/2021/hexo-Google-Search-Console/Pass-Mobile-Friendly-Test.png)
🎉🎉🎉

## Bonus: I forget the HTML tag contents

1. Visit Google Search Console, click "Settings" in the left side menu
   ![User settings in Google Search Console](/2021/hexo-Google-Search-Console/User-setting.png)
1. Click "User", and then click "User management"
   ![User management in Google Search Console](/2021/hexo-Google-Search-Console/User-setting-user-management.png)
1. HTML tag contents are display in the management console
   ![View HTML tag contents](/2021/hexo-Google-Search-Console/View-HTML-tag-contents.png)

## Reference

- [NexT: Google Webmaster Tools](https://theme-next.js.org/docs/theme-settings/seo#Google-Webmaster-Tools)
- [hexojs/hexo-generator-sitemap](https://github.com/hexojs/hexo-generator-sitemap)
- [hexo-generator-sitemap](https://brooke01.github.io/tecblog/2020/04/26/hexo-generator-sitemap/)
- [Hexo 搜尋引擎優化](https://hsiangfeng.github.io/hexo/20190514/2072033203/)
- [輕鬆地提交 Hexo 部落格的 Sitemap.xml 到 Google Search Console](https://askie.today/upload-sitemap-google-search-console-seo-hexo-blog/)
- [Hexo 博客 Next 主题 SEO 优化方法](https://hoxis.github.io/Hexo+Next%20SEO%E4%BC%98%E5%8C%96.html)

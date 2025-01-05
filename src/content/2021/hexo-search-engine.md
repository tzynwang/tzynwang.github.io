---
title: Add local search
date: 2021-02-17 09:07:53
tag:
- [hexo]
---

## Summary of this post

2 ways to add local search engine to the hexo blog:

1. Use plugin: [hexo-generator-searchdb](https://github.com/next-theme/hexo-generator-searchdb)
1. Use Google's [Programmable Search Engine](https://programmablesearchengine.google.com/about/)

## Environment

```
hexo: 5.3.0
hexo-cli: 4.2.0
os: Windows_NT 10.0.18363 win32 x64
```

## hexo-generator-searchdb

### GitHub

[hexo-generator-searchdb](https://github.com/next-theme/hexo-generator-searchdb)
Version: 1.3.3

### Configuration

#### \_config.yml

```yaml
search:
  path: search.xml
  field: post
  content: true
  format: html
```

#### \_config.next.yml

```yaml
# ---------------------------------------------------------------
# Search Services
# ---------------------------------------------------------------

# Local Search
local_search:
  enable: true

  # If auto, trigger search by changing input.
  # If manual, trigger search by pressing enter key or search button.
  trigger: auto

  # Show top n results per article, show all results by setting to -1
  top_n_per_article: -1

  # Unescape html strings to the readable one.
  unescape: false

  # Preload the search data when the page loads.
  preload: false
```

Note:
No needs to add `/search/` link in `# Menu Settings` if you want to use local search engine that provides by hexo-generator-searchdb. NexT (theme) will handle the search tab once the `# Local Search` option is enable.

#### CSS for search result highlight

File path: `themes\next\source\css\_common\components\third-party\search.styl`
I'd removed the bold setting and update the border-bottom style for `mark.search-keyword`:

```css
mark.search-keyword {
  background: transparent;
  border-bottom: 1px solid $red;
  color: $red;
  /*font-weight: bold;*/
}
```

### Result 1

![The screenshot of hexo blog local search](/2021/hexo-search-engine/search-result.jpg)

## Programmable Search Engine

Another way to add search function for hexo blog is adding [Google's Programmable Search Engine](https://programmablesearchengine.google.com/about/).

### Workflow

1. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/about/) and click "Get Started"
   ![The screenshot of Google's Programmable Search Engine homepage](/2021/hexo-search-engine/programmable-search-engine-00.jpg)
2. Enter the URL of the site to search. I enter `https://tzynwang.github.io/*` (with `*` at the end of URL) to make Google search the whole hexo blog
   ![The screenshot of config URL for Programmable Search Engine](/2021/hexo-search-engine/programmable-search-engine-01.jpg)
3. Click "CREATE" to submit the search engine application
   ![The screenshot after submitting the search engine application](/2021/hexo-search-engine/programmable-search-engine-02.jpg)
4. To add Google's search engine to hexo blog, click "Get code"
5. Copy the code
   ![The screenshot of copying search engine's code](/2021/hexo-search-engine/programmable-search-engine-03.jpg)
6. Launch cmd.exe, enter `hexo new page search` to add the searching page for hexo blog
7. Open the `index.md` file in `search` folder which was just created, add the front-matter `type: "search"`
8. Paste the search engine code as the content in `index.md`. Here's how the `index.md` should look like:

   ```markdown
   ---
   title: search
   date: 2021-02-17 10:33:04
   type: 'search'
   layout: search
   ---

   <script async src="https://cse.google.com/cse.js?cx=9e7ebf1af41ffecee"></script>
   <div class="gcse-search"></div>
   ```

9. Update the configuration in the `_config.next.yml` file: add `search` option in `# Menu Settings`
   ```yaml
   # ---------------------------------------------------------------
   # Menu Settings
   # ---------------------------------------------------------------
   menu:
   home: / || fa fa-home
   about: /about/ || fa fa-user
   tag: /categories/ || fa fa-th
   archives: /archives/ || fa fa-archive
   Google search: /search/ || fa fa-search
   ```
10. Save the settings, run `hexo server` to preview the result

### Result 2

![The screenshot of Google's Programmable Search Engine on hexo blog](/2021/hexo-search-engine/programmable-search-engine-04.jpg)

## Note

I decide to use `hexo-generator-searchdb` instead of adding another page to handle the search engine.
Prefer the way that NexT theme handles the search engine, it opens a searching tab on the current page. Users don't need to navigate to another page for doing content searching.

## Reference

[Hexo - 自訂站內搜尋 (Google Custom Search)](https://blog.johnwu.cc/article/hexo-google-custom-search.html)

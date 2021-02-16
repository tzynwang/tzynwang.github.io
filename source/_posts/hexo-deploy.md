---
title: Deploy hexo blog to GitHub Page
date: 2021-02-10 19:00:23
categories: 
- hexo
- deployment
keywords:
- hexo deploy
---

## Summary of this post
This post describes my whole workflow about deploying hexo blog from local to GitHub Page 🛫
記錄了自己把hexo blog從本機部屬到GitHub Pages的過程，寫得比hexo官方文件詳細一些。
沒有對官方文件提出improvement是因為這些內容可能太繁瑣了 🤣


## Environment
```
hexo: 5.3.0
hexo-cli: 4.2.0
os: Windows_NT 10.0.18363 win32 x64
git: 2.30.0.windows.2
```


## Workflow
### Download and install Git
Download link: https://git-scm.com/downloads
The version I downloaded is "Git-2.30.1-64-bit.exe". Double clicks the .exe file to install Git on the computer.


### Create repository on GitHub
💡 The repository should be named in the format `<GitHub username>.github.io`.
For example, if the username is "johndoe", then the repository should be named as "johndoe.github.io".


### Update _config.yml
Open the file `_config.yml` in the root of hexo blog folder.
Update the value of `url` and `deploy` keys.
```
# URL
url: https://<GitHub username>.github.io
root: /

# Deployment
deploy:
  type: git
  repo: https://github.com/<GitHub username>/<GitHub username>.github.io.git
  branch: master
```

For example, if the username is "johndoe", then the contents in `_config.yml` should be:
```
# URL
url: https://johndoe.github.io
root: /

# Deployment
deploy:
  type: git
  repo: https://github.com/johndoe/johndoe.github.io.git
  branch: master
```


### To deploy hexo blog
1. Open cmd.exe, move to hexo blog. In my case I enter `cd C:\Projects\hexo_blog`, this is the location that store my hexo blog contents
1. In cmd.exe, enter `git init` to [create a empty Git repository](https://git-scm.com/docs/git-init). If Windows is set to [show the hidden files](https://support.microsoft.com/en-us/windows/show-hidden-files-0320fe58-0117-fd59-6851-9b7f9840fdb2), a `.git` folder can be viewed after running the `git init` command.
1. Enter `git checkout -b source` to create a branch call "source"
1. Enter `git add .` to stage everything that are going to be committed (except the folders, files that are ignored by `.gitignore` file)
1. Enter `git commit -m "initial commit"`
1. Enter `git push https://github.com/tzynwang/<GitHub username>.github.io.git source`, this will push all the files that are staged to the "source" branch on the GitHub repository
1. Add a file `.github/workflows/pages.yml` to the "source" branch on the GitHub repository.
![Add new file through GitHub webpage interface](add-new-file-to-repository-00.png)
![Enter the name for the new-add file](add-new-file-to-repository-01.png)
1. Add the following contents to the file `.github/workflows/pages.yml`:
```
name: Pages

on:
  push:
    branches:
      - source  # default branch

jobs:
  pages:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js 12.x
        uses: actions/setup-node@v1
        with:
          node-version: '12.x'
      - name: Cache NPM dependencies
        uses: actions/cache@v2
        with:
          path: node_modules
          key: ${{ runner.OS }}-npm-cache
          restore-keys: |
            ${{ runner.OS }}-npm-cache
      - name: Install Dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          publish_branch: master  # deploying branch
```
1. Back to cmd.exe, run `hexo clean`, and then `hexo generate`
1. After `hexo generate`, a folder "public" will be created
1. Enter `hexo deploy`, this command will push the contents from local folder "public" to the branch "master" on GitHub repository. You don't need to create the branch "master" yourself, `hexo deploy` will handle this
  💡 There will be 2 branches on the repository, one is "source" and another is "master". The "master" branch contains the contents that will be rendered on your GitHub Pages
1. After `hexo deploy` is completed, go to the "Settings" page for the repository. Change the Source of GitHub Pages to Branch "master"
![Click the "Setting" tab on GitHub repository](config-github-pages-setting-00.png)
![Config the GitHub Pages setting](config-github-pages-setting-01.png)
1. Navigate to the URL `https://<GitHub username>.github.io/` to view your hexo blog ☕


### Note
- Do not add `""` for the value of `root` and `theme` in the `_config.yml` file. Just wrote the value like following:
```
# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: next

# URL
## If your site is put in a subdirectory, set url as 'http://example.com/child' and root as '/child/'
url: https://tzynwang.github.io
root: /
```
- To update blog contents (e.g. add new post), run `hexo generate` plus `hexo deploy`.
  `git commit` and `git push` the local content to "source" branch is not required for updating the blog contents on GitHub Pages.
- The branch name "source" and "master" can be changed to other preferred names.
  - Make sure to update the contents in `.github/workflows/pages.yml` file and the `_config.yml` file that exists in the root folder.
  - For example, if I want to `git push` the contents to the "development" branch, and `hexo deploy` to the "publish" branch, the `.github/workflows/pages.yml` file should be updated as follow:
  ```
  name: Pages

  on:
    push:
      branches:
        - development

  jobs:
    pages:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - name: Use Node.js 12.x
          uses: actions/setup-node@v1
          with:
            node-version: '12.x'
        - name: Cache NPM dependencies
          uses: actions/cache@v2
          with:
            path: node_modules
            key: ${{ runner.OS }}-npm-cache
            restore-keys: |
              ${{ runner.OS }}-npm-cache
        - name: Install Dependencies
          run: npm install
        - name: Build
          run: npm run build
        - name: Deploy
          uses: peaceiris/actions-gh-pages@v3
          with:
            github_token: ${{ secrets.GITHUB_TOKEN }}
            publish_dir: ./public
            publish_branch: publish
  ```
  The configuration in `_config.yml` file should be set like this:
  ```
  # Deployment
  deploy:
    branch: publish
  ```


## Reference
[hexo: GitHub Pages](https://hexo.io/docs/github-pages)
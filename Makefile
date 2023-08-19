# install packages without changing lockfile
.PHONY: i
i:
	rm -rf node_modules && \
	yarn install --frozen-lockfile --production=false

.PHONY: start
start:
	yarn astro dev

.PHONY: build
build:
	yarn astro check && \
	yarn tsc --noEmit && \
	yarn astro build

.PHONY: preview
preview:
	yarn astro preview

# create new .md in <root>/src/pages/posts folder
# syntax: make new post=<article name>
.PHONY: new
new:
	echo "---" >> src/pages/posts/$(shell date +%Y)/$(post).md
	echo "layout: '@Components/SinglePostLayout.astro'"
	echo "title: $(post)" >> src/pages/posts/$(shell date +%Y)/$(post).md
	echo "date: $(shell date +%F) $(shell date +%T)" >> src/pages/posts/$(shell date +%Y)/$(post).md
	echo "tag:" >> src/pages/posts/$(shell date +%Y)/$(post).md
	echo "	- []" >> src/pages/posts/$(shell date +%Y)/$(post).md
	echo "banner: " >> src/pages/posts/$(shell date +%Y)/$(post).md
	echo "summary: " >> src/pages/posts/$(shell date +%Y)/$(post).md
	echo "---" >> src/pages/posts/$(shell date +%Y)/$(post).md
	mkdir public/$(shell date +%Y)/$(post)

# deploy build result to gitHub repo as branch "gh-pages"
.PHONY: deploy
deploy: build
	cd dist && \
	git init && \
	git remote -v | grep -w origin || git remote add origin git@github.com:tzynwang/astro-blog-v2.git && \
	git branch -m gh-pages && \
	git add -A && \
	git commit -m "[feat] deploy as gh-pages `date +'%Y-%m-%d %H:%M:%S'`" && \
	git push -u origin gh-pages -f

# install packages without changing lockfile
.PHONY: i
i:
	rm -rf node_modules && \
	yarn install --frozen-lockfile --production=false

BIN := node node_modules/.bin

.PHONY: start
start:
	$(BIN)/astro dev

.PHONY: build
build:
	$(BIN)/astro build

.PHONY: preview
preview:
	$(BIN)/astro preview

NEW_POST_PATH := src/content
YEAR := $(shell date +%Y)
YMD := $(shell date +%F)
DATE := $(shell date +%T)

# create new .md in <root>/src/content/(YEAR) folder
# syntax: make new post=<article name>
.PHONY: new
new:
	@echo "---" >> $(NEW_POST_PATH)/$(YEAR)/$(post).md
	@echo "title: $(post)" >> $(NEW_POST_PATH)/$(YEAR)/$(post).md
	@echo "date: $(YMD) $(DATE)" >> $(NEW_POST_PATH)/$(YEAR)/$(post).md
	@echo "tag:" >> $(NEW_POST_PATH)/$(YEAR)/$(post).md
	@echo "	- []" >> $(NEW_POST_PATH)/$(YEAR)/$(post).md
	@echo "banner: " >> $(NEW_POST_PATH)/$(YEAR)/$(post).md
	@echo "summary: " >> $(NEW_POST_PATH)/$(YEAR)/$(post).md
	@echo "draft: " >> $(NEW_POST_PATH)/$(YEAR)/$(post).md
	@echo "---" >> $(NEW_POST_PATH)/$(YEAR)/$(post).md
	mkdir -p public/$(YEAR)/$(post)

# deploy build result to gitHub repo as branch "gh-pages"
.PHONY: deploy
deploy: build
	cd dist && \
	git init && \
	git remote -v | grep -w origin || git remote add origin git@github.com:tzynwang/tzynwang.github.io.git && \
	git branch -m gh-pages && \
	git add -A && \
	git commit -m "[feat] deploy as gh-pages `date +'%Y-%m-%d %H:%M:%S'`" && \
	git push -u origin gh-pages -f

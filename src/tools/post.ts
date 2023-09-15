import dayjs from 'dayjs';
import type { MarkdownInstance, Post } from '@Models/GeneralTypes';

async function getAllPosts() {
  // `import.meta.glob` ref.:
  // https://docs.astro.build/en/reference/api-reference/#astroglob
  // https://vitejs.dev/guide/features.html#glob-import
  const metaAllPosts = import.meta.glob<MarkdownInstance<Post>>(
    '../pages/**/*.md'
  );
  const keys = Object.keys(metaAllPosts);
  const allPostsPromises = keys.map((key) => metaAllPosts[key]());
  return await Promise.all(allPostsPromises);
}

function sortPostByDate(posts: MarkdownInstance<Post>[]) {
  return posts.sort(
    (a, b) =>
      dayjs(b.frontmatter.date).valueOf() - dayjs(a.frontmatter.date).valueOf()
  );
}

export const ALL_SORTED_POSTS = sortPostByDate(await getAllPosts());

const ALL_TAGS = ALL_SORTED_POSTS.map((post) => post.frontmatter.tag)
  .flat(2)
  .sort();

export const ALL_UNIQUE_TAGS = [...new Set(ALL_TAGS)];

export function groupPostByYear(posts: MarkdownInstance<Post>[]) {
  const yearsMap: Record<string, MarkdownInstance<Post>[]> = {};
  posts.forEach((post) => {
    const y = dayjs(post.frontmatter.date).format('YYYY');
    if (!yearsMap[y]) {
      yearsMap[y] = [];
    }
    yearsMap[y].push(post);
  });
  return yearsMap;
}

export function getPostWithCompiledSummary(posts: MarkdownInstance<Post>[]) {
  return posts.map((post) => {
    const compiledContent = post.compiledContent();
    // 在 .md 開頭為 h2+p 的情況下，取得文章第一段內容
    const summaryWithPTail = compiledContent.split('<p>')[1];
    // 移除 </p> 以後的內容
    const summary = summaryWithPTail.split('</p>')[0];
    return { ...post, summary };
  });
}

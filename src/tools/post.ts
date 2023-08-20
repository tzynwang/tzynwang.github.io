import dayjs from 'dayjs';
import type { MarkdownInstance, Post } from '@Models/GeneralTypes';

export function sortPostByDate(posts: MarkdownInstance<Post>[]) {
  return posts.sort(
    (a, b) =>
      dayjs(b.frontmatter.date).valueOf() - dayjs(a.frontmatter.date).valueOf()
  );
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

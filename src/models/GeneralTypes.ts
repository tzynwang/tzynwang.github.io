export type { MarkdownInstance, GetStaticPathsOptions, Page } from 'astro';

export interface Post {
  title: string;
  date: Date;
  tag: string[];
  banner?: string;
  summary?: string;
  /** 這是 Astro 判定草稿的關鍵字
   * 
   * 可參考 https://docs.astro.build/en/reference/configuration-reference/#markdowndrafts */
  draft?: boolean;
}

export interface Heading {
  depth: number;
  text: string;
  slug: string;
}

export interface Props {
  frontmatter: Post;
  headings: Heading[];
}

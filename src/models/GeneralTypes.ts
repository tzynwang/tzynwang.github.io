export type { MarkdownInstance, GetStaticPathsOptions, Page } from 'astro';

export interface Post {
  title: string;
  date: Date;
  tag: string[];
  banner?: string;
  summary?: string;
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

export type { MarkdownInstance, GetStaticPathsOptions, Page } from 'astro';

export type PostYear = '2021' | '2022' | '2023';

export type Post = {
  title: string;
  date: Date;
  tag: string[][];
  banner?: string;
  summary?: string;
  draft?: boolean | null;
};

export type EntryData = {
  data: Post;
};

import type { CollectionEntry } from 'astro:content';

export type PostYear = '2021' | '2022' | '2023' | '2024' | '2025';

export type Post = {
  title: string;
  date: Date;
  tag: string[];
  banner?: string;
  summary?: string;
  draft?: boolean | null;
};

export type EntryData = {
  data: Post;
};

export type PostContent = CollectionEntry<'2021'>;

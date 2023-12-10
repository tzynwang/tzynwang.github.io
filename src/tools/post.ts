import type { CollectionEntry } from 'astro:content';

import { getCollection } from 'astro:content';
import dayjs from 'dayjs';
import { dateFormatter } from '@Tools/formatter';

function getThisYear() {
  return dayjs().year();
}

function getYearOfPost(date: Date) {
  return dayjs(date).year();
}

export function getPostUrl(post: CollectionEntry<'2021'>) {
  return `${getYearOfPost(post.data.date)}/${post.slug}`;
}

function getAllYears() {
  const startYear = 2021;
  const thisYear = getThisYear();
  const years = Array.from(
    { length: thisYear - startYear + 1 },
    (_, index) => startYear + index
  );
  return years;
}

/** Filter posts with `draft: true` only when building for production */
export function filterOutDraft(
  post: CollectionEntry<'2021' | '2022' | '2023'>
) {
  return import.meta.env.PROD ? post.data.draft !== true : true;
}

async function getAllPosts() {
  const years = getAllYears();
  const allPostsPromises = years.map(
    async (year) =>
      // @ts-ignore
      await getCollection(year, (post) => filterOutDraft(post))
  );
  const allPosts = await Promise.all(allPostsPromises);
  return allPosts.flat();
}

function sortPostByDate(posts: CollectionEntry<'2021'>[]) {
  return posts.sort(
    (a, b) => dayjs(b.data.date).valueOf() - dayjs(a.data.date).valueOf()
  );
}

// @ts-ignore
export const ALL_SORTED_POSTS = sortPostByDate(await getAllPosts());

function getPostRss(posts: CollectionEntry<'2021'>[]) {
  return posts.map((p) => ({
    title: p.data.title,
    link: p.slug || '',
    description: p.data.summary || '',
    pubDate: new Date(dateFormatter(p.data.date)),
  }));
}

export const RSS_POSTS = getPostRss(ALL_SORTED_POSTS);

const ALL_TAGS = ALL_SORTED_POSTS.map((post) => post.data.tag)
  .flat(2)
  .sort();

export const ALL_UNIQUE_TAGS = [...new Set(ALL_TAGS)];

export function getFlatTags(tags: string[][]) {
  return tags.flat(2);
}

export function groupPostByYear(posts: CollectionEntry<'2021'>[]) {
  const yearsMap: Record<string, CollectionEntry<'2021'>[]> = {};
  posts.forEach((post) => {
    const y = dayjs(post.data.date).format('YYYY');
    if (!yearsMap[y]) {
      yearsMap[y] = [];
    }
    yearsMap[y].push(post);
  });
  return yearsMap;
}

import { dateFormatter } from "@Tools/formatter";
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

async function getAllPosts() {
  return await getCollection("legacyPosts");
}

// @ts-ignore
export const ALL_SORTED_POSTS = (await getAllPosts()).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
);

function getPostRss(posts: CollectionEntry<"legacyPosts">[]) {
  return posts.map((p) => ({
    title: p.data.title,
    link: p.id,
    description: p.data.summary || "",
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

export function groupPostByYear(posts: CollectionEntry<"legacyPosts">[]) {
  return posts.reduce<Record<string, CollectionEntry<"legacyPosts">[]>>(
    (acc, post) => {
      const year = new Date(post.data.date).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(post);
      return acc;
    },
    {},
  );
}

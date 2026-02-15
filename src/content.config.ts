import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const legacyPosts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tag: z.array(z.array(z.string())),
    banner: z.string().optional(),
    summary: z.string().optional(),
    draft: z.boolean().nullable().optional(),
  }),
});

export const collections = { legacyPosts };

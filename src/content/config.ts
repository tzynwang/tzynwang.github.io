import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tag: z.array(z.array(z.string())),
    banner: z.string().optional(),
    summary: z.string().optional(),
    draft: z.boolean().nullable().optional(),
  }),
});

export const collections = {
  // key 對應 src/content 下的資料夾年份，value 對應文章的 schema
  2021: blog,
  2022: blog,
  2023: blog,
  2024: blog,
  2025: blog,
};

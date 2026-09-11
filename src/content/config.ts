import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.string(),
    author: z.string().optional(),
    tags: z.array(z.string()),
    image: z.string().optional()
  })
});

export const collections = {
  blog
};



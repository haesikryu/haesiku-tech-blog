import { z } from 'zod';

export const postSchema = z.object({
  title: z
    .string()
    .min(1, '제목은 필수입니다.')
    .max(200, '제목은 200자 이하여야 합니다.'),
  content: z
    .string()
    .min(1, '내용은 필수입니다.'),
  summary: z
    .string()
    .max(500, '요약은 500자 이하여야 합니다.')
    .optional(),
  author: z
    .string()
    .min(1, '작성자는 필수입니다.'),
  categoryId: z
    .number()
    .optional(),
  tagNames: z
    .array(z.string()),
});

export type PostFormValues = z.infer<typeof postSchema>;

import { z } from 'zod';

export const reviewSchema = z.object({
  reviewType: z.enum(['BOOK', 'COURSE']),
  title: z
    .string()
    .min(1, '후기 제목은 필수입니다.')
    .max(200, '제목은 200자 이하여야 합니다.'),
  content: z.string().min(1, '후기 내용은 필수입니다.'),
  rating: z
    .number()
    .min(1, '평점은 1 이상이어야 합니다.')
    .max(5, '평점은 5 이하여야 합니다.'),
  itemTitle: z
    .string()
    .min(1, '책/강의 제목은 필수입니다.')
    .max(300, '300자 이하여야 합니다.'),
  itemAuthor: z.string().max(200, '200자 이하여야 합니다.').optional(),
  itemLink: z.string().max(500, '500자 이하여야 합니다.').optional(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewApi } from '@/api';
import type { ReviewRequest } from '@/types';

export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (page: number) => [...reviewKeys.lists(), { page }] as const,
  listByType: (reviewType: string, page: number) =>
    [...reviewKeys.all, 'type', reviewType, { page }] as const,
  search: (keyword: string, page: number) =>
    [...reviewKeys.all, 'search', { keyword, page }] as const,
  details: () => [...reviewKeys.all, 'detail'] as const,
  detail: (id: number) => [...reviewKeys.details(), id] as const,
};

export function useReviews(page = 0) {
  return useQuery({
    queryKey: reviewKeys.list(page),
    queryFn: () => reviewApi.getAll(page, 10, 'createdAt,desc'),
  });
}

export function useReview(id: number) {
  return useQuery({
    queryKey: reviewKeys.detail(id),
    queryFn: () => reviewApi.getById(id),
    enabled: id > 0,
  });
}

export function useReviewsByType(reviewType: 'BOOK' | 'COURSE', page = 0) {
  return useQuery({
    queryKey: reviewKeys.listByType(reviewType, page),
    queryFn: () => reviewApi.getByType(reviewType, page, 10),
  });
}

export function useSearchReviews(keyword: string, page = 0) {
  return useQuery({
    queryKey: reviewKeys.search(keyword, page),
    queryFn: () => reviewApi.search(keyword, page),
    enabled: !!keyword.trim(),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReviewRequest) => reviewApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: reviewKeys.all }),
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReviewRequest }) =>
      reviewApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: reviewKeys.all }),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reviewApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: reviewKeys.all }),
  });
}

import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '@/api';

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  posts: (slug: string, page: number) => [...categoryKeys.all, 'posts', slug, { page }] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: categoryApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategoryPosts(slug: string, page = 0) {
  return useQuery({
    queryKey: categoryKeys.posts(slug, page),
    queryFn: () => categoryApi.getPostsBySlug(slug, page),
    enabled: !!slug,
  });
}

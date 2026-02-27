import { useQuery } from '@tanstack/react-query';
import { tagApi } from '@/api';

export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  posts: (slug: string, page: number) => [...tagKeys.all, 'posts', slug, { page }] as const,
};

export function useTags() {
  return useQuery({
    queryKey: tagKeys.lists(),
    queryFn: tagApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTagPosts(slug: string, page = 0) {
  return useQuery({
    queryKey: tagKeys.posts(slug, page),
    queryFn: () => tagApi.getPostsBySlug(slug, page),
    enabled: !!slug,
  });
}

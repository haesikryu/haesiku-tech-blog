import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '@/api';
import type { PostRequest } from '@/types';

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (page: number, sort: string) => [...postKeys.lists(), { page, sort }] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (slug: string) => [...postKeys.details(), slug] as const,
  search: (keyword: string, page: number) => [...postKeys.all, 'search', { keyword, page }] as const,
  admin: () => [...postKeys.all, 'admin'] as const,
  adminList: (page: number) => [...postKeys.admin(), 'list', { page }] as const,
  adminDetail: (id: number) => [...postKeys.admin(), 'detail', id] as const,
};

export function usePublishedPosts(page = 0, sort = 'createdAt,desc') {
  return useQuery({
    queryKey: postKeys.list(page, sort),
    queryFn: () => postApi.getPublished(page, 10, sort),
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: postKeys.detail(slug),
    queryFn: () => postApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useSearchPosts(keyword: string, page = 0) {
  return useQuery({
    queryKey: postKeys.search(keyword, page),
    queryFn: () => postApi.search(keyword, page),
    enabled: !!keyword,
  });
}

export function useAllPosts(page = 0) {
  return useQuery({
    queryKey: postKeys.adminList(page),
    queryFn: () => postApi.getAll(page),
  });
}

export function usePostById(id: number) {
  return useQuery({
    queryKey: postKeys.adminDetail(id),
    queryFn: () => postApi.getById(id),
    enabled: id > 0,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostRequest) => postApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.all }),
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PostRequest }) => postApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.all }),
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => postApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.all }),
  });
}

export function useTogglePublish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => postApi.togglePublish(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: postKeys.all }),
  });
}

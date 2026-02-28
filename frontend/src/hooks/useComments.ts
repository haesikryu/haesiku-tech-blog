import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentApi } from '@/api';
import type { CommentCreateRequest, CommentUpdateRequest } from '@/types';
export const commentKeys = {
  all: ['comments'] as const,
  list: (postId: number) => [...commentKeys.all, postId] as const,
};

export function useComments(postId: number) {
  return useQuery({
    queryKey: commentKeys.list(postId),
    queryFn: () => commentApi.list(postId),
    enabled: postId > 0,
  });
}

export function useCreateComment(postId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CommentCreateRequest) => commentApi.create(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) });
    },
  });
}

export function useUpdateComment(postId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: number; data: CommentUpdateRequest }) =>
      commentApi.update(postId, commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) });
    },
  });
}

export function useDeleteComment(postId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, password }: { commentId: number; password: string }) =>
      commentApi.delete(postId, commentId, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) });
    },
  });
}

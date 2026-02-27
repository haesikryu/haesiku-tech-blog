import { useNavigate, useParams } from 'react-router-dom';
import { usePostById, useCreatePost, useUpdatePost } from '@/hooks';
import { postApi } from '@/api';
import { Loading, Seo } from '@/components/common';
import { PostEditor } from '@/components/post';
import type { PostFormValues } from '@/utils/postSchema';

export default function PostFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: existingPost, isLoading } = usePostById(isEdit ? Number(id) : 0);
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();

  const isPending = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  const handlePublish = async (data: PostFormValues) => {
    if (isEdit) {
      await updateMutation.mutateAsync({ id: Number(id), data });
    } else {
      const created = await createMutation.mutateAsync(data);
      // 생성 후 바로 발행
      await postApi.togglePublish(created.id);
    }
    navigate('/admin');
  };

  const handleSaveDraft = async (data: PostFormValues) => {
    if (isEdit) {
      await updateMutation.mutateAsync({ id: Number(id), data });
    } else {
      await createMutation.mutateAsync(data);
    }
    navigate('/admin');
  };

  if (isEdit && isLoading) return <Loading message="게시글 정보를 불러오는 중..." />;

  return (
    <>
      <Seo title={isEdit ? '게시글 수정' : '게시글 작성'} />

      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          {isEdit ? '게시글 수정' : '새 게시글 작성'}
        </h1>

        <PostEditor
          initialData={isEdit ? existingPost ?? undefined : undefined}
          onSubmit={handlePublish}
          onSaveDraft={handleSaveDraft}
          isPending={isPending}
          submitError={error ? '저장에 실패했습니다. 다시 시도해 주세요.' : undefined}
        />
      </div>
    </>
  );
}

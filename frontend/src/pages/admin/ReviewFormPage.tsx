import { useNavigate, useParams } from 'react-router-dom';
import {
  useReview,
  useCreateReview,
  useUpdateReview,
} from '@/hooks';
import { Loading, Seo } from '@/components/common';
import { ReviewEditor } from '@/components/review';
import type { ReviewFormValues } from '@/utils/reviewSchema';

export default function ReviewFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: existingReview, isLoading } = useReview(isEdit ? Number(id) : 0);
  const createMutation = useCreateReview();
  const updateMutation = useUpdateReview();

  const isPending = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  const handleSubmit = async (data: ReviewFormValues) => {
    if (isEdit) {
      await updateMutation.mutateAsync({ id: Number(id), data });
    } else {
      await createMutation.mutateAsync(data);
    }
    navigate('/admin/reviews');
  };

  if (isEdit && isLoading) {
    return <Loading message="후기 정보를 불러오는 중..." />;
  }

  return (
    <>
      <Seo title={isEdit ? '후기 수정' : '후기 작성'} />

      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          {isEdit ? '후기 수정' : '새 후기 작성'}
        </h1>

        <ReviewEditor
          initialData={isEdit ? existingReview ?? undefined : undefined}
          onSubmit={handleSubmit}
          isPending={isPending}
          submitError={
            error ? '저장에 실패했습니다. 다시 시도해 주세요.' : undefined
          }
        />
      </div>
    </>
  );
}

import { Link } from 'react-router-dom';
import { Seo, Button } from '@/components/common';

export default function NotFoundPage() {
  return (
    <>
      <Seo title="404 - 페이지를 찾을 수 없습니다" />
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-6xl font-bold text-gray-300">404</p>
        <h1 className="mt-4 text-xl font-bold text-gray-900">페이지를 찾을 수 없습니다</h1>
        <p className="mt-2 text-gray-500">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        <Link to="/" className="mt-6">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    </>
  );
}

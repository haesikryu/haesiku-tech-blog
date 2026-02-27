import { useState, type FormEvent, type ReactNode } from 'react';
import { useAuthStore } from '@/store';
import { Button, Input } from '@/components/common';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, login } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) return <>{children}</>;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!login(username, password)) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      setPassword('');
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-xl font-bold text-gray-900">관리자 로그인</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="아이디"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(''); }}
            placeholder="관리자 아이디"
            autoFocus
          />
          <Input
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            error={error}
            placeholder="비밀번호"
          />
          <Button type="submit" className="w-full">
            로그인
          </Button>
        </form>
      </div>
    </div>
  );
}

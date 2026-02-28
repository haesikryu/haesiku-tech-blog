import { type ReactNode } from 'react';
import { BreadcrumbProvider } from '@/contexts/BreadcrumbContext';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <BreadcrumbProvider>
      <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
        <Header />
        <div className="flex flex-1">
          <LeftSidebar />
          <main className="min-w-0 flex-1 border-gray-200 px-6 py-8 dark:border-gray-800 lg:px-8">
            {children}
          </main>
          <div className="hidden xl:block">
            <RightSidebar />
          </div>
        </div>
      </div>
    </BreadcrumbProvider>
  );
}

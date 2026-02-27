// --- Enums ---
export type PostStatus = 'DRAFT' | 'PUBLISHED';

// --- Response DTOs ---
export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
}

export interface TagResponse {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
}

export interface PostResponse {
  id: number;
  title: string;
  content: string;
  summary: string;
  author: string;
  slug: string;
  status: PostStatus;
  viewCount: number;
  category: CategoryResponse;
  tags: TagResponse[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// --- Request DTOs ---
export interface PostRequest {
  title: string;
  content: string;
  summary?: string;
  author: string;
  categoryId?: number;
  tagNames: string[];
}

export interface CategoryRequest {
  name: string;
  description?: string;
}

// --- Pagination ---
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

// --- Auth ---
export interface User {
  username: string;
  role: 'ADMIN';
}

// --- UI ---
export type Theme = 'light' | 'dark';

// --- Error ---
export interface ErrorResponse {
  status: number;
  message: string;
  errors: string[];
  timestamp: string;
}

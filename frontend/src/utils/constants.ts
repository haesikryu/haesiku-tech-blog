export const PAGE_SIZE = 10;

export const API_ENDPOINTS = {
  POSTS: '/posts',
  CATEGORIES: '/categories',
  TAGS: '/tags',
} as const;

export const POST_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
} as const;

export const ROUTES = {
  HOME: '/',
  POST_DETAIL: '/posts/:slug',
  POST_CREATE: '/posts/new',
  POST_EDIT: '/posts/:id/edit',
  CATEGORY_POSTS: '/categories/:slug',
  TAG_POSTS: '/tags/:slug',
} as const;

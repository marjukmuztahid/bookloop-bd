import type { ReactNode } from 'react';

export interface BlogFAQ {
  q: string;
  a: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  author: string;
  publishedAt: string; // ISO YYYY-MM-DD
  updatedAt?: string;
  readingMinutes: number;
  tags: string[];
  category:
    | 'Buying Guides'
    | 'Selling Guides'
    | 'Comparisons'
    | 'Curriculum & Exam Prep'
    | 'Local & Sustainability';
  primaryKeyword: string;
  content: ReactNode;
  faqs?: BlogFAQ[];
}

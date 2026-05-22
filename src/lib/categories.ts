export type CategoryId = 'dev' | 'invest' | 'learn' | 'daily';

export interface Category {
  id: CategoryId;
  name: string;
  desc: string;
  color: string;
  cssVar: string;
}

export const CATEGORIES: Record<CategoryId, Category> = {
  dev: {
    id: 'dev',
    name: '개발',
    desc: 'Spring Boot, Java, Docker, 최신 기술',
    color: '#0066FF',
    cssVar: '--cat-dev',
  },
  invest: {
    id: 'invest',
    name: '투자',
    desc: '퀀트 분석, 포트폴리오 관리',
    color: '#f59e0b',
    cssVar: '--cat-invest',
  },
  learn: {
    id: 'learn',
    name: '학습',
    desc: '기술 스택, 책/강의 후기',
    color: '#6541F2',
    cssVar: '--cat-learn',
  },
  daily: {
    id: 'daily',
    name: '일상',
    desc: '회고, 생각, 추천',
    color: '#14b8a6',
    cssVar: '--cat-daily',
  },
};

export const CATEGORY_LIST: Category[] = Object.values(CATEGORIES);

import { SETTINGS, type CategorySetting } from './settings';

export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
  desc: string;
  color: string;
  cssVar: string;
}

function toCategory(c: CategorySetting): Category {
  return {
    id: c.id,
    name: c.name,
    desc: c.desc,
    color: c.color,
    cssVar: `--cat-${c.id}`,
  };
}

export const CATEGORY_LIST: Category[] = SETTINGS.categories.map(toCategory);

export const CATEGORIES: Record<string, Category> = Object.fromEntries(
  CATEGORY_LIST.map((c) => [c.id, c]),
);

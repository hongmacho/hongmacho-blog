import settings from '../../blog-settings.json';

export interface CategorySetting {
  id: string;
  name: string;
  desc: string;
  color: string;
  colorBgLight: string;
  colorBgDark: string;
}

export interface CtaSetting {
  label: string;
  href: string;
}

export interface AboutStat {
  key: string;
  label: string;
  value: string | null;
}

export interface AboutTopic {
  name: string;
  desc: string;
}

export interface BlogSettings {
  site: {
    title: string;
    shortTitle: string;
    description: string;
    metaDescription: string;
    author: string;
    keywords: string;
  };
  hero: {
    statusText: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    primaryCta: CtaSetting;
    secondaryCta: CtaSetting;
  };
  footer: {
    subtitle: string;
    copyright: string;
  };
  categories: CategorySetting[];
  about: {
    pageTitle: string;
    pageDescription: string;
    avatarChar: string;
    name: string;
    role: string;
    intro: string[];
    stats: AboutStat[];
    topics: AboutTopic[];
    interests: string[];
    contact: { intro: string; email: string; outro: string };
    links: { github: string };
  };
}

export const SETTINGS = settings as BlogSettings;

export const CATEGORY_IDS = SETTINGS.categories.map((c) => c.id) as [string, ...string[]];

# 홍마초의 잡생각

> 개발, 투자, 학습, 그리고 일상의 기록 — Astro 기반 개인 블로그

`Astro 6` + `TailwindCSS 4` + `TypeScript 6` + `React 19` 스택의 정적 사이트입니다.
Hero 마우스 패럴렉스, Cmd+K 검색, Giscus 댓글, WCAG 2.1 AA 접근성을 갖췄습니다.

---

## ✨ 주요 기능

- **4 카테고리 블로그**: 개발 / 투자 / 학습 / 일상
- **Hero 패럴렉스 (`tree` 변형)**: SVG 지식 그래프 + 마우스 패럴렉스 (React Island)
- **Cmd+K 검색 모달**: 스코어 기반 실시간 검색 + 키보드 네비게이션
- **검색 결과 페이지** (`/search?q=`): `<mark>` 하이라이트 지원
- **TOC 스크롤 스파이**: Article 페이지 우측 220px 사이드바
- **Width Picker**: 본문 너비 600 / 720 / 860px 전환 (localStorage 저장)
- **다크/라이트 테마**: FOUC 없이 즉시 전환, `prefers-color-scheme` 폴백
- **SEO 풀세트**: Open Graph, Twitter Card, JSON-LD (Article), Sitemap, RSS, Canonical
- **Giscus 댓글**: GitHub Discussions 연동, 테마 자동 동기화
- **WCAG 2.1 AA**: 키보드 탐색, focus-visible, skip link, ARIA 레이블
- **반응형**: `@container` 쿼리 기반 (모바일 햄버거 메뉴 포함)

---

## 🛠 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Astro 6.3.6 (SSG) |
| 스타일 | TailwindCSS 4.3 + 디자인 토큰 CSS Variables |
| 인터랙티브 | React 19 Islands (`client:load` / `client:idle` / `client:visible`) |
| 언어 | TypeScript 6 (strict mode) |
| 콘텐츠 | Markdown + Astro Content Collections (zod 스키마) |
| 아이콘 | lucide-react |
| 폰트 | Pretendard Variable (CDN), JetBrains Mono (Google Fonts) |
| 댓글 | Giscus |
| 호스팅 | Vercel |

---

## 🚀 시작하기

### 1. 사전 요구사항

- Node.js ≥ 18
- npm

### 2. 설치 & 실행

```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev
# → http://localhost:4321

# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview
```

### 3. 환경 변수

루트에 `.env.local` 파일을 생성하고 `.env.example` 참조:

```bash
# Giscus 댓글 (https://giscus.app 에서 발급)
PUBLIC_GISCUS_REPO=owner/repo-name
PUBLIC_GISCUS_REPO_ID=your_repo_id
PUBLIC_GISCUS_CATEGORY_ID=your_category_id

# 사이트 URL (Canonical, OG, Sitemap에 사용)
PUBLIC_SITE_URL=https://your-domain.vercel.app
```

> ⚠️ Astro에서 클라이언트 컴포넌트(React Island)에서 접근 가능하려면 환경변수에 `PUBLIC_` prefix가 필요합니다.

---

## 📁 디렉토리 구조

```
hongmacho-blog/
├── public/                  # 정적 자산 (robots.txt 등)
├── src/
│   ├── components/
│   │   ├── article/         # ArticleHeader, ArticleFooter, TOC
│   │   ├── blog/            # PostCard, ListItem, Sidebar, TagCloud
│   │   ├── comments/        # GiscusComments (React Island)
│   │   ├── hero/            # HeroSection, HeroParallax
│   │   ├── home/            # CategoriesSection, LatestPosts
│   │   ├── layout/          # Header, Footer, MobileMenu, SEOHead
│   │   └── ui/              # CategoryBadge, Tag, Button, ThemeToggle,
│   │                        # WidthPicker, SearchOverlay
│   ├── content/
│   │   ├── config.ts        # zod 스키마 정의
│   │   └── blog/            # 마크다운 포스트
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ArticleLayout.astro
│   ├── lib/                 # categories, readTime, search, utils
│   ├── pages/
│   │   ├── index.astro      # 홈 (`/`)
│   │   ├── about.astro      # 소개 (`/about`)
│   │   ├── 404.astro
│   │   ├── search.astro     # 검색 결과 (`/search?q=`)
│   │   ├── feed.xml.ts      # RSS 2.0 (`/feed.xml`)
│   │   ├── sitemap.xml.ts   # Sitemap (`/sitemap.xml`)
│   │   └── blog/
│   │       ├── index.astro  # 블로그 목록 (`/blog`)
│   │       └── [slug].astro # 개별 포스트
│   └── styles/              # tokens.css, app.css, global.css, prose.css
├── astro.config.mjs
├── tsconfig.json
├── vercel.json              # 보안 헤더 + 캐싱 설정
└── README.md
```

---

## ✍️ 포스트 작성

`src/content/blog/YYYY-MM-DD-slug.md` 파일로 작성합니다.

### 프론트매터 스키마

```yaml
---
title: "포스트 제목"
date: "2026-05-22"
category: dev          # dev | invest | learn | daily
excerpt: "140자 이내 요약"
featured: false        # 옵션: 홈에서 grid-column span 2
tags: ["astro", "blog"]
readTime: 5            # 옵션: 미지정 시 자동 계산 (200 wpm)
---

본문 (Markdown)
```

### 카테고리

| ID | 이름 | 색상 |
|------|------|------|
| `dev` | 개발 | `#0066FF` (blue) |
| `invest` | 투자 | `#F59E0B` (amber) |
| `learn` | 학습 | `#6541F2` (violet) |
| `daily` | 일상 | `#14B8A6` (teal) |

---

## 🌐 Vercel 배포

### 1. GitHub 레포지토리 연결

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create hongmacho-blog --public --source=. --push
# 또는 GitHub에서 빈 레포 생성 후
git remote add origin https://github.com/<USER>/hongmacho-blog.git
git push -u origin main
```

### 2. Vercel 프로젝트 생성

1. https://vercel.com/new 접속
2. GitHub 레포 임포트
3. Framework Preset: **Astro** (자동 감지됨)
4. 환경 변수 등록 (`.env.example` 참조)
5. Deploy

### 3. 환경 변수 (Vercel Dashboard)

| 키 | 값 |
|------|------|
| `PUBLIC_GISCUS_REPO` | `owner/repo-name` |
| `PUBLIC_GISCUS_REPO_ID` | giscus.app에서 발급 |
| `PUBLIC_GISCUS_CATEGORY_ID` | giscus.app에서 발급 |
| `PUBLIC_SITE_URL` | `https://your-domain.vercel.app` |

### 4. 보안 헤더

`vercel.json`에 다음이 자동 적용됩니다:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- 정적 자산 캐싱: `immutable, max-age=31536000`

---

## 💬 Giscus 댓글 설정

1. GitHub 레포에서 **Settings → General → Features → Discussions** 활성화
2. https://github.com/apps/giscus 설치 (대상 레포 권한 부여)
3. https://giscus.app 접속 후 설정:
   - 레포: `owner/repo-name`
   - Page ↔ Discussions: `pathname` 권장
   - Category: `General` 또는 `Announcements`
4. 발급된 `data-repo-id`, `data-category-id` 값을 `.env.local` / Vercel 환경 변수에 입력

---

## 🎨 디자인 토큰

모든 색상·간격·shadow는 CSS Variable로 정의됩니다.

| 토큰 | 위치 |
|------|------|
| 색상 팔레트 | `src/styles/tokens.css` (wds-tokens 이식) |
| 시맨틱 토큰 | `src/styles/app.css` (`--color-bg-normal`, `--shadow-strong` 등) |
| 다크 모드 | `[data-theme="dark"]` 분기 |
| 본문 너비 | `--content-width` (600/720/860px, Width Picker 제어) |

> ⚠️ CSS 값 임의 변경 금지 — 항상 토큰 참조

---

## ♿ 접근성

- **WCAG 2.1 AA** 기준 준수
- Skip link → `#main-content`
- `:focus-visible` 2px solid primary, offset 2px
- 모든 아이콘 버튼 `aria-label` 부여
- 모달 (SearchOverlay) focus trap
- `prefers-reduced-motion: reduce` 시 Hero 패럴렉스 비활성화

---

## 📜 라이선스

MIT © 2026 홍마초

---

## 🔗 링크

- Live: https://hongmacho.vercel.app *(배포 후 갱신)*
- RSS: `/feed.xml`
- Sitemap: `/sitemap.xml`

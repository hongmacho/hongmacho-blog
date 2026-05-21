# Development Guidelines — 홍마초의 잡생각 Astro Blog

## Project Overview

- **목적:** Astro 6.3.6 기반 개인 기술 블로그 정적 사이트
- **스택:** Astro 6.3.6 / TailwindCSS 4.3.0 / TypeScript 6.0.3 / lucide-react 1.16.0 / React 19
- **배포:** Vercel (main 브랜치 자동 배포)
- **기준 문서:** `PRD.md` (아키텍처), `ROADMAP.md` (태스크 순서)

---

## Directory Structure

```
src/
├── content/
│   ├── config.ts               ← Content Collection 스키마 (zod)
│   └── blog/*.md               ← 포스트 파일
├── layouts/
│   ├── BaseLayout.astro         ← html/head/theme-script/app-shell
│   └── ArticleLayout.astro      ← TOC + prose wrapper
├── pages/
│   ├── index.astro              ← /
│   ├── blog/index.astro         ← /blog
│   ├── blog/[slug].astro        ← /blog/[slug]
│   ├── about.astro
│   ├── search.astro
│   ├── 404.astro
│   ├── rss.xml.ts
│   └── sitemap.xml.ts
├── components/
│   ├── layout/Header.astro, Footer.astro, MobileMenu.astro
│   ├── hero/HeroSection.astro, HeroBGTree.tsx
│   ├── home/CategoriesSection.astro, LatestPosts.astro
│   ├── blog/PostCard.astro, ListItem.astro, Sidebar.astro, TagCloud.astro
│   ├── article/TOC.tsx, ArticleHeader.astro, ArticleFooter.astro, GiscusComments.tsx
│   ├── search/SearchOverlay.tsx
│   └── ui/CategoryBadge.astro, Tag.astro, Button.astro, ThemeToggle.tsx, WidthPicker.tsx
├── lib/
│   ├── categories.ts            ← CATEGORIES 상수 + CategoryId 타입
│   ├── search.ts                ← 스코어 기반 검색
│   ├── readTime.ts              ← calcReadTime()
│   └── utils.ts                 ← formatDate(), slugify()
└── styles/
    ├── tokens.css               ← wds-tokens.css 이식본 (수정 금지)
    ├── app.css                  ← design_reference/styles/app.css 이식본 (수정 금지)
    ├── global.css               ← @import tokens, app.css + Tailwind directives
    └── prose.css                ← typography 오버라이드만
```

---

## Design Reference Priority

**CSS 값이 필요할 때 반드시 이 순서로 조회한다:**

| 우선순위 | 파일 | 용도 |
|---|---|---|
| 1 | `ui_design_prd/design_reference/styles/app.css` | 모든 시각 값의 최종 권위 (크기·색·간격·애니메이션) |
| 2 | `ui_design_prd/design_reference/styles/wds-tokens.css` | 원자 CSS 변수 정의 |
| 3 | `ui_design_prd/UI_PRD.md` | 컴포넌트 구조·인터랙션 서술 |
| 4 | `ui_design_prd/design_reference/src/components.jsx` | 컴포넌트 구현 참고 |
| 5 | `ui_design_prd/design_reference/src/hero-variants.jsx` | Hero 변형 구현 참고 |
| 6 | `ui_design_prd/design_reference/src/overlays.jsx` | SearchModal, WidthPicker 구현 참고 |

**결정 트리 — CSS 값 추가 시:**
```
값이 필요함
  → app.css에서 기존 클래스/var 검색
      → 존재하면: 해당 클래스/var 그대로 사용
      → 없으면: wds-tokens.css에서 토큰 검색
          → 존재하면: var(--token-name) 참조
          → 없으면: 디자인 레퍼런스 index.html DevTools로 값 확인 후 prose.css에 예외 추가
```

---

## CSS / Styling Rules

### Container Queries (필수)

- `src/layouts/BaseLayout.astro`의 `.app-shell`에 반드시 선언:
  ```css
  .app-shell { container-name: app; container-type: inline-size; }
  ```
- 모든 반응형은 `@container app (max-width: Npx)` 형식으로 작성
- **`@media (max-width: ...)` 너비 쿼리 절대 금지**
- 허용되는 `@media`: `prefers-reduced-motion`, `prefers-color-scheme` 전용

### 브레이크포인트 기준값 (변경 금지)

| 너비 | 변경 내용 |
|---|---|
| ≤960px | 포스트 그리드 2칸, TOC 숨김 |
| ≤900px | 카테고리 2칸, 블로그 레이아웃 1칸 |
| ≤768px | 푸터 1칸, Hero/섹션 패딩 축소 |
| ≤720px | nav 숨김 → 햄버거, 헤더 60px |
| ≤640px | 포스트 그리드 1칸 |
| ≤540px | About stat 1칸 |
| ≤480px | 카테고리 1칸 |
| ≤380px | 워드마크 14px |

### CSS 변수 사용 규칙

- **색상:** `var(--color-*)`, `var(--cat-*)`, `var(--c-*)` 형식만 사용
- **간격:** `var(--space-1)` ~ `var(--space-12)` 사용, px 하드코딩 금지
- **반경:** `var(--radius-1)` ~ `var(--radius-full)` 사용
- **그림자:** `var(--shadow-normal)`, `--shadow-strong`, `--shadow-heavy`, `--shadow-emphasize`
- **모션:** `var(--motion-micro)`, `--motion-standard`, `--motion-transitional)`, `--ease-standard`
- **새 CSS var 생성 금지** — 기존 var 중 없는 경우에만 `prose.css`에 국소 예외 추가

### 다크 테마

- 셀렉터: `[data-theme="dark"]` (`:root`의 미디어 쿼리 아님)
- `<html>` 요소에 `data-theme="dark"` | `"light"` 속성으로 제어

---

## Component Authoring Rules

### Astro vs TSX 판단 기준

| 조건 | 파일 형식 |
|---|---|
| 정적 렌더만 필요 | `.astro` |
| `useState`, `useEffect`, DOM 이벤트 리스너, localStorage 직접 조작 | `.tsx` (Astro Island) |
| `mousemove`, `scroll`, `keydown` 이벤트 필요 | `.tsx` (Astro Island) |

### Island 로딩 전략 (변경 금지)

| 컴포넌트 | 디렉티브 | 이유 |
|---|---|---|
| `ThemeToggle.tsx` | `client:load` | 초기 렌더 시 즉시 필요 |
| `WidthPicker.tsx` | `client:load` | 초기 렌더 시 즉시 필요 |
| `HeroBGTree.tsx` | `client:load` | 마우스 이벤트 즉시 필요 |
| `TOC.tsx` | `client:load` | 스크롤 스파이 즉시 필요 |
| `SearchOverlay.tsx` | `client:idle` | 초기 로드 불필요 |
| `GiscusComments.tsx` | `client:visible` | 뷰포트 진입 시 로드 |

### 컴포넌트 Props 규칙

- Props는 반드시 `interface`로 명시 (inline type 금지)
- `React.FC` 사용 금지, 함수 선언 방식 사용
- callback props: `(id: string) => void` 형식으로 명시적 타입 정의

### 카테고리 컴포넌트

- 카테고리 ID → 한국어 변환: `src/lib/categories.ts`의 `CATEGORIES` 상수만 사용
- CategoryBadge 색상: CSS `--cat-dev`, `--cat-invest`, `--cat-learn`, `--cat-daily` var 사용
- 카테고리 직접 하드코딩 금지

---

## Content Collection Rules

### 스키마 (`src/content/config.ts`)

```typescript
// 필수 필드 (변경 금지)
title:    z.string()
date:     z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
category: z.enum(['dev', 'invest', 'learn', 'daily'])
excerpt:  z.string().max(140)
tags:     z.array(z.string()).min(1)
// 선택 필드
featured: z.boolean().optional().default(false)
readTime: z.number().optional()  // 없으면 calcReadTime()으로 자동 계산
```

### 포스트 파일 규칙

- 파일명: `YYYY-MM-DD-slug.md` 형식 필수
- 위치: `src/content/blog/` 고정
- 마크다운 헤딩: H2, H3만 사용 (H1은 페이지 제목이 담당)
- 코드 블록: 언어 명시 필수 (` ```typescript `, ` ```bash ` 등)
- 이미지: 사용 금지 (텍스트 포워드 디자인)

### readTime 계산

- `src/lib/readTime.ts`의 `calcReadTime(content: string): number` 사용
- 기준: 200 단어/분, `Math.max(1, Math.ceil(wordCount / 200))`

---

## State Management Rules

### localStorage Keys (변경 금지)

| Key | 값 | 담당 컴포넌트 |
|---|---|---|
| `blog-theme` | `'light'` \| `'dark'` | ThemeToggle.tsx |
| `blog-content-width` | `'600px'` \| `'720px'` \| `'860px'` | WidthPicker.tsx |
| `blog-recent-searches` | `JSON.stringify(string[])` (max 5) | SearchOverlay.tsx |

### URL 상태 (필터/검색)

- 카테고리 필터: `?cat=dev` | `invest` | `learn` | `daily`
- 태그 필터: `?tag=<slug>`
- 검색 쿼리: `?q=<query>`
- URL 변경 시 반드시 `history.replaceState()` 사용 — `pushState` 금지

### CSS 변수 상태

- `--content-width`: `document.documentElement.style.setProperty('--content-width', value)`
- `data-theme`: `document.documentElement.setAttribute('data-theme', value)`

### 테마 초기화 순서 (BaseLayout.astro `<head>` 인라인 스크립트)

```
1. localStorage.getItem('blog-theme') 조회
2. 없으면 window.matchMedia('(prefers-color-scheme: dark)').matches 확인
3. document.documentElement.setAttribute('data-theme', result)
4. localStorage.getItem('blog-content-width') 조회 (기본 '720px')
5. document.documentElement.style.setProperty('--content-width', result)
```

---

## Multi-file Coordination

**다음 수정은 반드시 동시에 수행한다:**

| 작업 | 수정해야 할 파일 |
|---|---|
| 카테고리 추가/변경 | `src/lib/categories.ts` + `src/styles/app.css` (--cat-* vars 추가) + `src/content/config.ts` (enum 추가) |
| 새 페이지 추가 | 새 `src/pages/*.astro` + `src/components/layout/Footer.astro` (EXPLORE 칼럼) + `src/pages/sitemap.xml.ts` |
| Content Collection 스키마 필드 추가 | `src/content/config.ts` + 기존 모든 `src/content/blog/*.md` frontmatter |
| 검색 스코어 로직 변경 | `src/lib/search.ts` + `src/components/search/SearchOverlay.tsx` (동일 로직 사용) |
| 새 Island 컴포넌트 추가 | `.tsx` 파일 + 해당 `.astro` 페이지/레이아웃에서 `client:*` 디렉티브로 import |

---

## TypeScript Rules

- `any` 타입 사용 금지 — `unknown` + 타입 가드 사용
- 외부 데이터(API 응답, localStorage JSON) 파싱 시 `zod` 스키마 검증 필수
- 공유 타입 정의 위치: `src/lib/*.ts` (컴포넌트 파일 내 타입 export 금지)
- `CategoryId` 타입: `src/lib/categories.ts`에서 import
- Astro 컴포넌트 Props: `interface Props` 이름으로 동일 파일 내 선언

---

## Search Scoring Rules

`src/lib/search.ts`의 스코어 기준 (변경 금지):

| 매칭 조건 | 점수 |
|---|---|
| title contains query | +10 |
| title prefix match | +5 |
| excerpt contains | +4 |
| tags contains | +6 |
| category match | +3 |

---

## Hero Rules

- 프로덕션 기본: `tree` 변형 1개
- 다중 변형 사용 시: `Math.random()`으로 선택, `localStorage` 저장 금지
- 마우스 패럴렉스 CSS var (7개, 이름 변경 금지):
  `--mx`, `--my`, `--mx-pct`, `--my-pct`, `--mx-px`, `--my-px`, `--m-deg`
- lerp factor: `0.10` (변경 금지)
- `prefers-reduced-motion: reduce` 시 rAF 루프 중단 + CSS 애니메이션 제거 필수
- `useEffect` cleanup: rAF 취소 + 이벤트 리스너 제거 필수

---

## TOC Rules

- 스크롤 스파이 offset: `120px` (변경 금지)
- 활성 클래스: `is-active`
- sticky top: `88px` (헤더 68px + 여백)
- `scroll-margin-top: 88px` — h2, h3 모두 적용
- ≤960px 컨테이너 너비에서 TOC 숨김

---

## Prohibited Actions

- **`ui_design_prd/design_reference/` 하위 파일 수정 절대 금지** — 읽기 전용 레퍼런스
- **`src/styles/tokens.css`, `src/styles/app.css` 직접 수정 금지** — 이식 완료 후 불변
- **`tweaks-panel.jsx` 관련 코드를 production 빌드에 포함 금지**
- **`@media (max-width: ...)` 너비 쿼리 작성 금지**
- **`React.FC` 사용 금지**
- **`any` 타입 사용 금지**
- **`console.log` 사용 금지**
- **CSS 값 임의 추측 금지** — 반드시 app.css 또는 wds-tokens.css에서 조회
- **새 CSS 커스텀 프로퍼티(--var) 임의 생성 금지** — 기존 토큰만 참조
- **인라인 스타일(`style="..."`) 사용 금지** — CSS 클래스 또는 CSS var로 대체
- **`history.pushState()` 필터/검색 URL 변경에 사용 금지** — `replaceState()` 필수
- **localStorage key 임의 변경 금지** — `blog-theme`, `blog-content-width`, `blog-recent-searches`
- **Hero lerp factor(0.10) 변경 금지**
- **검색 스코어 기준값 변경 금지**

---

## Decision Tree — 컴포넌트 추가 시

```
새 컴포넌트 필요
  → DOM 이벤트/localStorage/상태 필요?
      → YES: src/components/{도메인}/{Name}.tsx 생성
              + 해당 페이지에서 client:load|idle|visible 디렉티브로 마운트
      → NO:  src/components/{도메인}/{Name}.astro 생성

  → 카테고리 배지 필요?
      → YES: src/components/ui/CategoryBadge.astro 재사용 (새로 만들지 않음)

  → 버튼 필요?
      → YES: src/components/ui/Button.astro variant prop 사용

  → 태그 chip 필요?
      → YES: src/components/ui/Tag.astro 재사용
```

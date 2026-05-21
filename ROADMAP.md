# ROADMAP: 홍마초의 잡생각 — Astro 블로그

> **목적:** 이 ROADMAP은 shrimp-task-manager MCP로 태스크를 계획·실행하기 위한 입력 문서다.  
> **기준 문서:** `PRD.md` (아키텍처·기능) + `ui_design_prd/UI_PRD.md` (디자인 단일 진실 소스)  
> **디자인 최종 권위:** `ui_design_prd/design_reference/styles/app.css`

---

## 전제 조건

- Node.js ≥ 18
- 작업 디렉토리: `/Users/hongpaul/develop/project-persnol/hongmacho-blog`
- 디자인 레퍼런스: `ui_design_prd/design_reference/index.html` (브라우저에서 열어 나란히 비교)
- 모든 CSS 값은 `app.css` → `wds-tokens.css` 순으로 조회, 임의 변경 금지

---

## Phase 0 — MVP (기반 구축)

**목표:** 모든 페이지가 렌더되고, 디자인 토큰이 완전히 이식되며, 기본 인터랙션이 동작한다.

---

### TASK-01: 프로젝트 스캐폴딩

**설명:**  
Astro 6.3.6 + TailwindCSS 4.3.0 + TypeScript 6.0.3 프로젝트를 생성한다.  
현재 디렉토리(`hongmacho-blog/`)에 `npm create astro@latest` 혹은 수동 설정으로 초기화한다.

**의존성:** 없음

**설치할 패키지:**
```
astro@6.3.6
@astrojs/tailwind
tailwindcss@4.3.0
@tailwindcss/typography@0.5.19
@tailwindcss/vite
lucide-react@1.16.0
@astrojs/react
react@19
react-dom@19
typescript@6.0.3
```

**설정 파일:**
- `astro.config.mjs` — integrations: [react(), tailwind()]
- `tsconfig.json` — strict mode, paths alias `@/*` → `src/*`
- `tailwind.config.mjs` — typography plugin 등록

**완료 기준:**
- `npm run dev` 실행 후 localhost:4321 접근 가능
- TypeScript 오류 없음
- TailwindCSS 클래스가 HTML에 적용됨

---

### TASK-02: 디자인 토큰 이식

**설명:**  
`ui_design_prd/design_reference/styles/wds-tokens.css`와 `app.css`를 Astro 프로젝트의 글로벌 스타일로 이식한다.  
**수정 없이 그대로 가져오되**, Astro 빌드 시스템에 맞게 import 구조만 조정한다.

**의존성:** TASK-01

**작업 내용:**
1. `src/styles/tokens.css` 생성 — wds-tokens.css 내용 전체 복사
2. `src/styles/app.css` 생성 — design_reference/styles/app.css 내용 전체 복사
3. `src/styles/global.css` 생성:
   ```css
   @import './tokens.css';
   @import './app.css';
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
4. `src/styles/prose.css` 생성 — typography prose 오버라이드 (PRD §5.8 기준)

**완료 기준:**
- CSS 변수 `--c-blue-50`, `--color-bg-normal`, `--space-6`, `--radius-3`, `--shadow-strong` 등이 브라우저 DevTools에서 확인됨
- `.app-shell { container-name: app; container-type: inline-size }` 동작 확인
- 다크 모드 `[data-theme="dark"]` CSS var 분기 확인

---

### TASK-03: BaseLayout 구현

**설명:**  
모든 페이지의 HTML 골격. 테마 초기화(깜빡임 방지), 폰트 로드, `--content-width` CSS var 초기화를 담당한다.

**의존성:** TASK-02

**파일:** `src/layouts/BaseLayout.astro`

**구현 요구사항:**
1. `<html lang="ko">` — `data-theme` 속성 (인라인 스크립트로 최초 설정)
2. `<head>` 인라인 `<script>` (블로킹, 깜빡임 방지):
   ```js
   // localStorage → prefers-color-scheme 폴백
   const saved = localStorage.getItem('blog-theme');
   const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
   document.documentElement.setAttribute('data-theme', saved || sys);
   // --content-width 복원
   const w = localStorage.getItem('blog-content-width') || '720px';
   document.documentElement.style.setProperty('--content-width', w);
   ```
3. Pretendard Variable CDN: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css`
4. JetBrains Mono Google Fonts: `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap`
5. `<body>` → `<div class="app-shell">` 래핑
6. Props: `title`, `description`, `ogImage?`

**완료 기준:**
- 다크/라이트 전환 시 페이지 새로고침해도 테마 유지
- 새로고침 시 테마 깜빡임(FOUC) 없음
- Pretendard 폰트가 렌더됨 (DevTools Network에서 font 요청 확인)

---

### TASK-04: Atom 컴포넌트 구현

**설명:**  
재사용 가능한 최소 단위 UI 컴포넌트 4종을 구현한다.  
모든 CSS는 `app.css` 클래스를 사용하고 인라인 스타일 최소화.

**의존성:** TASK-02

**파일 및 구현:**

1. `src/components/ui/CategoryBadge.astro`
   - Props: `category: 'dev' | 'invest' | 'learn' | 'daily'`
   - 클래스: `cat-badge cat-badge--{category}` (app.css 기준)
   - 카테고리명 한국어 변환: dev→개발, invest→투자, learn→학습, daily→일상

2. `src/components/ui/Tag.astro`
   - Props: `tag: string`, `href?: string`
   - 클래스: `tag` (app.css 기준)

3. `src/components/ui/Button.astro`
   - Props: `variant: 'primary' | 'white' | 'ghost'`, `href?: string`, `type?: string`
   - 클래스: `btn btn--{variant}`

4. `src/lib/categories.ts`
   ```ts
   export const CATEGORIES = {
     dev:    { id: 'dev',    name: '개발',  color: '#0066FF', cssVar: '--cat-dev' },
     invest: { id: 'invest', name: '투자',  color: '#F59E0B', cssVar: '--cat-invest' },
     learn:  { id: 'learn',  name: '학습',  color: '#6541F2', cssVar: '--cat-learn' },
     daily:  { id: 'daily',  name: '일상',  color: '#14B8A6', cssVar: '--cat-daily' },
   } as const
   export type CategoryId = keyof typeof CATEGORIES
   ```

**완료 기준:**
- CategoryBadge가 각 카테고리 색상으로 렌더됨
- Tag 클릭 시 href로 이동
- Button 3종 variant 스타일 일치

---

### TASK-05: Header 컴포넌트 구현

**설명:**  
sticky + frosted glass 헤더. 스크롤 8px 이상 시 hairline border 등장. ≤720px에서 햄버거 메뉴로 전환.  
디자인 레퍼런스: `components.jsx`의 `Header` 컴포넌트 구현을 참고한다.

**의존성:** TASK-03, TASK-04

**파일:**
- `src/components/layout/Header.astro`
- `src/components/layout/MobileMenu.astro`
- `src/components/ui/ThemeToggle.tsx` (Astro Island, client:load)
- `src/components/ui/WidthPicker.tsx` (Astro Island, client:load)

**구현 요구사항:**
1. `.site-header` (sticky, backdrop-filter: blur(24px), z-50)
2. `.site-header__inner` height: 68px / 60px (@container app ≤720px)
3. 브랜드 배지: 32px, border-radius: 9px, blue→violet gradient + 🚀 emoji
4. 워드마크: "홍마초의 잡생각" + 5px blue `.brand__dot`
5. Nav: 홈/블로그/소개 링크, 활성 시 `is-active` 클래스 → brand-blue 2px underline
6. 툴 클러스터: 검색 아이콘 버튼 + WidthPicker + ThemeToggle
7. 스크롤 이벤트 → `scrolled` 클래스 토글 (8px 임계값)
8. ≤720px: nav 숨김, 햄버거 버튼 노출
9. ThemeToggle.tsx: Sun ↔ Moon 아이콘, localStorage `blog-theme`, 호버 -18deg 회전
10. WidthPicker.tsx: 3-bar glyph, 220px popover, 600/720/860px radio, `--content-width` CSS var + localStorage `blog-content-width`
11. 검색 버튼: 클릭 시 전역 이벤트 dispatch (SearchOverlay 연동용)

**완료 기준:**
- design_reference 헤더와 픽셀 수준으로 일치
- 스크롤 시 hairline 등장
- 테마 전환 즉시 반영
- Width Picker 동작 확인 (본문 너비 변경)
- 모바일(≤720px)에서 햄버거만 표시

---

### TASK-06: Footer 컴포넌트 구현

**설명:**  
3칸 그리드 푸터 (1.4fr / 1fr / 1fr). ≤768px에서 1칸.  
빌드 날짜 자동 주입, v1.0.0 mono pill.

**의존성:** TASK-03, TASK-04

**파일:** `src/components/layout/Footer.astro`

**구현 요구사항:**
1. `.site-footer` border-top hairline, padding: 48px 0 56px
2. 3-col grid: 브랜드 블록 / EXPLORE 칼럼 / MORE 칼럼
3. 브랜드 블록: 배지+워드마크 + 태그라인 + GitHub/X/RSS 소셜 아이콘
4. EXPLORE: 전체 글 + dev/invest/learn/daily 링크
5. MORE: About / 구독 링크
6. bottom row: `© 2026 홍마초. Built with Astro + TailwindCSS.` + 빌드 날짜 + `v1.0.0` mono pill
7. 빌드 날짜: `new Date().toLocaleDateString('ko-KR', {year:'numeric',month:'long',day:'numeric'})`

**완료 기준:**
- design_reference 푸터와 레이아웃 일치
- ≤768px에서 1칸으로 전환
- 소셜 아이콘 호버 시 색상 변화

---

### TASK-07: Content Collection 설정 + 샘플 포스트

**설명:**  
Astro Content Collections API로 블로그 포스트 스키마를 정의하고, 샘플 포스트 5개를 작성한다.

**의존성:** TASK-01

**파일:**
- `src/content/config.ts`
- `src/content/blog/` 디렉토리 + 샘플 포스트 5개

**스키마:**
```typescript
import { z, defineCollection } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title:    z.string(),
    date:     z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    category: z.enum(['dev', 'invest', 'learn', 'daily']),
    excerpt:  z.string().max(140),
    featured: z.boolean().optional().default(false),
    tags:     z.array(z.string()).min(1),
    readTime: z.number().optional(),
  })
})
export const collections = { blog }
```

**샘플 포스트:**
- `2026-05-21-astro-blog-journey.md` (dev, featured: true, 800자 이상)
- `2026-05-22-quant-trading.md` (invest, 600자 이상)
- `2026-05-23-spring-boot-optimization.md` (dev, 700자 이상)
- `2026-05-24-java-streams.md` (dev, 600자 이상)
- `2026-05-25-quitting-career.md` (daily, 500자 이상)

각 포스트는 H2/H3 헤딩, 코드 블록(언어 명시), blockquote, 표를 최소 1개씩 포함 (prose 스타일 검증용).

**완료 기준:**
- `getCollection('blog')` 호출 시 5개 포스트 반환
- TypeScript 타입 추론 정상
- zod 스키마 검증 통과

---

### TASK-08: 유틸리티 라이브러리 구현

**설명:**  
공통 유틸리티 함수 구현.

**의존성:** TASK-07

**파일:**

1. `src/lib/readTime.ts`
   ```ts
   export function calcReadTime(content: string): number {
     const WORDS_PER_MIN = 200
     return Math.max(1, Math.ceil(content.split(/\s+/).length / WORDS_PER_MIN))
   }
   ```

2. `src/lib/utils.ts`
   ```ts
   export function formatDate(dateStr: string): string {
     return new Date(dateStr).toLocaleDateString('ko-KR', {
       year: 'numeric', month: 'long', day: 'numeric'
     })
   }
   export function slugify(str: string): string { ... }
   ```

3. `src/lib/search.ts`
   ```ts
   // 스코어 기반 검색
   // title contains: +10, title prefix: +5
   // excerpt: +4, tags: +6, category: +3
   export function searchPosts(posts: BlogPost[], query: string): ScoredPost[]
   ```

**완료 기준:**
- `calcReadTime` 단위 테스트 통과 (200단어 → 1분)
- `searchPosts` 스코어 계산 정확성 확인

---

### TASK-09: 홈 페이지 구현 (`/`)

**설명:**  
Hero 섹션 + 카테고리 섹션 + 최신 글 3개 섹션으로 구성된 홈 페이지.  
Hero는 정적 `aurora` 변형 1개로 시작 (Phase 1에서 `tree`로 교체).

**의존성:** TASK-05, TASK-06, TASK-07, TASK-08

**파일:**
- `src/pages/index.astro`
- `src/components/hero/HeroSection.astro`
- `src/components/home/CategoriesSection.astro`
- `src/components/home/LatestPosts.astro`
- `src/components/blog/PostCard.astro`

**HeroSection 구현:**
1. `.hero` padding: 128px 0 104px → 80px 0 64px (@container app ≤768px)
2. `.hero__greeting` — status pill + pulsing green dot + "지금 글을 쓰고 있어요"
3. `h1.hero__title` — "개발, 투자, 학습." (줄1) + "그리고 일상의 기록" + `.hero__caret` (steps(2) blink)
4. `.accent` 클래스로 brand-blue `.` 강조
5. Hero sub 문단: clamp(16px, 1.6vw, 19px), max-width: 56ch
6. CTA row: btn--white "최신 글 보기" + btn--ghost "About"
7. 배경: `aurora` 변형 정적 CSS (app.css의 `.hero--aurora` 클래스 적용)

**CategoriesSection:**
- alt bg + 상하 hairline
- `.cat-grid` 4col → 2col @900 → 1col @480
- 각 카드: count는 `getCollection('blog')`으로 실시간 계산
- 클릭 시 `/blog?cat={id}` 이동

**LatestPosts:**
- `getCollection('blog')` → date 정렬 → 최신 3개
- `.post-grid` 3col → 2col @960 → 1col @640
- featured 포스트: `grid-column: span 2`

**PostCard:**
- CategoryBadge + title 2줄 clamp + excerpt 3줄 clamp + meta(date·readTime) + tags(max 3)
- 호버: `translateY(-2px)` + `shadow-strong`

**완료 기준:**
- design_reference 홈과 레이아웃 1:1 일치
- 카테고리 카드 hover 인터랙션 (3px top accent scaleX)
- PostCard 호버 동작
- 반응형 브레이크포인트 전체 확인

---

### TASK-10: Blog List 페이지 구현 (`/blog`)

**설명:**  
2-칸 레이아웃(사이드바 220px + 목록). 카테고리/태그 필터를 URL 파라미터로 관리.

**의존성:** TASK-05, TASK-06, TASK-07, TASK-08

**파일:**
- `src/pages/blog/index.astro`
- `src/components/blog/Sidebar.astro`
- `src/components/blog/ListItem.astro`
- `src/components/blog/TagCloud.astro`

**구현 요구사항:**
1. `Astro.url.searchParams`로 `?cat=` / `?tag=` 읽기 (SSG: 클라이언트 사이드 필터링)
2. `.blog-layout` grid: 220px 1fr, gap: 56px → 1col @900
3. Sidebar sticky top: 88px → static @900
4. 카테고리 버튼: color dot + 이름 + count badge, 활성 시 `fill-strong` bg
5. 태그 클라우드: frequency 정렬, Tag 컴포넌트 사용
6. ListItem: hairline border-bottom, 호버 title → primary color
7. 클라이언트 사이드 필터: URL 변경 시 `replaceState` 사용, 페이지 새로고침 없이 필터
8. 페이지 헤드: h1 "블로그" 40px + 서브 텍스트

**ListItem 구조:**
- meta row: CategoryBadge + date + readTime
- h3: 22px, 호버 → primary blue
- excerpt: 15px alt, max-width: 64ch
- tags: Tag chips

**완료 기준:**
- URL `?cat=dev` → dev 포스트만 표시
- URL `?tag=spring-boot` → 해당 태그 포스트만 표시
- 브라우저 뒤로가기/앞으로가기 정상 동작
- ≤900px 사이드바 상단으로 이동

---

### TASK-11: Article 페이지 구현 (`/blog/[slug]`)

**설명:**  
TOC(220px) + 본문(`var(--content-width)`) 2-칸 레이아웃. Prose 스타일 완전 구현.

**의존성:** TASK-05, TASK-06, TASK-07, TASK-08

**파일:**
- `src/layouts/ArticleLayout.astro`
- `src/pages/blog/[slug].astro`
- `src/components/article/ArticleHeader.astro`
- `src/components/article/ArticleFooter.astro`
- `src/components/article/TOC.tsx` (Astro Island, client:load)

**구현 요구사항:**
1. `.article-layout` grid: 220px 1fr, gap: 56px → 1col @960
2. ArticleHeader: CategoryBadge + date + readTime + h1 clamp(28px,4vw,40px) + excerpt 17px + byline
3. byline: 36px gradient avatar(blue→violet, "홍" 문자) + 이름 + 날짜
4. Prose: `@tailwindcss/typography` + `src/styles/prose.css` 오버라이드
   - body: 16px / line-height 1.75
   - h2: 26px + scroll-margin-top: 88px
   - h3: 20px + scroll-margin-top: 88px
   - blockquote: 4px brand-blue left border + alt bg + italic
   - inline code: `fill-normal` bg + 4px radius
   - code block: JetBrains Mono 13.5px + alt bg + 12px radius + hairline border
   - table: hairline border + rounded corners + alt-bg 헤더
5. ArticleFooter: tag row + 링크복사/공유 ghost 버튼 + 관련 글(2열, 같은 카테고리) + Giscus placeholder
6. TOC.tsx Island:
   - `getStaticPaths`에서 h2/h3 추출 → props로 전달
   - 스크롤 스파이: `scroll` 이벤트, 120px offset
   - 활성 항목: `is-active` → brand-blue + 2px left indicator
   - `sticky top: 88px`, `max-height: calc(100vh - 110px)`, overflow-y scroll

**완료 기준:**
- prose h2/h3 스타일 design_reference 일치
- blockquote/code/table 스타일 일치
- TOC 스크롤 시 활성 항목 자동 추적
- ≤960px TOC 숨김

---

### TASK-12: About + 404 페이지 구현

**설명:**  
소개 페이지와 Not Found 페이지 구현.

**의존성:** TASK-05, TASK-06, TASK-04

**파일:**
- `src/pages/about.astro`
- `src/pages/404.astro`

**About:**
1. max-width: 720px, margin: auto, padding: 64px 24px
2. 80px gradient circular avatar (blue→violet, "홍" 문자)
3. h1 28px + role caption alt-color + intro 본문
4. `.stat-grid` 3칸(글 수 / 백엔드 경력 / 올해 읽은 책) → 1칸 @540
5. 주제/관심사/연락처 bullet 섹션
6. CTA: primary "최신 글 보러가기" + ghost "GitHub"

**404:**
1. full-height centered flex
2. "404" gradient (blue→violet): clamp(96px, 12vw, 180px)
3. h1 title-1 + p body-1 alt
4. CTA 2개: primary "홈으로" + ghost "블로그 보기"

**완료 기준:**
- About stat grid 반응형 확인
- 404 gradient 텍스트 렌더링 확인
- 두 페이지 모두 design_reference와 일치

---

## Phase 1 — 인터랙션 & 검색 기반

**목표:** Hero 마우스 패럴렉스, TOC 스파이, Width Picker, 클라이언트 검색이 완전히 동작한다.

---

### TASK-13: Hero `tree` 변형 + 마우스 패럴렉스 Island ✓ COMPLETED


**설명:**  
`tree` 변형 Hero 배경을 React Island로 구현한다.  
디자인 레퍼런스: `ui_design_prd/design_reference/src/hero-variants.jsx`의 `HeroTree` 컴포넌트를 참고한다.

**의존성:** TASK-09

**파일:** `src/components/hero/HeroParallax.tsx` (client:idle)

**구현 요구사항:**
1. SVG 지식 그래프 (노드 + 엣지) 구현
2. `mousemove` 이벤트 → `targetX/Y` 저장
3. `requestAnimationFrame` loop: lerp factor 0.10
4. Hero element에 7개 CSS var 갱신:
   - `--mx` (-0.5 ~ 0.5)
   - `--my` (-0.5 ~ 0.5)
   - `--mx-pct` (0% ~ 100%)
   - `--my-pct` (0% ~ 100%)
   - `--mx-px`, `--my-px`
   - `--m-deg` (각도)
5. `mouseleave` → center(0,0)으로 복귀
6. `prefers-reduced-motion: reduce` → rAF loop 중단, CSS 애니메이션 제거
7. `useEffect` cleanup에서 rAF 취소 + listener 제거

**완료 기준:**
- 마우스 이동에 따라 그래프 노드가 부드럽게 반응
- reduced-motion 환경에서 정적으로 렌더
- 메모리 누수 없음 (페이지 이탈 시 rAF 취소 확인)

---

### TASK-14: Cmd+K 검색 모달 구현

**설명:**  
전역 검색 오버레이. `⌘K` / `Ctrl+K` / `/` 트리거. 스코어 기반 실시간 검색.  
디자인 레퍼런스: `ui_design_prd/design_reference/src/overlays.jsx`의 `SearchModal` 참고.

**의존성:** TASK-08, TASK-05

**파일:** `src/components/search/SearchOverlay.tsx` (client:idle)

**구현 요구사항:**
1. 트리거: `document.addEventListener('keydown')` — `⌘K` / `Ctrl+K` / `/`(input 미포커스 시)
2. 오버레이: full-viewport backdrop-filter blur(6px), fade-in 160ms
3. `.search-modal` max-width: 600px, slide-down 200ms
4. 빈 상태: 최근 검색 chips(max 5) + 카테고리 목록 + 추천 글 3개
5. 타이핑 상태: 스코어 검색 결과 max 8 + "전체 N개 모두 보기" → `/search?q=`
6. 포스트 데이터: 빌드 시 JSON으로 직렬화 → Island props로 전달 (`define:vars` 또는 `data-` attribute)
7. localStorage `blog-recent-searches` (max 5, 중복 제거)
8. 키보드: `↑`/`↓` 네비게이트, `Enter` 선택, `Esc` 닫기
9. 활성 행: `--color-fill-normal` 배경
10. `<mark>` 태그로 매칭 텍스트 하이라이트

**완료 기준:**
- design_reference 검색 모달과 시각적 일치
- 키보드 네비게이션 완전 동작
- 최근 검색어 localStorage 저장/불러오기
- `⌘K` 단축키 동작 (Mac/Windows 모두)

---

### TASK-15: 검색 결과 페이지 구현 (`/search`)

**설명:**  
`/search?q=` 검색 결과 전용 페이지.

**의존성:** TASK-08, TASK-10

**파일:** `src/pages/search.astro`

**구현 요구사항:**
1. `Astro.url.searchParams.get('q')` → 쿼리 읽기
2. `h1` "검색어" 따옴표(alt-color) 포함, 32px
3. 재검색 form: radius 12, alt bg, 36px submit 버튼
4. 쿼리 없거나 결과 없음: dashed border alt-bg card + 인기 태그 클라우드
5. 결과: ListItem 스타일 + `<mark>` 하이라이트
6. 결과 수: "N개의 결과" 서브헤딩

**완료 기준:**
- `/search?q=astro` 접근 시 관련 포스트 표시
- mark 하이라이트 정상 렌더
- empty state 스타일 확인

---

## Phase 2 — 폴리시 & 배포

**목표:** SEO, 접근성, 성능 최적화 완료. Vercel 배포.

---

### TASK-16: SEO + Meta 태그 완성

**설명:**  
모든 페이지에 Open Graph, Twitter Card, Schema.org, Canonical URL 추가.

**의존성:** TASK-09, TASK-10, TASK-11, TASK-12

**파일:**
- `src/components/seo/SEOHead.astro` (BaseLayout에 포함)
- `src/pages/rss.xml.ts`
- `src/pages/sitemap.xml.ts`
- `public/robots.txt`

**구현 요구사항:**
1. SEOHead: `<title>`, `<meta name="description">`, `og:*`, `twitter:card`, canonical
2. Article 페이지: Schema.org `Article` + `Person` JSON-LD
3. RSS: `@astrojs/rss` 사용
4. Sitemap: 전체 URL 목록 (동적 생성)
5. robots.txt: Sitemap 경로 포함

**완료 기준:**
- Facebook Sharing Debugger에서 OG 태그 확인
- `/rss.xml` 유효한 RSS 반환
- `/sitemap.xml` 전체 URL 포함

---

### TASK-17: Giscus 댓글 통합

**설명:**  
GitHub Discussions 기반 댓글 시스템. Article 페이지 하단에 삽입.

**의존성:** TASK-11

**파일:** `src/components/article/GiscusComments.tsx` (client:visible)

**구현 요구사항:**
1. Giscus 스크립트 동적 주입
2. 다크/라이트 테마 연동 (`data-theme` 변경 감지)
3. `loading="lazy"` 적용
4. 환경 변수: `PUBLIC_GISCUS_REPO`, `PUBLIC_GISCUS_REPO_ID`, `PUBLIC_GISCUS_CATEGORY_ID`
5. `.env.example` 파일 생성

**완료 기준:**
- 댓글 위젯 렌더 확인 (Giscus 계정 설정 후)
- 테마 전환 시 Giscus 테마도 즉시 변경

---

### TASK-18: 접근성 감사 & 수정

**설명:**  
WCAG 2.1 AA 기준으로 전체 접근성 검토.

**의존성:** TASK-09 ~ TASK-15

**체크 항목:**
- [ ] 모든 이미지 `alt` 속성
- [ ] `focus-visible` 스타일: 2px solid primary, offset 2px
- [ ] 모든 버튼/링크 `aria-label` (아이콘 전용 시)
- [ ] 색상 대비 4.5:1 검증 (주요 텍스트)
- [ ] 터치 타겟 ≥ 44px (모바일 검증)
- [ ] 키보드 탭 순서 논리적
- [ ] 모달 focus trap (SearchOverlay)
- [ ] prefers-reduced-motion Hero 애니메이션 비활성화 확인

**완료 기준:**
- Lighthouse Accessibility ≥ 95
- 키보드 전용 조작으로 전체 페이지 탐색 가능

---

### TASK-19: 성능 최적화 & Lighthouse 검증

**설명:**  
번들 크기 목표 달성 및 Core Web Vitals 최적화.

**의존성:** TASK-16 ~ TASK-18

**최적화 항목:**
- [ ] JS ≤ 50KB (Island 코드 스플리팅 확인)
- [ ] CSS ≤ 30KB (미사용 Tailwind 클래스 제거 확인)
- [ ] 폰트: `font-display: swap` 설정
- [ ] `client:idle` / `client:visible` Island 로딩 전략 재검토
- [ ] Astro 빌드 출력 `dist/` 크기 확인

**목표:**
- Performance ≥ 95
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO = 100

**완료 기준:**
- Lighthouse 목표 수치 달성 (로컬 build preview 기준)
- FCP < 1s, LCP < 2s, CLS < 0.1

---

### TASK-20: Vercel 배포 설정

**설명:**  
GitHub 연동 + Vercel 자동 배포 설정.

**의존성:** TASK-19

**파일:**
- `vercel.json`
- `.env.example`
- `README.md` (배포 가이드 포함)

**vercel.json:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

**작업 순서:**
1. `git init` + GitHub 레포 연결
2. Vercel 프로젝트 생성 + GitHub 연동
3. 환경 변수 Vercel Dashboard에 등록
4. `main` 브랜치 push → 배포 확인

**완료 기준:**
- `https://*.vercel.app` 에서 사이트 접근 가능
- PR 생성 시 Preview 배포 URL 자동 생성

---

## 태스크 의존성 그래프

```
TASK-01 (스캐폴딩)
  └─ TASK-02 (토큰 이식)
       └─ TASK-03 (BaseLayout)
            ├─ TASK-05 (Header) ─────────────────────────┐
            ├─ TASK-06 (Footer) ─────────────────────────┤
            └─ TASK-04 (Atom 컴포넌트) ──────────────────┤
  └─ TASK-07 (Content Collection)                        │
       └─ TASK-08 (유틸리티)                             │
            ├─ TASK-09 (홈) ─────────────────────────────┤
            ├─ TASK-10 (Blog List) ───────────────────────┤
            ├─ TASK-11 (Article) ─────────────────────────┤
            └─ TASK-12 (About + 404) ─────────────────────┘
                  │
            TASK-13 (Hero tree Island) [TASK-09 필요]
            TASK-14 (검색 모달) [TASK-08, 05 필요]
            TASK-15 (검색 결과 페이지) [TASK-08, 10 필요]
                  │
            TASK-16 (SEO)
            TASK-17 (Giscus) [TASK-11 필요]
            TASK-18 (접근성)
            TASK-19 (성능 + Lighthouse)
                  │
            TASK-20 (Vercel 배포)
```

---

## 태스크 요약 테이블

| ID | 태스크 | 페이즈 | 예상 소요 | 의존성 |
|---|---|---|---|---|
| TASK-01 | 프로젝트 스캐폴딩 | MVP | 30분 | — |
| TASK-02 | 디자인 토큰 이식 | MVP | 30분 | 01 |
| TASK-03 | BaseLayout | MVP | 1시간 | 02 |
| TASK-04 | Atom 컴포넌트 | MVP | 1시간 | 02 |
| TASK-05 | Header | MVP | 2시간 | 03, 04 |
| TASK-06 | Footer | MVP | 1시간 | 03, 04 |
| TASK-07 | Content Collection + 샘플 포스트 | MVP | 1.5시간 | 01 |
| TASK-08 | 유틸리티 라이브러리 | MVP | 1시간 | 07 |
| TASK-09 | 홈 페이지 | MVP | 2.5시간 | 05, 06, 07, 08 |
| TASK-10 | Blog List 페이지 | MVP | 2시간 | 05, 06, 07, 08 |
| TASK-11 | Article 페이지 | MVP | 3시간 | 05, 06, 07, 08 |
| TASK-12 | About + 404 페이지 | MVP | 1시간 | 05, 06, 04 |
| TASK-13 | Hero tree Island | Phase 1 | 2시간 | 09 |
| TASK-14 | 검색 모달 | Phase 1 | 2.5시간 | 08, 05 |
| TASK-15 | 검색 결과 페이지 | Phase 1 | 1시간 | 08, 10 |
| TASK-16 | SEO + Meta | Phase 2 | 1.5시간 | 09-12 |
| TASK-17 | Giscus 댓글 | Phase 2 | 1시간 | 11 |
| TASK-18 | 접근성 감사 | Phase 2 | 1.5시간 | 09-15 |
| TASK-19 | 성능 + Lighthouse | Phase 2 | 1시간 | 16-18 |
| TASK-20 | Vercel 배포 | Phase 2 | 1시간 | 19 |

**총 예상 소요: 약 30시간**

---

## shrimp-task-manager 사용 가이드

이 ROADMAP을 shrimp-task-manager로 실행하려면:

```
1. plan_task("이 ROADMAP.md를 기반으로 홍마초 Astro 블로그 개발 태스크를 계획해줘")
   → ROADMAP.md 전체 내용을 컨텍스트로 제공

2. split_tasks(...)
   → 각 TASK-XX를 독립 태스크로 분리

3. list_tasks()
   → 현재 태스크 목록 확인

4. execute_task("TASK-01")
   → 순서대로 실행
```

**핵심 원칙:**
- 각 태스크 완료 후 `design_reference/index.html`과 나란히 비교
- CSS 값 임의 변경 금지 — 항상 `app.css` 참조
- 한 태스크 완료 전 다음 태스크 시작 금지

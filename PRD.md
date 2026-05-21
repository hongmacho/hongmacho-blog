# PRD: 홍마초의 잡생각 — Astro 블로그

> **개발, 투자, 학습 그리고 일상의 기록.**

---

## 0. 절대 원칙

이 문서는 아키텍처·기능·구현 순서를 다룬다.  
**디자인(색상·크기·간격·애니메이션·인터랙션)의 단일 진실 소스는 `ui_design_prd/UI_PRD.md`와 `ui_design_prd/design_reference/`** 다.

| 우선순위 | 권위 |
|---|---|
| 1 | `design_reference/styles/app.css` — 모든 시각 결정의 최종 값 |
| 2 | `design_reference/styles/wds-tokens.css` — 원자 토큰 |
| 3 | `ui_design_prd/UI_PRD.md` — 컴포넌트·인터랙션 서술 |
| 4 | 이 PRD — 아키텍처·기능·구현 로드맵 |

이 PRD와 UI_PRD.md가 충돌하면 **UI_PRD.md가 이긴다.**  
"이렇게 하면 더 좋지 않을까?"는 금지다. 프로토타입과 1:1로 맞추는 것이 목표다.

---

## 1. 프로젝트 개요

| 항목 | 값 |
|---|---|
| 프로젝트명 | 홍마초의 잡생각 |
| 슬로건 | 개발, 투자, 학습 그리고 일상의 기록 |
| 타입 | 개인 기술 블로그 (정적 사이트) |
| 오너 | paul@secuware.co.kr |

### 1.1 기술 스택

| 관심사 | 선택 | 버전 |
|---|---|---|
| Framework | Astro | 6.3.6 |
| Styling | TailwindCSS | 4.3.0 |
| Prose | @tailwindcss/typography | 0.5.19 |
| Icons | lucide-react | 1.16.0 |
| Language | TypeScript | 6.0.3 |
| Hosting | Vercel | — |
| Comments | Giscus | — |
| Fonts | Pretendard Variable (CDN) + JetBrains Mono (Google) | — |

> **중요:** Astro는 구현 도구다. 시각 결정은 design_reference를 따른다.

---

## 2. Information Architecture

```
/                     홈 — Hero + 카테고리 섹션 + 최신 글 3개
/blog                 전체 포스트 목록 (필터 가능)
/blog?cat=<id>        카테고리 필터 (dev / invest / learn / daily)
/blog?tag=<slug>      태그 필터
/blog/[slug]          단일 포스트 — 마크다운 본문
/about                프로필 + 소개
/search?q=...         검색 결과 페이지
/404                  Not Found
```

### 2.1 카테고리 (고정 4개)

| id | 한국어명 | 설명 | 강조색 | CSS 변수 |
|---|---|---|---|---|
| `dev` | 개발 | Spring Boot, Java, Docker, 최신 기술 | `#0066FF` | `--cat-dev` |
| `invest` | 투자 | 퀀트 분석, 포트폴리오 관리 | `#F59E0B` | `--cat-invest` |
| `learn` | 학습 | 기술 스택, 책/강의 후기 | `#6541F2` | `--cat-learn` |
| `daily` | 일상 | 회고, 생각, 추천 | `#14B8A6` | `--cat-daily` |

---

## 3. 디자인 토큰 요약

> 전체 값은 `wds-tokens.css`와 `app.css`가 권위. 아래는 구현 참조용 요약이다.

### 3.1 색상 — 브랜드 & 카테고리

```css
/* app.css :root */
--cat-dev:        var(--c-blue-50);      /* #0066FF */
--cat-dev-bg:     var(--c-blue-95);      /* #EAF2FE */
--cat-invest:     #f59e0b;
--cat-invest-bg:  #fef3c7;
--cat-learn:      var(--c-violet-50);    /* #6541F2 */
--cat-learn-bg:   var(--c-violet-95);    /* #F0ECFE */
--cat-daily:      #14b8a6;
--cat-daily-bg:   #ccfbf1;
--content-width:  720px;                 /* Width Picker CSS var */
```

다크 테마에서 카테고리 배경:
```css
[data-theme="dark"] {
  --cat-dev-bg:     rgba(0,102,255,0.14);
  --cat-invest-bg:  rgba(245,158,11,0.16);
  --cat-learn-bg:   rgba(101,65,242,0.20);
  --cat-daily-bg:   rgba(20,184,166,0.18);
}
```

### 3.2 색상 — 시맨틱 (라이트)

```css
--color-primary-normal:    #0066FF     /* --c-blue-50 */
--color-primary-hover:     #005EEB     /* --c-blue-45 */
--color-primary-pressed:   #0054D1     /* --c-blue-40 */
--color-primary-on:        #ffffff

--color-label-strong:      #000000
--color-label-normal:      rgba(23,23,25,0.88)
--color-label-alternative: rgba(55,56,60,0.61)
--color-label-assistive:   rgba(55,56,60,0.28)
--color-label-disable:     rgba(55,56,60,0.16)

--color-bg-normal:               #ffffff
--color-bg-alternative:          #F7F7F8   /* --c-cool-95 */
--color-bg-elevated-normal:      #ffffff
--color-bg-elevated-alternative: #F7F7F8

--color-line-normal:       rgba(112,115,124,0.22)
--color-line-alternative:  rgba(112,115,124,0.08)
--color-line-strong:       #70737C

--color-fill-normal:       rgba(112,115,124,0.08)
--color-fill-strong:       rgba(112,115,124,0.16)
--color-fill-heavy:        rgba(112,115,124,0.22)
```

### 3.3 색상 — 시맨틱 (다크 `[data-theme="dark"]`)

```css
--color-label-strong:      #ffffff
--color-label-normal:      rgba(255,255,255,0.88)
--color-label-alternative: rgba(255,255,255,0.43)
--color-bg-normal:         #171719
--color-bg-alternative:    #1b1c1e
--color-bg-elevated-normal:#212225
--color-line-normal:       rgba(255,255,255,0.16)
--color-line-alternative:  rgba(255,255,255,0.06)
--color-fill-normal:       rgba(255,255,255,0.06)
--color-fill-strong:       rgba(255,255,255,0.12)
--color-primary-normal:    #1A75FF    /* --c-blue-55, 다크에서 더 밝게 */
--color-primary-hover:     #3385FF
--color-primary-pressed:   #4F95FF
```

### 3.4 Spacing (4px 베이스)

```
--space-1: 4px   --space-2: 8px   --space-3: 12px  --space-4: 16px
--space-5: 20px  --space-6: 24px  --space-7: 32px  --space-8: 40px
--space-9: 48px  --space-10: 64px --space-11: 96px --space-12: 128px
```

### 3.5 Border Radius

```
--radius-1: 4px   --radius-2: 8px   --radius-3: 12px  --radius-4: 16px
--radius-5: 20px  --radius-6: 24px  --radius-7: 32px  --radius-8: 48px
--radius-9: 60px  --radius-10: 64px --radius-full: 9999px
```

### 3.6 Shadows

```css
--shadow-emphasize: 0 0 1px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.08);
--shadow-normal:    0 0 1px rgba(23,23,23,0.07), 0 1px 4px rgba(23,23,23,0.06);
--shadow-strong:    0 1px 4px rgba(23,23,23,0.10), 0 4px 14px rgba(23,23,23,0.07);
--shadow-heavy:     0 4px 14px rgba(23,23,23,0.10), 0 14px 40px rgba(23,23,23,0.06);
```

### 3.7 Typography

**Font 패밀리:**
```css
--font-sans:    "Pretendard Variable", "Pretendard JP", "Noto Sans KR",
                -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
--font-display: "Pretendard Variable", "Wanted Sans Variable", "Wanted Sans", system-ui, sans-serif;
--font-mono:    "JetBrains Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace;
```

**Type Ramp (size / line-height / tracking / weight):**

| 토큰 | size | line | tracking | weight | 사용처 |
|---|---|---|---|---|---|
| display-1 | 56px | 72px | -0.0319em | 700 | — |
| display-2 | 40px | 52px | -0.0282em | 700 | — |
| title-1   | 32px | 44px | -0.0253em | 700 | 페이지 헤드 |
| title-2   | 28px | 38px | -0.0236em | 700 | 섹션 헤드 |
| title-3   | 24px | 32px | -0.023em  | 700 | — |
| heading-1 | 22px | 30px | -0.0194em | 700 | — |
| heading-2 | 20px | 28px | -0.012em  | 700 | 목록 카드 제목 |
| headline-1 | 18px | 26px | -0.002em | 700 | — |
| body-1    | 16px | 24px | 0.0057em  | 500 | 본문 |
| body-1-reading | 16px | 26px | 0.0057em | 500 | Prose 단락 |
| label-1   | 14px | 20px | 0.0145em  | 600 | 버튼, 네비 |
| label-2   | 13px | 18px | 0.0194em  | 600 | — |
| caption-1 | 12px | 16px | 0.0252em  | 600 | 메타, 배지 |
| caption-2 | 11px | 14px | 0.0311em  | 700 | — |

**Hero 제목:**
```css
font-size: clamp(40px, 6vw, 64px);
font-weight: 800;
line-height: 1.08;
letter-spacing: -0.035em;
max-width: 14ch;
text-wrap: balance;
```

### 3.8 Motion

```css
--motion-micro:        150ms;
--motion-standard:     200ms;
--motion-transitional: 300ms;
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
```

Hero 애니메이션 주기: 8–40s, `cubic-bezier(0.45, 0, 0.55, 1)` 또는 `ease-in-out`.

---

## 4. 반응형 시스템 (Container Queries)

**핵심:** 이 블로그는 `@media` 대신 **CSS Container Queries**를 사용한다.

```css
.app-shell {
  container-name: app;
  container-type: inline-size;
}
```

모든 반응형 브레이크포인트는 `@container app (max-width: ...)` 형식이다.

| 너비 | 변경 사항 |
|---|---|
| ≤ 960px | 포스트 그리드 → 2칸; 아티클 TOC 숨김; 아티클 1칸 |
| ≤ 900px | 카테고리 그리드 → 2칸; 블로그 레이아웃 → 1칸 (사이드바 위로 이동) |
| ≤ 768px | 푸터 → 1칸; Hero 패딩 축소; 섹션 패딩 축소 |
| ≤ 720px | 데스크탑 nav 숨김 → 햄버거; 헤더 60px; 모바일 드로어 활성 |
| ≤ 640px | 포스트 그리드 → 1칸; 브랜드 워드마크 15px |
| ≤ 540px | About stat 그리드 → 1칸 |
| ≤ 480px | 카테고리 그리드 → 1칸 |
| ≤ 380px | 브랜드 워드마크 14px; 배지 28px |

`@media (prefers-reduced-motion: reduce)` → Hero 변형 애니메이션 전체 제거.

---

## 5. 페이지 & 컴포넌트 명세

> 각 컴포넌트의 정확한 CSS 값은 `app.css`를 직접 참조할 것.

### 5.1 레이아웃 쉘 (`BaseLayout.astro`)

```
<html data-theme="...">             ← 테마 + --content-width CSS var
  <body>
    <div class="app-shell">         ← container-name: app
      <Header />
      <main>
        <slot />
      </main>
      <Footer />
    </div>
  </body>
</html>
```

- `app-shell`: `container-name: app; container-type: inline-size; min-height: 100vh`
- 테마 초기화 스크립트: `<head>` 인라인 — `localStorage → prefers-color-scheme` 폴백
- 너비 초기화 스크립트: `--content-width` CSS var을 `localStorage`에서 복원

### 5.2 Header

```
.site-header (sticky, z-50)
└── .container .site-header__inner (height: 68px / 60px mobile)
    ├── .brand (a 태그, 홈 링크)
    │   ├── .brand__badge (32px, border-radius: 9px, gradient blue→violet)
    │   │   └── .brand__rocket 🚀
    │   └── .brand__wordmark "홍마초의 잡생각" + .brand__dot (5px blue circle)
    ├── nav.site-nav
    │   ├── a.site-nav__link "홈" / "블로그" / "소개"
    │   └── .site-header__tools (hairline left border)
    │       ├── button.icon-btn (검색, ⌘K)
    │       ├── <WidthPicker />
    │       └── button.icon-btn.theme-toggle (Sun/Moon)
    ├── button.site-header__menu-btn (≤720px only, hamburger)
    └── .mobile-menu (≤720px, fixed drawer)
```

**동작:**
- 스크롤 8px 이상: `scrolled` 클래스 추가 → `border-bottom-color: var(--color-line-normal)`
- 배경: `color-mix(in srgb, var(--color-bg-normal) 78%, transparent)` + `backdrop-filter: blur(24px)`
- 테마 토글 호버: 아이콘 `-18deg` 회전
- `.brand:hover`: `opacity: 0.82` + 배지 `rotate(-6deg) scale(1.04)`
- 활성 nav: `font-weight: 600` + brand-blue 2px underline (`scaleX(1)`)
- `⌘K` / `Ctrl+K` / `/` (input 외부): 검색 모달 열기

### 5.3 Footer

```
footer.site-footer (border-top hairline, padding: 48px 0 56px)
└── .container .site-footer__inner (grid: 1.4fr 1fr 1fr → 1col @768px)
    ├── .site-footer__brand-block
    │   ├── <brand mark (동일)>
    │   ├── .site-footer__tagline "개발, 투자, 학습 그리고 일상의 기록."
    │   └── social icons (GitHub / X / RSS)
    ├── "EXPLORE" 칼럼 (전체 글 + 4 카테고리 링크)
    └── "MORE" 칼럼 (About / Resume / 구독 / Now)
    .site-footer__bottom
        ├── "© 2026 홍마초. Built with Astro + TailwindCSS."
        └── "마지막 빌드 · YYYY. MM. DD." + .brand__version "v1.0.0"
```

### 5.4 Hero

```
section.hero (padding: 128px 0 104px → 80px 0 64px @768px)
└── .container (z-index: 10)
    ├── .hero__greeting (status pill + pulsing green dot)
    │   "지금 글을 쓰고 있어요"
    ├── h1.hero__title
    │   "개발, 투자, 학습." (줄1, .accent → blue .)
    │   "그리고 일상의 기록" + .hero__caret (blinking, steps(2))
    ├── p.hero__sub (clamp(16px,1.6vw,19px), max-width: 56ch)
    └── .hero__cta-row
        ├── a.btn.btn--white "최신 글 보기"
        └── a.btn.btn--ghost "About"
```

**Hero 배경 변형 (12종) — `src/hero-variants.jsx` 참조:**

| 변형 | 타입 | 핵심 기법 |
|---|---|---|
| `aurora` | 정적 | 블러 blob 4개 + 카테고리 ghost 텍스트 + dot grid + conic sweep |
| `marquee` | 정적 | 3 레인 수평 슬라이딩 타이포그래피 |
| `grid` | 정적 | Perspective wireframe grid + horizon glow + scan beam |
| `matrix` | 정적 | 세로 falling 포스트 제목 columns |
| `terminal` | 정적 | 우상단 터미널 윈도우 + CRT scanlines |
| `wave` | 정적 | 4 레이어 SVG sine-wave |
| `constellation` | 정적 | SVG point-line 네트워크 |
| `tree` | **마우스** | 지식 그래프 SVG + rAF lerp 패럴렉스 |
| `spotlight` | **마우스** | 라디얼 마스크 keyword reveal |
| `ripple` | **마우스** | 커서 추적 dot grid + concentric rings |
| `magnet` | **마우스** | floating words, 커서에 반응 |
| `compass` | **마우스** | 동심원 rings + 방향 needle |

**마우스 인터랙티브 패럴렉스 (rAF lerp):**
```js
// mousemove → target 저장 → rAF loop에서 lerp (factor: 0.10)
// → hero element에 7개 CSS var 갱신:
--mx      (−0.5 ~ 0.5, center=0)
--my      (−0.5 ~ 0.5)
--mx-pct  (0% ~ 100%)
--my-pct  (0% ~ 100%)
--mx-px   (픽셀)
--my-px   (픽셀)
--m-deg   (각도, compass needle용)
// mouseleave → center(0,0)으로 복귀
```

**프로덕션 기본값:** `tree` 변형 1개. 추가 변형 원할 경우 페이지 로드마다 랜덤(`Math.random()`), localStorage 저장 금지.

### 5.5 카테고리 섹션 (홈)

```
section.section (bg: --color-bg-alternative, 상하 hairline)
└── .container
    ├── .section__head (title 28px + sub + 링크 없음)
    └── .cat-grid (4col → 2col @900 → 1col @480, gap: 16px)
        └── button.cat-card (--cat-color CSS var 주입)
            ├── ::before (3px top accent, scaleX hover)
            ├── .cat-card__label (uppercase, 11px, cat color)
            ├── .cat-card__name (22px bold)
            ├── .cat-card__desc (13px alt color)
            └── .cat-card__count (12px)
```

**`cat-card` 호버:** `border-color: var(--cat-color)` + `translateY(-2px)` + `::before scaleX(1)`.

### 5.6 최신 글 섹션 (홈)

```
section.section (bg: --color-bg-normal)
└── .container
    ├── .section__head (title "최신 글" + "전체 보기 →" 링크)
    └── .post-grid (3col → 2col @960 → 1col @640, gap: 24px)
        └── button.post-card (featured: span 2)
```

**`post-card` 구조:**
```
.post-card
├── CategoryBadge (cat-badge pill)
├── h3.post-card__title (18px, -webkit-line-clamp: 2)
├── p.post-card__excerpt (14px alt, -webkit-line-clamp: 3)
├── .post-card__meta (12px: date · clock icon · 읽기시간분)
└── .post-card__tags (Tag chips, max 3개)
```

**호버:** `translateY(-2px)` + `shadow-strong` + `border-color: line-strong`.

### 5.7 Blog List 페이지 (`/blog`)

```
.page-head (padding: 64px 0 32px → 40px 0 24px @768)
├── h1.page-head__title (40px, -0.028em)
└── p.page-head__sub (16px alt)

.blog-layout (grid: 220px 1fr, gap: 56px → 1col @900)
├── aside.sidebar (sticky top: 88px → static @900)
│   ├── 카테고리 섹션
│   │   ├── button "전체" (active: fill-strong bg)
│   │   └── button×4 (color dot + name + count badge)
│   └── 인기 태그 섹션 (frequency 정렬)
└── main (list-item 목록)
    └── button.list-item × N
```

**`list-item` 구조:**
```
button.list-item (border-bottom hairline)
├── .list-item__meta (CategoryBadge + date + readTime)
├── h3.list-item__title (22px, hover → primary color)
├── p.list-item__excerpt (15px alt, max-width: 64ch)
└── .list-item__tags (Tag chips)
```

**URL 상태:** `?cat=<id>` / `?tag=<slug>` — URL 파라미터로 필터 관리. `replaceState`로 히스토리 오염 방지.

### 5.8 Article 페이지 (`/blog/[slug]`)

```
.article-layout (grid: 220px 1fr, gap: 56px → 1col @960)
├── aside.toc (sticky top: 88px, max-height: calc(100vh-110px))
│   └── 스크롤 스파이 — h2/h3 계층 목차 (active: blue 2px left indicator)
└── article.article-body (max-width: var(--content-width))
    ├── .article-header
    │   ├── CategoryBadge + date + readTime
    │   ├── h1 (clamp(28px, 4vw, 40px))
    │   ├── p.excerpt (17px alt)
    │   └── .byline (36px gradient avatar + 홍 + name + date)
    ├── .prose (TailwindCSS @tailwindcss/typography)
    └── .article-footer
        ├── tag row
        ├── 링크 복사 / 공유 ghost 버튼
        ├── 관련 글 (2열 grid, 같은 카테고리)
        └── 댓글 (Giscus)
```

**Prose 스타일 (app.css 기준):**
- 본문: 16px / line-height 1.75 / body-1-reading (26px)
- h2: 26px + `scroll-margin-top: 88px`
- h3: 20px + `scroll-margin-top: 88px`
- blockquote: 4px brand-blue left border + alt bg + italic
- 인라인 code: `fill-normal` bg + 4px radius
- code block: JetBrains Mono 13.5px + alt bg + 12px radius + hairline border
- table: hairline border + rounded corners + alt-bg 헤더

**TOC 스크롤 스파이:**
- `scroll` 이벤트 → 120px offset 기준 마지막 heading 감지
- 활성 항목: `is-active` 클래스 → brand-blue + 2px left line

### 5.9 About 페이지 (`/about`)

```
.about-page (max-width: 720px, margin: auto, padding: 64px 24px)
├── 80px gradient circular avatar (blue→violet, "홍" 문자)
├── h1 (28px, name)
├── p.role (caption, alt color)
├── p.intro (body-1, 소개문)
├── .stat-grid (3칸 → 1칸 @540: 글 수 / 백엔드 경력 / 올해 읽은 책)
├── 주제 / 관심사 / 연락처 bullet 섹션
└── 버튼 행 (primary "최신 글 보러가기" + ghost "GitHub")
```

### 5.10 검색 모달 (SearchModal)

**트리거:** `⌘K` / `Ctrl+K` / `/` (input 외부)

```
overlay (full-viewport, backdrop-filter: blur(6px), fade-in 160ms)
└── .search-modal (max-width: 600px, slide-down 200ms)
    ├── header: 검색 아이콘 + input + ESC 키 힌트
    ├── body (스크롤)
    │   ├── 빈 상태: 최근 검색 chips (max 5) + 카테고리 목록 + 추천 글 3개
    │   └── 타이핑 상태: 결과 목록 (max 8) + "전체 결과 N개 모두 보기"
    └── footer: 키보드 힌트 pills + "실시간 검색" 레이블
```

**검색 스코어링:**
```
title prefix match: +5
title contains:     +10
excerpt:            +4
tags:               +6
category:           +3
```

**localStorage:** `blog-recent-searches` (max 5 unique queries)

**키보드:** `↑`/`↓` 네비게이트, `Enter` 선택, `Esc` 닫기.  
**활성 행:** `--color-fill-normal` 배경.

### 5.11 검색 결과 페이지 (`/search?q=...`)

```
.search-results-page
├── h1 (32px): "검색어" 따옴표 alt-color 포함
├── 재검색 form (radius 12, alt bg, 36px submit button)
├── empty 상태: dashed border alt-bg card + 인기 태그
└── 결과 목록 (ListItem 스타일 + <mark> 하이라이트)
```

### 5.12 404 페이지

```
full-height centered
├── "404" (clamp(96px,12vw,180px), gradient: blue→violet)
├── h1 (title-1)
├── p (body-1 alt)
└── 버튼 2개 (primary "홈으로" + ghost "블로그 보기")
```

### 5.13 Width Picker

**헤더 아이콘:** 3-bar mini-glyph, 현재 설정에 따라 크기 변형.

```
click → 220px popover "본문 너비"
└── radio rows × 3
    ├── 좁게  — 600px
    ├── 보통  — 720px (기본)
    └── 넓게  — 860px
```

선택 시: `document.documentElement.style.setProperty('--content-width', '<값>')` + `localStorage` 저장.  
닫기: 외부 클릭 / `Esc`.

### 5.14 Theme Toggle

- 저장소: `localStorage` key `blog-theme`
- 첫 방문 기본값: `prefers-color-scheme`
- 적용: `document.documentElement.setAttribute('data-theme', 'dark' | 'light')`
- 아이콘: Sun ↔ Moon, 호버 시 `-18deg` 회전

---

## 6. 마크다운 콘텐츠

### 6.1 Content Collection 설정

경로: `src/content/blog/*.md`

**frontmatter 스키마 (TypeScript):**
```typescript
interface BlogFrontmatter {
  title: string          // 필수
  date: string           // 필수, YYYY-MM-DD
  category: 'dev' | 'invest' | 'learn' | 'daily'  // 필수
  excerpt: string        // 필수, 140자 이하
  featured?: boolean     // 선택, 홈 featured card
  tags: string[]         // 필수, 최소 1개, kebab-case
  readTime?: number      // 자동 계산 (분)
}
```

### 6.2 초기 샘플 포스트

```
2026-05-21-astro-blog-journey.md       category: dev
2026-05-22-quant-trading.md            category: invest
2026-05-23-spring-boot-optimization.md category: dev
2026-05-24-java-streams.md             category: dev
2026-05-25-quitting-career.md          category: daily
```

### 6.3 readTime 자동 계산

```typescript
const WORDS_PER_MIN = 200
const wordCount = content.split(/\s+/).length
const readTime = Math.max(1, Math.ceil(wordCount / WORDS_PER_MIN))
```

### 6.4 마크다운 작성 규칙

- 제목: H2 / H3만 사용 (H1은 페이지 제목)
- 코드 블록: 언어 명시 필수
- 이미지: 없음 (텍스트 포워드 디자인)
- 링크: 인라인
- 이모지: 브랜드 🚀 외 없음

---

## 7. 상태 관리

Astro는 SSG 기반이므로 최소한의 클라이언트 상태만 사용한다.

| 상태 | 저장소 | 구현 방법 |
|---|---|---|
| 다크/라이트 테마 | `localStorage['blog-theme']` | 인라인 `<script>` + Astro Island |
| 본문 너비 | `localStorage['blog-content-width']` | CSS var `--content-width` |
| 카테고리/태그 필터 | URL `?cat=` / `?tag=` | URL searchParams |
| 검색 쿼리 | URL `?q=` | URL searchParams |
| 최근 검색 | `localStorage['blog-recent-searches']` | SearchModal Island |
| 검색 모달 open | 컴포넌트 state | SearchModal Island |
| TOC 활성 항목 | 컴포넌트 state | Article Island |

**Astro Island 후보:**
- `SearchOverlay` — `client:idle`
- `ThemeToggle` — `client:load`
- `WidthPicker` — `client:load`
- `HeroBackground` (마우스 인터랙티브) — `client:load`
- `TOCScrollSpy` — `client:load`
- `MobileMenu` — `client:load`

---

## 8. 기능 요구사항

### 8.1 MVP (Phase 0)

- [ ] Astro 6 + TailwindCSS 4 + @tailwindcss/typography 스캐폴딩
- [ ] Content Collections (`src/content/blog/`)
- [ ] 전체 디자인 토큰 (wds-tokens.css → Tailwind `@theme` 블록 또는 CSS vars import)
- [ ] Pretendard Variable (CDN) + JetBrains Mono (Google Fonts) 로드
- [ ] 라이트/다크 테마 (data-theme + localStorage + prefers-color-scheme)
- [ ] 홈 페이지 (`/`) — Hero + 카테고리 섹션 + 최신 글 3개
- [ ] Blog List (`/blog`) — 카테고리/태그 필터 (URL state)
- [ ] Article 페이지 (`/blog/[slug]`) — Prose 본문
- [ ] About 페이지 (`/about`)
- [ ] 404 페이지
- [ ] Header + Footer 컴포넌트
- [ ] 모바일 반응형 (Container Queries, 전체 브레이크포인트)
- [ ] 모든 hover/focus/active 상태
- [ ] Container Query 기반 반응형 (`.app-shell` container)

### 8.2 Phase 1 (1~2주)

- [ ] Hero 배경 변형 — `tree` 1개 (마우스 패럴렉스 포함)
- [ ] TOC 스크롤 스파이 (120px offset)
- [ ] Width Picker 팝오버 (--content-width CSS var)
- [ ] 클라이언트 사이드 검색 (스코어 기반 필터)
- [ ] 읽기시간 자동 계산
- [ ] 관련 글 추천 (같은 카테고리)

### 8.3 Phase 2 (3~4주)

- [ ] Cmd+K 검색 모달 (전체 상태 구현)
- [ ] 검색 결과 페이지 (`/search?q=...`)
- [ ] Giscus 댓글 통합
- [ ] Hero 배경 랜덤 선택 (선택 사항, 다중 변형 시)
- [ ] RSS 피드 (`/rss.xml`)
- [ ] XML Sitemap
- [ ] Open Graph 태그 (소셜 공유)

---

## 9. 성능 요구사항

### 9.1 Lighthouse 목표

| 지표 | 목표 |
|---|---|
| Performance | 95+ |
| Accessibility | 95+ |
| Best Practices | 95+ |
| SEO | 100 |

### 9.2 번들 크기

| 자산 | 목표 |
|---|---|
| JavaScript | ≤ 50KB |
| CSS | ≤ 30KB |

### 9.3 Core Web Vitals

| 지표 | 목표 |
|---|---|
| FCP | < 1s |
| LCP | < 2s |
| CLS | < 0.1 |

---

## 10. 접근성 요구사항

- WCAG 2.1 AA 준수
- 색상 대비: 4.5:1 (텍스트) — WDS 토큰으로 자동 확보
- `focus-visible`: 2px solid `--color-primary-normal`, offset 2px
- Touch targets: ≥ 44px (모바일)
- 스크린 리더: 시맨틱 HTML + `aria-label`
- `alt` 텍스트: 모든 이미지
- `prefers-reduced-motion: reduce` — Hero 애니메이션 비활성화

---

## 11. SEO 요구사항

- `<title>` + `<meta name="description">` (160자)
- Open Graph 태그 (`og:title`, `og:description`, `og:image`)
- Canonical URL
- XML Sitemap (`/sitemap.xml`)
- `robots.txt`
- Schema.org 구조화 데이터 (Article, Person)
- 모바일 최적화 (`viewport` meta)

---

## 12. 보안 요구사항

- HTTPS (Vercel 자동)
- CSP 헤더 (Vercel `vercel.json` 설정)
- `X-Frame-Options: DENY`
- 환경 변수 관리 (Giscus 설정 등)
- `npm audit` 정기 확인

---

## 13. 배포 요구사항

### 13.1 GitHub

- Repository: `hongmapre/my-blog` (또는 설정된 이름)
- 기본 브랜치: `main`

### 13.2 Vercel

- `main` push 시 자동 배포
- PR Preview deployment
- 도메인: `my-blog.vercel.app`

### 13.3 빌드

```bash
npm run build   # → dist/
npm run preview # 로컬 확인
```

---

## 14. 프로젝트 파일 구조

```
src/
├── content/
│   ├── config.ts               ← Content Collection 스키마
│   └── blog/
│       ├── 2026-05-21-astro-blog-journey.md
│       ├── 2026-05-22-quant-trading.md
│       ├── 2026-05-23-spring-boot-optimization.md
│       ├── 2026-05-24-java-streams.md
│       └── 2026-05-25-quitting-career.md
├── layouts/
│   ├── BaseLayout.astro         ← html, head, theme script, app-shell
│   └── ArticleLayout.astro      ← TOC + prose wrapper
├── pages/
│   ├── index.astro              ← /
│   ├── blog/
│   │   ├── index.astro          ← /blog
│   │   └── [slug].astro         ← /blog/[slug]
│   ├── about.astro              ← /about
│   ├── search.astro             ← /search?q=
│   └── 404.astro                ← /404
├── components/
│   ├── layout/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── MobileMenu.astro
│   ├── hero/
│   │   ├── HeroSection.astro
│   │   └── HeroBGTree.tsx       ← Astro Island, client:load
│   ├── home/
│   │   ├── CategoriesSection.astro
│   │   └── LatestPosts.astro
│   ├── blog/
│   │   ├── PostCard.astro
│   │   ├── ListItem.astro
│   │   ├── Sidebar.astro
│   │   └── TagCloud.astro
│   ├── article/
│   │   ├── TOC.tsx              ← Astro Island, client:load
│   │   ├── ArticleHeader.astro
│   │   └── ArticleFooter.astro
│   ├── search/
│   │   └── SearchOverlay.tsx    ← Astro Island, client:idle
│   ├── ui/
│   │   ├── CategoryBadge.astro
│   │   ├── Tag.astro
│   │   ├── Button.astro
│   │   └── ThemeToggle.tsx      ← Astro Island, client:load
│   └── WidthPicker.tsx          ← Astro Island, client:load
├── lib/
│   ├── categories.ts            ← CATEGORIES 상수, CAT_COLOR
│   ├── search.ts                ← 스코어 기반 검색 함수
│   ├── readTime.ts              ← readTime 계산
│   └── utils.ts                 ← formatDate 등
└── styles/
    ├── global.css               ← wds-tokens.css + app.css import + Tailwind
    └── prose.css                ← typography prose 오버라이드
```

---

## 15. 구현 순서 (권장)

```
1. 프로젝트 스캐폴딩
   Astro 6 + TailwindCSS 4 + @tailwindcss/typography
   TailwindCSS container queries 지원 확인 (TW4 native)

2. 디자인 토큰 이식
   wds-tokens.css → src/styles/global.css @import
   app.css → src/styles/global.css @import
   .app-shell container 선언

3. BaseLayout
   theme 초기화 스크립트 (인라인 head, 깜빡임 없음)
   --content-width 초기화
   Pretendard + JetBrains Mono 로드

4. Atom 컴포넌트
   CategoryBadge, Tag, Button, Icon (Lucide)

5. Header + Footer
   sticky header, frosted glass
   theme toggle, width picker wiring
   mobile hamburger

6. Content Collection 설정
   config.ts 스키마 + 샘플 md 파일

7. 홈 페이지
   Hero (tree 변형 1개, mouse parallax island)
   카테고리 섹션
   최신 글 3개 (PostCard)

8. Blog List 페이지
   Sidebar (카테고리 필터, 태그 클라우드)
   ListItem 목록
   ?cat= / ?tag= URL state

9. Article 페이지
   ArticleLayout (TOC + prose)
   TOC 스크롤 스파이 island
   Giscus placeholder

10. About + 404 페이지

11. 검색 (Phase 1 → Phase 2)
    Phase 1: 클라이언트 필터 (/blog 내)
    Phase 2: SearchOverlay island (⌘K) + /search 페이지

12. Width Picker island 완성

13. 폴리시 및 배포
    Lucide 아이콘 교체 (inline SVG → lucide-react)
    Lighthouse 검증
    Vercel 배포 설정
    Tweaks panel 제거 확인
```

---

## 16. 완료 기준 체크리스트

`design_reference/index.html`과 Astro 빌드를 나란히 열고 모든 항목이 일치하는지 확인한다.

### 토큰 & 기초

- [ ] WDS 원자 컬러 ramp 14종 (wds-tokens.css) — CSS var로 포팅
- [ ] 시맨틱 컬러 토큰 21+ 종 (라이트 + 다크)
- [ ] 그림자 토큰 4종
- [ ] 반경 토큰 11종 (`--radius-1` ~ `--radius-full`)
- [ ] 간격 토큰 12종 (`--space-1` ~ `--space-12`)
- [ ] 타이포 토큰 21종 (display/title/heading/headline/body/label/caption)
- [ ] Pretendard Variable — CDN 로드 확인
- [ ] JetBrains Mono — Google Fonts 로드 확인
- [ ] Motion 토큰 3종 + ease-standard

### Header

- [ ] 68px (모바일 60px) sticky + frosted glass
- [ ] 스크롤 8px → hairline border-bottom 등장
- [ ] 브랜드 배지: 32px, 9px 반경, blue→violet gradient + 🚀
- [ ] 워드마크: 700 16px + 5px blue dot
- [ ] Nav: 홈/블로그/소개 — 활성 시 2px brand-blue underline
- [ ] 툴 클러스터: 검색 / 너비 / 테마, 36px 원형
- [ ] hairline left divider (nav ↔ tools)
- [ ] 테마 토글 호버: -18deg 회전
- [ ] ≤720px: nav → 햄버거 드로어

### Hero

- [ ] padding 128px → 80px (768px)
- [ ] status pill + pulsing green dot
- [ ] 제목: clamp(40px,6vw,64px), -0.035em, max-width 14ch
- [ ] brand-blue `.` 강조 + 블링킹 caret (steps(2))
- [ ] btn--white + btn--ghost CTA
- [ ] `tree` 변형 1개 이상
- [ ] 마우스 패럴렉스 CSS var (--mx, --my 등)
- [ ] `prefers-reduced-motion` 시 애니메이션 없음

### 카테고리 섹션 (홈)

- [ ] alt bg + 상하 hairline
- [ ] 4col → 2col @900 → 1col @480 (container query)
- [ ] 카드: 24px padding, 14px radius, hairline border
- [ ] 3px top accent (scaleX(0) → scaleX(1) on hover)
- [ ] uppercase label + 22px name + 13px desc + count

### Post Cards & List Items

- [ ] PostCard: badge + title 2줄 clamp + excerpt 3줄 + meta + tags
- [ ] 호버: translateY(-2px) + shadow-strong
- [ ] Featured: grid-column span 2
- [ ] ListItem: hairline border-bottom, 호버 → title primary color

### Article 페이지

- [ ] 220px TOC + var(--content-width) 본문
- [ ] ≤960px: TOC 숨김, 본문 중앙
- [ ] 헤더: meta + clamp(28px,4vw,40px) title + 17px excerpt + byline avatar
- [ ] Prose: line-height 1.75, h2 26px, h3 20px, scroll-margin-top 88px
- [ ] blockquote: 4px blue left border + alt bg + italic
- [ ] code block: JetBrains Mono 13.5px + alt bg + 12px radius
- [ ] table: hairline border + alt-bg header
- [ ] 아티클 footer: tags + share + 관련 글 + 댓글

### Blog List 페이지

- [ ] page-head: 40px title
- [ ] 사이드바 220px sticky-top-88
- [ ] 카테고리 color dot + count badge
- [ ] 활성 카테고리: fill-strong bg
- [ ] 태그 cloud (frequency 정렬)
- [ ] ?cat= / ?tag= URL state 보존
- [ ] ≤900px: 사이드바 위로 이동

### 검색 모달

- [ ] ⌘K / Ctrl+K / / 트리거
- [ ] backdrop-filter blur(6px)
- [ ] 600px modal, slide-down 200ms
- [ ] empty: 최근 검색 + 카테고리 + 추천 글
- [ ] localStorage blog-recent-searches (max 5)
- [ ] 스코어 검색 (title=10, prefix=5, excerpt=4, tags=6, cat=3)
- [ ] `<mark>` 하이라이트
- [ ] 상위 8개 + "전체 N개" 링크
- [ ] ↑↓ Enter Esc 키보드

### 검색 결과 페이지

- [ ] 32px 쿼리 echo
- [ ] 재검색 form
- [ ] empty: dashed card + 인기 태그
- [ ] ListItem 스타일 + mark 하이라이트

### About 페이지

- [ ] 720px 중앙 칼럼
- [ ] 80px gradient avatar + name + role
- [ ] 3칸 stat → 1칸 @540

### 404

- [ ] 중앙 정렬
- [ ] gradient "404" (blue→violet)
- [ ] title + sub + CTA 2개

### Footer

- [ ] 3-col (1.4fr / 1fr / 1fr) → 1col @768
- [ ] 브랜드 + 태그라인 + 소셜 아이콘
- [ ] Explore / More 칼럼
- [ ] bottom: copyright + 빌드 날짜 + v1.0.0 mono pill

### Width Picker

- [ ] 3-bar glyph (현재 설정 반영)
- [ ] 220px popover "본문 너비"
- [ ] 좁게 600 / 보통 720 / 넓게 860
- [ ] 외부 클릭 / Esc 닫기
- [ ] --content-width CSS var 갱신

### 테마 토글

- [ ] localStorage blog-theme 지속
- [ ] 첫 방문: prefers-color-scheme 준수
- [ ] data-theme="dark" on `<html>`
- [ ] Sun ↔ Moon 아이콘 swap

### 반응형 (Container Queries)

- [ ] .app-shell: container-name: app; container-type: inline-size
- [ ] 모든 브레이크포인트 @container app (max-width: ...) 형식
- [ ] prefers-reduced-motion: hero 애니메이션 off

### 동작 검증

- [ ] 전체 라우트, 양 테마에서 console error 없음
- [ ] 모든 hover 상태 일치 (색상 shift + shadow + transform)
- [ ] focus-visible: 2px outline + 2px offset
- [ ] 320px에서 가로 스크롤 없음
- [ ] Korean 텍스트: Pretendard 렌더링 (시스템 폰트 아님)
- [ ] Touch targets ≥ 44px (모바일)

---

## 17. 디자인 참조 파일 맵

| 파일 | 역할 |
|---|---|
| `ui_design_prd/design_reference/index.html` | 실행 가능한 프로토타입 — 브라우저에서 열어 직접 비교 |
| `ui_design_prd/design_reference/styles/wds-tokens.css` | 원자 색상/타이포/간격/반경/그림자 토큰 |
| `ui_design_prd/design_reference/styles/app.css` | **모든 시각 결정의 최종 권위** |
| `ui_design_prd/design_reference/styles/wds-fonts.css` | 폰트 @font-face |
| `ui_design_prd/design_reference/src/components.jsx` | Header, Footer, PostCard, ListItem, Badge, Tag |
| `ui_design_prd/design_reference/src/pages.jsx` | 페이지 레이아웃 구현 |
| `ui_design_prd/design_reference/src/overlays.jsx` | SearchModal, WidthPicker |
| `ui_design_prd/design_reference/src/hero-variants.jsx` | 12종 Hero 배경 변형 |
| `ui_design_prd/design_reference/src/app.jsx` | App shell, 라우터, 랜덤 Hero 선택 |
| `ui_design_prd/design_reference/src/data.jsx` | 샘플 포스트 데이터 + CATEGORIES 상수 |
| `ui_design_prd/design_reference/tweaks-panel.jsx` | Tweaks panel — **프로덕션에서 제거** |

---

> 의심스러울 때는 `design_reference/index.html`을 브라우저에서 열고, Astro 빌드와 나란히 비교하라. 두 화면이 구분 불가능할 때 완료다.

# Handoff: 홍마초의 잡생각 — Personal Tech Blog

> 개발, 투자, 학습 그리고 일상의 기록.

A complete design package for **홍마초의 잡생각** — a personal Korean tech blog covering development, investing, learning, and daily reflection.

---

## 🎯 Mandate: 100% UI/UX Reproduction

**This handoff exists to enable a 1:1 reproduction of the prototype in `design_reference/`.**

Read this section first.

1. **The prototype is the source of truth.** Every color, spacing value, font weight, animation curve, hover state, micro-interaction, and copy string in `design_reference/` was chosen deliberately during a long design conversation. Do not reinterpret, simplify, or substitute "good enough" approximations.
2. **When this README and the prototype disagree, the prototype wins.** This README is a navigation aid — the CSS, JSX, and HTML files contain the literal values.
3. **Do not redesign.** No "while we're at it" improvements, no swapping tokens for closer Tailwind defaults, no replacing the custom hero variants with generic gradient stand-ins, no removing the search modal because "users won't use it". Ship what's here.
4. **Preserve all behavior.** That includes:
   - The 12 hero background variants (or whichever subset you ship — see Hero Variants section), with their exact mouse-interactive parallax behavior where applicable
   - The Cmd-K search modal with all its empty / typing / no-results states, keyboard shortcuts, recent-search persistence, and result scoring
   - The width picker popover (narrow/normal/wide) wired to a CSS variable
   - The container-query-based responsive system that lets framed previews trigger real mobile layout
   - Theme persistence (`data-theme="dark"` + localStorage + `prefers-color-scheme` first-visit)
   - TOC scroll-spy on article pages
   - Hash-routing → file-routing translation without losing the `?cat=` / `?tag=` / `?q=` URL state
5. **The Tweaks panel is the ONLY thing to remove.** Strip it after porting — it's a designer-only control surface. The container-query responsive system survives without it.
6. **Compare side-by-side before merging.** Run `design_reference/index.html` in one window and your Astro build in another. They should be indistinguishable at every breakpoint, in both themes, on every route, with every overlay open.

If you find yourself thinking _"this is too much detail, I'll just use the design system defaults"_ — stop. The whole point of the package is the detail.

---

## Context — Why this design exists

This blog is for a Korean developer who writes across four orthogonal interests (Spring/Java backend work, quantitative investing, book/study notes, daily reflection). Most personal-blog templates lean visual-magazine or pure dev-minimalist; neither fit. The design carries these tensions deliberately:

- **Text-forward, no thumbnails.** Posts are about ideas, not images. Cards have no image slot. Replace at your peril.
- **One brand blue (`#0066FF`), four category accents.** The brand stays singular; the categories color the spaces between them.
- **Restrained chrome.** Hairline borders, soft shadows, no decorative gradients on surfaces. Drama is reserved for the hero.
- **Generous hero, focused body.** The hero is allowed to be artistic (12 different background variants) because the body needs to be calm.
- **Korean primary, Pretendard everywhere.** No mixing fonts. No emoji except the brand 🚀.
- **Wanted DS as the visual grammar.** Tokens, type ramp, hairline conventions all come from the Wanted Design System (CC BY 4.0). When in doubt about a value, look at Wanted.

These tensions are why the prototype is detailed. Removing the detail removes the tension and the design dies.

---

## About the Design Files

The files in `design_reference/` are **interactive HTML prototypes** running React via Babel inline JSX (no build step). Open `design_reference/index.html` in any modern browser and the entire site runs locally.

The prototype implementation choice (React-via-Babel single-file inline) was for design iteration speed — **don't ship it as-is**. Your job is to **recreate the same designs in Astro + TailwindCSS**, copying the visual language, layout decisions, interaction patterns, copywriting, and behavior. The JSX files are reference, not target output.

If you decide to use a different framework (Next.js, SvelteKit, plain Astro without React), the visual fidelity bar is unchanged — 1:1.

## Fidelity

**High-fidelity** (hi-fi). The mocks are pixel-precise:
- Exact colors via CSS custom properties (see `styles/wds-tokens.css`)
- Exact typography (Pretendard Variable, with full type scale)
- Exact spacing (4-px base, see DESIGN TOKENS below)
- Exact interactions (hover/focus/active states, animations, scroll-spy, modal behaviour)
- Light + dark theme, full container-query-driven responsive system
- Tablet (820 px) and mobile (390 px) preview frames built into the prototype

The CSS in `design_reference/styles/app.css` is the canonical reference for every visual decision. Read it.

---

## Tech Stack (Target)

| Concern | Choice | Why |
|---|---|---|
| **Static site generator** | Astro 6.x | Markdown-first, near-zero JS by default, content collections |
| **Styling** | TailwindCSS 4.x + `@tailwindcss/typography` | Atomic + automatic prose styling for markdown |
| **Hosting** | Vercel | Auto-deploy from GitHub, preview deploys |
| **Comments** | Giscus | No database; uses GitHub Discussions |
| **Search** | Pagefind (later) or current client-side filter | Static-friendly |
| **Icons** | Lucide React | Closest match to Wanted's outlined icon style |
| **Fonts** | Pretendard Variable (CDN: orioncactus/pretendard) | Korean / Latin metric-matched sans-serif |

Important: the prototype uses inline SVG icons. In Astro you should pull these from `lucide-react` (e.g. `Search`, `Sun`, `Moon`, `Github`, `Hash`, `Clock`, `ArrowRight`, `MessageSquare`, `Sparkles`, `Twitter`, `Rss`, `Copy`).

---

## Information Architecture

```
/                       Home — Hero + Categories + Latest 3 posts
/blog                   List of all posts, filterable
/blog?cat=<id>          Filtered by category
/blog?tag=<slug>        Filtered by tag
/blog/[slug]            Single post (markdown body)
/about                  Profile + about page
/search?q=...           Search results page
/404                    Not found
```

Categories (fixed 4):
| id | 이름 | Description | Accent color |
|---|---|---|---|
| `dev` | 개발 | Spring Boot, Java, Docker, 최신 기술 | `#0066FF` (Wanted blue) |
| `invest` | 투자 | 퀀트 분석, 포트폴리오 관리 | `#F59E0B` (amber) |
| `learn` | 학습 | 기술 스택, 책/강의 후기 | `#6541F2` (Wanted violet) |
| `daily` | 일상 | 회고, 생각, 추천 | `#14B8A6` (teal) |

These IDs flow through everything — sidebar filters, badges, sample-post categorization, and accent rings on the home category cards.

---

## Design Tokens

All tokens live in `design_reference/styles/wds-tokens.css` (Wanted DS foundations) and `design_reference/styles/app.css` (app-level overrides). Re-export them as Tailwind theme extensions.

### Colors — Brand & accents

```css
--c-blue-50:     #0066FF;   /* Primary brand */
--cat-dev:       #0066FF;
--cat-invest:    #F59E0B;
--cat-learn:     #6541F2;   /* var(--c-violet-50) */
--cat-daily:     #14B8A6;
```

### Colors — Semantic (light theme)

```css
--color-primary-normal:    var(--c-blue-50);     /* #0066FF */
--color-primary-hover:     var(--c-blue-45);     /* #005EEB */
--color-primary-pressed:   var(--c-blue-40);     /* #0054D1 */
--color-primary-on:        #ffffff;

--color-label-strong:      #000000;
--color-label-normal:      rgba(23,23,25,0.88);
--color-label-alternative: rgba(55,56,60,0.61);
--color-label-assistive:   rgba(55,56,60,0.28);
--color-label-disable:     rgba(55,56,60,0.16);

--color-bg-normal:               #ffffff;
--color-bg-alternative:          #F7F7F8;
--color-bg-elevated-normal:      #ffffff;
--color-bg-elevated-alternative: #F7F7F8;

--color-line-normal:        rgba(112,115,124,0.22);  /* THE hairline */
--color-line-alternative:   rgba(112,115,124,0.08);
--color-line-strong:        #70737C;

--color-fill-normal:        rgba(112,115,124,0.08);
--color-fill-strong:        rgba(112,115,124,0.16);
--color-fill-heavy:         rgba(112,115,124,0.22);
```

### Colors — Semantic (dark theme — `[data-theme="dark"]`)

```css
--color-label-strong:      #ffffff;
--color-label-normal:      rgba(255,255,255,0.88);
--color-label-alternative: rgba(255,255,255,0.43);
--color-bg-normal:         #171719;
--color-bg-alternative:    #1B1C1E;
--color-bg-elevated-normal:#212225;
--color-line-normal:       rgba(255,255,255,0.16);
--color-line-alternative:  rgba(255,255,255,0.06);
--color-primary-normal:    var(--c-blue-55);   /* #1A75FF — slightly brighter on dark */
```

### Spacing (4 px base)

```
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96, 128
```

### Border radius

```
4, 8, 12, 16, 20, 24, 32, 48, 60, 64, 9999
```

### Shadows

```css
--shadow-emphasize: 0 0 1px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.08);
--shadow-normal:    0 0 1px rgba(23,23,23,0.07), 0 1px 4px rgba(23,23,23,0.06);
--shadow-strong:    0 1px 4px rgba(23,23,23,0.10), 0 4px 14px rgba(23,23,23,0.07);
--shadow-heavy:     0 4px 14px rgba(23,23,23,0.10), 0 14px 40px rgba(23,23,23,0.06);
```

### Typography

**Font family:** Pretendard Variable — `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css`. Fallback stack: `"Pretendard JP", "Noto Sans KR", -apple-system, BlinkMacSystemFont, system-ui, sans-serif`.

**Mono:** JetBrains Mono (Google Fonts) for code blocks and small caption stamps.

Type ramp (size / line-height / tracking / weight) — see `wds-tokens.css`. Most-used:

| Token | Size | Line | Tracking | Weight | Used for |
|---|---|---|---|---|---|
| Display 1 | 56 | 72 | -0.0319em | 700 | Hero (uses `clamp()`) |
| Title 1   | 32 | 44 | -0.0253em | 700 | Page heads |
| Title 2   | 28 | 38 | -0.0236em | 700 | Section heads |
| Heading 2 | 20 | 28 | -0.012em  | 700 | List item titles |
| Body 1    | 16 | 24 | 0.0057em  | 500 | Body |
| Body 1 reading | 16 | 26 | 0.0057em | 500 | Prose paragraphs |
| Label 1   | 14 | 20 | 0.0145em  | 600 | Buttons, nav |
| Caption 1 | 12 | 16 | 0.0252em  | 600 | Meta, badges |

### Motion

```css
--motion-micro:        150ms;
--motion-standard:     200ms;
--motion-transitional: 300ms;
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
```

Custom hero animations use longer cycles (8–40 s) with their own `ease-in-out` or `cubic-bezier(0.45, 0, 0.55, 1)` curves.

---

## Screens

### 1. Home (`/`)

**Layout (top to bottom):**

1. **Sticky header** — 68 px tall, full-bleed, frosted glass (backdrop-filter blur), brand-blue accented border on scroll.
2. **Hero** — 128 px / 80 px (mobile) vertical padding. Animated background (one of 12 variants — see Hero Variants). Content inside `.container` (max-width 1200 px, side padding 24 px):
   - Status pill `지금 글을 쓰고 있어요` with pulsing green dot
   - Hero title: `개발, 투자, 학습.` (line 1, with `.` in brand-blue) / `그리고 일상의 기록▮` (line 2, with blinking caret). Pretendard 900, `clamp(40px, 6vw, 64px)`, tight letter-spacing `-0.035em`, max-width 14ch, `text-wrap: balance`
   - Sub-copy: 16-19 px, max-width 56ch, color: `--color-label-normal`
   - Two buttons: primary "최신 글 보기" (white bg, dark text, subtle border, `--shadow-emphasize`) + ghost "About"
3. **카테고리 section** — Alternative bg (`--color-bg-alternative`), top/bottom hairline. Section head with title (28 px, `-0.024em`) + sub. 4-column grid (auto-stacks at 900 px → 480 px). Each card: 24 px padding, `--radius-3` (12 px), hairline border, 3-px top accent bar that scales-in on hover. Card content: kebab id label in accent color, name (22 px bold), description (13 px alt), count.
4. **최신 글 section** — White bg. Section head with "전체 보기 →" link. 3-column post-card grid (`PostCard` component).
5. **Footer** — see Footer section.

**Animated hero backgrounds:** there are **12 variants** the user picked from. On every page refresh, one is randomly selected (`pickRandomHero()` in `src/app.jsx`). Variants `tree`, `spotlight`, `ripple`, `magnet`, `compass` are **mouse-interactive** (parallax driven by CSS variables `--mx`, `--my`, `--mx-pct`, `--my-pct`, `--mx-px`, `--my-px`, `--m-deg` set by an rAF lerp loop on the hero element). See `src/pages.jsx` lines starting at `// Mouse-driven parallax`. Decide whether to ship random rotation or pick one; if you ship multiple, keep the mouse-driven CSS vars wired.

The 12 variants — all in `src/hero-variants.jsx`:

| Variant | Static / Mouse-interactive | Description |
|---|---|---|
| `aurora` | static animation | Blurred blue/violet/teal/pink blobs orbiting + 4 huge drifting Korean category words (개발/투자/학습/일상) at 7-12 % opacity + dot grid + colored floating dots + slow conic-gradient hue sweep |
| `marquee` | static animation | 3 horizontal lanes of huge sliding typography (English tags / Korean categories / italic phrases) at different speeds and opacities |
| `grid` | static animation | Perspective-tilted wireframe grid receding to horizon + brand-blue horizon glow + vertical scanning beam + 3 outlined geometric shapes (hex / ring / triangle) rotating |
| `matrix` | static animation | Vertical falling columns of post titles (15 most-recent post titles, character by character) — terminal/Matrix vibe. Green-on-black, brighter leading character per column |
| `terminal` | static animation | Faux terminal window at top-right with macOS traffic-light dots, scrolling fake commands (`$ astro dev`, `$ cat about.md`, `$ grep -r "spring" posts/`, etc), CRT scanlines, blinking cursor |
| `wave` | static animation | 4 layered SVG sine-wave paths in category colors sliding at different speeds (sea-of-content metaphor) |
| `constellation` | static animation | SVG point-and-line network — 22 nodes connected when within 240-unit distance, gentle line-pulse animation |
| `tree` | **mouse-interactive** | Knowledge graph: root node "잡생각" → 4 category nodes (개발/투자/학습/일상) → 3 leaf keywords each (Spring, Kotlin, Docker / 백테스트, 팩터, 포트폴리오 / 책, 강의, 메모 / 회고, 추천, 습관). Curved SVG paths with animated stroke-dasharray "data flow", rectangle pill nodes with breathing stroke-width pulse. Whole tree parallaxes with mouse |
| `spotlight` | **mouse-interactive** | Dark bg, hidden grid of bright category-colored keywords. Radial-gradient mask follows cursor — only inside the spotlight circle are the words revealed. A glowing brand-blue cursor dot tracks the mouse |
| `ripple` | **mouse-interactive** | Sparse dot grid background + a brighter dot grid that follows the cursor (with double-density for shimmer) + animated concentric expanding rings emanating from cursor |
| `magnet` | **mouse-interactive** | 6 floating Korean words (개발/투자/학습/일상 + 잡생각 + `{ code }`). Each has its own `--pull-x` / `--pull-y` factors and they translate in unique directions when the cursor moves — like a magnet repelling/attracting different masses |
| `compass` | **mouse-interactive** | Concentric rings rotating different amounts (driven by `var(--mx)` and `var(--my)`), a needle that points toward the cursor (`var(--m-deg)`), plus N/E/S/W cardinal labels (개발/투자/학습/일상 mapped to the 4 directions) |

If you keep this gallery, expose it as the user's Tweak panel did: a dev-mode dropdown. For production, pick **one** to ship as the canonical hero — `tree` is the strongest narrative tie to the content.

### 2. Blog List (`/blog`)

- **Page head** (64-32 px vertical padding) with H1 (40 px) and sub-copy (16 px alt color).
- **2-column layout** below 1200px → stacks at 900 px container width:
  - **Sidebar** (220 px, sticky top: 88 px): "카테고리" section with all-categories button + 4 category buttons. Each button has a color-coded dot, count badge on the right, active state with `--color-fill-strong` background. Below: "인기 태그" section with a tag cloud (sorted by frequency).
  - **Main** (1fr): vertical list of `ListItem` cards. Each item has hairline bottom border, meta row (category badge + date + read-time), title (22 px, hover → primary color), excerpt (15 px alt, max-width 64ch), tag row.

URL state: `?cat=<id>` / `?tag=<slug>` query params drive the filter; clicking sidebar items updates the URL via `navigate('/blog?cat=...', { replace: true })`.

### 3. Article (`/blog/[slug]`)

- **2-column layout** (220 px TOC + content max-width 720 px center-aligned). At 960 px container width, TOC hides and content centers.
- **TOC** (sticky top: 88 px, max-height calc(100vh - 110px), scrollable): tab-indented for h2 vs h3, scroll-spy highlights active heading in brand blue with a 2-px left line.
- **Article header**: category badge + date + read-time meta row → title (`clamp(28px, 4vw, 40px)`) → excerpt (17 px alt, max-width unchanged) → byline (36-px gradient circular avatar with `홍` character + name + date).
- **Prose body**: 16 px / line-height 1.75. h2 = 26 px, h3 = 20 px. Both have `scroll-margin-top: 88px` so anchored scrolling clears the sticky header. Blockquote: 4-px brand-blue left border, alt bg, italic. Code blocks: JetBrains Mono 13.5 px, alt bg, 12-px radius, hairline border. Inline code: `--color-fill-normal` bg, 4-px radius. Tables: hairline-bordered with rounded corners, alt-bg header row.
- **Article footer**: tag row + "링크 복사 / 공유" ghost buttons → "관련 글" (same-category posts, 2-up grid) → comments placeholder card (replace with `<Giscus>`).

The featured demo post (`/blog/this-blog-with-astro-tailwind`) contains the full sample content the user provided (12 sections, code blocks, table); all other slugs render the placeholder `GenericPostBody` to demonstrate the layout. **Replace both with real markdown rendering through `@tailwindcss/typography`'s `.prose` class** — the existing `.prose` styles in `app.css` mirror Tailwind's defaults so they should drop in with minimal change.

### 4. About (`/about`)

Centered 720-px column with: 80-px gradient avatar + name (28 px) + role caption, intro paragraph, 3-cell stat grid (글 수 / 백엔드 경력 / 올해 읽은 책 — replace with real numbers), bullet sections for 주제 / 관심사 / 연락처, two action buttons (primary "최신 글 보러가기", ghost "GitHub").

### 5. Search Results (`/search?q=...`)

- Big query echo (`"검색어"` in 32 px) with result-count.
- Re-search form (border-radius 12, alt bg, 36-px primary submit button).
- Empty state: dashed-border alt-bg card with recovery suggestions + popular tags.
- Results list: same `list-item` style as blog list, with `<mark>` highlighted matches.

### 6. 404 (`/missing`)

Full-vertical-center copy: gradient 96-180 px "404" numeral (blue → violet) + title + sub + two CTAs.

---

## Cross-cutting components

### Header (`Header` in `src/components.jsx`)

- Sticky, 68 px / 60 px (mobile), frosted glass background.
- **Brand mark**: 32-px rounded square badge with gradient (blue → violet) at 14-22 % opacity over bg, hairline border, soft shadow, holds the 🚀 rocket emoji (centered, baseline-corrected). Right of badge: Pretendard 700 16 px wordmark "홍마초의 잡생각" with a brand-blue 5-px period accent. Whole brand block is one `<a>` going home.
- **Primary nav**: 홈 / 블로그 / 소개 (Korean). Active state = brand-blue 2-px animated underline indicator. Inactive = alt color, hover → strong color (no background plate).
- **Tools cluster** (right side, hairline left-divider): search icon button → width-picker icon-with-popover → theme toggle. All circular 36 px (40 px on mobile). On mobile (≤720 px container): nav links hide, hamburger appears, links move into a `.mobile-menu` drawer.
- **Keyboard**: `⌘K` / `Ctrl+K` / `/` opens search modal.

### Footer (`Footer` in `src/components.jsx`)

- Top hairline border, 48 / 56 px vertical padding.
- 3-column grid (1.4fr / 1fr / 1fr) — collapses to 1-col on mobile.
- Column 1: brand mark (badge + wordmark + dot, same as header), tagline (`--color-label-alternative`, 14 px), social icon row (GitHub / X / RSS).
- Columns 2-3: titled "EXPLORE" / "MORE" lists.
- **Bottom row**: top hairline, flex-spaced: copyright on left → "마지막 빌드 · 2026. 05. 21." + `v1.0.0` mono pill on right.

### Search modal (`SearchModal` in `src/overlays.jsx`)

Cmd-K spotlight pattern:
- Full-viewport semi-dark overlay with `backdrop-filter: blur(6px)`, fade-in 160 ms.
- 600-px-max modal slides down (200 ms scale-up + translate). Header: search icon → input → `ESC` keyboard tag. Body: scrolling sections. Footer: keyboard hint pills + "실시간 검색" label.
- **Empty state** shows: 최근 검색 chips (5, stored in `localStorage` key `blog-recent-searches`), 카테고리로 둘러보기 list (4 entries), 추천 글 list (top 3 posts).
- **Typing**: scored full-text search across title (weight 10), title-prefix bonus (5), excerpt (4), tags (6), category (3). Top 8 results shown with `<mark>` highlighted matches; >8 → "전체 결과 N개 모두 보기 →" row navigates to `/search?q=...`.
- **Keyboard**: ↑/↓ navigate active row (background `--color-fill-normal` + bracket-keyed `is-active`), Enter → navigate to slug or to search page if no exact match, Esc → close.

### Width picker (`WidthPicker` in `src/overlays.jsx`)

Notion-style popover next to theme toggle. The icon is a 3-bar mini-glyph that grows with the current setting (narrow→small middle bar / normal→bigger middle / wide→all big). Click opens a 220-px popover with title "본문 너비" and 3 radio rows (각 좁게 600 / 보통 720 / 넓게 860 px), each with the same mini-icon + label + hint + check mark. Selection updates the CSS variable `--content-width` on `<html>`, which the article body consumes.

### Tweaks (`TweaksPanel` from `tweaks-panel.jsx`)

In-design controls panel. **Not for production** — strip before shipping. It exposes:
- 외형 / 테마 (light / dark)
- 레이아웃 / 본문 너비 (narrow / normal / wide) — duplicates the header picker
- 레이아웃 / 뷰포트 미리보기 (full / tablet · 820 / mobile · 390) — constrains `.app-shell` width and toggles container-query breakpoints so designers can verify mobile layout from desktop
- 둘러보기 — quick-nav buttons to all routes

The viewport-preview feature drives the **container-query-based responsive system** described next.

---

## Responsive system

Critical: this design uses **CSS container queries** (`@container app (max-width: ...)`) instead of `@media (max-width: ...)` everywhere. The container is declared on `.app-shell`:

```css
.app-shell {
  container-name: app;
  container-type: inline-size;
}
```

When the Tweaks panel constrains `.app-shell` to 820 / 390 px, container queries inside fire and mobile layout actually renders — without resizing the browser. **Preserve this in your Astro port.** TailwindCSS 4 supports container queries via the `@container` directive natively, or via the `@tailwindcss/container-queries` plugin if you stay on 3.x.

Breakpoints used:

| Width | What happens |
|---|---|
| ≤ 960 | Post grid → 2 cols; article TOC hides; article goes 1-col; featured card spans 2 |
| ≤ 900 | Cat grid → 2 cols; blog layout → 1 col (sidebar drops above); sidebar loses sticky; terminal hero hides its right window |
| ≤ 768 | Footer → 1 col; hero padding shrinks; sections shrink; page head shrinks; about padding shrinks |
| ≤ 720 | Desktop nav links collapse; hamburger appears; mobile drawer activates; header to 60 px; tools tighten |
| ≤ 640 | Post grid → 1 col; featured → 1 col; related grid → 1 col; nav link padding tightens; brand wordmark → 15 px |
| ≤ 540 | About stat grid → 1 col |
| ≤ 480 | Cat grid → 1 col |
| ≤ 380 | Brand wordmark → 14 px; brand badge → 28 px |

`@media (prefers-reduced-motion: reduce)` zeroes out all hero variant animations.

---

## Interactions & Behavior

| Interaction | Where | Implementation |
|---|---|---|
| Hash router | App-wide | Plain `window.location.hash` parsing. Routes: `/`, `/blog`, `/blog/[slug]`, `/about`, `/search`. In Astro, replace with file-based routing. |
| Random hero variant on refresh | `pickRandomHero()` in `src/app.jsx` | `Math.random()` on mount, never persisted. |
| Theme toggle | Header icon button | Sets `data-theme="dark"` on `<html>`, persists to `localStorage` key `blog-theme`. Honors `prefers-color-scheme` on first visit. Sun ↔ moon icon swaps. |
| Search modal | `Cmd+K` / `Ctrl+K` / `/` | Custom keyboard listener, body scroll lock when open, focus management. |
| Search recent | localStorage | Stores last 5 unique queries under `blog-recent-searches`. |
| Width picker | Header icon | Clicking opens popover; outside click + Esc close it; selection writes to `--content-width` CSS variable on `<html>`. |
| TOC scroll-spy | Article | Listens to `scroll` on window, finds last heading above offset 120 px, marks `.is-active`. |
| Hero mouse parallax | Hero element (interactive variants only) | `mousemove` writes target into rAF lerp, lerp writes 7 CSS vars (`--mx`, `--my`, `--mx-pct`, `--my-pct`, `--mx-px`, `--my-px`, `--m-deg`). `mouseleave` returns to center. Smoothing factor 0.10. |
| Blog filter | Sidebar | `?cat=<id>` and `?tag=<slug>` URL params; `navigate(..., { replace: true })` to avoid history spam. |
| Tag chip click | Article footer & blog list | Navigates to `/blog?tag=<slug>`. |
| Comments placeholder | Article footer | Replace with `<Giscus>` widget — use repo `<owner>/<repo-discussions>`, theme reactive to `--color-bg-normal`. |

---

## State Management

The prototype uses local React `useState`. For Astro:
- **Routes** are file-system based — no client router needed.
- **Theme** + **width** + **filters**: use small Astro islands (or vanilla JS) — these are simple enough not to warrant a state library.
- **Search modal**: a single shared island (`<SearchOverlay client:idle />`).
- **Tweaks panel**: drop entirely. The container-query responsive system stays; just remove the Tweak control that toggles `data-viewport-preview`.

Data:
- Use Astro Content Collections (`src/content/blog/*.md` with YAML frontmatter `title`, `pubDate`, `category`, `tags`, `excerpt`, optionally `featured: true`).
- The category map (`CATEGORIES`) and color tokens (`CAT_COLOR`) move into a `src/lib/categories.ts` constant.

---

## Assets

- **Pretendard Variable** — CDN, no asset shipping needed. (Use jsdelivr URL above.)
- **JetBrains Mono** — Google Fonts.
- **Rocket emoji** 🚀 — used in brand mark; no asset.
- **Wanted Design System CSS** — `wds-tokens.css` is a portable extract; ship it or transpose into Tailwind theme.
- **No images** are used in the design (no thumbnails, no hero images, no avatars beyond gradient text). The blog is deliberately text-forward. Add image support later if you want a "thumbnail" post-card variant.
- **Icons** — Lucide React (replace the inline SVGs in `src/components.jsx`'s `Icon` object).

---

## Files in this handoff

```
design_handoff_hongmacho_blog/
├── README.md                                ← you are here
└── design_reference/
    ├── index.html                            ← entry, loads all scripts
    ├── tweaks-panel.jsx                      ← Tweaks shell (designer-only)
    ├── styles/
    │   ├── wds-tokens.css                    ← Wanted DS color/type/spacing tokens
    │   ├── wds-fonts.css                     ← Pretendard JP / Wanted Sans @font-face
    │   └── app.css                           ← all app + hero-variant styling (THE source of truth)
    └── src/
        ├── data.jsx                          ← sample post data + categories
        ├── article-bodies.jsx                ← full sample article + generic body
        ├── components.jsx                    ← Header, Footer, PostCard, ListItem, Tag, CategoryBadge, Icon
        ├── pages.jsx                         ← HomePage, BlogListPage, ArticlePage, AboutPage, NotFoundPage
        ├── overlays.jsx                      ← SearchModal, SearchResultsPage, WidthPicker
        ├── hero-variants.jsx                 ← all 12 hero background variants
        └── app.jsx                           ← App shell (router + tweak wiring)
```

Open `design_reference/index.html` in a browser to see the prototype run.

---

## Implementation suggestions (recommended order)

1. **Scaffold Astro 6 + TailwindCSS 4 + Typography plugin.** Add `@tailwindcss/container-queries` (or use TW4's native support). Configure `tailwind.config.ts`:
   - Add a `@theme` block with all the Wanted DS tokens (or import `wds-tokens.css` and re-export via CSS vars).
   - Pretendard Variable as the default sans.
2. **Layout primitives** — `BaseLayout.astro` with sticky header, footer, theme-color meta. Wire dark-mode toggle (`data-theme` attribute, localStorage, prefers-color-scheme).
3. **Atoms** — `CategoryBadge`, `Tag`, `Button` (`btn--primary` / `--white` / `--ghost`), `Icon` (Lucide).
4. **Home page** — pick ONE hero variant to ship (recommend `tree`), then build it as an Astro Island (the mouse parallax needs JS). The other 11 variants can move into a `/lab/heroes` page if you want to keep them.
5. **Content collections** — `blog` collection with sample markdown files mirroring the data in `src/data.jsx`.
6. **Blog index + article pages** — use `getStaticPaths`. Article body is `<Content />` from the collection entry; wrap in `<article class="prose">`.
7. **Search** — start with a simple client-side filter (the scoring function in `src/overlays.jsx` is portable). Upgrade to Pagefind later for full-text indexing.
8. **Giscus** — drop the placeholder card, install `@giscus/svelte` (or vanilla embed) wired to your Discussions category.
9. **Strip the Tweaks panel.** Keep the container-query-based responsive system — it doesn't depend on the panel.
10. **Polish**: Lucide-replace inline icons, verify Lighthouse, set up Vercel preview deploys.

---

## Tone & content notes

- Korean is primary. The voice is calm-friendly polite (`~합니다 / ~해요` mix, never stiff). Headings use bold typography for hierarchy, never ALL-CAPS or excessive iconography.
- **No emojis** beyond the brand 🚀. Following Wanted DS convention.
- **No filler content.** Every section earns its place. Don't pad — the design's strength is its restraint.
- The default sample posts cover all 4 categories and a believable date range; replace them with real content but keep the same metadata shape (title / excerpt / tags / category / readTime / date / featured).

---

## ✅ Verification checklist (run before declaring done)

Open the prototype and your build side-by-side. For each row, both should match.

### Tokens & primitives
- [ ] All 14 atomic color ramps from `wds-tokens.css` ported into the Tailwind theme or available as CSS vars
- [ ] All 21+ semantic color tokens (`--color-*`) defined for light AND dark theme
- [ ] All 4 shadow tokens (`--shadow-emphasize/normal/strong/heavy`)
- [ ] All 11 radius tokens (`--radius-1` … `--radius-10` + `--radius-full`)
- [ ] All 12 spacing tokens (`--space-1` … `--space-12`)
- [ ] All 21 type tokens (size + line-height + tracking + weight, 3 each for display 1-3 / title 1-3 / heading 1-2 / headline 1-2 / body 1-2 / label 1-2 / caption 1-2)
- [ ] Pretendard Variable loaded from jsdelivr CDN
- [ ] JetBrains Mono loaded from Google Fonts
- [ ] Motion tokens (`--motion-micro/standard/transitional`, `--ease-standard`)

### Header
- [ ] 68 px (60 px mobile) sticky header with frosted-glass backdrop-filter
- [ ] On-scroll: hairline bottom border appears
- [ ] Brand mark: 32-px rounded-square badge with blue→violet gradient + rocket emoji
- [ ] Wordmark uses display font, brand-blue 5-px dot accent
- [ ] Nav: 홈 / 블로그 / 소개 — Korean; active state = 2-px animated brand-blue underline
- [ ] Tools cluster: search / width picker / theme toggle, all circular 36/40 px
- [ ] Hairline divider between nav and tools
- [ ] Theme toggle rotates icon -18° on hover
- [ ] ≤720 px: nav links collapse into hamburger drawer

### Hero
- [ ] Hero is 128 / 80 px padded
- [ ] Status pill with pulsing green dot
- [ ] Title uses display font, `clamp(40px, 6vw, 64px)`, max-width 14ch, `text-wrap: balance`
- [ ] Brand-blue period accent on line 1
- [ ] Blinking caret at end of line 2 (`steps(2)` animation)
- [ ] CTA buttons: primary "white" variant + ghost "About"
- [ ] At least one hero variant ships (recommended: `tree`)
- [ ] If multiple variants ship: random pick on each page load, never persisted
- [ ] Mouse-interactive variants (`tree`/`spotlight`/`ripple`/`magnet`/`compass`) drive parallax via the rAF-lerped CSS vars `--mx`, `--my`, `--mx-pct`, `--my-pct`, `--mx-px`, `--my-px`, `--m-deg`

### Categories section (home)
- [ ] Alternative bg, top + bottom hairlines
- [ ] 4-column grid → 2-col @ 900 px → 1-col @ 480 px (container queries)
- [ ] Each card: 24-px padding, 12-px radius, hairline border, 3-px top accent that scales on hover
- [ ] Card content: uppercase kebab-id label in category color, name, description, count

### Post cards & list items
- [ ] PostCard has category badge + title (clamped 2 lines) + excerpt (clamped 3 lines) + meta + tags
- [ ] Hover: lifts 2 px + shadow strong
- [ ] ListItem (blog index): hairline bottom border, hover → title turns brand-blue
- [ ] Featured card variant spans 2 columns

### Article page
- [ ] 220-px sticky TOC + 720-px (variable via picker) content body
- [ ] At ≤960 px: TOC hides, content centers
- [ ] Article header: meta row + title `clamp(28px, 4vw, 40px)` + excerpt 17 px + byline with gradient avatar
- [ ] Prose body: line-height 1.75, h2 26 px, h3 20 px, both with `scroll-margin-top: 88px`
- [ ] Blockquote: 4-px brand-blue left border, alt bg, italic
- [ ] Inline code: fill bg, 4-px radius
- [ ] Code block: JetBrains Mono 13.5 px, alt bg, 12-px radius, syntax-highlight tokens (`.tok-kw/str/num/cmt/fn/attr`)
- [ ] Table: hairline border, rounded, alt-bg header
- [ ] Footer: tag row + share buttons + related posts grid + comments placeholder
- [ ] TOC scroll-spy works at offset 120 px

### Blog list page
- [ ] Page head with 40-px title + sub
- [ ] Sidebar 220 px sticky-top-88
- [ ] Category list with color dots + count badges
- [ ] Active category has stronger fill bg
- [ ] Tag cloud sorted by frequency
- [ ] `?cat=` and `?tag=` URL state preserved
- [ ] ≤900 px: sidebar drops above content

### Search modal
- [ ] Opens with `⌘K` / `Ctrl+K` / `/` from any route
- [ ] Backdrop blur(6px) overlay
- [ ] 600-px max modal slides down 200 ms with scale + translate
- [ ] Empty state: 최근 검색 chips + 카테고리 list + 추천 글
- [ ] localStorage key `blog-recent-searches`, max 5 unique
- [ ] Typing: scored search (title=10, prefix=5, excerpt=4, tags=6, category=3)
- [ ] Highlighted matches via `<mark>`
- [ ] Top 8 shown; >8 → "전체 결과 N개 모두 보기" link
- [ ] Keyboard: ↑↓ navigate, Enter select, Esc close
- [ ] Active row gets fill-normal bg

### Search results page (`/search?q=...`)
- [ ] 32-px query echo with quote marks in alt color
- [ ] Re-search form with primary submit
- [ ] Empty state: dashed alt-bg card + popular tag chips
- [ ] Result list reuses ListItem style with highlighted matches

### About page
- [ ] 720-px centered column
- [ ] 80-px gradient avatar + name + role
- [ ] 3-cell stat grid → 1-col @ 540 px

### 404
- [ ] Centered layout
- [ ] Gradient 96-180 px "404" numeral (blue → violet)
- [ ] Title + sub + 2 CTAs

### Footer
- [ ] 3-column grid (1.4 / 1 / 1)
- [ ] Brand block with full mark + tagline + social icons
- [ ] Explore / More columns
- [ ] Bottom row: copyright left, "마지막 빌드 · DATE" + `v1.0.0` mono pill right
- [ ] ≤768 px: collapses to 1-col

### Width picker
- [ ] Header icon = 3-bar glyph that grows with current width preset
- [ ] Click opens 220-px popover with title "본문 너비"
- [ ] 3 options (좁게 600 / 보통 720 / 넓게 860 px) each with mini-icon + label + hint + check
- [ ] Click outside or Esc closes
- [ ] Updates `--content-width` CSS var on `<html>`

### Theme toggle
- [ ] Persists to `localStorage` key `blog-theme`
- [ ] Honors `prefers-color-scheme` on first visit
- [ ] `data-theme="dark"` on `<html>` element
- [ ] Sun ↔ moon icon swap with rotation hover

### Responsive (container queries)
- [ ] `.app-shell` has `container-name: app; container-type: inline-size`
- [ ] All `@media (max-width:)` are actually `@container app (max-width:)`
- [ ] Framed preview (820 / 390) triggers real mobile layout, not just shrinking
- [ ] `prefers-reduced-motion: reduce` zeroes hero animations

### Behavior
- [ ] No console errors on any route, both themes
- [ ] All hover states match (color shift + shadow + transform)
- [ ] All focus-visible states show 2-px outline at 2-px offset
- [ ] No horizontal scroll at any width including 320 px
- [ ] Reduced-motion respected
- [ ] Korean text rendered with Pretendard, NOT system Korean fonts
- [ ] Touch targets ≥ 44 px on mobile breakpoint

When every box is ticked, you're done.

---

Good luck — the design is dense but every choice was deliberate. When in doubt, mimic Wanted's restraint and trust the spacing scale.

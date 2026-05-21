/* Main App — router + theme + tweaks. */

const { useState: useStateApp, useEffect: useEffectApp, useCallback: useCallbackApp } = React;

/* Tweak defaults (parsed by host for persistence) */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "contentWidth": "normal",
  "viewportPreview": "full"
}/*EDITMODE-END*/;

/* Hero variant — randomized each refresh, never persisted. */
const HERO_KEYS = Object.keys(HERO_VARIANTS);
const pickRandomHero = () => HERO_KEYS[Math.floor(Math.random() * HERO_KEYS.length)];

/* Parse the hash route: #/path?key=val&key=val */
const parseHash = () => {
  const raw = window.location.hash.slice(1) || '/';
  const [path, queryStr] = raw.split('?');
  const query = {};
  if (queryStr) {
    queryStr.split('&').forEach(kv => {
      const [k, v] = kv.split('=');
      if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
  }
  return { path: path || '/', query };
};

const CONTENT_WIDTHS = {
  narrow: 600,
  normal: 720,
  wide:   860,
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useStateApp(parseHash());
  // Hero variant is randomized once per page load and never persisted —
  // user gets a surprise on every refresh.
  const [heroVariant, setHeroVariant] = useStateApp(pickRandomHero);

  // Theme application
  useEffectApp(() => {
    document.documentElement.setAttribute('data-theme', t.theme || 'light');
  }, [t.theme]);

  // Content width application
  useEffectApp(() => {
    const w = CONTENT_WIDTHS[t.contentWidth] || CONTENT_WIDTHS.normal;
    document.documentElement.style.setProperty('--content-width', w + 'px');
  }, [t.contentWidth]);

  // Viewport preview: constrain .app-shell via body attribute so designer
  // can compare desktop / tablet / mobile renderings live.
  useEffectApp(() => {
    const labels = { full: '', tablet: 'TABLET · 820', mobile: 'MOBILE · 390' };
    const mode = t.viewportPreview === 'full' ? '' : t.viewportPreview;
    if (mode) {
      document.body.setAttribute('data-viewport-preview', mode);
      document.body.setAttribute('data-viewport-label', labels[mode] || '');
    } else {
      document.body.removeAttribute('data-viewport-preview');
      document.body.removeAttribute('data-viewport-label');
    }
    return () => {
      document.body.removeAttribute('data-viewport-preview');
      document.body.removeAttribute('data-viewport-label');
    };
  }, [t.viewportPreview]);

  // Initial theme: respect tweak default; honor system if first visit.
  useEffectApp(() => {
    window.__setTweak = setTweak; // dev helper: window.__setTweak('heroVariant','marquee')
    const stored = localStorage.getItem('blog-theme');
    if (stored) {
      setTweak('theme', stored);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTweak('theme', 'dark');
    }
    // eslint-disable-next-line
  }, []);
  useEffectApp(() => {
    if (t.theme) localStorage.setItem('blog-theme', t.theme);
  }, [t.theme]);

  // Hash router
  useEffectApp(() => {
    const onHash = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallbackApp((to, opts = {}) => {
    const target = '#' + to;
    if (opts.replace) {
      window.history.replaceState(null, '', target);
      setRoute(parseHash());
    } else {
      window.location.hash = to;
    }
  }, []);

  // Render the active page
  let page;
  const { path, query } = route;
  if (path === '/' || path === '') {
    page = <HomePage navigate={navigate} heroVariant={heroVariant} />;
  } else if (path === '/blog') {
    page = <BlogListPage navigate={navigate} query={query} />;
  } else if (path.startsWith('/blog/')) {
    const slug = path.slice('/blog/'.length);
    page = <ArticlePage slug={slug} navigate={navigate} />;
  } else if (path === '/about') {
    page = <AboutPage navigate={navigate} />;
  } else if (path === '/search') {
    page = <SearchResultsPage navigate={navigate} query={query} />;
  } else {
    page = <NotFoundPage navigate={navigate} />;
  }

  return (
    <div className="app-shell wds" data-theme={t.theme}>
      <Header
        route={path}
        navigate={navigate}
        theme={t.theme}
        setTheme={(v) => setTweak('theme', v)}
        contentWidth={t.contentWidth}
        setContentWidth={(v) => setTweak('contentWidth', v)}
      />
      {page}
      <Footer navigate={navigate} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="히어로 배경" />
        <TweakSelect
          label="Hero 변형"
          value={t.heroVariant}
          options={[
            { value: 'aurora',        label: 'V1 · Aurora (블롭 + 한글)' },
            { value: 'marquee',       label: 'V2 · Marquee (3-레인 타이포)' },
            { value: 'grid',          label: 'V3 · Grid (와이어프레임)' },
            { value: 'matrix',        label: 'V4 · Matrix (글 제목 코드 레인)' },
            { value: 'terminal',      label: 'V7 · Terminal (ASCII)' },
            { value: 'wave',          label: 'V8 · Wave (SVG 물결)' },
            { value: 'constellation', label: 'V9 · Constellation (별자리)' },
            { value: 'tree',          label: 'V11 · Tree (키워드 트리 🖱)' },
            { value: 'spotlight',     label: 'V12 · Spotlight (손전등 🖱)' },
            { value: 'ripple',        label: 'V14 · Ripple (도트 그리드 🖱)' },
            { value: 'magnet',        label: 'V15 · Magnet (자석 한글 🖱)' },
            { value: 'compass',       label: 'V16 · Compass (나침반 🖱)' },
          ]}
          onChange={(v) => { setTweak('heroVariant', v); navigate('/'); }}
        />
        <TweakSection label="외형" />
        <TweakRadio
          label="테마"
          value={t.theme}
          options={['light', 'dark']}
          onChange={(v) => setTweak('theme', v)}
        />
        <TweakSection label="레이아웃" />
        <TweakRadio
          label="본문 너비"
          value={t.contentWidth}
          options={['narrow', 'normal', 'wide']}
          onChange={(v) => setTweak('contentWidth', v)}
        />
        <TweakSelect
          label="뷰포트 미리보기"
          value={t.viewportPreview}
          options={[
            { value: 'full',   label: '전체 (브라우저 너비)' },
            { value: 'tablet', label: '태블릿 · 820' },
            { value: 'mobile', label: '모바일 · 390' },
          ]}
          onChange={(v) => setTweak('viewportPreview', v)}
        />
        <TweakSection label="둘러보기" />
        <TweakButton label="홈" onClick={() => navigate('/')} />
        <TweakButton label="블로그 목록" onClick={() => navigate('/blog')} />
        <TweakButton label="개별 글 (피처드)" onClick={() => navigate('/blog/this-blog-with-astro-tailwind')} />
        <TweakButton label="개별 글 (일반)" onClick={() => navigate('/blog/spring-boot-3-migration')} />
        <TweakButton label="검색 결과 (Astro)" onClick={() => navigate('/search?q=Astro')} />
        <TweakButton label="검색 결과 (없음)" onClick={() => navigate('/search?q=zzz')} />
        <TweakButton label="About" onClick={() => navigate('/about')} />
        <TweakButton label="404" onClick={() => navigate('/missing')} />
      </TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

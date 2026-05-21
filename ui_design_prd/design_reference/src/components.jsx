/* Shared UI components for 홍마초의 잡생각. */

const { useState, useEffect, useRef, useCallback } = React;

/* ─── Icons (inline SVG so we don't depend on a CDN) ─── */
const Icon = {
  Sun: (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  ),
  Moon: (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  Search: (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
    </svg>
  ),
  ArrowRight: (p) => (
    <svg {...p} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7"/>
    </svg>
  ),
  ArrowLeft: (p) => (
    <svg {...p} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M11 5l-7 7 7 7"/>
    </svg>
  ),
  Clock: (p) => (
    <svg {...p} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
  ),
  Github: (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
    </svg>
  ),
  Twitter: (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Rss: (p) => (
    <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/>
    </svg>
  ),
  Hash: (p) => (
    <svg {...p} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>
    </svg>
  ),
  Copy: (p) => (
    <svg {...p} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  ),
  MessageSquare: (p) => (
    <svg {...p} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Sparkles: (p) => (
    <svg {...p} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/>
    </svg>
  ),
};

/* ─── formatting helpers ─── */
const formatDate = (iso) => {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}. ${m}. ${day}`;
};

const catName = (id) => (CATEGORIES.find(c => c.id === id) || {}).name || id;

/* ─── Header ─── */
const Header = ({ route, navigate, theme, setTheme, contentWidth, setContentWidth }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cmd/Ctrl+K → open search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === '/' && !searchOpen) {
        const tag = (document.activeElement && document.activeElement.tagName) || '';
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          setSearchOpen(true);
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  const isOn = (prefix) => {
    if (prefix === '/') return route === '/';
    return route === prefix || route.startsWith(prefix + '/');
  };

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container site-header__inner">
        <a href="#/" className="brand" onClick={(e) => { e.preventDefault(); navigate('/'); }} aria-label="홍마초의 잡생각 — 홈으로">
          <span className="brand__badge" aria-hidden="true">
            <span className="brand__rocket">🚀</span>
          </span>
          <span className="brand__wordmark">
            홍마초의 잡생각<span className="brand__dot" aria-hidden="true"/>
          </span>
        </a>
        <nav className="site-nav" aria-label="Primary">
          <a href="#/" className={`site-nav__link ${isOn('/') ? 'is-active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('/'); }}>홈</a>
          <a href="#/blog" className={`site-nav__link ${isOn('/blog') ? 'is-active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('/blog'); }}>블로그</a>
          <a href="#/about" className={`site-nav__link ${isOn('/about') ? 'is-active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('/about'); }}>소개</a>
          <div className="site-header__tools">
            <button
              className="icon-btn"
              aria-label="검색"
              title="검색 (⌘K)"
              onClick={() => setSearchOpen(true)}
            >
              <Icon.Search />
            </button>
            <WidthPicker value={contentWidth} onChange={setContentWidth} />
            <button
              className="icon-btn theme-toggle"
              aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
              title={theme === 'dark' ? '라이트 모드' : '다크 모드'}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <span className="theme-toggle__icon">
                {theme === 'dark' ? <Icon.Sun /> : <Icon.Moon />}
              </span>
            </button>
          </div>
        </nav>
      </div>
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} navigate={navigate} />}
    </header>
  );
};

/* ─── Footer ─── */
const Footer = ({ navigate }) => (
  <footer className="site-footer">
    <div className="container site-footer__inner">
      <div className="site-footer__brand-block">
        <a href="#/" className="brand" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          <span className="brand__badge" aria-hidden="true">
            <span className="brand__rocket">🚀</span>
          </span>
          <span className="brand__wordmark">
            홍마초의 잡생각<span className="brand__dot" aria-hidden="true"/>
          </span>
        </a>
        <p className="site-footer__tagline">개발, 투자, 학습 그리고 일상의 기록.</p>
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <a className="icon-btn" href="#" aria-label="GitHub" onClick={(e) => e.preventDefault()}><Icon.Github /></a>
          <a className="icon-btn" href="#" aria-label="X / Twitter" onClick={(e) => e.preventDefault()}><Icon.Twitter /></a>
          <a className="icon-btn" href="#" aria-label="RSS" onClick={(e) => e.preventDefault()}><Icon.Rss /></a>
        </div>
      </div>
      <div>
        <div className="site-footer__col-title">Explore</div>
        <ul className="site-footer__list">
          <li><a href="#/blog" onClick={(e) => { e.preventDefault(); navigate('/blog'); }}>전체 글</a></li>
          {CATEGORIES.map(c => (
            <li key={c.id}>
              <a href={`#/blog?cat=${c.id}`} onClick={(e) => { e.preventDefault(); navigate(`/blog?cat=${c.id}`); }}>{c.name}</a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="site-footer__col-title">More</div>
        <ul className="site-footer__list">
          <li><a href="#/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>About</a></li>
          <li><a href="#" onClick={(e) => e.preventDefault()}>Resume</a></li>
          <li><a href="#" onClick={(e) => e.preventDefault()}>구독</a></li>
          <li><a href="#" onClick={(e) => e.preventDefault()}>Now</a></li>
        </ul>
      </div>
    </div>
    <div className="container site-footer__bottom">
      <span>© 2026 홍마초. Built with Astro + TailwindCSS.</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
        <span>마지막 빌드 · 2026. 05. 21.</span>
        <span className="brand__version" aria-label="버전 정보">v1.0.0</span>
      </span>
    </div>
  </footer>
);

/* ─── Badges ─── */
const CategoryBadge = ({ cat }) => (
  <span className="cat-badge" data-cat={cat}>{catName(cat)}</span>
);

const Tag = ({ name, onClick }) => (
  <span className="tag" onClick={onClick}>
    <Icon.Hash style={{ opacity: 0.55, marginRight: 3 }} />{name}
  </span>
);

/* ─── Post cards ─── */
const PostCard = ({ post, navigate, featured }) => (
  <button
    className={`post-card ${featured ? 'post-card--featured' : ''}`}
    onClick={() => navigate(`/blog/${post.slug}`)}
    aria-label={`${post.title} 글 보기`}
  >
    <CategoryBadge cat={post.category} />
    <h3 className="post-card__title">{post.title}</h3>
    <p className="post-card__excerpt">{post.excerpt}</p>
    <div className="post-card__meta">
      <span>{formatDate(post.date)}</span>
      <span className="dot">·</span>
      <Icon.Clock /> <span>{post.readTime}분</span>
    </div>
    <div className="post-card__tags">
      {post.tags.slice(0, 3).map(t => <Tag key={t} name={t} />)}
    </div>
  </button>
);

/* List-item style for blog index */
const ListItem = ({ post, navigate }) => (
  <button className="list-item" onClick={() => navigate(`/blog/${post.slug}`)}>
    <div className="list-item__meta">
      <CategoryBadge cat={post.category} />
      <span className="list-item__date">{formatDate(post.date)}</span>
      <span className="dot" style={{ color: 'var(--color-line-strong)' }}>·</span>
      <span className="list-item__date" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <Icon.Clock />{post.readTime}분
      </span>
    </div>
    <h3 className="list-item__title">{post.title}</h3>
    <p className="list-item__excerpt">{post.excerpt}</p>
    <div className="list-item__tags">
      {post.tags.map(t => <Tag key={t} name={t} />)}
    </div>
  </button>
);

Object.assign(window, {
  Icon, Header, Footer,
  CategoryBadge, Tag,
  PostCard, ListItem,
  formatDate, catName,
});

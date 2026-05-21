/* Overlays — Search modal (⌘K spotlight), Search results page, Width picker. */

const { useState: useStateOv, useEffect: useEffectOv, useRef: useRefOv, useMemo: useMemoOv } = React;

/* ─── tiny utilities ─── */
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function highlight(text, query) {
  if (!query) return text;
  const q = query.trim();
  if (!q) return text;
  const re = new RegExp(`(${escapeRe(q)})`, 'gi');
  const parts = text.split(re);
  return parts.map((p, i) =>
    re.test(p) && p.toLowerCase() === q.toLowerCase()
      ? <mark key={i}>{p}</mark>
      : <React.Fragment key={i}>{p}</React.Fragment>
  );
}

function scoreAndFilter(query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  return POSTS
    .map(p => {
      let score = 0;
      const t = p.title.toLowerCase();
      const e = p.excerpt.toLowerCase();
      if (t.includes(q)) score += 10;
      if (t.startsWith(q)) score += 5;
      if (e.includes(q)) score += 4;
      if (p.tags.some(tag => tag.toLowerCase().includes(q))) score += 6;
      if (catName(p.category).toLowerCase().includes(q)) score += 3;
      return { post: p, score };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(r => r.post);
}

const RECENT_KEY = 'blog-recent-searches';
function loadRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}
function pushRecent(q) {
  if (!q) return;
  const list = [q, ...loadRecent().filter(x => x !== q)].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}

/* ─── Search modal (Cmd+K spotlight) ─── */
const SearchModal = ({ onClose, navigate }) => {
  const [query, setQuery] = useStateOv('');
  const [activeIdx, setActiveIdx] = useStateOv(0);
  const [recent, setRecent] = useStateOv(loadRecent());
  const inputRef = useRefOv(null);
  const bodyRef = useRefOv(null);

  useEffectOv(() => {
    inputRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const results = useMemoOv(() => scoreAndFilter(query), [query]);

  useEffectOv(() => { setActiveIdx(0); }, [query]);

  useEffectOv(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx(i => Math.min(results.length - 1, i + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx(i => Math.max(0, i - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results.length > 0) {
          const target = results[activeIdx] || results[0];
          if (target) {
            pushRecent(query);
            onClose();
            navigate(`/blog/${target.slug}`);
          }
        } else if (query.trim()) {
          pushRecent(query);
          onClose();
          navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [results, activeIdx, query, navigate, onClose]);

  useEffectOv(() => {
    // keep active row in view
    if (!bodyRef.current) return;
    const row = bodyRef.current.querySelector('.search-result.is-active');
    if (row) row.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const seeAllHref = `/search?q=${encodeURIComponent(query.trim())}`;

  const handlePick = (post) => {
    pushRecent(query);
    onClose();
    navigate(`/blog/${post.slug}`);
  };

  return (
    <div
      className="search-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="검색"
    >
      <div className="search-modal">
        <div className="search-input-row">
          <span className="search-input-row__icon"><Icon.Search /></span>
          <input
            ref={inputRef}
            className="search-input"
            placeholder="제목, 본문 요약, 태그로 검색…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="search-kbd">ESC</span>
        </div>

        <div className="search-body" ref={bodyRef}>
          {!query.trim() && (
            <>
              {recent.length > 0 && (
                <>
                  <div className="search-section-title">최근 검색</div>
                  <div className="search-chip-row">
                    {recent.map(q => (
                      <span key={q} className="search-chip" onClick={() => setQuery(q)}>
                        <Icon.Clock /> {q}
                      </span>
                    ))}
                    <span
                      className="search-chip"
                      onClick={() => { localStorage.removeItem(RECENT_KEY); setRecent([]); }}
                      style={{ background: 'transparent' }}
                    >
                      지우기
                    </span>
                  </div>
                </>
              )}
              <div className="search-section-title">카테고리로 둘러보기</div>
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  className="search-result"
                  onClick={() => { onClose(); navigate(`/blog?cat=${c.id}`); }}
                >
                  <div>
                    <div className="search-result__title">{c.name} 글 모두 보기</div>
                    <div className="search-result__excerpt">{c.desc}</div>
                  </div>
                  <div className="search-result__meta">
                    <CategoryBadge cat={c.id} />
                  </div>
                </button>
              ))}
              <div className="search-section-title">추천 글</div>
              {POSTS.slice(0, 3).map(p => (
                <button
                  key={p.slug}
                  className="search-result"
                  onClick={() => handlePick(p)}
                >
                  <div>
                    <div className="search-result__title">{p.title}</div>
                    <div className="search-result__excerpt">{p.excerpt}</div>
                  </div>
                  <div className="search-result__meta">
                    <CategoryBadge cat={p.category} />
                  </div>
                </button>
              ))}
            </>
          )}

          {query.trim() && results.length === 0 && (
            <div className="search-empty">
              "<strong>{query}</strong>" 에 해당하는 결과가 없습니다.
              <div style={{ marginTop: 12 }}>
                <span className="search-chip" onClick={() => { onClose(); navigate(seeAllHref); }}>
                  전체 검색 결과 페이지 열기
                </span>
              </div>
            </div>
          )}

          {query.trim() && results.length > 0 && (
            <>
              <div className="search-section-title">
                결과 {results.length}개 — 글
              </div>
              {results.slice(0, 8).map((p, i) => (
                <button
                  key={p.slug}
                  className={`search-result ${i === activeIdx ? 'is-active' : ''}`}
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => handlePick(p)}
                >
                  <div>
                    <div className="search-result__title">{highlight(p.title, query)}</div>
                    <div className="search-result__excerpt">{highlight(p.excerpt, query)}</div>
                  </div>
                  <div className="search-result__meta">
                    <CategoryBadge cat={p.category} />
                  </div>
                </button>
              ))}
              {results.length > 8 && (
                <button
                  className="search-result"
                  onClick={() => { pushRecent(query); onClose(); navigate(seeAllHref); }}
                  style={{ marginTop: 4 }}
                >
                  <div>
                    <div className="search-result__title" style={{ color: 'var(--color-primary-normal)' }}>
                      전체 결과 {results.length}개 모두 보기 →
                    </div>
                  </div>
                  <div className="search-result__meta">
                    <span className="search-kbd">ENTER</span>
                  </div>
                </button>
              )}
            </>
          )}
        </div>

        <div className="search-footer">
          <div className="search-footer__keys">
            <span className="search-footer__key"><span className="search-kbd">↑↓</span> 이동</span>
            <span className="search-footer__key"><span className="search-kbd">↵</span> 선택</span>
            <span className="search-footer__key"><span className="search-kbd">ESC</span> 닫기</span>
          </div>
          <span>실시간 검색</span>
        </div>
      </div>
    </div>
  );
};

/* ─── Search Results Page ─── */
const SearchResultsPage = ({ navigate, query: routeQuery }) => {
  const initialQ = routeQuery.q || '';
  const [q, setQ] = useStateOv(initialQ);
  useEffectOv(() => { setQ(initialQ); }, [initialQ]);

  const results = useMemoOv(() => scoreAndFilter(q), [q]);

  const submit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    pushRecent(q.trim());
    navigate(`/search?q=${encodeURIComponent(q.trim())}`, { replace: true });
  };

  return (
    <main>
      <div className="container search-results-page">
        <div className="search-results-page__head">
          <div className="search-results-page__label">검색 결과</div>
          <h1 className="search-results-page__query">
            <span className="quote">"</span>{q || '검색어 없음'}<span className="quote">"</span>
          </h1>
          <div className="search-results-page__count">
            {q.trim() ? `${results.length}개의 결과` : '검색어를 입력하세요.'}
          </div>
        </div>

        <form className="search-results-page__form" onSubmit={submit}>
          <Icon.Search style={{ color: 'var(--color-label-alternative)' }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="다시 검색…"
            autoFocus
          />
          <button type="submit" className="btn btn--primary" style={{ height: 36, padding: '0 14px' }}>
            검색 <Icon.ArrowRight />
          </button>
        </form>

        {q.trim() && results.length === 0 && (
          <div style={{
            padding: '64px 24px',
            border: '1px dashed var(--color-line-normal)',
            borderRadius: 16,
            textAlign: 'center',
            color: 'var(--color-label-alternative)',
            background: 'var(--color-bg-alternative)',
            maxWidth: 640,
          }}>
            <h3 style={{ margin: '0 0 8px', color: 'var(--color-label-normal)', fontSize: 18 }}>
              일치하는 글이 없어요
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 14 }}>
              철자를 확인하거나, 더 짧은 키워드로 다시 시도해보세요.<br/>
              혹은 아래 추천 태그를 살펴봐도 좋아요.
            </p>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
              {Object.entries(TAG_COUNTS).slice(0, 8).map(([t]) => (
                <span key={t} className="tag" onClick={() => navigate(`/blog?tag=${t}`)}>
                  <Icon.Hash style={{ opacity: 0.55, marginRight: 3 }} />{t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="search-results-page__list">
          {results.map(p => (
            <button key={p.slug} className="list-item" onClick={() => navigate(`/blog/${p.slug}`)}>
              <div className="list-item__meta">
                <CategoryBadge cat={p.category} />
                <span className="list-item__date">{formatDate(p.date)}</span>
                <span style={{ color: 'var(--color-line-strong)' }}>·</span>
                <span className="list-item__date" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Icon.Clock />{p.readTime}분
                </span>
              </div>
              <h3 className="list-item__title">{highlight(p.title, q)}</h3>
              <p className="list-item__excerpt">{highlight(p.excerpt, q)}</p>
              <div className="list-item__tags">
                {p.tags.map(t => <Tag key={t} name={t} />)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};

/* ─── Width Picker Popover ─── */
const WidthIcon = ({ size = 'normal' }) => {
  // 3-bar icon, the center bar grows with the width preset.
  const heights = { narrow: [8, 8, 8], normal: [8, 12, 8], wide: [12, 14, 12] };
  const h = heights[size] || heights.normal;
  return (
    <span className="width-icon">
      <span className="width-icon__bars">
        {h.map((v, i) => (
          <span key={i} className="width-icon__bar" style={{ height: v }} />
        ))}
      </span>
    </span>
  );
};

const WIDTH_OPTIONS = [
  { id: 'narrow', label: '좁게',  hint: '600px · 집중 모드' },
  { id: 'normal', label: '보통',  hint: '720px · 권장' },
  { id: 'wide',   label: '넓게',  hint: '860px · 와이드' },
];

const WidthPicker = ({ value, onChange }) => {
  const [open, setOpen] = useStateOv(false);
  const containerRef = useRefOv(null);

  useEffectOv(() => {
    if (!open) return;
    const onClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="popover-container" ref={containerRef}>
      <button
        className="icon-btn"
        aria-label="본문 너비 설정"
        aria-haspopup="true"
        aria-expanded={open}
        title="본문 너비"
        onClick={() => setOpen(o => !o)}
        style={open ? { background: 'var(--color-fill-normal)', color: 'var(--color-label-strong)' } : {}}
      >
        <WidthIcon size={value} />
      </button>
      {open && (
        <div className="popover" role="menu">
          <div className="popover__title">본문 너비</div>
          {WIDTH_OPTIONS.map(opt => (
            <button
              key={opt.id}
              className={`popover__option ${value === opt.id ? 'is-active' : ''}`}
              role="menuitemradio"
              aria-checked={value === opt.id}
              onClick={() => { onChange(opt.id); setOpen(false); }}
            >
              <span className="popover__option-icon">
                <WidthIcon size={opt.id} />
              </span>
              <span className="popover__option-body">
                <span className="popover__option-label">{opt.label}</span>
                <span className="popover__option-hint">{opt.hint}</span>
              </span>
              <span className="popover__option-check">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

Object.assign(window, { SearchModal, SearchResultsPage, WidthPicker });

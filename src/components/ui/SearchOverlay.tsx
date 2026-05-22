import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import type { BlogPost } from '../../lib/search';
import { searchPosts } from '../../lib/search';
import { CATEGORIES, CATEGORY_LIST, type CategoryId } from '../../lib/categories';

interface Props {
  allPosts: BlogPost[];
}

const RECENT_KEY = 'blog-recent-searches';
const MAX_VISIBLE = 8;

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function pushRecent(q: string): string[] {
  const trimmed = q.trim();
  if (!trimmed) return loadRecent();
  const next = [trimmed, ...loadRecent().filter((x) => x !== trimmed)].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlight(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const re = new RegExp(`(${escapeRe(q)})`, 'gi');
  const parts = text.split(re);
  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase() ? <mark key={i}>{p}</mark> : <Fragment key={i}>{p}</Fragment>
  );
}

export default function SearchOverlay({ allPosts }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => (query.trim() ? searchPosts(allPosts, query) : []), [allPosts, query]);
  const visible = results.slice(0, MAX_VISIBLE);

  // Featured / suggested posts for empty state: top 3 most recent
  const suggested = useMemo(
    () => [...allPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3),
    [allPosts]
  );

  // ── Open hooks: custom event + Cmd/Ctrl+K + '/'
  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (!open && e.key === '/') {
        const tag = (document.activeElement && (document.activeElement as HTMLElement).tagName) || '';
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          setOpen(true);
        }
      }
    };
    document.addEventListener('hongmacho:open-search', onOpen as EventListener);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('hongmacho:open-search', onOpen as EventListener);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // ── On open: load recent, lock body scroll, focus input
  useEffect(() => {
    if (!open) return;
    setRecent(loadRecent());
    setQuery('');
    setActiveIdx(0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // ── Reset active index when query changes
  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  // ── Keep active row visible
  useEffect(() => {
    if (!bodyRef.current) return;
    const el = bodyRef.current.querySelector('.search-result.is-active');
    if (el) (el as HTMLElement).scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  // ── Focus trap
  useEffect(() => {
    if (!open || !modalRef.current) return;
    const root = modalRef.current;
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, [open]);

  function close() {
    setOpen(false);
  }

  function navigate(href: string) {
    window.location.href = href;
  }

  function pickPost(post: BlogPost) {
    pushRecent(query);
    close();
    navigate(`/blog/${post.slug}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(Math.max(visible.length - 1, 0), i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const q = query.trim();
      if (visible.length > 0) {
        pickPost(visible[activeIdx] ?? visible[0]);
      } else if (q) {
        pushRecent(q);
        close();
        navigate(`/search?q=${encodeURIComponent(q)}`);
      }
    }
  }

  function clearRecent() {
    localStorage.removeItem(RECENT_KEY);
    setRecent([]);
  }

  if (!open) return null;

  const trimmed = query.trim();
  const seeAllHref = `/search?q=${encodeURIComponent(trimmed)}`;

  return (
    <div
      ref={overlayRef}
      className="search-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="검색"
    >
      <div ref={modalRef} className="search-modal">
        <div className="search-input-row">
          <span className="search-input-row__icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="제목, 본문 요약, 태그로 검색…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="포스트 검색"
            autoComplete="off"
            spellCheck={false}
          />
          <span className="search-kbd" aria-hidden="true">ESC</span>
        </div>

        <div className="search-body" ref={bodyRef} aria-live="polite" aria-atomic="false">
          {!trimmed && (
            <>
              {recent.length > 0 && (
                <>
                  <div className="search-section-title">최근 검색</div>
                  <div className="search-chip-row">
                    {recent.map((q) => (
                      <button
                        key={q}
                        type="button"
                        className="search-chip"
                        onClick={() => setQuery(q)}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        {q}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="search-chip"
                      style={{ background: 'transparent' }}
                      onClick={clearRecent}
                    >
                      지우기
                    </button>
                  </div>
                </>
              )}

              <div className="search-section-title">카테고리로 둘러보기</div>
              {CATEGORY_LIST.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="search-result"
                  onClick={() => {
                    close();
                    navigate(`/blog?cat=${c.id}`);
                  }}
                >
                  <div>
                    <div className="search-result__title">{c.name} 글 모두 보기</div>
                    <div className="search-result__excerpt">{c.desc}</div>
                  </div>
                  <div className="search-result__meta">
                    <span className="cat-badge" data-cat={c.id}>{c.name}</span>
                  </div>
                </button>
              ))}

              {suggested.length > 0 && (
                <>
                  <div className="search-section-title">추천 글</div>
                  {suggested.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="search-result"
                      onClick={() => pickPost(p)}
                    >
                      <div>
                        <div className="search-result__title">{p.title}</div>
                        <div className="search-result__excerpt">{p.excerpt}</div>
                      </div>
                      <div className="search-result__meta">
                        <span className="cat-badge" data-cat={p.category}>{CATEGORIES[p.category as CategoryId]?.name ?? p.category}</span>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </>
          )}

          {trimmed && results.length === 0 && (
            <div className="search-empty">
              "<strong>{query}</strong>" 에 해당하는 결과가 없습니다.
              <div style={{ marginTop: 12 }}>
                <button
                  type="button"
                  className="search-chip"
                  onClick={() => {
                    pushRecent(query);
                    close();
                    navigate(seeAllHref);
                  }}
                >
                  전체 검색 결과 페이지 열기
                </button>
              </div>
            </div>
          )}

          {trimmed && results.length > 0 && (
            <>
              <div className="search-section-title">결과 {results.length}개 — 글</div>
              {visible.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  className={`search-result ${i === activeIdx ? 'is-active' : ''}`}
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => pickPost(p)}
                >
                  <div>
                    <div className="search-result__title">{highlight(p.title, query)}</div>
                    <div className="search-result__excerpt">{highlight(p.excerpt, query)}</div>
                  </div>
                  <div className="search-result__meta">
                    <span className="cat-badge" data-cat={p.category}>{CATEGORIES[p.category as CategoryId]?.name ?? p.category}</span>
                  </div>
                </button>
              ))}
              {results.length > MAX_VISIBLE && (
                <button
                  type="button"
                  className="search-result"
                  style={{ marginTop: 4 }}
                  onClick={() => {
                    pushRecent(query);
                    close();
                    navigate(seeAllHref);
                  }}
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
}

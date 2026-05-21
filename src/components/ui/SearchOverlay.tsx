import { useState, useEffect, useRef } from 'react';
import type { BlogPost } from '../../lib/search';
import { searchPosts } from '../../lib/search';
import { formatDate } from '../../lib/utils';
import './SearchOverlay.css';

interface SearchOverlayProps {
  allPosts: BlogPost[];
}

function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

export default function SearchOverlay({ allPosts }: SearchOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BlogPost[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('blog-recent-searches');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed);
        }
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll selected result into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const selectedElement = resultsContainerRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      ) as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const displayResults =
    query.trim() === '' ? recentSearches.map((q) => q) : results.map((r) => r.title);
  const actualResults = query.trim() === '' ? [] : results;

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      const searchResults = searchPosts(allPosts, value);
      setResults(searchResults);
      setSelectedIndex(0);
    } else {
      setResults([]);
      setSelectedIndex(0);
    }
  };

  const saveSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(
      0,
      5
    );
    setRecentSearches(updated);
    localStorage.setItem('blog-recent-searches', JSON.stringify(updated));
  };

  const handleSelectResult = (post: BlogPost) => {
    saveSearch(query);
    window.location.href = `/blog/${post.slug}`;
  };

  const handleSelectRecent = (recentQuery: string) => {
    setQuery(recentQuery);
    const searchResults = searchPosts(allPosts, recentQuery);
    setResults(searchResults);
    setSelectedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const maxIndex = query.trim() === '' ? recentSearches.length : results.length;
      setSelectedIndex((prev) => Math.min(maxIndex - 1, prev + 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim() === '' && selectedIndex < recentSearches.length) {
        handleSelectRecent(recentSearches[selectedIndex]);
      } else if (query.trim() !== '' && selectedIndex < results.length) {
        handleSelectResult(results[selectedIndex]);
      }
    }
  };

  // Global keydown listener for '/' or Cmd+K to open modal
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!isOpen && (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'))) {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="search-overlay">
      <div className="search-overlay__backdrop" onClick={() => setIsOpen(false)} />
      <div className="search-overlay__modal">
        <div className="search-overlay__header">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search posts..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-overlay__input"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="search-overlay__close"
            aria-label="Close search"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="search-overlay__body" ref={resultsContainerRef}>
          {query.trim() === '' ? (
            <div className="search-overlay__section">
              <div className="search-overlay__section-title">Recent Searches</div>
              {recentSearches.length > 0 ? (
                <ul className="search-overlay__list">
                  {recentSearches.map((recentQuery, index) => (
                    <li key={index}>
                      <button
                        className={`search-overlay__result search-overlay__result--recent ${
                          selectedIndex === index ? 'is-selected' : ''
                        }`}
                        onClick={() => handleSelectRecent(recentQuery)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        data-index={index}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="23 4 23 10 17 10" />
                          <path d="M20.49 15a9 9 0 1 1-2-8.12" />
                        </svg>
                        <span>{recentQuery}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="search-overlay__empty">No recent searches</p>
              )}
            </div>
          ) : results.length > 0 ? (
            <div className="search-overlay__section">
              <div className="search-overlay__section-title">
                {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
              </div>
              <ul className="search-overlay__list">
                {results.map((post, index) => (
                  <li key={post.id}>
                    <button
                      className={`search-overlay__result ${
                        selectedIndex === index ? 'is-selected' : ''
                      }`}
                      onClick={() => handleSelectResult(post)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      data-index={index}
                    >
                      <div className="search-overlay__result-meta">
                        <span className="cat-badge">{post.category}</span>
                        <span className="search-overlay__date">{formatDate(post.date)}</span>
                      </div>
                      <h4 className="search-overlay__result-title">{post.title}</h4>
                      <p
                        className="search-overlay__result-excerpt"
                        dangerouslySetInnerHTML={{
                          __html: highlightText(post.excerpt, query),
                        }}
                      />
                      {post.tags.length > 0 && (
                        <div className="search-overlay__tags">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="search-overlay__tag">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="search-overlay__empty-state">
              <p>No results found for &quot;{query}&quot;</p>
              <p className="search-overlay__empty-hint">Try different keywords</p>
            </div>
          )}
        </div>

        <div className="search-overlay__footer">
          <div className="search-overlay__shortcuts">
            <span className="search-overlay__shortcut">
              <kbd>↑↓</kbd> Navigate
            </span>
            <span className="search-overlay__shortcut">
              <kbd>Enter</kbd> Select
            </span>
            <span className="search-overlay__shortcut">
              <kbd>Esc</kbd> Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';

interface TocItem {
  depth: number;
  text: string;
  slug: string;
}

interface Props {
  toc: TocItem[];
}

export default function TOC({ toc }: Props) {
  const [activeSlug, setActiveSlug] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (toc.length === 0) return;

    const headingEls = toc
      .map((item) => document.getElementById(item.slug))
      .filter((el): el is HTMLElement => el !== null);

    if (headingEls.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((prev, curr) =>
            prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr
          );
          setActiveSlug(topmost.target.id);
        }
      },
      {
        rootMargin: '-88px 0px -60% 0px',
        threshold: 0,
      }
    );

    headingEls.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav className="toc" aria-label="목차">
      <div className="toc__title">목차</div>
      <ul className="toc__list">
        {toc.map((item) => (
          <li key={item.slug}>
            <a
              href={`#${item.slug}`}
              className={[
                'toc__item',
                item.depth === 3 ? 'toc__item--h3' : '',
                activeSlug === item.slug ? 'is-active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(item.slug);
                if (!el) return;
                const top = el.getBoundingClientRect().top + window.scrollY - 88;
                window.scrollTo({ top, behavior: 'smooth' });
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

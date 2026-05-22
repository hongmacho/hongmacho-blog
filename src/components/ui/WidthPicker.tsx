import { useEffect, useRef, useState } from 'react';

type WidthId = 'narrow' | 'normal' | 'wide';

const ID_TO_PX: Record<WidthId, string> = {
  narrow: '600px',
  normal: '720px',
  wide: '860px',
};

const PX_TO_ID: Record<string, WidthId> = {
  '600px': 'narrow',
  '720px': 'normal',
  '860px': 'wide',
};

const OPTIONS: { id: WidthId; label: string; hint: string }[] = [
  { id: 'narrow', label: '좁게', hint: '600px · 집중 모드' },
  { id: 'normal', label: '보통', hint: '720px · 권장' },
  { id: 'wide', label: '넓게', hint: '860px · 와이드' },
];

const HEIGHTS: Record<WidthId, [number, number, number]> = {
  narrow: [8, 8, 8],
  normal: [8, 12, 8],
  wide: [12, 14, 12],
};

function WidthIcon({ size }: { size: WidthId }) {
  const h = HEIGHTS[size];
  return (
    <span className="width-icon" aria-hidden="true">
      <span className="width-icon__bars">
        {h.map((v, i) => (
          <span key={i} className="width-icon__bar" style={{ height: v }} />
        ))}
      </span>
    </span>
  );
}

export default function WidthPicker() {
  const [value, setValue] = useState<WidthId>('normal');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('blog-content-width');
    if (stored && PX_TO_ID[stored]) {
      setValue(PX_TO_ID[stored]);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  function handleChange(next: WidthId) {
    setValue(next);
    const px = ID_TO_PX[next];
    localStorage.setItem('blog-content-width', px);
    document.documentElement.style.setProperty('--content-width', px);
    setOpen(false);
  }

  return (
    <div ref={ref} className="popover-container">
      <button
        type="button"
        className="icon-btn"
        aria-label="본문 너비 설정"
        aria-haspopup="menu"
        aria-expanded={open}
        title="본문 너비"
        onClick={() => setOpen((o) => !o)}
        style={open ? { background: 'var(--color-fill-normal)', color: 'var(--color-label-strong)' } : undefined}
      >
        <WidthIcon size={value} />
      </button>

      {open && (
        <div className="popover" role="menu" aria-label="본문 너비 선택">
          <div className="popover__title">본문 너비</div>
          {OPTIONS.map((opt) => {
            const active = value === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                className={`popover__option ${active ? 'is-active' : ''}`}
                role="menuitemradio"
                aria-checked={active}
                onClick={() => handleChange(opt.id)}
              >
                <span className="popover__option-icon">
                  <WidthIcon size={opt.id} />
                </span>
                <span className="popover__option-body">
                  <span className="popover__option-label">{opt.label}</span>
                  <span className="popover__option-hint">{opt.hint}</span>
                </span>
                <span className="popover__option-check" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

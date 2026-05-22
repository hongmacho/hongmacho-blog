/* Hero background variants — V1–V11. */

/* ─────────────── V1 — Aurora drift (original) ─────────────── */
const HeroBGAurora = () => (
  <>
    <div className="hero__bg-grid" aria-hidden="true"/>
    <div className="hero__sweep" aria-hidden="true"/>
    <div className="hero__aurora hero__aurora--blue" aria-hidden="true"/>
    <div className="hero__aurora hero__aurora--violet" aria-hidden="true"/>
    <div className="hero__aurora hero__aurora--teal" aria-hidden="true"/>
    <div className="hero__aurora hero__aurora--pink" aria-hidden="true"/>
    <div className="hero__words" aria-hidden="true">
      <span className="hero__word hero__word--dev">개발</span>
      <span className="hero__word hero__word--invest">투자</span>
      <span className="hero__word hero__word--learn">학습</span>
      <span className="hero__word hero__word--daily">일상</span>
    </div>
    <span className="hero__dot hero__dot--a" aria-hidden="true"/>
    <span className="hero__dot hero__dot--b" aria-hidden="true"/>
    <span className="hero__dot hero__dot--c" aria-hidden="true"/>
    <span className="hero__dot hero__dot--d" aria-hidden="true"/>
    <div className="hero__scan" aria-hidden="true"/>
  </>
);

/* ─────────────── V2 — Marquee tapestry ─────────────── */
const MARQUEE_ROW_1 = ['JAVA', 'KOTLIN', 'SPRING BOOT', 'JPA', 'DOCKER', 'POSTGRES', 'REDIS', 'GRAPHQL'];
const MARQUEE_ROW_2 = ['개발', '투자', '학습', '일상', '회고', '백테스트', '메모', '코드 리뷰'];
const MARQUEE_ROW_3 = ['quant', 'factor', 'reading', 'refactor', 'system design', 'monad', 'compose'];

const MarqueeRow = ({ items, className }) => {
  const doubled = [...items, ...items];
  return (
    <div className={`marquee-row ${className}`} aria-hidden="true">
      {doubled.map((it, i) => <span key={i}>{it}</span>)}
    </div>
  );
};

const HeroBGMarquee = () => (
  <>
    <div className="hero__lanes" aria-hidden="true">
      <MarqueeRow items={MARQUEE_ROW_1} className="marquee-row--1" />
      <MarqueeRow items={MARQUEE_ROW_2} className="marquee-row--2" />
      <MarqueeRow items={MARQUEE_ROW_3} className="marquee-row--3" />
    </div>
    <div className="hero__vignette" aria-hidden="true"/>
  </>
);

/* ─────────────── V3 — Wireframe grid ─────────────── */
const HeroBGGrid = () => (
  <>
    <div className="hero__sky" aria-hidden="true"/>
    <div className="hero__plane-wrap" aria-hidden="true">
      <div className="hero__grid-plane"/>
    </div>
    <div className="hero__horizon" aria-hidden="true"/>
    <div className="hero__scan-beam" aria-hidden="true"/>
    <svg className="hero__shape hero__shape--hex" viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,4 92,28 92,72 50,96 8,72 8,28"
        fill="none" stroke="currentColor" strokeWidth="1.4"
        style={{ color: 'var(--color-primary-normal)', opacity: 0.7 }}/>
    </svg>
    <div className="hero__shape hero__shape--ring" aria-hidden="true"
      style={{ color: 'var(--color-primary-normal)' }}/>
    <svg className="hero__shape hero__shape--tri" viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,8 92,86 8,86"
        fill="none" stroke="currentColor" strokeWidth="1.4"
        style={{ color: 'var(--cat-learn)', opacity: 0.7 }}/>
    </svg>
  </>
);

/* ─────────────── V4 — Matrix code rain ─────────────── */
const MATRIX_COLUMN_COUNT = 18;

const HeroBGMatrix = () => {
  // Use the 15 most recent post titles as the falling text — each column
  // shows one title, character-stacked. With 18 columns and 15 posts we
  // cycle the last few. Long titles get truncated to ~22 chars so column
  // heights stay similar.
  const cols = React.useMemo(() => {
    const titles = POSTS.slice(0, 15).map(p => p.title.replace(/\s+/g, ' ').trim().slice(0, 22));
    return Array.from({ length: MATRIX_COLUMN_COUNT }, (_, i) => {
      const title = titles[i % titles.length];
      const rnd = (k) => Math.abs(Math.sin(i * 9.7 + k * 1.3));
      return {
        chars: [...title],
        left:  (i / MATRIX_COLUMN_COUNT) * 100 + (Math.sin(i * 3.7) * 1.5),
        dur:   8 + rnd(0) * 10,      // 8–18s
        delay: -(rnd(1) * 14),
        opacity: 0.55 + rnd(2) * 0.45,
      };
    });
  }, []);
  return (
    <div className="matrix-rain" aria-hidden="true">
      {cols.map((c, i) => (
        <div
          key={i}
          className="matrix-col"
          style={{
            left: `${c.left}%`,
            opacity: c.opacity,
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
          }}
        >
          {c.chars.map((ch, j) => (
            <span key={j}>{ch === ' ' ? '\u00A0' : ch}</span>
          ))}
        </div>
      ))}
    </div>
  );
};

/* ─────────────── V7 — Terminal ASCII ─────────────── */
const HeroBGTerminal = () => (
  <>
    <div className="terminal-bg" aria-hidden="true">
      <div className="terminal-glow"/>
    </div>
    <div className="terminal-block" aria-hidden="true">
      <div className="terminal-block__dots"><span/><span/><span/></div>
      <div><span className="terminal-prompt">$</span> astro dev</div>
      <div className="terminal-comment">  ➜ Local:    http://localhost:4321/</div>
      <div className="terminal-comment">  ➜ Network:  use --host to expose</div>
      <div><span className="terminal-prompt">$</span> cat about.md</div>
      <div># 홍마초의 잡생각</div>
      <div className="terminal-comment">  개발, 투자, 학습 그리고 일상</div>
      <div><span className="terminal-prompt">$</span> grep -r "spring" posts/</div>
      <div className="terminal-comment">  → 3 matches in posts/</div>
      <div><span className="terminal-prompt">$</span> <span className="terminal-typed">build --new-post "잡생각"</span><span className="terminal-cursor"/></div>
    </div>
  </>
);

/* ─────────────── V8 — Layered waves ─────────────── */
const wavePath =
  'M0,80 C150,40 350,120 500,80 C650,40 850,120 1000,80 C1150,40 1350,120 1500,80 ' +
  'C1650,40 1850,120 2000,80 L2000,200 L0,200 Z';

const HeroBGWave = () => (
  <div className="wave-stack" aria-hidden="true">
    <svg className="wave-1" viewBox="0 0 2000 200" preserveAspectRatio="none">
      <path d={wavePath} fill="var(--cat-dev)" />
    </svg>
    <svg className="wave-2" viewBox="0 0 2000 200" preserveAspectRatio="none">
      <path d={wavePath} fill="var(--c-violet-50)" style={{ transform: 'translateY(20px)' }}/>
    </svg>
    <svg className="wave-3" viewBox="0 0 2000 200" preserveAspectRatio="none">
      <path d={wavePath} fill="#14b8a6" style={{ transform: 'translateY(40px)' }}/>
    </svg>
    <svg className="wave-4" viewBox="0 0 2000 200" preserveAspectRatio="none">
      <path d={wavePath} fill="var(--c-blue-50)" style={{ transform: 'translateY(80px)' }}/>
    </svg>
  </div>
);

/* ─────────────── V9 — Constellation network ─────────────── */
const HeroBGConstellation = () => {
  const W = 1600, H = 800;
  // 20 nodes
  const nodes = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 22; i++) {
      const rnd = (k) => Math.abs(Math.sin(i * 13.7 + k * 5.3));
      arr.push({
        x: rnd(1) * W,
        y: rnd(2) * H,
        r: 2 + rnd(3) * 3,
        cat: ['', 'violet', 'teal', 'amber'][i % 4],
      });
    }
    return arr;
  }, []);
  // connect nearby
  const links = React.useMemo(() => {
    const out = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 240) out.push({ i, j, d });
      }
    }
    return out;
  }, [nodes]);
  return (
    <svg className="constellation-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {links.map((l, i) => (
        <line
          key={i}
          x1={nodes[l.i].x} y1={nodes[l.i].y}
          x2={nodes[l.j].x} y2={nodes[l.j].y}
          className="constellation-line"
          style={{ animationDelay: `${(i * 0.13) % 4}s` }}
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x} cy={n.y} r={n.r}
          className={`constellation-node ${n.cat ? 'constellation-node--' + n.cat : ''}`}
          style={{ animationDelay: `${(i * 0.4) % 6}s` }}
        />
      ))}
    </svg>
  );
};

/* ─────────────── V11 — Tree (knowledge graph) ─────────────── */
const TREE_LAYOUT = (() => {
  // Layout in a 1600×800 viewport (xMidYMid slice). Keep all node x in
  // [460, 1230] so even at narrow viewports the slice crop still shows
  // every node. Tree is biased right-of-center so hero copy on the left
  // doesn't fight with the graph.
  const cx = 900, cy = 400;
  const cats = [
    { id: 'dev',    label: '개발',  x: 1080, y: 200,
      leaves: [
        { label: 'Spring',  x: 1230, y: 110 },
        { label: 'Kotlin',  x: 1230, y: 250 },
        { label: 'Docker',  x: 1170, y: 380 },
      ],
    },
    { id: 'invest', label: '투자',  x: 1150, y: 440,
      leaves: [
        { label: '백테스트',  x: 1230, y: 380 },
        { label: '팩터',     x: 1220, y: 540 },
        { label: '포트폴리오', x: 1110, y: 660 },
      ],
    },
    { id: 'learn',  label: '학습',  x: 970,  y: 630,
      leaves: [
        { label: '책',    x: 1080, y: 740 },
        { label: '강의',  x: 880,  y: 760 },
        { label: '메모',  x: 720,  y: 720 },
      ],
    },
    { id: 'daily',  label: '일상',  x: 670,  y: 380,
      leaves: [
        { label: '회고',  x: 540, y: 270 },
        { label: '추천',  x: 500, y: 410 },
        { label: '습관',  x: 570, y: 560 },
      ],
    },
  ];
  return { cx, cy, cats };
})();

const HeroBGTree = () => {
  const { cx, cy, cats } = TREE_LAYOUT;

  // Mouse parallax is wired by HomePage — we just read --mx/--my via CSS.

  // Cubic curve from a → b (gentle s-curve)
  const curve = (a, b) => {
    const dx = b.x - a.x, dy = b.y - a.y;
    const off = 0.25;
    const c1x = a.x + dx * 0.5 + dy * off * -0.2;
    const c1y = a.y + dy * 0.5 - dx * off * -0.2;
    return `M${a.x},${a.y} Q${c1x},${c1y} ${b.x},${b.y}`;
  };

  return (
    <div className="tree-wrap" aria-hidden="true">
    <svg className="tree-svg" viewBox="0 0 1600 800" preserveAspectRatio="xMidYMid slice">
      {/* Edges first so nodes sit on top */}
      {cats.map((cat, ci) => (
        <g key={cat.id}>
          {/* root → category */}
          <path
            className={`tree-link tree-link--${cat.id}`}
            d={curve({ x: cx, y: cy }, { x: cat.x, y: cat.y })}
            style={{ animationDelay: `${ci * 0.4}s` }}
          />
          {/* category → leaves */}
          {cat.leaves.map((leaf, li) => (
            <path
              key={li}
              className={`tree-link tree-link--${cat.id}`}
              d={curve({ x: cat.x, y: cat.y }, leaf)}
              style={{ animationDelay: `${ci * 0.4 + li * 0.25 + 0.6}s`, opacity: 0.7 }}
            />
          ))}
        </g>
      ))}

      {/* Root node */}
      <g className="tree-node tree-node--root">
        <rect className="tree-node__pill tree-node__pill--root"
          x={cx - 76} y={cy - 26} width="152" height="52" rx="26" />
        <text className="tree-node__label tree-node__label--root" x={cx} y={cy + 1}>잡생각</text>
      </g>

      {/* Category nodes */}
      {cats.map((cat) => (
        <g key={cat.id} className="tree-node tree-node--cat">
          <rect className={`tree-node__pill tree-node__pill--${cat.id}`}
            x={cat.x - 54} y={cat.y - 22} width="108" height="44" rx="22" />
          <text className="tree-node__label" x={cat.x} y={cat.y + 1}>{cat.label}</text>
        </g>
      ))}

      {/* Leaf nodes */}
      {cats.flatMap((cat, ci) =>
        cat.leaves.map((leaf, li) => {
          const w = Math.max(72, leaf.label.length * 18 + 28);
          return (
            <g key={`${ci}-${li}`} className="tree-node tree-node--leaf">
              <rect className={`tree-node__pill tree-node__pill--${cat.id}`}
                x={leaf.x - w / 2} y={leaf.y - 17} width={w} height="34" rx="17" />
              <text className="tree-node__label tree-node__label--small"
                x={leaf.x} y={leaf.y + 1}>{leaf.label}</text>
              <circle
                className="tree-node__leaf-dot"
                cx={leaf.x + w / 2 - 8} cy={leaf.y} r="3"
                fill={`var(--cat-${cat.id})`}
                style={{ animationDelay: `${(ci * 3 + li) * 0.3}s` }}
              />
            </g>
          );
        })
      )}
    </svg>
    </div>
  );
};

/* ─────────────── V12 — Spotlight (mouse reveals hidden keywords) ─────────────── */
const SPOTLIGHT_WORDS = [
  '개발', 'Spring', 'JPA', 'Kotlin',
  '투자', '백테스트', '팩터', '복리',
  '학습', '책', '메모', '강의',
  '일상', '회고', '추천', '습관',
  'Docker', 'Astro', 'Java', '퀀트',
  '리팩터', '시스템', 'Redis', '습관',
];
const HeroBGSpotlight = () => (
  <>
    <div className="spotlight-reveal" aria-hidden="true">
      {SPOTLIGHT_WORDS.map((w, i) => <span key={i}>{w}</span>)}
    </div>
    <div className="spotlight-cursor" aria-hidden="true"/>
  </>
);

/* ─────────────── V14 — Ripple Grid ─────────────── */
const HeroBGRipple = () => (
  <>
    <div className="ripple-grid" aria-hidden="true"/>
    <div className="ripple-spot" aria-hidden="true"/>
    <div className="ripple-rings" aria-hidden="true"/>
  </>
);

/* ─────────────── V15 — Magnetic Words ─────────────── */
const HeroBGMagnet = () => (
  <>
    <div className="magnet-field" aria-hidden="true">
      <span className="magnet-word magnet-word--dev">개발</span>
      <span className="magnet-word magnet-word--invest">투자</span>
      <span className="magnet-word magnet-word--learn">학습</span>
      <span className="magnet-word magnet-word--daily">일상</span>
      <span className="magnet-word magnet-word--alt1">잡생각</span>
      <span className="magnet-word magnet-word--alt2">{`{ code }`}</span>
    </div>
    <div className="magnet-cursor-dot" aria-hidden="true"/>
  </>
);

/* ─────────────── V16 — Compass (rotating rings + needle) ─────────────── */
const HeroBGCompass = () => (
  <div className="compass-stage" aria-hidden="true">
    <div className="compass-rings">
      <div className="compass-ring compass-ring--1"/>
      <div className="compass-ring compass-ring--2"/>
      <div className="compass-ring compass-ring--3"/>
      <div className="compass-ring compass-ring--4"/>
      <div className="compass-ring compass-ring--5"/>
      <div className="compass-needle"/>
      <div className="compass-core"/>
      <span className="compass-cardinal compass-cardinal--n">개발</span>
      <span className="compass-cardinal compass-cardinal--e">투자</span>
      <span className="compass-cardinal compass-cardinal--s">학습</span>
      <span className="compass-cardinal compass-cardinal--w">일상</span>
    </div>
  </div>
);

const HERO_VARIANTS = {
  aurora:       { label: 'V1 · Aurora',       Component: HeroBGAurora,       caption: '블롭 + 떠다니는 한글 ghost' },
  marquee:      { label: 'V2 · Marquee',      Component: HeroBGMarquee,      caption: '3-레인 타이포 마키' },
  grid:         { label: 'V3 · Grid',         Component: HeroBGGrid,         caption: '원근 와이어프레임 + scan' },
  matrix:       { label: 'V4 · Matrix',       Component: HeroBGMatrix,       caption: '글 제목 코드 레인' },
  terminal:     { label: 'V7 · Terminal',     Component: HeroBGTerminal,     caption: 'ASCII + 타이핑' },
  wave:         { label: 'V8 · Wave',         Component: HeroBGWave,         caption: '레이어드 SVG 물결' },
  constellation:{ label: 'V9 · Constellation',Component: HeroBGConstellation,caption: 'SVG 파티클 네트워크' },
  tree:         { label: 'V11 · Tree',        Component: HeroBGTree,         caption: '키워드 트리 (마우스 인터랙티브)' },
  spotlight:    { label: 'V12 · Spotlight',   Component: HeroBGSpotlight,    caption: '커서로 비추는 손전등' },
  ripple:       { label: 'V14 · Ripple',      Component: HeroBGRipple,       caption: '도트 그리드 + 잔물결' },
  magnet:       { label: 'V15 · Magnet',      Component: HeroBGMagnet,       caption: '커서 따라 떠다니는 한글' },
  compass:      { label: 'V16 · Compass',     Component: HeroBGCompass,      caption: '회전 동심원 + 나침반' },
};

Object.assign(window, {
  HeroBGAurora, HeroBGMarquee, HeroBGGrid, HeroBGMatrix,
  HeroBGTerminal, HeroBGWave, HeroBGConstellation, HeroBGTree,
  HeroBGSpotlight, HeroBGRipple, HeroBGMagnet, HeroBGCompass,
  HERO_VARIANTS,
});

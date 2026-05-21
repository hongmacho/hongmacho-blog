/* Page components — Home, BlogList, Article, About, NotFound. */

const { useState: useStatePages, useEffect: useEffectPages, useMemo, useRef: useRefPages } = React;

/* ─── Home ─── */
const HomePage = ({ navigate, heroVariant = 'aurora' }) => {
  const latest = POSTS.slice(0, 3);
  const variant = HERO_VARIANTS[heroVariant] || HERO_VARIANTS.aurora;
  const HeroBG = variant.Component;
  const heroRef = React.useRef(null);

  // Mouse-driven parallax: write smoothed CSS variables to the .hero
  // element so every variant can read them.
  //   --mx, --my     :  -0.5 to 0.5 (unitless fraction from hero center)
  //   --mx-pct       :  0% to 100% (cursor x as percent of hero width)
  //   --my-pct       :  0% to 100%
  //   --mx-px / -py  :  absolute px from hero top-left
  //   --m-deg        :  angle from center to cursor, in degrees
  React.useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let target = { x: 0, y: 0, px: 0, py: 0, w: 0, h: 0 };
    let current = { x: 0, y: 0 };
    let raf = 0;

    const measure = () => {
      const r = hero.getBoundingClientRect();
      target.w = r.width; target.h = r.height;
    };
    measure();

    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      target.w = r.width; target.h = r.height;
      target.px = e.clientX - r.left;
      target.py = e.clientY - r.top;
      target.x = Math.max(-0.5, Math.min(0.5, target.px / r.width  - 0.5));
      target.y = Math.max(-0.5, Math.min(0.5, target.py / r.height - 0.5));
    };
    const onLeave = () => { target.x = 0; target.y = 0; target.px = target.w / 2; target.py = target.h / 2; };
    const tick = () => {
      current.x += (target.x - current.x) * 0.10;
      current.y += (target.y - current.y) * 0.10;
      hero.style.setProperty('--mx', current.x.toFixed(3));
      hero.style.setProperty('--my', current.y.toFixed(3));
      hero.style.setProperty('--mx-pct', `${((current.x + 0.5) * 100).toFixed(2)}%`);
      hero.style.setProperty('--my-pct', `${((current.y + 0.5) * 100).toFixed(2)}%`);
      hero.style.setProperty('--mx-px', `${(current.x * target.w + target.w / 2).toFixed(1)}px`);
      hero.style.setProperty('--my-px', `${(current.y * target.h + target.h / 2).toFixed(1)}px`);
      // angle from center (atan2). Useful for compass-style rotations.
      const deg = (Math.atan2(current.y, current.x) * 180 / Math.PI).toFixed(1);
      hero.style.setProperty('--m-deg', `${deg}deg`);
      raf = requestAnimationFrame(tick);
    };

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', measure);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', measure);
      ['--mx','--my','--mx-pct','--my-pct','--mx-px','--my-px','--m-deg']
        .forEach(k => hero.style.removeProperty(k));
    };
  }, []);

  return (
    <main>
      <section className={`hero hero--${heroVariant}`} ref={heroRef}>
        {/* Animated background — selected variant */}
        <HeroBG />

        <div className="container">
          <div className="hero__greeting">지금 글을 쓰고 있어요</div>
          <h1 className="hero__title">
            개발, 투자, 학습<span className="accent">.</span><br/>
            그리고 일상의 기록<span className="hero__caret" aria-hidden="true"/>
          </h1>
          <p className="hero__sub">
            홍마초의 잡생각입니다. Spring Boot로 만든 서비스를 운영하고, 퀀트 투자 백테스트를 돌리고, 책을 읽다 떠오른 메모를 남기는 곳. 너무 다듬지 않은, 진행 중인 생각들을 모아둡니다.
          </p>
          <div className="hero__cta-row">
            <a className="btn btn--white" href="#/blog" onClick={(e) => { e.preventDefault(); navigate('/blog'); }}>
              최신 글 보기 <Icon.ArrowRight />
            </a>
            <a className="btn btn--ghost" href="#/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>
              About
            </a>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-alternative)', borderTop: '1px solid var(--color-line-alternative)', borderBottom: '1px solid var(--color-line-alternative)' }}>
        <div className="container">
          <div className="section__head">
            <div>
              <h2 className="section__title">카테고리</h2>
              <p className="section__sub">관심 있는 주제로 바로 들어가 보세요.</p>
            </div>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                className="cat-card"
                style={{ '--cat-color': CAT_COLOR[c.id] }}
                onClick={() => navigate(`/blog?cat=${c.id}`)}
              >
                <span className="cat-card__label">{c.id}</span>
                <h3 className="cat-card__name">{c.name}</h3>
                <p className="cat-card__desc">{c.desc}</p>
                <span className="cat-card__count">{CAT_COUNTS[c.id]}개의 글 →</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head">
            <div>
              <h2 className="section__title">최신 글</h2>
              <p className="section__sub">최근에 새로 올라온 글들입니다.</p>
            </div>
            <a className="section__link" href="#/blog" onClick={(e) => { e.preventDefault(); navigate('/blog'); }}>
              전체 보기 <Icon.ArrowRight />
            </a>
          </div>
          <div className="post-grid">
            {latest.map(p => (
              <PostCard key={p.slug} post={p} navigate={navigate} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

/* ─── Blog list ─── */
const BlogListPage = ({ navigate, query }) => {
  const [activeCat, setActiveCat] = useStatePages(query.cat || 'all');
  const [activeTag, setActiveTag] = useStatePages(query.tag || null);

  useEffectPages(() => {
    setActiveCat(query.cat || 'all');
    setActiveTag(query.tag || null);
  }, [query.cat, query.tag]);

  const filtered = useMemo(() => {
    return POSTS.filter(p => {
      if (activeCat !== 'all' && p.category !== activeCat) return false;
      if (activeTag && !p.tags.includes(activeTag)) return false;
      return true;
    });
  }, [activeCat, activeTag]);

  const setCat = (id) => {
    setActiveCat(id);
    setActiveTag(null);
    const q = id === 'all' ? '' : `?cat=${id}`;
    navigate(`/blog${q}`, { replace: true });
  };

  const setTag = (t) => {
    setActiveTag(t);
    navigate(`/blog?tag=${t}`, { replace: true });
  };

  const popularTags = Object.entries(TAG_COUNTS)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  const headTitle = activeTag
    ? `#${activeTag}`
    : activeCat === 'all'
      ? '전체 글'
      : `${catName(activeCat)} 글`;

  const headSub = activeTag
    ? `'${activeTag}' 태그가 달린 글 ${filtered.length}개`
    : `총 ${filtered.length}개의 글`;

  return (
    <main>
      <div className="page-head">
        <div className="container">
          <h1 className="page-head__title">{headTitle}</h1>
          <p className="page-head__sub">{headSub}</p>
        </div>
      </div>
      <div className="container blog-layout">
        <aside className="sidebar" aria-label="필터">
          <div>
            <div className="sidebar__title">카테고리</div>
            <div className="sidebar__list">
              <button className={`sidebar__item ${activeCat === 'all' ? 'is-active' : ''}`} onClick={() => setCat('all')}>
                <span><span className="dot" style={{ background: 'var(--color-label-alternative)' }}/>전체</span>
                <span className="count">{POSTS.length}</span>
              </button>
              {CATEGORIES.map(c => (
                <button
                  key={c.id}
                  className={`sidebar__item ${activeCat === c.id ? 'is-active' : ''}`}
                  style={{ '--cat-color': CAT_COLOR[c.id] }}
                  onClick={() => setCat(c.id)}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <span className="dot" />{c.name}
                  </span>
                  <span className="count">{CAT_COUNTS[c.id]}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="sidebar__title">인기 태그</div>
            <div className="sidebar__tag-cloud">
              {popularTags.map(([t, n]) => (
                <span
                  key={t}
                  className="tag"
                  style={activeTag === t ? { background: 'var(--color-primary-normal)', color: 'var(--color-primary-on)' } : {}}
                  onClick={() => setTag(t)}
                >
                  <Icon.Hash style={{ opacity: 0.55, marginRight: 3 }} />{t}
                </span>
              ))}
            </div>
          </div>
        </aside>
        <div className="blog-list">
          {filtered.length === 0 ? (
            <div style={{ padding: '64px 0', textAlign: 'center', color: 'var(--color-label-alternative)' }}>
              해당 조건의 글이 아직 없습니다.
            </div>
          ) : (
            filtered.map(p => <ListItem key={p.slug} post={p} navigate={navigate} />)
          )}
        </div>
      </div>
    </main>
  );
};

/* ─── Article ─── */
const ArticlePage = ({ slug, navigate }) => {
  const post = POSTS.find(p => p.slug === slug);
  const articleRef = useRefPages(null);
  const [activeHeading, setActiveHeading] = useStatePages(null);

  if (!post) return <NotFoundPage navigate={navigate} />;

  const isFeatured = post.body === 'long-astro-post';
  const toc = isFeatured ? AstroPostTOC : GenericPostTOC;
  const BodyComp = isFeatured ? AstroPostBody : () => <GenericPostBody post={post} />;

  // Scroll spy for TOC
  useEffectPages(() => {
    const handler = () => {
      const headings = toc.map(t => document.getElementById(t.id)).filter(Boolean);
      const offset = 120;
      let current = null;
      for (const h of headings) {
        const rect = h.getBoundingClientRect();
        if (rect.top - offset <= 0) current = h.id;
      }
      setActiveHeading(current || (headings[0] && headings[0].id));
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [toc]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top - 88;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  // Related = same category, exclude current
  const related = POSTS.filter(p => p.category === post.category && p.slug !== post.slug).slice(0, 2);

  return (
    <main>
      <div className="article-layout">
        <aside className="toc" aria-label="목차">
          <div className="toc__title">목차</div>
          <ul className="toc__list">
            {toc.map(item => (
              <li key={item.id}>
                <button
                  className={`toc__item ${item.level === 3 ? 'toc__item--h3' : ''} ${activeHeading === item.id ? 'is-active' : ''}`}
                  onClick={() => scrollTo(item.id)}
                >
                  {item.text}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <article className="article" ref={articleRef}>
          <header className="article__header">
            <div className="article__meta-top">
              <CategoryBadge cat={post.category} />
              <span style={{ color: 'var(--color-label-alternative)', fontSize: 13 }}>{formatDate(post.date)}</span>
              <span style={{ color: 'var(--color-line-strong)' }}>·</span>
              <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center', color: 'var(--color-label-alternative)', fontSize: 13 }}>
                <Icon.Clock /> {post.readTime}분 읽기
              </span>
            </div>
            <h1 className="article__title">{post.title}</h1>
            <p className="article__excerpt">{post.excerpt}</p>
            <div className="article__byline">
              <span className="article__avatar" aria-hidden="true">홍</span>
              <div>
                <div className="article__byline-name">홍마초</div>
                <div className="article__byline-date">작성 · {formatDate(post.date)}</div>
              </div>
            </div>
          </header>

          <BodyComp />

          <footer className="article__footer">
            <div className="article__share">
              <div className="article__share-tags">
                {post.tags.map(t => (
                  <span key={t} className="tag" onClick={() => navigate(`/blog?tag=${t}`)}>
                    <Icon.Hash style={{ opacity: 0.55, marginRight: 3 }} />{t}
                  </span>
                ))}
              </div>
              <div className="share-actions">
                <button className="btn btn--ghost" onClick={() => {}}>
                  <Icon.Copy /> 링크 복사
                </button>
                <button className="btn btn--ghost" onClick={() => {}}>
                  <Icon.Twitter /> 공유
                </button>
              </div>
            </div>

            {related.length > 0 && (
              <div className="related">
                <h2 className="related__title">관련 글</h2>
                <div className="related__grid">
                  {related.map(p => <PostCard key={p.slug} post={p} navigate={navigate} />)}
                </div>
              </div>
            )}

            <div className="comments">
              <div className="comments__icon" style={{ color: 'var(--color-label-alternative)' }}>
                <Icon.MessageSquare />
              </div>
              <h3 className="comments__title">댓글 (Giscus)</h3>
              <p className="comments__hint">GitHub 계정으로 의견을 남겨주세요. — 운영 환경에서는 Giscus 위젯이 이 자리에 렌더링됩니다.</p>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
};

/* ─── About ─── */
const AboutPage = ({ navigate }) => (
  <main>
    <div className="about">
      <div className="about__hero">
        <span className="about__avatar" aria-hidden="true">홍</span>
        <div>
          <h1 className="about__name">홍마초</h1>
          <p className="about__role">백엔드 개발자 · 개인 투자자 · 학습 중독자</p>
        </div>
      </div>

      <div className="prose">
        <p>안녕하세요. 서울에서 Spring Boot 기반 서비스를 만들고 운영하는 백엔드 개발자입니다. 코드 외 시간에는 퀀트 투자 백테스트를 돌리고, 책을 읽고, 가끔 글을 씁니다.</p>
        <p>이 블로그는 <strong>다듬지 않은 진행 중인 생각</strong>을 모아두는 공간입니다. 완성된 정답이 아니라, 풀고 있는 문제와 그 과정의 메모. 그래서 글 사이에 일관성이 없을 때도 있습니다.</p>
      </div>

      <div className="about__stat-grid">
        <div className="about__stat">
          <div className="about__stat-value">{POSTS.length}</div>
          <div className="about__stat-label">총 글 수</div>
        </div>
        <div className="about__stat">
          <div className="about__stat-value">6.2y</div>
          <div className="about__stat-label">백엔드 경력</div>
        </div>
        <div className="about__stat">
          <div className="about__stat-value">42</div>
          <div className="about__stat-label">올해 읽은 책</div>
        </div>
      </div>

      <div className="prose">
        <h2>주로 다루는 주제</h2>
        <ul>
          <li><strong>개발</strong> — Spring Boot, JPA, Kotlin, JVM 내부, 시스템 디자인</li>
          <li><strong>투자</strong> — 퀀트 백테스트, 팩터 투자, 포트폴리오 관리</li>
          <li><strong>학습</strong> — 책/강의 리뷰, 학습법, 메모 시스템</li>
          <li><strong>일상</strong> — 분기별 회고, 추천 모음, 작은 실험</li>
        </ul>

        <h2>지금 관심 있는 것</h2>
        <ol>
          <li>코틀린 코루틴의 내부 동작</li>
          <li>국내 ETF 기반의 단순한 퀀트 룰</li>
          <li>“덜 하기” 라는 생활 원칙</li>
        </ol>

        <h2>연락</h2>
        <p>이메일이 가장 빠릅니다. <a href="#" onClick={(e) => e.preventDefault()}>hello@hongmacho.dev</a> 또는 GitHub, X(트위터)로 멘션 주세요.</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 32 }}>
        <button className="btn btn--primary" onClick={() => navigate('/blog')}>최신 글 보러가기 <Icon.ArrowRight /></button>
        <a className="btn btn--ghost" href="#" onClick={(e) => e.preventDefault()}><Icon.Github /> GitHub</a>
      </div>
    </div>
  </main>
);

/* ─── 404 ─── */
const NotFoundPage = ({ navigate }) => (
  <main className="error-404">
    <div className="error-404__code" aria-hidden="true">404</div>
    <h1 className="error-404__title">페이지를 찾을 수 없어요</h1>
    <p className="error-404__sub">주소가 바뀌었거나, 글이 비공개로 전환됐을 수 있어요. 다른 글을 둘러보시는 건 어때요?</p>
    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
      <button className="btn btn--primary" onClick={() => navigate('/')}>홈으로 <Icon.ArrowRight /></button>
      <button className="btn btn--ghost" onClick={() => navigate('/blog')}>블로그 둘러보기</button>
    </div>
  </main>
);

Object.assign(window, { HomePage, BlogListPage, ArticlePage, AboutPage, NotFoundPage });

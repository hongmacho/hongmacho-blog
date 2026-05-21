/* Sample post data — Korean blog posts across 4 categories.
   This is a prototype, so the corpus is small but plausible. */

const CATEGORIES = [
  { id: 'dev',    name: '개발',  desc: 'Spring Boot, Java, Docker, 최신 기술',     kr: '개발' },
  { id: 'invest', name: '투자',  desc: '퀀트 분석, 포트폴리오 관리',              kr: '투자' },
  { id: 'learn',  name: '학습',  desc: '기술 스택, 책/강의 후기',                  kr: '학습' },
  { id: 'daily',  name: '일상',  desc: '회고, 생각, 추천',                         kr: '일상' },
];

const CAT_COLOR = {
  dev: 'var(--cat-dev)',
  invest: 'var(--cat-invest)',
  learn: 'var(--cat-learn)',
  daily: 'var(--cat-daily)',
};

const POSTS = [
  {
    slug: 'this-blog-with-astro-tailwind',
    title: '이 블로그를 만들기까지 — Astro + TailwindCSS 여정',
    excerpt: '개인 블로그를 직접 구축하면서 배운 Astro와 TailwindCSS. 왜 이 기술 스택을 선택했는지, 그리고 개발 과정에서의 선택과 고민들을 정리해봤습니다.',
    category: 'dev',
    date: '2026-05-21',
    readTime: 12,
    tags: ['astro', 'tailwindcss', 'blog', '정적사이트'],
    featured: true,
    body: 'long-astro-post', // rendered separately
  },
  {
    slug: 'spring-boot-3-migration',
    title: 'Spring Boot 3.0 마이그레이션 회고 — Jakarta EE 전환의 실제',
    excerpt: 'Spring Boot 2.7에서 3.0으로 올리며 마주친 Jakarta 네임스페이스 전환, Hibernate 6, Native Image까지. 운영 중인 서비스에서 어떻게 안전하게 옮겼는지 적어둡니다.',
    category: 'dev',
    date: '2026-04-28',
    readTime: 9,
    tags: ['spring-boot', 'jakarta', 'migration', 'java'],
  },
  {
    slug: 'quant-portfolio-rebalance',
    title: '분기별 리밸런싱 룰을 정하기까지 — 백테스트 6개월',
    excerpt: '“얼마나 자주, 어떤 기준으로 리밸런싱할까?” 라는 질문에 답하기 위해 6개월간 돌린 백테스트 결과와, 결국 정착한 단순한 규칙을 공유합니다.',
    category: 'invest',
    date: '2026-04-14',
    readTime: 7,
    tags: ['퀀트', '백테스트', '포트폴리오'],
  },
  {
    slug: 'docker-compose-prod-tips',
    title: 'Docker Compose만으로 1년 운영하며 배운 것들',
    excerpt: 'Kubernetes는 너무 무겁고, 클라우드 매니지드는 비쌌다. 1인 서비스를 Docker Compose만으로 1년간 운영하며 부딪힌 한계와 트릭들.',
    category: 'dev',
    date: '2026-03-30',
    readTime: 8,
    tags: ['docker', 'devops', 'self-hosting'],
  },
  {
    slug: 'reading-the-pragmatic-programmer',
    title: '실용주의 프로그래머 — 20주년 기념판 다시 읽기',
    excerpt: '주니어 때 한 번, 시니어가 되어서 또 한 번. 같은 책인데 밑줄이 완전히 달라졌다. 다시 읽으며 새로 발견한 것들.',
    category: 'learn',
    date: '2026-03-18',
    readTime: 6,
    tags: ['책', '리뷰', '실용주의'],
  },
  {
    slug: 'q1-2026-retrospective',
    title: '2026년 1분기 회고 — 덜 하고, 깊게',
    excerpt: '올해의 키워드는 “덜 하기”. 작년에 너무 많은 걸 벌렸다는 반성에서 시작한 1분기. 무엇을 멈췄고, 무엇이 남았는가.',
    category: 'daily',
    date: '2026-03-31',
    readTime: 5,
    tags: ['회고', '2026', '미니멀리즘'],
  },
  {
    slug: 'kotlin-coroutines-deep-dive',
    title: '코틀린 코루틴, 진짜로 어떻게 동작할까',
    excerpt: 'suspend 함수가 컴파일되면 어떤 바이트코드가 나오는지, Continuation은 정확히 무엇인지. Disassembly로 확인하는 코루틴의 내부.',
    category: 'dev',
    date: '2026-02-25',
    readTime: 14,
    tags: ['kotlin', 'coroutines', 'jvm'],
  },
  {
    slug: 'factor-investing-with-python',
    title: '파이썬으로 팩터 투자 백테스트하기 — 기초편',
    excerpt: 'pandas와 yfinance만으로 시작할 수 있는 팩터 투자 백테스트. Value, Momentum, Quality 세 가지 팩터를 직접 구현해봅니다.',
    category: 'invest',
    date: '2026-02-10',
    readTime: 11,
    tags: ['python', '퀀트', '팩터'],
  },
  {
    slug: 'designing-data-intensive-applications',
    title: 'DDIA 완독 후기 — 6개월 걸린 이유',
    excerpt: '“데이터 중심 애플리케이션 설계”를 처음 시작했을 때는 3개월이면 끝날 줄 알았다. 결국 6개월. 그래도 시간이 아깝지 않은 이유.',
    category: 'learn',
    date: '2026-01-22',
    readTime: 8,
    tags: ['책', 'DDIA', '시스템디자인'],
  },
  {
    slug: 'monthly-recommend-2026-01',
    title: '2026년 1월의 추천 — 책, 영상, 도구',
    excerpt: '한 달 동안 나에게 영향을 준 것들. 추천하고 싶은 책 한 권, 유튜브 채널, 그리고 새로 쓰기 시작한 도구.',
    category: 'daily',
    date: '2026-01-31',
    readTime: 4,
    tags: ['추천', '월간', '도구'],
  },
  {
    slug: 'jpa-n-plus-1-still',
    title: 'JPA N+1 — 아직도 매번 헷갈리는 이유',
    excerpt: '@OneToMany, @ManyToOne, Fetch Join, EntityGraph. 머리로는 알지만 실전에서 또 N+1을 만나는 이유와 패턴별 해결법.',
    category: 'dev',
    date: '2026-01-12',
    readTime: 10,
    tags: ['jpa', 'hibernate', 'performance'],
  },
  {
    slug: 'why-i-stopped-reading-news',
    title: '왜 뉴스를 끊었는가 — 6개월 실험기',
    excerpt: '경제·기술 뉴스에 매일 30분씩 쓰던 시간을 책 읽기로 옮겨봤다. 6개월 후 무엇이 달라졌는지, 그리고 무엇은 그대로인지.',
    category: 'daily',
    date: '2025-12-28',
    readTime: 6,
    tags: ['습관', '실험', '미디어다이어트'],
  },
];

const TAG_COUNTS = (() => {
  const m = {};
  POSTS.forEach(p => p.tags.forEach(t => { m[t] = (m[t] || 0) + 1; }));
  return m;
})();

const CAT_COUNTS = (() => {
  const m = { dev: 0, invest: 0, learn: 0, daily: 0 };
  POSTS.forEach(p => { m[p.category] = (m[p.category] || 0) + 1; });
  return m;
})();

Object.assign(window, { CATEGORIES, CAT_COLOR, POSTS, TAG_COUNTS, CAT_COUNTS });

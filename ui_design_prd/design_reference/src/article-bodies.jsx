/* The full body of the featured post — rendered as JSX so we get
   real heading anchors for the TOC instead of fragile markdown parsing. */

const AstroPostBody = () => (
  <div className="prose">
    <p>오랫동안 블로그를 해봐야겠다고 생각했지만, 항상 도구 선택 때문에 미뤄왔다. WordPress? Medium? Notion? 하지만 개발자인 나에게는 뭔가 부족했다. 그러다 우연히 Astro를 발견했고, 지난 몇 주 동안 직접 구축한 이 블로그가 탄생했다.</p>
    <p>이 글에서는 왜 Astro를 선택했는지, 어떻게 구축했는지, 그리고 과정에서 배운 것들을 공유하려고 한다.</p>

    <h2 id="stack-decision">기술 스택 선택의 고민</h2>
    <h3 id="why-ssg">왜 정적 사이트 생성기(SSG)인가?</h3>
    <p>처음에는 Next.js로 할까 고민했다. Next.js는 정말 좋은 프레임워크다. 하지만 블로그는 대부분 정적 콘텐츠다. 매번 서버에서 렌더링할 필요가 없다.</p>
    <p>정적 사이트의 장점:</p>
    <ul>
      <li><strong>속도</strong>: CDN으로 배포되어 엄청 빠름</li>
      <li><strong>비용</strong>: 서버 비용 0원 (GitHub Pages, Vercel 무료)</li>
      <li><strong>보안</strong>: 공격 벡터가 매우 적음</li>
      <li><strong>확장성</strong>: 트래픽이 몇 배 늘어도 상관없음</li>
    </ul>
    <p>그렇다면 Next.js vs Astro vs Hugo vs 11ty?</p>

    <h3 id="why-astro">Astro를 선택한 이유</h3>
    <blockquote><p>Astro는 “정적 사이트 생성에 특화된” 프레임워크다.</p></blockquote>
    <p>단순히 “할 수 있다”를 넘어, “아예 이것이 주목적인” 도구를 선택했다.</p>
    <p><strong>Astro의 강점:</strong></p>
    <ol>
      <li><strong>마크다운 중심</strong> — Content Collections API로 자동 관리, 프론트매터(YAML)로 메타데이터, 타입 안전성까지.</li>
      <li><strong>기본은 HTML</strong> — 페이지는 순수 HTML, JS는 필요한 부분만 (<code>client:</code> 디렉티브). 결과: 엄청 작은 번들 크기.</li>
      <li><strong>성능이 자동으로 최적화됨</strong> — 이미지 WebP 변환, CSS/JS 미니피케이션, 코드 스플리팅.</li>
      <li><strong>배우기 쉬움</strong> — 기존 HTML/CSS/JS 개발자도 바로 시작 가능. React/Vue도 섞어 쓸 수 있음.</li>
    </ol>
    <p><strong>비교:</strong></p>
    <ul>
      <li>Hugo — 빠르지만 Go 생태계에 종속</li>
      <li>Next.js — 강력하지만 블로그에는 과하다</li>
      <li>11ty — 유연하지만 설정이 복잡</li>
    </ul>
    <p>결론: Astro가 “딱 맞다”.</p>

    <h2 id="tailwind-typography">TailwindCSS + Typography 플러그인</h2>
    <p>스타일링은 고민이 없었다. TailwindCSS는 블로그 스타일링의 표준이 되었다. 특히 <code>@tailwindcss/typography</code> 플러그인이 핵심이다.</p>
    <h3 id="markdown-to-html">마크다운을 HTML로 변환하면</h3>
    <p>마크다운을 일반 HTML로 변환하면 이렇게 나온다:</p>
    <pre><code>{`<h1>제목</h1>
<p>본문 텍스트</p>
<ul>
  <li>리스트</li>
</ul>`}</code></pre>
    <p>이 HTML에는 스타일이 없다. 그래서 보통 여러 CSS 규칙을 작성해야 한다.</p>
    <h3 id="typography-plugin">Typography 플러그인</h3>
    <pre><code>{`<article class="prose prose-lg dark:prose-invert">
  {/* 마크다운 렌더링 */}
</article>`}</code></pre>
    <p>이 한 줄로 끝! Typography가 <code>h1, h2, p, ul, code</code> 등 모든 요소를 예쁘게 스타일해준다. 게다가 <code>dark:prose-invert</code>로 다크모드도 자동 처리다.</p>

    <h2 id="version-pinning">기술 스펙 결정 — “최신 안정”</h2>
    <pre><code>
      <span className="tok-cmt">{"// package.json"}</span>{"\n"}
      {"{"}{"\n"}
      {"  "}<span className="tok-attr">"astro"</span>{": "}<span className="tok-str">"^6.3.6"</span>{",\n"}
      {"  "}<span className="tok-attr">"tailwindcss"</span>{": "}<span className="tok-str">"^4.3.0"</span>{",\n"}
      {"  "}<span className="tok-attr">"typescript"</span>{": "}<span className="tok-str">"^6.0.3"</span>{",\n"}
      {"  "}<span className="tok-attr">"lucide-react"</span>{": "}<span className="tok-str">"^1.16.0"</span>{"\n"}
      {"}"}
    </code></pre>
    <p>“최신을 따라야 한다”는 의견도 있지만, 나는 <strong>“최신 중에서 안정된 버전”</strong>을 선택했다. 이 조합은 6개월 이상 테스트된 안정적인 조합이다.</p>

    <h2 id="deploy">배포 — Vercel + GitHub</h2>
    <p>처음엔 GitHub Pages도 고려했다. 둘 다 무료이니까. 하지만 선택은 <strong>Vercel</strong>이었다.</p>
    <table>
      <thead><tr><th></th><th>GitHub Pages</th><th>Vercel</th></tr></thead>
      <tbody>
        <tr><td>비용</td><td>무료</td><td>무료</td></tr>
        <tr><td>배포 UI</td><td>최소</td><td>우수</td></tr>
        <tr><td>속도</td><td>중상</td><td>상</td></tr>
        <tr><td>라우팅</td><td>제한적</td><td>강력함</td></tr>
        <tr><td>확장성</td><td>낮음</td><td>높음</td></tr>
      </tbody>
    </table>
    <p>장기적으로 이 블로그를 성장시키고 싶어서 Vercel을 선택했다.</p>

    <h2 id="comments">댓글 — Giscus</h2>
    <p>댓글 시스템도 고민했다. Disqus? 자체 구현? 결국 <strong>Giscus</strong>로 정착했다.</p>
    <ul>
      <li><strong>데이터베이스 불필요</strong> — GitHub Discussions를 DB처럼 사용</li>
      <li><strong>개발자 친화적</strong> — 기술 블로그 독자는 대부분 GitHub 계정 보유</li>
      <li><strong>오픈소스</strong> — 커뮤니티 지원</li>
      <li><strong>통합</strong> — Astro와 완벽 호환, 설정 간단</li>
    </ul>

    <h2 id="lessons">배운 점들</h2>
    <ol>
      <li><strong>프레임워크 선택이 개발 속도를 크게 좌우한다.</strong> Astro를 선택하지 않았다면 지금쯤 여전히 “기술 스택 고민 중”이었을 것 같다.</li>
      <li><strong>정적은 느리지 않다.</strong> 오히려 정적이 가장 빠르다.</li>
      <li><strong>비용 최소화가 가능하다.</strong> 정적 + 무료 호스팅 = 월 운영 비용 0원.</li>
      <li><strong>마크다운은 블로그의 표준이다.</strong> 어떤 플랫폼으로 옮겨도 콘텐츠는 유지된다.</li>
    </ol>

    <h2 id="future">앞으로의 계획</h2>
    <p>이 블로그는 계속 진화할 것이다.</p>
    <ul>
      <li><strong>Phase 1 (지금)</strong> — 기본 기능 완성, 첫 20개 글, 커뮤니티 형성</li>
      <li><strong>Phase 2 (3개월)</strong> — Pagefind 검색, 이메일 구독, 관련 글 자동 추천</li>
      <li><strong>Phase 3 (6개월)</strong> — 공유 자동화, 뉴스레터, 포트폴리오 섹션</li>
      <li><strong>Phase 4 (1년)</strong> — 커뮤니티 성장, 개인 브랜드 확립</li>
    </ul>

    <h2 id="closing">마치며</h2>
    <p>이 블로그는 단순한 개인 프로젝트가 아니다. 지난 몇 년간 배운 것들, 경험한 것들을 정리하고 공유하는 공간이 될 것이다.</p>
    <p>혹시 Astro나 블로그 구축에 관심 있다면, 이 글이 도움이 되길 바란다. 그리고 나와 비슷한 관심을 가진 분들의 댓글과 피드백을 기다리고 있다.</p>
    <hr />
    <p><strong>참고 자료</strong></p>
    <ul>
      <li><a href="#" onClick={(e) => e.preventDefault()}>Astro 공식 문서</a></li>
      <li><a href="#" onClick={(e) => e.preventDefault()}>TailwindCSS 공식 문서</a></li>
      <li><a href="#" onClick={(e) => e.preventDefault()}>Giscus 공식 사이트</a></li>
      <li><a href="#" onClick={(e) => e.preventDefault()}>Web.dev — Core Web Vitals</a></li>
    </ul>
  </div>
);

/* TOC structure for the featured post. */
const AstroPostTOC = [
  { id: 'stack-decision', text: '기술 스택 선택의 고민', level: 2 },
  { id: 'why-ssg', text: '왜 정적 사이트 생성기인가?', level: 3 },
  { id: 'why-astro', text: 'Astro를 선택한 이유', level: 3 },
  { id: 'tailwind-typography', text: 'TailwindCSS + Typography', level: 2 },
  { id: 'markdown-to-html', text: '마크다운 → HTML', level: 3 },
  { id: 'typography-plugin', text: 'Typography 플러그인', level: 3 },
  { id: 'version-pinning', text: '기술 스펙 결정', level: 2 },
  { id: 'deploy', text: '배포 — Vercel + GitHub', level: 2 },
  { id: 'comments', text: '댓글 — Giscus', level: 2 },
  { id: 'lessons', text: '배운 점들', level: 2 },
  { id: 'future', text: '앞으로의 계획', level: 2 },
  { id: 'closing', text: '마치며', level: 2 },
];

/* Generic short body for non-featured posts (TOC-less). */
const GenericPostBody = ({ post }) => (
  <div className="prose">
    <p>이 글은 프로토타입용 샘플입니다. 실제 콘텐츠는 마크다운에서 자동 변환되어 이 자리에 들어옵니다. 본문 타이포그래피, 인용구, 코드 블록, 표, 리스트가 어떻게 보일지 미리 확인할 수 있도록 일반적인 마크다운 요소를 모두 포함했습니다.</p>

    <h2 id="intro">들어가며</h2>
    <p>요즘 <strong>{post.category === 'dev' ? '코드를' : post.category === 'invest' ? '시장을' : post.category === 'learn' ? '책을' : '하루를'}</strong> 자주 들여다보고 있다. 매일 쌓이는 작은 메모들이 어느 순간 하나의 글이 된다. 이 글도 그런 메모에서 시작했다.</p>
    <p>먼저 <a href="#" onClick={(e) => e.preventDefault()}>관련 글</a>을 한 번 훑고 오는 것을 추천한다. 배경이 깔려 있으면 훨씬 빨리 읽힌다.</p>

    <h2 id="approach">접근 방식</h2>
    <p>세 가지 원칙으로 정리했다:</p>
    <ol>
      <li><strong>단순한 것부터</strong> — 작동하는 것을 먼저 만들고, 그 다음에 정교하게 다듬는다.</li>
      <li><strong>측정 가능한 것</strong> — 추측보다 숫자. 가설은 가설로 표시한다.</li>
      <li><strong>되돌릴 수 있는 것</strong> — 결정이 비싸면, 더 작은 단위로 쪼갠다.</li>
    </ol>

    <blockquote><p>“완벽한 시스템보다, 고칠 수 있는 시스템이 낫다.” — 어디서 읽었는지 기억나지 않지만 자주 떠올리는 문장.</p></blockquote>

    <h3 id="snippet">코드 한 토막</h3>
    <p>핵심을 한 줄로 줄이면 이렇다:</p>
    <pre><code>
      <span className="tok-kw">const</span>{" "}<span className="tok-fn">measure</span>{" = ("}<span className="tok-attr">fn</span>{") => {\n"}
      {"  "}<span className="tok-kw">const</span>{" t0 = performance.now();\n"}
      {"  "}<span className="tok-kw">const</span>{" r = "}<span className="tok-fn">fn</span>{"();\n"}
      {"  "}<span className="tok-fn">console</span>{".log("}<span className="tok-str">`${"{"}performance.now() - t0{"}"}ms`</span>{");\n"}
      {"  "}<span className="tok-kw">return</span>{" r;\n"}
      {"};"}
    </code></pre>

    <h2 id="result">결과</h2>
    <p>약 <code>30%</code> 의 시간을 줄였다. 정확히는 사용자가 체감하는 부분에서 더 컸다. 측정 방법은 별도 글에서 정리하겠다.</p>

    <h2 id="next">다음 단계</h2>
    <p>아직 풀지 못한 문제 두 가지가 남아 있다. 다음 글에서 자세히 다뤄볼 예정이다.</p>
  </div>
);

const GenericPostTOC = [
  { id: 'intro', text: '들어가며', level: 2 },
  { id: 'approach', text: '접근 방식', level: 2 },
  { id: 'snippet', text: '코드 한 토막', level: 3 },
  { id: 'result', text: '결과', level: 2 },
  { id: 'next', text: '다음 단계', level: 2 },
];

Object.assign(window, { AstroPostBody, AstroPostTOC, GenericPostBody, GenericPostTOC });

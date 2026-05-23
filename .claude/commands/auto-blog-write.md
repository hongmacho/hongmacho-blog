---
description: 키워드 한 줄로 블로그 글을 생성·검증·커밋·푸시까지 자동화
argument-hint: <주제 키워드 한 줄>
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash(date:*)
  - Bash(npm run build)
  - Bash(npm run build:*)
  - Bash(git add:*)
  - Bash(git commit:*)
  - Bash(git push)
  - Bash(git push:*)
  - Bash(git status:*)
  - Bash(git log:*)
  - Bash(git rev-parse:*)
  - Bash(ls:*)
  - Bash(wc:*)
  - Bash(grep:*)
---

# /auto-blog-write

사용자 입력: `$ARGUMENTS`

Astro 6 기반 한국어 개인 블로그에 글 한 편을 추가하는 작업. 입력 키워드를 주제로 5,000~7,000자 분량 글을 만들고, 빌드 검증을 통과시키고, 커밋·푸시까지 끝낸다. 사용자는 결과만 받는다.

---

## CONTEXT — 이 블로그의 톤

- 글쓴이는 서울에서 Spring Boot 백엔드를 만드는 개발자. 퀀트 투자, 책·강의 메모, 일상 회고도 같이 쓴다.
- 기존 26편 모두 **반말 평어체**(-다, -였다). 존댓말 금지.
- **1인칭 단언**으로 시작한다. 메타 오프닝 금지.
- 결말은 **미결 과제 / 다음 실험**으로 열어둔다. "맺음말" 헤더 금지.
- 한국어 95% / 영문 5%. 영문은 고유명사·코드 식별자에만.

---

## STEP 1 — 입력 파싱

`$ARGUMENTS`를 읽는다. 비어 있으면 즉시 멈추고 "키워드를 한 줄 적어 주세요"라고만 답한다.

(a) 주제 한 문장, (b) 카테고리 후보, (c) 글의 각도(회고/실험기/비교/실패담)를 정한다. 사용자에게 묻지 않는다.

---

## STEP 2 — 카테고리 자동 분류

| Category | 트리거 키워드 |
|----------|---------------|
| `dev` | Spring, Java, Kotlin, Astro, Claude Code, MCP, 에이전트, 백엔드, 프론트, 빌드, 배포, Rust, Docker, Next.js, React |
| `invest` | 퀀트, ETF, 배당, 포트폴리오, 백테스트, 리밸런싱, RSI, MDD, 팩터, 시드, 변동성 |
| `learn` | Anki, Obsidian, 영어, 책, 강의, 30일, 노트, 학습법, 챌린지, 독서 |
| `daily` | 회고, 루틴, 생각, 카페인, 새벽, 거절, 출근, 퇴근, 분기, 한 달 |

1순위 매칭이 있으면 확정. 복수 매칭이거나 매칭이 없으면 본문에서 다룰 핵심 소재로 결정. 결정 불가일 때만 `daily`.

---

## STEP 3 — 슬러그와 날짜

```bash
date +%Y-%m-%d
```

슬러그는 영문 케밥, **6단어 이내**, 주제 압축 명사구.

- "퀀트 6개월 후기" → `quant-six-months`
- "Astro 6로 블로그 이주" → `astro6-blog-migration`
- "새벽 5시 3주차" → `5am-routine-3weeks`

`ls src/content/blog/` 로 같은 날짜·슬러그 충돌 확인. 충돌 시 슬러그에 `-2`, `-3` 접미사.

최종 경로: `src/content/blog/YYYY-MM-DD-{slug}.md`

---

## STEP 4 — Frontmatter

```yaml
---
title: "한국어 제목, 따옴표 필수, 35자 이내"
date: "YYYY-MM-DD"
category: dev
excerpt: "140자 이하. 한 문장. 메타 설명 문체 금지."
featured: false
tags: ["태그1", "태그2", "태그3"]
---
```

- `excerpt`: **140자 이하**. 141자면 빌드 즉시 실패. 작성 후 직접 글자 수 검증.
- `excerpt`는 본문에서 가장 도발적인 한 문장을 꺼낸다. "이 글에 대해 설명합니다" 류 금지.
- `tags`: **3~5개**, 최소 1개 필수.
- `readTime`은 생략(자동 계산).
- `featured`는 항상 `false`.

---

## STEP 5 — 본문

### 분량과 구조

- **5,000~7,000자(한국어 기준)**. 작성 직후 `wc -m`로 검증.
- **h2 5~7개**, h3는 거의 안 씀.
- 표·코드 블록·인용구 최소 1개 이상.
- 마지막 섹션은 미결 과제/다음 실험으로 닫는다.

### GOOD 도입부 예시

```
블로그 글을 쓰는 데 가장 오래 걸리는 구간은 첫 줄이었다.
8주 만에 30분 영어 듣기를 매일 했다.
서브에이전트 셋을 동시에 띄웠더니 토큰 한도에서 멈췄다.
```

### 금기 문장 (등장 즉시 폐기 후 재작성)

- "안녕하세요", "여러분"
- "Today we will…", "이번 글에서는", "~에 대해 알아보겠습니다"
- "In conclusion", "정리하면", "결론적으로"
- 섹션 헤더로 "맺음말", "결론", "마치며"
- AI-slop 인사말 (한국어 변형 포함)

### 작성 절차

1. h2 6개 제목 먼저 정함 (도입 1 + 본론 4 + 미결 1)
2. 각 h2 아래 700~1,000자씩
3. 각 섹션마다 **구체 숫자, 날짜, 인용, 코드, 표 중 하나** 이상 포함
4. 도입부는 장면 묘사 또는 1인칭 단언
5. 모든 문장 평어체 점검

---

## STEP 6 — Write

`src/content/blog/YYYY-MM-DD-{slug}.md`로 Write. 충돌 시 STEP 3으로 복귀.

---

## STEP 7 — 빌드 검증 루프 (최대 3회)

```bash
npm run build 2>&1 | tail -30
```

- 통과 → STEP 8
- 실패 → 원인 분류 후 Edit으로 수정 후 재빌드:
  - zod frontmatter 위반(excerpt 길이, category enum, date regex, tags min) → frontmatter 수정
  - 마크다운 파싱 오류 → 닫히지 않은 코드블록·따옴표 점검
  - 빌드 시스템 오류(본인 작성 파일과 무관) → 즉시 멈추고 보고

**3회 실패 시 멈춤.** 마지막 stderr 30줄 그대로 사용자에게 보여줌. 파일은 삭제하지 않음.

---

## STEP 8 — 커밋과 푸시

```bash
git add src/content/blog/YYYY-MM-DD-{slug}.md
git commit -m "post: {frontmatter title 그대로}"
git push
```

`git push` 실패 시:
- 권한/네트워크/non-fast-forward → 사유만 보고
- **커밋은 revert하지 않음.** 로컬 보존.

---

## STEP 9 — 결과 보고

다음만 간결하게:
- 생성된 파일 경로
- 카테고리 / 태그
- 본문 글자 수 (`wc -m`)
- 빌드 재시도 횟수
- 커밋 SHA (`git rev-parse HEAD`)
- 푸시 결과

잡담·이모지·축하 인사 금지.

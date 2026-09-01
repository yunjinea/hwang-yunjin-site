# AFTER THE NUMBERS — Final v2.0

현재 라이브 배포본과 `after-the-numbers-v1.1-full` 기준본을 합쳐 복원한 전체 소스입니다. 홈페이지의 기존 시각 언어와 `INTRO → CAREER → SELECTED CASES → EXPERTISE → WRITING → ABOUT` 구조는 유지하면서, 누락된 Writing 아카이브와 Markdown 발행 파이프라인을 복원했습니다.

## 배포

- Build command: `npm run build`
- Output directory: `dist`
- Node.js: 20 이상
- Cloudflare Pages 환경에서 저장소의 `main` 브랜치와 위 설정을 연결합니다.

로컬 확인:

```bash
npm test
npm run dev
```

## 글 발행

1. `/admin/`에서 Pages CMS로 이동합니다.
2. `content/posts`에 Markdown 글 1개를 생성하거나 업로드합니다.
3. `draft: false`로 Publish 합니다.
4. GitHub 커밋을 감지한 Cloudflare Pages가 `npm run build`를 실행합니다.

글 형식은 `content/POST_TEMPLATE.md`를 사용합니다. 본문의 `[[FIGURE:TOKEN]]`은 `figures/TOKEN.html`로 변환되며, 공개 글은 도식이 최소 2개 있어야 빌드됩니다. Markdown 본문에 직접 넣은 HTML과 `<style>` 태그는 실행되지 않고 문자로 안전하게 표시됩니다.

## 시리즈

- SEE — 앞으로 어떤 숫자가 만들어질지 본다
- EXPLAIN — 계획과 실제의 차이를 설명한다
- DECIDE — 숫자를 선택과 판단으로 연결한다
- CONTROL — 목표와 실적의 차이를 다음 행동으로 바꾼다

## 패키지 구분

- Full source: 저장소 전체 교체용
- Deploy: `dist` 내용만 포함한 Cloudflare Pages 직접 업로드용

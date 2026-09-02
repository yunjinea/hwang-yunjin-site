# AFTER THE NUMBERS — v2.3

`v2.1` 최종 소스를 기준으로 Hero부터 About까지 PC·모바일 사용자 흐름을 전면 재구성한 전체 소스입니다. 기존 시각 언어와 `INTRO → CAREER → SELECTED CASES → EXPERTISE → WRITING → ABOUT` 구조, Writing 아카이브와 Markdown 발행 파이프라인은 유지합니다.

## v2.3 변경사항

- PC에서 본문 글자 크기와 섹션 폭을 확대하고 짧은 노트북 화면에서도 콘텐츠가 잘리지 않도록 고정 높이를 제거
- Career·Cases·Expertise를 한 번에 하나씩 보는 선택형 구조로 통일
- 클릭 가능한 카드, 활성 상태, 진행 안내, 이전·다음 버튼을 명확하게 표시
- PC는 마우스 휠, 모바일은 탭·좌우 스와이프로 콘텐츠를 전환
- 모바일 선택 메뉴를 상단에 고정하고 상세 설명은 펼침 구조로 바꿔 페이지 길이를 축소
- Hero 애니메이션을 빠르게 조정하고 Case 바로가기 버튼을 추가
- 1363×936, 1024×768, 390×844, 360×800 화면에서 가로 넘침과 주요 상호작용을 검증

상세한 문제·개선 매핑과 검증 결과는 `UX-IMPROVEMENTS-v2.3.md`를 참고합니다.

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

- READ — 숫자가 만들어지고 달라지는 흐름을 읽는다
- DECIDE — 숫자를 선택과 판단으로 연결한다
- CONTROL — 목표와 실적의 차이를 다음 행동으로 바꾼다

## 패키지 구분

- Full source: 저장소 전체 교체용
- Deploy: `dist` 내용만 포함한 Cloudflare Pages 직접 업로드용

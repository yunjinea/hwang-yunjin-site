# READ / 03 — 문장과 구성을 다시 다듬은 초안

제목: 재고가 늘면 왜 이익이 좋아 보일까  
기준: after-the-numbers-v3.1-full-source.zip  
수정일: 2026-09-14  
상태: `draft: true`

## 이번 수정

한 공장의 첫 달 생산 증가와 다음 달 재고 소진을 따라가도록 다시 썼다. 개당 평균 제조원가가 9.75만원에서 9만원으로 낮아진다는 설명은 유지했다. 계산을 반복하는 문장을 줄이고, 이익이 늘어난 달과 재고를 줄인 달을 어떻게 평가할지에 집중했다.

본문에는 원가를 판매분과 재고분으로 나누는 그림 하나, 두 달 실적을 비교하는 표 하나를 둔다. 정상조업도, 손익 계산, 현금 계산은 글 끝에서 펼쳐 읽는 세 개의 메모로 옮겼다. 펼치기 기능은 HTML 기본 기능으로 동작한다.

## 포함 파일

- `content/posts/2026-09-10-read03-inventory-profit-illusion.md` — 수정 원고
- `figures/INVENTORY_FIXED_COST_SPLIT.html` — 판매분·재고분 원가 그림
- `figures/INVENTORY_PROFIT_COMPARE.html` — 두 달 비교표
- `figures/INVENTORY_READING_NOTES.html` — 펼쳐 읽는 계산·회계 메모
- `READ03_UPLOAD_GUIDE.md` — 안내문

이번 ZIP은 기존 3.1 저장소에 적용하는 게시글 추가·수정용이다. 홈페이지 디자인, 공통 모션, 다른 게시글, 빌드 프로그램과 관리자 설정은 포함하지 않는다.

## 업로드

1. ZIP을 내려받아 압축을 푼다.
2. [현재 GitHub 저장소](https://github.com/yunjinea/hwang-yunjin-site)의 배포 브랜치 `main`을 연다.
3. 저장소 첫 화면에서 **Add file → Upload files**를 선택한다.
4. 압축을 푼 폴더 안의 `content`와 `figures` 폴더를 함께 올린다. 바깥 폴더나 ZIP 자체를 올리지 않는다.
5. Markdown이 `content/posts` 안에 있고, HTML 세 개가 `figures` 안에 있는지 확인한 뒤 커밋한다.

이전 초안을 올려 두었다면 같은 파일명은 덮어쓴다. 새 `INVENTORY_READING_NOTES.html`을 꼭 함께 올린다. 이전 초안에서만 사용한 도식 파일이 저장소에 남아 있어도 이번 본문에서는 호출하지 않으므로 표시되지 않는다. 삭제할 필요는 없다.

폴더 업로드가 어려우면 `figures`에 HTML 세 개를 먼저 업로드한 뒤 `content/posts`에 Markdown을 올린다.

## 공개할 때

현재 파일은 임시저장 상태다. `draft: true`이면 홈·글 목록·RSS·사이트맵에 나타나지 않고 상세 페이지도 생성되지 않는다.

검토 후 Markdown 상단의 `draft: true`를 `draft: false`로 바꾸어 커밋한다. 이전 글을 이미 공개한 상태에서 이번 수정본을 적용하면서 공개를 유지하려면, 업로드 전에 `draft: false`로 변경한다.

발행일은 기존 `date: "2026-09-10"`을 유지했다. 실제 발행일에 맞추려면 이 날짜 필드를 수정하면 된다. 파일명과 slug를 바꿀 필요는 없다.

배포가 완료된 후 확인할 주소는 [READ 03 게시글](https://hwang-yunjin-site.pages.dev/writing/inventory-profit-illusion/)이다. 기존 빌드 명령 `npm run build`와 출력 디렉터리 `dist`는 유지한다. 이 ZIP의 파일을 `dist`에 올리지 않는다.

## 관리자와 검증 범위

3.1의 `/admin/`은 Pages CMS로 이동한다. 실제 설정인 `.pages.yml`에는 여전히 SEE·EXPLAIN 분류가 남아 있어, 이번 글은 위 GitHub 편집 절차를 기준으로 안내한다. 이 수정에서는 관리자 설정을 바꾸지 않았다.

3.1 원본과 공통 소스가 동일한 상태에서 임시저장·공개 빌드, 도식과 메모의 삽입, 글 목록·RSS·사이트맵, 내부 링크와 예시 계산을 확인했다. 도식이 최소 두 개 필요하다는 기존 발행 조건도 충족한다.

실제 공개 배포와 외부 CMS 로그인은 수행하지 않았다. PC·모바일 브라우저 실화면 검증은 하지 못했으며, 반응형 레이아웃과 HTML 구조를 정적으로 확인했다.

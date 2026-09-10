# AFTER THE NUMBERS — v3.0

2026-09-09 / 기준 소스: 사용자가 제공한 v2.3 최종 전체 소스

홈페이지를 일반 세로 스크롤을 사용하는 편집형 포트폴리오로 개편했습니다.

## 어떤 ZIP을 쓰면 되나요?

- `after-the-numbers-v3.0-full-source.zip`: GitHub와 Cloudflare Pages를 연결해서 운영하는 경우. 압축을 풀고 파일·폴더를 저장소 루트에 반영합니다.
- `after-the-numbers-v3.0-deploy.zip`: 빌드가 끝난 공개 파일입니다. Cloudflare Pages의 직접 업로드 방식으로 배포할 때 사용합니다.
- 두 ZIP을 섞어서 올릴 필요는 없습니다. 관리자로 글을 계속 발행할 예정이면 GitHub 연결 방식과 전체 소스를 사용하세요.

## GitHub 연결 배포

1. 기존 저장소를 백업하거나 현재 커밋을 기록합니다.
2. 전체 소스 ZIP의 압축을 풉니다. `package.json`, `build.js`, `site-pages.js`, `index.html`, `styles.css`, `content`, `figures`, `admin`, `.pages.yml` 등이 저장소 루트에 오도록 반영합니다. ZIP 파일 자체만 저장소에 올리면 적용되지 않습니다.
3. 이 버전에는 원본 ZIP에 있던 공개 글 두 편을 포함했습니다. 그 이후 별도로 추가한 글·도식·업로드 파일이 저장소에 있다면 `content/posts`, `figures`, `uploads` 안의 추가 파일을 보존합니다. 저장소를 통째로 지우지 않아도 됩니다.
4. Cloudflare Pages의 기존 Git 연결과 배포 브랜치를 유지합니다.
5. 빌드 명령은 `npm run build`, 출력 디렉터리는 `dist`, Node.js 버전은 20 이상입니다. 별도 의존성 설치는 필요하지 않습니다.
6. 커밋 후 배포가 완료되면 홈페이지, `/writing/`, 기존 글 주소, `/admin/`을 확인합니다.

새 `site-pages.js` 파일을 반드시 함께 반영하세요. 소스의 `index.html`은 빌드용 템플릿이므로 원본 파일을 직접 열어 확인하지 마세요.

## 직접 업로드 배포

1. 직접 업로드를 사용하는 Cloudflare Pages 프로젝트에서 새 배포를 만듭니다.
2. 배포용 ZIP을 올리거나, 압축을 푼 폴더 안의 파일을 올립니다. 업로드 루트에 `index.html`과 `cases`, `writing` 폴더가 있어야 합니다.
3. GitHub 연결로 배포 중인 기존 프로젝트라면 위의 전체 소스 방식으로 반영하세요. 직접 업로드용 파일만 바꿔서는 관리자 발행 소스가 갱신되지 않습니다.

## 앞으로 글을 발행하는 방법

기존 방식과 같습니다.

1. `/admin/`에서 기존 Pages CMS로 이동합니다.
2. `content/posts`에 Markdown 파일 한 개를 생성하거나 업로드합니다.
3. 기존 `content/POST_TEMPLATE.md` 형식을 사용하고 `draft: false`로 발행합니다.
4. GitHub 커밋을 감지한 Cloudflare Pages가 다시 빌드합니다.
5. 홈페이지의 최신 글 3개, 전체 글 목록, RSS, 사이트맵에 자동 반영됩니다.

READ / DECIDE / CONTROL 시리즈와 기존 두 게시글 주소를 유지했습니다. 기존 정책에 따라 공개 글에는 도식이 최소 두 개 필요하고, 새 도식 토큰을 쓰면 해당 `figures/TOKEN.html`도 함께 추가해야 합니다.

관리자 로그인과 외부 CMS 연결 설정은 원본 그대로입니다. 이번 작업에서는 외부 계정 로그인이나 실제 공개 배포를 수행하지 않았습니다.

## 수정할 파일

| 목적 | 파일 |
| --- | --- |
| 홈페이지 소개·경력·연락처 | `index.html` |
| 사례 카드·상세 내용·공통 메뉴 | `site-pages.js` |
| 공통 디자인·모바일 레이아웃 | `styles.css` |
| 게시글 템플릿·홈 최신 글·생성 과정 | `build.js` |
| 글 본문과 도식 스타일 | `article.css` |
| 전체 글 목록 스타일 | `writing.css` |
| 공개 글 원문 | `content/posts/*.md` |

## 로컬 확인

```bash
npm run build
npm run check
npm run dev
```

브라우저에서 `http://localhost:4173/`를 엽니다. 추가 패키지 없이 Node.js만 사용합니다.

## 배포 전 확인 결과

- 페이지 생성, JavaScript 구문 검사, 공개 파일·내부 링크·앵커·중복 ID 검사 통과.
- 원본의 두 Markdown 게시글 내용과 파일명, 관리자 설정 보존.
- PC 1363px 화면과 1024px 폭 구성, 390px·360px 모바일 크기의 브라우저 프레임 확인.
- 모바일 메뉴 열기·Escape 닫기, 사례 진입, Forecast 탭과 키보드 이동, 글 필터와 빈 목록 상태 확인.
- 모바일 홈·Forecast 사례·원재료 게시글에서 페이지 가로 넘침 없음. 표는 표 영역 안에서 가로 스크롤합니다.
- 실제 휴대폰 기기 및 CMS 로그인은 별도로 검증하지 않았습니다.

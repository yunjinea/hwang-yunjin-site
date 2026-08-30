# AFTER THE NUMBERS — VERSION 1

기준일: 2026-08-30

이 폴더는 현재 확정된 홈페이지 프론트엔드의 **Version 1 기준본**입니다.
앞으로 디자인/기능 수정은 이 버전을 기준으로 관리합니다.

## 파일

- `index.html` — 페이지 구조와 콘텐츠
- `styles.css` — 전체 디자인, 반응형, 애니메이션
- `script.js` — 메뉴, Hero, Career, Cases, Expertise, Writing 동작
- `VERSION.md` — Version 1 기준과 정리 내역

## 배포

GitHub 저장소 루트의 `index.html`, `styles.css`, `script.js`를 이 세 파일로 교체하면 됩니다.
기존 `build.js`는 이 세 파일을 `dist/`로 복사하므로 빌드 구조를 바꿀 필요가 없습니다.
`admin/`, `content/`, `build.js`, `package.json`은 그대로 유지하세요.

## 유지보수 원칙

1. 새로운 수정은 HTML 안에 `<style>` 또는 큰 인라인 `<script>`를 추가하지 않습니다.
2. 스타일은 `styles.css`, 동작은 `script.js`에 반영합니다.
3. 임시 버전 패치는 최종 확정 시 기존 로직에 통합합니다.
4. 모바일과 PC는 같은 콘텐츠를 공유하되 UX는 각 화면 크기에 맞게 분리합니다.

# VERSION 1

**Baseline:** 2026-08-30

## 포함된 현재 동작

- Hero: 현재 확정된 자동 Cinematic/FP&A visual
- Career: 이전 pinned scroll-progress 방식 유지
- Current Focus 01~03: 확정된 상세 문구/도식
- Selected Cases Intro: SEE → EXPLAIN → DECIDE → CONTROL 순차 등장
- Cases 01~04: 각기 다른 one-time motion language
- Expertise: 모바일 01~05 개별 scene
- Writing: 모바일 normal flow, CMS empty-state 지원
- About: 불필요한 긴 모바일 runway 제거
- Reduced Motion 대응 유지

## 코드 정리

- 단일 300KB+ HTML에서 CSS/JS 분리
- B5.6a / B5.6b / B5.6c / B5.6d 누적 패치 제거
- 롤백된 7-screen Career 생성 코드 제거
- 구형 모바일 Cases/Expertise/Writing scroll-progress writer 제거
- Selected Cases Intro 애니메이션 로직을 하나로 통합
- Writing 상단의 잔류 inline opacity 문제 발생 경로 제거

이 버전을 이후 변경의 기준점으로 사용합니다.

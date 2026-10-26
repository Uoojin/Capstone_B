# 메인 스트로크 및 배경 추적 수정

수정 요소: 히어로 기본/인터랙션 안내, Delight Insight 제목과 연도, 설명의 모든 줄. 기존 CSS 스트로크를 HTML 텍스트 뒤의 SVG 외곽선으로 변경. 실제 HTML의 글꼴·크기·자간·줄바꿈·정렬은 그대로 두고 Range로 줄별 좌표를 측정한다. SVG stroke-linejoin/linecap은 round이며 블러·그림자는 사용하지 않는다. 기존 제목의 1px text-shadow도 제거했다.

배경 LET’S/SYNC!는 기존 둥근 SVG 외곽선을 유지한다. Canvas에는 strokeText가 없으며, 기존 타이포 SVG와 공 PNG는 채움/이미지 방식이므로 원본을 변경하지 않았다.

## 파일
- src/pages/Home/RoundedStrokeText.jsx (추가): HTML 텍스트의 둥근 SVG 외곽선, 리사이즈·폰트 로딩 갱신·정리
- src/pages/Home/RoundedStrokeText.css (추가): Home 전용 외곽선 레이어
- src/pages/Home/Home.jsx: 히어로 두 안내에 적용
- src/pages/Home/Home.css: 기존 6px 화이트 스트로크를 렌더러 변수로 전달
- src/pages/Home/DelightInsight.jsx: 제목·설명에 적용, 배경의 스프링 추적 및 속도 기반 기울기
- src/pages/Home/HomeSections.css: 기존 vw/모바일 px 두께와 컬러를 렌더러 변수로 전달

## 동작
섹션 전체에서 포인터를 추적하며 최대 X ±100px, Y ±70px로 이동한다. 현재 위치와 목표 사이에 감쇠 스프링을 적용한다. 포인터의 좌표 차이/시간 및 타이포 이동 속도로 추가 기울기를 산출하고 기본 -15도에서 ±10도 범위로 제한한다. 멈추면 위치는 목표에 도달하고 각도는 -15도로 복귀한다. 이탈 시 위치·각도 모두 초기화하며, 수렴하면 rAF를 중단한다.

## 확인
- 브라우저 1444×834: 좌상단 -90.3/-54.1px, 우하단 +91.1/+49.3px 위치 변화 확인.
- 빠른 우측 이동 중 -5.59도, 좌측 이동 중 -24.11도 확인. 정지 후 -15도 복귀, 이탈 후 translate3d(0,0,0) 확인.
- 마우스 이동 전후 전면 제목의 rect는 x385.367/y371.664/width227.664/height90.25로 동일.
- 스트로크 실측: 히어로 6px, 데스크톱 제목19.494px(1.35vw), 설명15.884px(1.1vw), 모바일 제목12px/설명8px. 모두 기존 화이트·round 유지.
- 모바일 390×844 줄바꿈·외곽선·clipping·가로 넘침 확인. 가로 넘침 없음.
- 브라우저 console error/warn 없음.
- npm run build / npm run lint 통과. 빌드의 500KB 청크 경고는 유지.
- 작업 전 전체 src 해시와 비교하여 위 네 파일 및 신규 두 파일 이외의 소스·에셋 변경 없음 확인.

# 2번째 원근 시점 및 8번째 고정 안내 수정

## 수정 파일
- src/pages/Home/DelightInsight.jsx: 포인터 추적 이동/속도 회전을 제거. 섹션 중심 기준 정규화 좌표로 rotateX/rotateY ±25도 계산, rAF 보간. 정지 시 현재 시점 유지, 이탈 시 0/0도로 복귀.
- src/pages/Home/HomeSections.css: 배경 SVG의 기본 transform만 perspective(1000px), rotateX(0), rotateY(0), rotateZ(-15) 및 center center 원점으로 지정. 크기·위치·스트로크·패널·전면 문구 유지.
- src/pages/Home/InteractiveBalls.jsx: 고정 문구를 React DOM으로 유지하고 공 엔진으로 전달하던 안내 ref 제거.
- src/pages/Home/InteractiveBalls.css: 안내의 opacity 전환/숨김 규칙 삭제. Canvas z-index 0, 상단 UI z-index 1, 안내 배경을 기존 섹션 색과 같게 지정하여 공·연결선이 텍스트를 가리지 않게 처리.
- src/pages/Home/balls/balls-engine.js: 모드/공 추가 제한/재진입 시 안내 문구 변경 및 2.8초 숨김 타이머 제거. 공의 물리 함수와 전체 렌더링 함수는 수정 전과 바이트 단위로 동일.

## 브라우저 확인
- 위: rotateX -20.3163도 / 아래: +18.6681도.
- 왼쪽: rotateY +22.7184도 / 오른쪽: -22.7184도.
- 대각선: rotateX -19.1944도와 rotateY -22.7184도 동시 적용.
- 모든 상태에서 translate(-50%,-50%)는 고정이고 별도의 포인터 X/Y 이동 없음. 기본 rotateZ -15도 유지.
- 이탈 후 rotateX/rotateY 모두 0도로 복귀. 전면 제목 rect는 x409.391/y402.281/width241.859/height95.875로 변함없음.
- PLAY/PULL 전환, 공 드래그, 6회 더블클릭을 통한 공 추가 및 최대 개수 도달 후에도 안내 문구가 동일하고 opacity 1 유지.
- 추가로 4초 대기한 뒤에도 안내가 그대로 표시되며 transition-duration은 0s.
- 안내는 Canvas 외부 React DOM이며 상단 UI의 레이어가 Canvas 위에 위치.
- 브라우저 console error/warn 없음.

## 검증
- npm run build 성공 (기존 500KB 청크 경고만 있음).
- npm run lint 성공.
- 원본 물리 비교 회귀 검사 통과. 최대 개수의 동적 안내를 기대하던 검사는 새 요구에 맞게 제외하고 고정 안내는 브라우저에서 별도로 확인.
- 전체 src 해시 비교: 위 다섯 파일 외 소스/에셋 변경 없음. Hero, 7번째 설명, 공 디자인, 내부 PNG, 버튼 디자인, 물리, 영상, 다른 섹션, Header/Footer 및 모든 서브 페이지 보존.

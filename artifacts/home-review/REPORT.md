# Capstone_B 메인 페이지 수정 결과

## 구현 범위와 파일

| 파일 | 내용 |
|---|---|
| `src/pages/Home/Home.jsx` | Hero 내부 안내 문구 추가. 기존 모바일 Hero 아래에도 새 섹션 연결 |
| `src/pages/Home/Home.css` | 상단 중앙 안내, 호버·드래그 문구 전환, 기존 헤더 메뉴 상태에 따른 숨김 |
| `src/components/TypeInteraction/type-engine.js` | 기존 노드 앵커 안내만 제거하고 기존 호버 판정·드래그 상태를 host 데이터 속성으로 노출 |
| `src/pages/Home/HomeSections.jsx` | 최종 섹션 순서 구성. 영상 JSX·effect 그대로 보존 |
| `src/pages/Home/HomeSections.css` | 신규 섹션 스타일. 기존 영상 CSS 그대로 보존 |
| `src/pages/Home/DelightInsight.jsx` (추가) | 연한 그레이 패널, 배경 타이포, 고정 전면 문구, 보간을 적용한 2D 회전 |
| `src/pages/Home/NewHomeSections.jsx` (추가) | SparkBanner, EmptyContent, EmptyFilm, PullPlaySyncopate, SyncFinale |
| `src/pages/Home/InteractiveBalls.jsx` (추가) | 함수형 컴포넌트와 useRef/useEffect로 Canvas·버튼·안내 연결 |
| `src/pages/Home/InteractiveBalls.css` (추가) | 섹션 내부 Canvas, 안내, 모드 버튼과 모바일 레이아웃 |
| `src/pages/Home/balls/balls-engine.js` (추가) | 원본 HTML의 물리·렌더링·이벤트 이식과 수명 관리 |
| `src/pages/Home/balls/ball-0.png` ~ `ball-9.png` (추가) | HTML에 내장된 PNG 10개를 바이트 변경 없이 추출 |
| `src/pages/Curriculum/Curriculum.jsx` | 사용자 추가 지시에 따라 삭제된 DrawingObject.svg 참조 한 줄만 기존 symbol/symbol_1.svg로 변경 |

## 최종 구성

1. Hero: 기존 타이포 SVG·점의 움직임·호버 시 정지·연결·드래그·커서·인트로 유지. 안내는 Hero 내부 absolute 요소이며 기본/인터랙션 두 문구를 같은 그리드 칸에 겹쳐 크기 변화를 방지. 기존 헤더의 is-menu-open 상태를 CSS로 읽으므로 헤더 수정 없음.
2. Delight Insight 2026: 화이트 여백, 라운드 패널, 흰색/연회색 대형 타이포. 기본 -15도에서 최대 ±15도 범위 내 2D rotate. 포인터 이탈 시 기본 각도로 보간 복귀. 전면 텍스트 고정.
3. 기존 영상: 파일, 경로, JSX 속성, 진입·이탈 재생 effect, CSS 모두 원본 유지. 원본은 loop 속성이 없으며, 종료 프레임을 유지하다 재진입하면 처음부터 재생하는 방식도 유지.
4. 당기고, 닿고, 스파크!: 가로형 핑크 배너, 들여쓴 둘째 줄, 우측 설명과 정적인 작은 장식.
5. 빈 콘텐츠: 독립 컴포넌트, 화이트, 최소 100dvh, 내부 콘텐츠 없음.
6. 빈 영상: 독립 컴포넌트, 화이트, 최소 100dvh, 영상·플레이스홀더 없음.
7. Pull. Play. Syncopate: 두 줄 대형 핑크 타이포, 둘째 줄 들여쓰기, 애니메이션 없음.
8. Interactive Balls: 섹션 내부 Canvas와 PULL/PLAY, 원본 그래픽·라벨·물리 로직 유지.
9. LET’S SYNC!: 기존 src/assets/LET'SSYNC!.svg 원본을 중앙에 배치. 비율·색상·텍스처 변경 없음.
10. 기존 Footer 연결.

## HTML 이식 내역

- 초기 5개 공의 오각형 배치, 원본 반지름 계산, 10개 이미지와 영문 라벨 순서 및 배치 유지.
- 표시상 PULL → 원본 내부 play: 커서 끌어당김, 달라붙음, 빠른 흔들기로 분리, 관성·쿨다운.
- 표시상 PLAY → 원본 내부 pull: 잡기, 드래그 오프셋, 놓을 때 속도, 중력, 벽·바닥 바운스.
- 충돌 분리, 충격량, 회전·스핀, 접촉 시 핑크 채움과 흰 그래픽 전환 유지.
- 커서와 공 사이 연결선, 장력에 따른 색·굵기, 커서 점 유지.
- 더블클릭/더블탭 추가, 생성 시 크기 보간, 최대 10개 안내와 복귀, 모드별 문구·2.8초 후 안내 숨김 유지.
- 원본의 bonds/thread/magnet 관련 보조 경로도 보존. 원본에는 이 상태를 새로 활성화하는 입력이 없으므로 별도의 공끼리 연결하는 신규 동작을 만들지는 않음.
- iframe/전체 HTML 삽입 없음. 이벤트는 Canvas/버튼에 한정하고 좌표는 섹션 기준. 전역 overflow/touch-action 변경 없음.
- ResizeObserver로 해상도·DPR·반지름·위치·기준점을 조정. 반응형 크기 변경 시 기존 위치 비율 보존.
- IntersectionObserver로 이탈 시 프레임 정지·드래그 해제, 재진입 시 단일 루프 재개. 탭 비활성 시 정지.
- cleanup에서 이벤트 AbortController, observer, rAF, 타이머, 포인터 캡처와 이미지 onload 정리.
- 커서가 공 중심과 정확히 일치할 때 0으로 나누지 않도록 거리 최솟값 .001 적용. 일반 입력에서는 원본 계산과 동일.
- 모바일 Canvas는 touch-action: pan-y로 일반 세로 스크롤 유지. 세로 터치는 브라우저 스크롤이 우선하며 pointercancel로 잡기를 정리.

## 검증 결과

- `npm run build`: 성공. 기존 /Capstone_B/ base와 하위 경로 index 생성 설정 유지. 500KB 이상 JS 청크에 대한 Vite 경고는 있음.
- `npm run lint`: 전체 성공.
- `node artifacts/home-review/verify-balls.mjs`: 18개 검사 통과. 첨부 HTML과 같은 난수·시간·입력으로 초기 상태, 부유, 끌어당김·충돌, 흔들기, 중력·바운스, 잡기·던지기·회전, 공 추가 상태의 수치 일치를 비교. 이탈 정지·재진입 루프·리사이즈·cleanup도 검사.
- 원본 내장 PNG 10개와 추출 파일의 바이트 일치 확인.
- 원본 영상 effect와 영상 CSS의 문자열 일치 확인.
- 1530×900, 390×844 브라우저 검증: 가로 스크롤 넘침 없음, Canvas 크기 일치, 버튼 전환·드래그·공 추가·최대 개수 안내 확인.
- 브라우저: Hero 기본 안내·호버/드래그 안내·기본 복귀, 메뉴 열림 숨김/닫힘 표시 확인. 기존 노드 정지·복귀 로직은 수정하지 않음.
- 브라우저: 영상 readyState 4, 진입 시 paused=false와 currentTime 진행, 이탈 후 paused=true 확인.
- 브라우저: 모바일 정상 이미지 표시, PROJECT 이동 후 Home Canvas·커서 레이어 0개, 세로 스크롤 정상 확인.
- 최종 확인 시 브라우저 console error/warn 없음.
- Header, Footer, App 라우팅, 배포 설정, 전역 CSS, PROJECT/STUDENT/BEHIND/GUESTBOOK/PHOTOBOOTH/기타 Content 파일 변경 없음을 git diff로 확인. 모든 서브페이지 기능의 전체 E2E 검사를 수행한 것은 아님.

## 확인이 필요한 사항

- 실제 GitHub Pages 배포는 실행하지 않음. 로컬 검증 링크: http://127.0.0.1:5173/Capstone_B/
- 첨부 6장은 Hero 전체, Hero 상단 안내, Insight, 핑크 배너, Pull/Play 타이포, 마지막 SVG 순서로 확인됨. 공 섹션의 별도 이미지 레퍼런스는 없어 HTML의 외형·글자·물리를 기준으로 구현하고 안내 위치는 요청대로 좌측 상단에 적용.
- 기존 모바일 Hero는 별도 포스터/전시 안내 구성이라 보존하고 새 섹션을 그 아래에 연결. 기존 모바일 포스터 이미지가 null인 회색 영역과 모바일 전시 문구·날짜는 변경하지 않음.
- 작업 시작 전 heroTitle.svg 변경, DrawingObject.svg·let’ssync.svg 삭제, LET'SSYNC!.svg 및 Let's Sync 폴더 추가 상태가 이미 존재했음. 이 에셋들은 수정·복원하지 않았으며 최종 SVG는 제공된 현재 파일을 사용.
- 회귀 비교 스크립트는 /Users/yujin/Downloads/lets-sync-balls.html 원본을 읽고 프로젝트 루트에서 실행해야 함.

## 캡처

- insight-desktop.png: 교체한 Delight Insight 섹션
- balls-desktop.png: 원본 PNG와 라벨을 사용하는 공 섹션

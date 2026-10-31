# 최종 폴더 구조 정리 결과 — 2026-10-31

이번 작업의 비교 기준은 **최종 수정 요청을 받은 시점의 작업 폴더**입니다. 이전 작업의 수정·삭제 내용과 데이터는 그대로 보존했습니다. 아래 구조가 현재 구조이며, 지난 보고서의 경로 설명을 대체합니다.

## 최종 프로젝트 구조

```text
branding/
├── src/                 # 아래에 전체 소스 파일 구조 기재
├── public/              # 기존 배포용 에셋, 위치·내용 유지
├── supabase/            # 기존 SQL·설정 자료 유지
├── scripts/             # 기존 제작 스크립트 유지
├── docs/refactor/       # 이번 구조 설명·검증 결과
├── .github/             # 기존 배포 workflow 유지
├── index.html
├── package.json / package-lock.json
├── vite.config.js / eslint.config.js
├── README.md
├── node_modules/        # 설치 의존성
└── dist/                # 빌드 산출물
```

```text
src/
├── assets/ (192개 기존 에셋, 위치 유지)
├── components/
│   ├── Footer/
│   │   ├── Footer.css
│   │   └── Footer.jsx
│   ├── Header/
│   │   ├── Header.css
│   │   └── Header.jsx
│   ├── PageTransition/
│   │   ├── PageTransition.css
│   │   ├── PageTransition.jsx
│   │   └── PageTransitionContext.js
│   ├── RoundedStrokeText/
│   │   ├── RoundedStrokeText.css
│   │   └── RoundedStrokeText.jsx
│   └── ScrollToTop.jsx
├── data/
│   ├── README.md
│   ├── categories.js
│   ├── dataUtils.js
│   └── index.js
├── pages/
│   ├── Behind/
│   │   ├── Behind.css
│   │   ├── Behind.jsx
│   │   └── behindData.js
│   ├── Curriculum/
│   │   ├── ConvergenceDiagram.jsx
│   │   ├── Curriculum.css
│   │   ├── Curriculum.jsx
│   │   └── curriculumData.js
│   ├── Guestbook/
│   │   ├── AdjustablePhoto.jsx
│   │   ├── Guestbook.css
│   │   ├── Guestbook.jsx
│   │   ├── GuestbookModal.jsx
│   │   ├── Message.css
│   │   ├── Message.jsx
│   │   ├── PhotoBooth.css
│   │   ├── PhotoBooth.jsx
│   │   └── guestbookApi.js
│   ├── Home/
│   │   ├── sections/
│   │   │   ├── Hero/
│   │   │   │   ├── Hero.css
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── TypeInteraction.css
│   │   │   │   ├── TypeInteraction.jsx
│   │   │   │   ├── sync-contact-motion.js
│   │   │   │   ├── type-engine.js
│   │   │   │   └── type-scene.css
│   │   │   ├── Section01/
│   │   │   │   ├── Section01.css
│   │   │   │   └── Section01.jsx
│   │   │   ├── Section02/
│   │   │   │   ├── Section02.css
│   │   │   │   ├── Section02.jsx
│   │   │   │   ├── SyncTypographyMotion.jsx
│   │   │   │   ├── sync-typography-motion.js
│   │   │   │   └── syncopateEngine.js
│   │   │   ├── Section03/
│   │   │   │   ├── InteractiveBalls.css
│   │   │   │   ├── InteractiveBalls.jsx
│   │   │   │   ├── PullPlayTransition.css
│   │   │   │   ├── PullPlayTransition.jsx
│   │   │   │   ├── Section03.css
│   │   │   │   ├── Section03.jsx
│   │   │   │   ├── ball-sparks.js
│   │   │   │   ├── ball-typography.js
│   │   │   │   ├── balls-engine.js
│   │   │   │   └── pull-play-motion.js
│   │   │   ├── Section04/
│   │   │   │   ├── Section04.css
│   │   │   │   └── Section04.jsx
│   │   │   └── Video/
│   │   │       ├── Video.css
│   │   │       ├── Video.jsx
│   │   │       └── useExhibitionFilm.js
│   │   ├── Home.css
│   │   └── Home.jsx
│   ├── Project/
│   │   ├── Project.css
│   │   ├── Project.jsx
│   │   └── projectData.js
│   ├── Student/
│   │   ├── Student.css
│   │   ├── Student.jsx
│   │   ├── hangulSearch.js
│   │   └── studentData.js
│   └── Syncopate/
│       ├── DrawingEditor.css
│       ├── DrawingEditor.jsx
│       ├── Syncopate.css
│       ├── Syncopate.jsx
│       └── supabase.js
├── utils/
│   ├── createMediaQueryStore.js
│   └── shuffle.js
├── App.jsx
├── global.css
├── index.css
└── main.jsx
```

에셋 파일 192개는 src/assets에 기존 이름과 경로로 유지했습니다. .DS_Store 같은 시스템 메타데이터는 구조 표에서 생략했습니다. 섹션 폴더 내부에 components 또는 balls 중간 폴더를 만들지 않았습니다.

## 메인 섹션별 구성

화면상의 순서는 기존 구현 그대로입니다. 폴더의 알파벳 정렬 순서가 아닌 Home.jsx의 JSX 순서로 관리합니다.

| 화면 순서 | 폴더 | 구성 |
| --- | --- | --- |
| 1 | Hero | Hero JSX/CSS, TypeInteraction JSX/CSS, type-engine, type-scene, sync-contact-motion |
| 2 | Section01 | 전시 소개 JSX, 해당 섹션의 기본·반응형 CSS |
| 3 | Video | 영상 JSX/CSS, useExhibitionFilm |
| 4 | Section02 | 섹션 JSX/CSS, SyncTypographyMotion, sync-typography-motion, syncopateEngine |
| 5 | Section03 | 섹션 JSX/CSS, PullPlayTransition JSX/CSS, pull-play-motion, InteractiveBalls JSX/CSS, balls-engine, ball-sparks, ball-typography |
| 6 | Section04 | 마무리 JSX와 기본·반응형 CSS |

Home.jsx는 데스크톱 섹션을 조립하는 유일한 파일입니다. HomeSections/NewHomeSections는 이번 작업 시작 시 이미 제거된 상태였으며 다시 만들지 않았습니다. Home 안의 DesktopHome/MobileHome 함수는 기존 반응형 마운트 경계를 보존합니다.

Video의 hook은 파일만 Video 폴더로 이동했습니다. 호출은 계속 DesktopHome에서 수행하므로 자식 인터랙션 effect 다음에 영상 observer가 등록되는 순서를 유지합니다. Section03의 PullPlayTransition > InteractiveBalls 중첩도 그대로입니다.

## 이동·통합한 파일

| 이전 위치 | 최종 위치 또는 처리 |
| --- | --- |
| Home/sections/{이름}.jsx 및 .css | Home/sections/{이름}/{이름}.jsx 및 .css |
| components/TypeInteraction의 사용 중인 5개 파일 | Home/sections/Hero에 직접 배치 |
| Home/SyncTypographyMotion.jsx, sync-typography-motion.js, syncopateEngine.js | Home/sections/Section02에 직접 배치 |
| Home/PullPlayTransition JSX/CSS, pull-play-motion.js, InteractiveBalls JSX/CSS | Home/sections/Section03에 직접 배치 |
| Home/balls의 엔진·파티클·타이포 파일 | Home/sections/Section03에 직접 배치 |
| Home/useExhibitionFilm.js | Home/sections/Video/useExhibitionFilm.js |
| Home/MobileHome.jsx | 정적 JSX와 기존 함수 경계를 Home.jsx 내부로 통합 |
| Home/sections/Sections.css | 섹션별 반응형 규칙은 해당 섹션 CSS로, 페이지 공용·보류 규칙과 CSS import는 Home.css로 통합 |
| Home/Home.css의 Hero 규칙 | Home/sections/Hero/Hero.css |
| lib/guestbookApi.js | pages/Guestbook/guestbookApi.js |
| lib/supabase.js | pages/Syncopate/supabase.js |

이동 후 이전 위치에 구현 복사본은 남기지 않았습니다. 비게 된 components/TypeInteraction, Home/balls, lib 폴더도 제거했습니다.

## 삭제·유지 판단

- MobileHome.jsx는 정적 JSX를 Home.jsx에 통합하여 제거했습니다. 실제 DOM과 콘텐츠는 동일합니다.
- Sections.css는 스타일을 소유 섹션으로 이전하여 제거했습니다. 별도 스타일 조립 파일 대신 Home.css에서 명시적으로 import합니다.
- heroHandoff.js는 src/public/scripts의 import·호출·등록 참조가 모두 없고, 동적 JS glob에도 포함되지 않는 독립 파일임을 확인하여 제거했습니다. 실행 중인 엔진에서 사용하는 파일이 아니었습니다.
- 기존 .home-spark 등 현재 섹션에 연결되지 않는 스타일은 불확실한 사용 가능성을 고려해 Home.css에 보존했습니다. 새 섹션 파일에 임의로 배정하지 않았습니다.
- 작더라도 독립 상태·ref·effect·포커스·포털 처리가 있는 AdjustablePhoto, GuestbookModal, ConvergenceDiagram 등은 해당 페이지의 같은 폴더에 유지했습니다.
- 복잡한 인터랙션 파일은 내부 실행 로직을 변경하지 않았습니다. 이동에 필요한 import 및 에셋 glob 경로만 갱신했습니다.

## 다른 페이지와 공통 코드

Project, Student, Curriculum, Behind, Guestbook, Syncopate 모두 페이지 전용 파일을 각 페이지 폴더에서 직접 관리합니다. Project/Student의 데이터 원본과 전용 검색 함수도 기존 페이지 폴더에 유지했습니다. Guestbook의 API와 Syncopate의 Supabase 클라이언트는 각 페이지 폴더로 옮겼으며, 서로 다른 연결을 합치지 않았습니다.

src/components에는 다음 실제 공통 기능만 남겼습니다.

- Header / Footer: 여러 페이지의 공통 UI.
- PageTransition / PageTransitionContext: 페이지 이동과 여러 페이지의 전환 준비 상태.
- ScrollToTop: 모든 경로의 공통 스크롤 처리.
- RoundedStrokeText: Home과 Guestbook에서 실제 사용.

src/data는 Project와 Student 사이의 공통 데이터 변환·연결·분류를 유지합니다. src/utils의 shuffle과 createMediaQueryStore도 실제 여러 페이지 및 App에서 사용하므로 공통 위치에 유지했습니다.

## 섹션 추가 방법

Home/sections/Section05에 JSX·CSS와 필요한 전용 기능 파일을 직접 둡니다. Home.jsx에서 해당 JSX를 import하여 원하는 순서에 추가하고, Home.css에서 섹션 CSS를 import합니다. 기존 섹션 내부를 수정하거나 별도의 등록 시스템을 추가할 필요가 없습니다. 기존 일반 섹션 사이에 삽입하는 경우 실제 화면 순서에 맞춰 번호와 참조를 함께 변경합니다. 모바일은 기존처럼 Home.jsx 내부의 별도 정적 화면입니다.

## 검증

- 변경 전후 npm run lint와 npm run build 통과.
- 이동한 JS/JSX의 import 및 에셋 glob 선언을 제외한 실행 본문 비교에서 차이 없음. 삭제한 미참조 heroHandoff와 통합한 MobileHome은 별도 확인.
- 빌드 CSS의 선택자·미디어쿼리 문맥 1,237개별 선언값·중복 선언 순서를 비교해 차이 없음. 섹션별 반응형 규칙을 함께 배치하여 **전체 CSS의 텍스트 순서·파일 해시는 달라졌으며**, 바이트 동일이라고 보고하지 않습니다. 인터랙션 CSS는 기존처럼 섹션 기본 CSS보다 먼저 적용되도록 유지했습니다.
- 빌드된 CSS/JS 외 미디어·폰트 등 179개 에셋은 변경 전후 바이트 동일.
- Vite base, 라우트 URL, GitHub Pages 설정, Supabase의 환경 변수·인증·테이블·쿼리는 변경하지 않았습니다.
- Vite의 기존 500kB 초과 번들 경고는 유지됩니다.

### Chrome 브라우저 비교 결과

- 변경 전후 프로덕션 빌드를 별도 로컬 서버에서 비교했습니다. Home, Project, Student, Curriculum, Credit, Syncopate, Guestbook의 1440/820/390px × 높이 900px, 총 21개 조합 모두 샘플 DOM·계산 스타일·배치가 동일했습니다. 모바일 제한 경로는 기존 Home 리디렉션 결과를 비교했습니다.
- 변화가 계속되는 Project 캐러셀, Credit 스크롤 내부, SVG 내부와 shadow DOM·canvas 픽셀은 배치 표본에서 제외했습니다. 전체 픽셀 비교 또는 모든 인터랙션 상태 비교를 의미하지 않습니다.
- 변경 전후 각 10개, 총 20회 대표 시나리오가 모두 통과했습니다: 히어로 canvas 마운트·Section01 포인터 모션, 영상 진입 재생·이탈 정지, Pull hold·공 모드·헤더 복구, 학생 뒤집기·검색, 프로젝트 상세 열기·닫기, 융합 다이어그램 포커스, 크레딧 자동 스크롤, 드로잉 모달, 메시지 입력 검증·Escape·inert 복구, 포토부스 열기·닫기·모바일 리디렉션.
- 브라우저 pageerror 0건, 로컬 요청 실패 0건입니다. 외부 Supabase HTTP 응답은 빈 목록으로 대체했습니다. 실제 저장·업로드·실시간 동기화 검증이 아닙니다.
- 원시 요약은 layout-comparison.json에 저장했습니다.

**미검증**: 히어로 SYNC 생성·충돌·파티클·물리 움직임의 프레임 단위 동일성, 캐러셀/크레딧 전체 애니메이션 프레임, 모든 브레이크포인트·스크롤 위치, Safari/Firefox, 실제 Supabase 등록·실시간 반영, 카메라 촬영·파일 업로드·QR 다운로드, 배포 서버에서의 실제 실행. 이 항목들은 검증 완료로 표시하지 않습니다. 복잡한 실행 로직은 위치 및 import/glob 경로 외에 수정하지 않았습니다.

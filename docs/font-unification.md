# 웹사이트 폰트 통일 변경 및 검증

## 적용 방식

- 한글 음절·자모가 포함된 문단/제목/텍스트 단위 전체: Pretendard. 내부 영문 span도 같은 폰트를 상속합니다.
- 영문 전용 텍스트: Helvetica Neue. 미설치 기기의 대체 글꼴은 Pretendard만 지정했습니다.
- 숫자·기호만 있는 텍스트: 주변 텍스트의 지정 폰트를 상속합니다.
- 프로젝트/학생 데이터, 입력값·placeholder, 모달·포털 및 로딩 화면의 DOM 텍스트 변경을 관찰합니다. lang 속성은 판별에 사용하지 않습니다.
- CSS font-family를 공통 변수로 연결했습니다. 별도 DOM 래퍼나 텍스트 변경 없이 data-text-font 속성만 부여합니다.
- 캔버스 텍스트에는 같은 언어 판별을 적용했고, SVG의 실제 text/tspan은 같은 CSS 규칙을 받습니다. 패스로 변환된 SVG와 이미지 파일은 수정하지 않았습니다.
- MutationObserver는 텍스트/폼 속성만 관찰하며, 애니메이션의 style·path 변경은 관찰하지 않습니다. 언마운트 시 옵저버와 이벤트를 정리합니다.

## 폰트 파일

- Pretendard v1.3.9 Variable WOFF2를 공식 배포본에서 설치하고 OFL 라이선스를 함께 보관했습니다. Vite가 배포 base 경로에 맞춰 번들링합니다.
- 현재 Mac의 Helvetica Neue는 `/System/Library/Fonts/HelveticaNeue.ttc`에 이미 설치되어 있습니다.
- Helvetica Neue 웹폰트 파일을 추가 배포하지는 않았습니다. 모든 기기에 같은 Helvetica Neue를 보장하려면 별도의 정식 웹폰트가 필요합니다. 현재 미설치 기기는 Pretendard를 사용합니다.
- 공식 출처: [Pretendard](https://github.com/orioncactus/pretendard), [Helvetica Neue 배포처](https://www.myfonts.com/collections/neue-helvetica-font-linotype).

## 검증

| 화면 | 크기 | 확인 경로 | 결과 |
|---|---|---|---|
| PC | 1920×1080 | Home, Project, Student, Guestbook, Curriculum, Syncopate, Behind | 언어별 폰트 불일치/페이지 가로 넘침 없음 |
| 노트북 | 1366×768 | 위 7개 경로 | 동일 |
| 태블릿 | 1024×768 | 위 7개 경로 | 동일 |
| 모바일 | 390×844 | Home, Project, Student 및 나머지 경로의 기존 Home 리다이렉트 | 동일 |

- 프로젝트 상세 모달, 학생 검색의 한글/영문 입력 전환, 학생 카드의 영문 라벨·한글 설명, 방명록 메시지 모달, 드로잉 모달, 로딩 화면에서 실제 계산 폰트를 확인했습니다.
- 혼합 제목 `TEAM42(사이)`의 TEAM까지 Pretendard, 독립된 `PLANNER` 라벨은 Helvetica Neue인 것을 확인했습니다.
- 카메라 접근·메시지 전송·공유는 수행하지 않았습니다.
- 기존 모든 CSS에서 font-family 외 선언이 동일한지 비교했습니다. font shorthand의 크기·굵기·행간도 유지했습니다.
- 다른 폰트 이름의 선언을 제거했고, 변경 JS의 ESLint와 Vite production build를 통과했습니다.
- 태블릿 Header의 기존 고정폭/overflow 구조에서 메뉴가 잘릴 수 있는 상태는 별도 레이아웃 문제입니다. Header CSS는 변경하지 않았습니다.

## 변경 파일

- `src/fonts.css`
- `src/components/LanguageFonts/LanguageFonts.jsx`
- `src/components/LanguageFonts/languageFontPolicy.js`
- `src/utils/textFonts.js`
- `src/assets/fonts/PretendardVariable.woff2`
- `src/assets/fonts/Pretendard-LICENSE.txt`
- `src/main.jsx`
- `src/index.css`
- `src/pages/Home/sections/Hero/type-engine.js`
- `src/pages/Home/sections/Section03/syncopateEngine.js`
- `src/components/PageTransition/PageTransition.css`
- `src/global.css`
- `src/pages/Curriculum/Curriculum.css`
- `src/pages/Guestbook/Guestbook.css`
- `src/pages/Home/sections/DesignMotifs/DesignMotifs.css`
- `src/pages/Home/sections/Hero/Hero.css`
- `src/pages/Home/sections/Hero/TypeInteraction.css`
- `src/pages/Home/sections/Hero/type-scene.css`
- `src/pages/Home/sections/RollingTypography/RollingTypography.css`
- `src/pages/Home/sections/Section01/Section01.css`
- `src/pages/Project/Project.css`
- `src/pages/Syncopate/DrawingEditor.css`
- `src/pages/Syncopate/Syncopate.css`
- `docs/font-unification.md` — 이 변경/검증 기록

기존 사용자 수정(프로젝트 파일, 타이포 SVG, Section03 스타일 등)은 유지했으며 이 작업의 변경 목록에 포함하지 않았습니다.

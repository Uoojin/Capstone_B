# 졸업전시 데이터 입력 안내

## 입력 파일

- `src/pages/Project/projectData.js`: 프로젝트 17개. `PROJECT 01` ~ `PROJECT 17` 주석으로 검색합니다.
- `src/pages/Student/studentData.js`: 학생 113명. `STUDENT 001` ~ `STUDENT 113` 주석으로 검색합니다.
- `src/data/categories.js`: 기존 MEDIA / SUBJECT / TARGET 선택값입니다.

프로젝트 ID는 `project-01` ~ `project-17`로 유지합니다. 학생 ID는 `kwonnayeong`처럼 영문 이름으로 직접 지정합니다. 영문으로 시작하고 공백/특수기호 없이 영문과 숫자만 사용하세요. 아직 이름이 없는 학생은 기존 `student-001` ~ `student-113` 임시 ID를 유지합니다. nameEn은 표시용으로 유지하며 ID를 자동 생성하지 않습니다. 입력 객체를 추가로 생성할 필요가 없습니다. 모든 이름/소개/카테고리/이미지 키는 빈 문자열이며 선택 링크는 null입니다. 팀 번호만 `001` ~ `017`로 지정되어 있습니다.

파일을 저장하면 다음 페이지 로드에 반영됩니다. 개발 서버에서 이전 내용이 남아 보이면 브라우저를 새로고침하세요. 배포 사이트는 `npm run build` 후 기존 배포 절차를 진행해야 합니다.

## 프로젝트 입력

```js
// projectData.js의 기존 project-01 객체에서 해당 항목만 수정하는 예
name: '프로젝트명',
team: '001',
slogan: '한 줄 소개',
desc: '상세 소개',
imageKey: 'letssync',
teamImageKey: 'tantan',
media: 'APP',
subject: '교육',
target: '일반 대중',
link: null,
memberIds: ['kwonnayeong', 'kimyujin'],
```

`team`에는 숫자 문자열만 입력합니다. 기존 화면의 TEAM / Team. 표기와 두 자리 목록 번호는 컴포넌트에서 유지됩니다. 파일명 번호는 team 값이 아니라 고정 프로젝트 ID에서 가져옵니다.

카테고리는 categories.js의 값을 그대로 입력합니다. `tags`는 자동 생성되므로 입력하지 않습니다. 빈 카테고리는 필터에 매칭되지 않습니다. 현재 목록/캐러셀의 무작위 표시 방식은 유지됩니다.

## 학생 입력 및 양방향 연결

```js
// studentData.js의 기존 student-001 객체에서 해당 항목만 수정하는 예
studentId: 'kwonnayeong',
name: '권나영',
nameEn: 'KWON NAYEONG',
imageKey: '', // 비워두면 studentId로 사진 경로 생성
role: 'DESIGNER',
interview: '한 줄 자기소개',
contact: '',
profileUrl: null,
projectId: 'project-01',
```

1. 학생의 `studentId`를 고유한 영문 이름 ID로 직접 지정하고, 프로젝트의 `memberIds`에도 같은 ID를 원하는 표시 순서대로 입력합니다. 임시 ID를 변경할 때 기존 memberIds 참조도 함께 변경하세요.
2. 각 학생의 `projectId`에도 참여 프로젝트 ID를 입력합니다.
3. 팀원 이름과 역할은 학생 파일에서만 수정합니다. 프로젝트 상세에는 `memberIds` 순서로 연결됩니다.
4. 학생 페이지의 프로젝트명은 `projectId`로 자동 조회합니다. 프로젝트명은 학생 파일에 중복 입력하지 않습니다.

학생 역할 필터의 기존 선택값은 DESIGNER / PLANNER / PROGRAMMER입니다. 빈 연결은 미입력 상태로 허용합니다. 존재하지 않는 ID는 안전하게 건너뛰며 개발 환경에서 연결 불일치를 경고합니다.

## 이미지 추가 위치와 파일명

| 용도 | 추가할 실제 파일 예 |
| --- | --- |
| 프로젝트 카드 | `public/assets/projects/project01_letssync_card.webp` |
| 프로젝트 상세 | `public/assets/projects/project01_letssync_info.webp` |
| 프로젝트 손글씨 | `public/assets/projects/project01_letssync_hand.webp` |
| 팀 사진 | `public/assets/teams/team01_tantan.webp` |
| 학생 프로필 | `public/assets/students/student_kwonnayeong.webp` |

키에는 경로, 확장자, 공백, 특수기호를 넣지 않습니다. 확정 파일명의 영문명 부분만 입력하고, 실제 파일명과 대소문자를 일치시킵니다. 위 예시는 안내용이며 입력 파일에는 넣지 않았습니다.

프로젝트의 `imageKey` 하나로 card / info / hand 경로가 만들어집니다. 팀 사진 키 `teamImageKey`는 별도로 입력합니다. 학생 사진 키는 학생마다 독립적으로 입력합니다. 동명이인은 kimyujin / kimyujin2처럼 별도의 고유 studentId를 직접 지정하세요. 중복 영문 이름과 ID는 개발 환경에서 경고하며, 임의로 ID를 생성하거나 덮어쓰지 않습니다. imageKey가 비어 있으면 영문 studentId로 사진 경로를 생성하고, 기존 imageKey가 입력되어 있으면 해당 값을 우선 사용합니다. 임시 ID와 빈 imageKey 조합은 이미지 없이 유지합니다. 서로 다른 ID라도 같은 사진 키를 사용하면 개발 환경에서 경고합니다.

루트 배포에서는 `/assets/...`, 현재 GitHub Pages 설정에서는 `/Capstone_B/assets/...`가 됩니다. 배포 접두사는 Vite BASE_URL로 자동 적용합니다. 프로젝트의 빈 이미지 키, 학생의 임시 ID와 빈 이미지 키는 null로 변환하므로 잘못된 이미지 요청을 만들지 않습니다. 실제 이미지는 해당 위치에 직접 추가해야 하며, 기존 src/assets 파일은 이동하거나 삭제하지 않았습니다.

카드와 학생 이미지는 기존 플레이스홀더 영역의 배경에 연결되므로 기존 크기/비율/둥근 모서리/호버 및 뒤집기 효과를 사용합니다. 프로젝트 상세 이미지 요소와 스타일은 그대로 사용합니다.

## 처리 파일 및 검증

- `dataUtils.js`: 이미지 경로, 팀원/프로젝트명 연결, tags 생성, 개발 환경 경고.
- `index.js`: 기존 두 입력 원본을 불러와 한 번 변환한 뒤 페이지에 전달합니다. 실제 데이터는 저장하지 않습니다.
- `../pages/Project/projectData.js`, `../pages/Student/studentData.js`: 실제 정보를 입력하는 유일한 원본입니다. 처리 파일을 import하지 않으므로 순환 import가 없습니다.

개발 환경의 브라우저 콘솔에서 `[전시 데이터]` 경고를 확인하세요. 중복 ID, 잘못된 ID 형식, 없는 대상 ID, 양방향 연결 불일치, 중복 팀원, 학생 영문 이름/사진 키 중복, 잘못된 이미지 키/카테고리를 검사합니다. 빈 필드는 경고 대상이 아닙니다. 프로덕션에서는 이 경고를 출력하지 않습니다.

```sh
node --test tests/exhibitionData.test.mjs
npm run lint
npm run build
```

자동 검증은 개수/ID, 빈 이미지 처리, 확정된 파일명 5종과 배포 경로, 113개 개별 학생 사진 경로, 팀원 순서/프로젝트명 변경/필터 태그, 잘못된 연결 및 개발 환경 경고를 확인합니다. 실제 이미지 파일과 실제 참여 정보의 내용 검수는 데이터 입력 후 진행해야 합니다.

## 최종 파일 구조

```text
src/
├── pages/
│   ├── Project/
│   │   ├── projectData.js   # 프로젝트 17개 입력 원본
│   │   └── Project.jsx     # 변환된 데이터 사용
│   └── Student/
│       ├── studentData.js  # 학생 113명 입력 원본
│       └── Student.jsx    # 변환된 데이터 사용
└── data/
    ├── categories.js      # 공통 분류
    ├── dataUtils.js       # 이미지 경로, ID 연결, 변환 및 검증
    ├── index.js           # 두 원본을 불러와 공통 변환 (데이터 중복 없음)
    └── README.md          # 입력 안내
```

실제 정보는 두 입력 원본만 수정합니다. index.js는 중복 변환 및 경고를 방지하는 공통 연결 지점으로 유지하고, 이 안내 파일은 입력 방법을 확인할 수 있도록 유지합니다.

## 통합 작업의 수정/삭제 파일

- 수정: src/pages/Project/projectData.js, src/pages/Student/studentData.js — 개별 입력 객체 통합
- 수정: src/pages/Project/Project.jsx, src/pages/Student/Student.jsx — 변환 결과 import 경로만 변경
- 수정: src/data/index.js — 기존 원본 파일을 참조하도록 변경
- 수정: src/data/README.md — 최종 입력 위치 및 구조 안내
- 수정: tests/exhibitionData.test.mjs — 원본/변환 데이터 import 경로 변경
- 삭제: src/data/projects.js, src/data/students.js — 참조 및 내용 이전 확인 후 중복 파일 제거
- 유지: src/data/categories.js, src/data/dataUtils.js, public/assets/ 이미지 폴더

디자인, CSS, 애니메이션, 인터랙션 및 데이터 변환 함수는 이번 통합 작업에서 수정하지 않았습니다.

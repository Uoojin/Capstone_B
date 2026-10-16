// Content transcribed from the existing Curriculum.png design, in display order.
export const tracks = ['직무 공통', '기획', '디자인', '프로그래밍', '스튜디오']

export const foundation = [
  { semester: '1-1', courses: [['영상 기초'], ['기획 기초'], ['디자인 기초'], ['실감미디어 기초'], []] },
  { semester: '1-2', courses: [['3D 모션그래픽스'], ['콘텐츠 기획'], ['콘텐츠 디자인'], ['웹 퍼블리싱'], []] },
  { semester: '2-1', courses: [[], ['소셜 크리에이팅', '프로젝트 기획', '미디어 프로토타이핑'], ['비주얼 커뮤니케이션', '실감형 3D 디자인', 'UI/UX 디자인'], ['유니티 프로그래밍', '자바스크립트 프로그래밍', '고급 웹 퍼블리싱'], ['디지털 콘텐츠 제작']] },
  { semester: '2-2', courses: [['졸업작품 심사', '포트폴리오 제작'], ['프로젝트 프로포절', '데이터 시각화', '프로젝트 매니징'], ['경험 디자인', '인터랙션 디자인', '실감형 3D 모션'], ['실감미디어 프로그래밍', '웹 인터랙션 프로그래밍', '서버 프로그래밍'], ['캡스톤 디자인']] },
]

export const advanced = [
  { semester: '3-1', courses: [['동시대 예술과 디자인'], ['타이포그래피'], ['디지털 미디어 세미나'], ['스타트업 프로젝트'], ['피지컬 컴퓨팅 스튜디오']] },
  { semester: '3-2', courses: [['디자인과 인간심리'], ['커뮤니케이션 디자인'], ['디지털 미디어 프로토타이핑'], [], ['컨버전스 스튜디오']] },
  { semester: '4-1', courses: [['UX 라이팅 워크숍'], ['뉴미디어 디자인'], ['디지털 미디어 프로젝트'], [], ['캡스톤 디자인 스튜디오']] },
  { semester: '4-2', courses: [['퍼블리셔'], ['포트폴리오 연구'], ['마케팅 & 브랜딩'], [], ['이노베이션 스튜디오']] },
]

export const careers = [
  { title: '디지털미디어 에이전시', jobs: ['서비스·콘텐츠 기획자', 'UI/UX 기획자', 'SNS 마케팅 / 운영 기획자', '서비스 경험 디자이너', '웹 / 모바일 디자이너', 'GUI 디자이너'] },
  { title: '크리에이터', jobs: ['1인 크리에이터', '유튜브 크리에이터', 'SNS 크리에이터', '라이브커머스 크리에이터'] },
  { title: '모션 그래픽', jobs: ['모션 그래픽 기획자', '모션 그래픽 디자이너', '모션 그래픽 제작자'] },
  { title: '실감 미디어', jobs: ['체험 전시 기획자', '체험 전시 디자이너', '체험 전시 프로그래머', 'VR/AR 콘텐츠 기획자', 'VR/AR 인터랙션 디자이너', 'VR/AR 콘텐츠 프로그래머'] },
  { title: '진학', jobs: ['학사학위 전공심화과정 진학', '해외 자매 대학 연계 유학'] },
]

// Add the supplied SVG URLs here; empty values preserve the current artwork.
export const curriculumArtwork = { symbolsSrc: '', titleSrc: '' }

// Transcribed from the supplied convergence hover reference.
export const convergenceEducation = [
  {
    id: 'design', label: 'DESIGN', cx: 300, cy: 160,
    heading: ['스튜디오 중심', '산학협력 프로젝트 활성화'],
    description: ['크리에이티브 스튜디오 활성화', '사용자 경험 UI/UX 스튜디오 활성화', '사용자 테스트 UT 스튜디오 활성화', '모션 스튜디오 활성화'],
  },
  {
    id: 'media', label: 'MEDIA', cx: 178, cy: 372,
    heading: ['현장 중심 실무전문가 교육과정'],
    description: ['창의교육모델 NCS/KCS 교육과정 개발 운영', '산업체 주문식 교육과정 개발 운영', '직무 맞춤 세부전공 선택', '정기 산업체 리크루팅'],
  },
  {
    id: 'technology', label: 'TECHNOLOGY', cx: 422, cy: 372,
    heading: ['디자인 기술', '융합산업 선도형 콘텐츠 연구 개발'],
    description: ['피지컬 컴퓨팅 콘텐츠 연구 개발', '인터미디어 콘텐츠 연구 개발'],
  },
]

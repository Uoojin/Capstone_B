export const categories = {
  media: ['APP', 'WEB', '실감미디어', '공간/전시', '키오스크', '웨어러블', '모빌리티', '브랜딩'],
  subject: ['심리/정서', '일상/라이프', '문화/예술', '사회/공공', '교육'],
  target: ['아동/청소년', '대학생/청년', '시니어', '일반 대중', '특수/공공기관', '전시 관람객'],
}

const placeholderMembers = [
  ['김00', 'PLANNER'],
  ['김00', 'PLANNER'],
  ['김00', 'DESIGNER'],
  ['김00', 'DESIGNER'],
  ['김00', 'DESIGNER'],
  ['김00', 'DESIGNER'],
  ['김00', 'PROGRAMMER'],
  ['김00', 'PROGRAMMER'],
]

export const projects = Array.from({ length: 17 }, (_, index) => {
  const media = categories.media[index % categories.media.length]
  const subject = categories.subject[index % categories.subject.length]
  const target = categories.target[index % categories.target.length]

  return {
    id: `project-${String(index + 1).padStart(2, '0')}`,
    name: 'Project Name',
    team: `TEAM.${String(index + 1).padStart(3, '0')}`,
    slogan: '슬로건 내용이 들어가는 영역입니다.',
    desc: '프로젝트에 대한 설명이 들어가는 영역입니다. 간단한 기획 의도와 주요 특징을 소개하며 사용자가 프로젝트를 이해할 수 있도록  작성됩니다. 프로젝트에 대한 설명이 들어가는 영역입니다.  간단한 기획 의도와 주요 특징을 소개하며 사용자가 프로젝트를  이해할 수 있도록 작성됩니다.',
    tags: [media, subject, target],
    media,
    subject,
    target,
    // Import each project's asset above and replace null with its URL.
    // Keep absent images empty; the detail layout reserves their space.
    image: null,
    teamImage: null,
    handwritingImage: null,
    handwritingAlt: '',
    link: index === 0 ? 'https://example.com' : '#',
    members: placeholderMembers,
  }
})

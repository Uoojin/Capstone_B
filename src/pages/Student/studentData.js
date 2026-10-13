const roles = ['DESIGNER', 'PLANNER', 'PROGRAMMER']

export const students = Array.from({ length: 24 }, (_, index) => ({
  studentId: `student-${String(index + 1).padStart(2, '0')}`,
  name: '학생 이름',
  project: 'Project Name',
  projectId: 'project-01',
  role: roles[index % roles.length],
  interview: '인사말 혹은 짧은 인터뷰 내용이 들어가는 영역입니다.',
  contact: 'xxxxxxxx@gmail.com',
  profileUrl: '#',
}))

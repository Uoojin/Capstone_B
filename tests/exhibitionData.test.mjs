import test from 'node:test'
import { matchesHangulName } from '../src/pages/Student/hangulSearch.js'
import assert from 'node:assert/strict'
import { projects } from '../src/pages/Project/projectData.js'
import { students } from '../src/pages/Student/studentData.js'
import { buildExhibitionData, validateData, getProjectImages, getStudentImage, imageBackgroundStyle } from '../src/data/dataUtils.js'
import { projects as pageProjects, students as pageStudents } from '../src/data/index.js'

function fixture() {
  const project = { ...projects[0], name: '연결 검증', imageKey: 'letssync', teamImageKey: 'tantan', media: 'APP', subject: '교육', target: '일반 대중', memberIds: ['kimyujin', 'kwonnayeong'] }
  const members = [
    { ...students[0], studentId: 'kwonnayeong', name: '첫 번째', role: 'DESIGNER', projectId: project.id, imageKey: 'kwonnayeong' },
    { ...students[1], studentId: 'kimyujin', name: '두 번째', role: 'PLANNER', projectId: project.id },
  ]
  return { project, members }
}

test('existing inputs keep fixed project order and unique, reciprocal student relationships', () => {
  assert.equal(projects.length, 17)
  assert.equal(students.length, 113)
  assert.equal(new Set(projects.map((p) => p.id)).size, 17)
  assert.equal(new Set(students.map((s) => s.studentId)).size, 113)
  projects.forEach((p, i) => assert.equal(p.id, `project-${String(i + 1).padStart(2, '0')}`))
  assert.deepEqual(validateData(projects, students), [])
  assert.equal(pageProjects.length, 17)
  assert.equal(pageStudents.length, 113)
  for (const project of pageProjects) {
    for (const member of project.members) {
      const student = pageStudents.find((item) => item.studentId === member.studentId)
      assert.ok(student)
      assert.equal(student.projectId, project.id)
      assert.equal(student.project, project.name)
    }
    assert.ok(project.tags.every((tag) => typeof tag === 'string'))
  }
})

test('empty images leave existing placeholders and no invalid paths', () => {
  const data = buildExhibitionData([{ id: 'project-01', memberIds: [] }], [{ studentId: 'student-001' }])
  for (const key of ['image', 'cardImage', 'teamImage', 'handwritingImage']) assert.equal(data.projects[0][key], null)
  assert.deepEqual(data.projects[0].tags, [])
  assert.deepEqual(data.projects[0].members, [])
  assert.equal(data.students[0].image, null)
  assert.equal(data.students[0].project, '')
  assert.equal(imageBackgroundStyle(null), undefined)
  assert.equal(getStudentImage({ imageKey: '../bad' }), null)
  assert.equal(getProjectImages({ id: 'invalid', imageKey: 'valid' }).image, null)
})

test('all five filenames honor root and deployed base paths', () => {
  const { project, members } = fixture()
  for (const base of ['/', '/Capstone_B/']) {
    const prefix = `${base}assets/`
    const images = getProjectImages(project, base)
    assert.equal(images.cardImage, `${prefix}projects/project01_letssync_card.webp`)
    assert.equal(images.image, `${prefix}projects/project01_letssync_info.webp`)
    assert.equal(images.handwritingImage, `${prefix}projects/project01_letssync_hand.webp`)
    assert.equal(images.teamImage, `${prefix}teams/team01_tantan.webp`)
    assert.equal(getStudentImage(members[0], base), `${prefix}students/student_kwonnayeong.webp`)
  }
  assert.equal(new Set(students.map((s, i) => getStudentImage({ ...s, imageKey: `person${i}` }))).size, 113)
})

test('member order, names/roles, project rename and filter tags derive from input only', () => {
  const { project, members } = fixture()
  const before = JSON.stringify({ project, members })
  const data = buildExhibitionData([project], members)
  assert.deepEqual(validateData([project], members), [])
  assert.deepEqual(data.projects[0].members, [{ studentId: 'kimyujin', name: '두 번째', role: 'PLANNER' }, { studentId: 'kwonnayeong', name: '첫 번째', role: 'DESIGNER' }])
  assert.equal(data.students[0].project, project.name)
  assert.equal(data.projects.filter((p) => p.tags.includes('APP')).length, 1)
  assert.equal(data.projects.filter((p) => p.tags.includes('WEB')).length, 0)
  assert.deepEqual(data.projects[0].tags, ['APP', '교육', '일반 대중'])
  assert.equal(JSON.stringify({ project, members }), before)
  assert.equal(buildExhibitionData([{ ...project, name: '변경된 이름' }], members).students[0].project, '변경된 이름')
})

test('bad IDs, mismatched links and duplicate keys/names warn in development only and keep rendering', () => {
  const { project, members } = fixture()
  project.memberIds.push('unknownperson', 'kimyujin')
  members[0].projectId = 'project-99'
  members[0].nameEn = 'SAME NAME'
  members[1].nameEn = 'same name'
  members[1].imageKey = members[0].imageKey
  const warnings = []
  const data = buildExhibitionData([project, { ...project }], [...members, { ...members[1], studentId: 'student-02' }], { dev: true, warn: (w) => warnings.push(w) })
  for (const text of ['프로젝트 ID 중복', '학생 이미지 키 중복', '학생 영문 이름 중복', '존재하지 않는 학생 ID', '존재하지 않는 프로젝트 ID', '일치하지 않습니다', '학생 ID 형식 오류', '중복된 학생 ID']) {
    assert.ok(warnings.some((w) => w.includes(text)), text)
  }
  assert.equal(data.students[0].project, '')
  assert.equal(data.projects[0].members.length, 3)
  const productionWarnings = []
  buildExhibitionData([project], members, { dev: false, warn: (w) => productionWarnings.push(w) })
  assert.deepEqual(productionWarnings, [])
  assert.ok(validateData([{ ...project, memberIds: [] }], [members[1]]).some((w) => w.includes('memberIds에 학생 ID가 없습니다')))
})


test('English student IDs provide optional image keys while explicit and temporary keys stay compatible', () => {
  assert.equal(getStudentImage({ studentId: 'kwonnayeong', imageKey: '' }), '/assets/students/student_kwonnayeong.webp')
  assert.equal(getStudentImage({ studentId: 'kwonnayeong' }, '/Capstone_B/'), '/Capstone_B/assets/students/student_kwonnayeong.webp')
  assert.equal(getStudentImage({ studentId: 'kimyujin2', imageKey: 'originalphoto' }), '/assets/students/student_originalphoto.webp')
  assert.equal(getStudentImage({ studentId: 'student-001', imageKey: 'originalphoto' }), '/assets/students/student_originalphoto.webp')
  assert.equal(getStudentImage({ studentId: 'student-001', imageKey: '' }), null)
  assert.equal(getStudentImage({ studentId: 'kwonnayeong', imageKey: '../invalid' }), null)
  assert.equal(getStudentImage({ studentId: '../invalid', imageKey: '' }), null)
})

test('names never generate IDs; duplicate English names need explicitly distinct IDs and image paths', () => {
  const project = { ...projects[0], memberIds: ['kimyujin', 'kimyujin2', 'missingperson'] }
  const members = [
    { ...students[0], studentId: 'kimyujin', name: '김유진', nameEn: 'KIM YUJIN', projectId: project.id },
    { ...students[1], studentId: 'kimyujin2', name: '김유진', nameEn: 'kim yujin', projectId: project.id },
  ]
  const warnings = []
  const data = buildExhibitionData([project], members, { dev: true, warn: (w) => warnings.push(w) })
  assert.deepEqual(data.students.map((s) => s.studentId), ['kimyujin', 'kimyujin2'])
  assert.deepEqual(data.projects[0].members, members.map(({ studentId, name, role }) => ({ studentId, name, role })))
  assert.equal(new Set(data.students.map((s) => s.image)).size, 2)
  assert.ok(warnings.some((w) => w.includes('학생 영문 이름 중복') && w.includes('별도의 고유 studentId')))
  assert.ok(warnings.some((w) => w.includes('존재하지 않는 학생 ID missingperson')))
  assert.ok(!warnings.some((w) => w.includes('학생 ID 형식 오류')))
  assert.equal(data.students.filter((s) => matchesHangulName(s.name, 'ㄱㅇㅈ')).length, 2)
  const duplicateIds = validateData([], [{ ...members[0], projectId: '' }, { ...members[1], projectId: '', studentId: 'kimyujin' }])
  assert.ok(duplicateIds.some((w) => w.includes('학생 ID 중복') && w.includes('별도의 고유 studentId')))
  const duplicateImage = validateData([], [{ ...members[0], projectId: '' }, { ...members[1], projectId: '', imageKey: 'kimyujin' }])
  assert.ok(duplicateImage.some((w) => w.includes('학생 이미지 키 중복')))
  const temporary = buildExhibitionData([], [{ ...students[0], studentId: 'student-001', imageKey: '', nameEn: 'KIM YUJIN' }]).students[0]
  assert.equal(temporary.studentId, 'student-001')
  assert.equal(temporary.image, null)
})


test('array categories produce searchable string tags for the five psychology projects', () => {
  const data = buildExhibitionData(projects, students)
  assert.deepEqual(data.projects.filter((project) => project.tags.includes('심리/정서')).map((project) => project.id), [
    'project-02', 'project-08', 'project-09', 'project-10', 'project-15',
  ])
  const project = { ...projects[0], media: ['APP', 'WEB'], subject: ['심리/정서', '교육'], target: ['대학생/청년', '일반 대중'], memberIds: [] }
  assert.deepEqual(buildExhibitionData([project], []).projects[0].tags, ['APP', 'WEB', '심리/정서', '교육', '대학생/청년', '일반 대중'])
  assert.deepEqual(validateData([project], []), [])
  assert.deepEqual(validateData([{ ...project, subject: ['심리/정서', '없는 분류'] }], []), [
    `${project.id}: 알 수 없는 subject: 없는 분류`,
  ])
})

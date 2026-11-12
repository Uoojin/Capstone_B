import { categories } from './categories.js'

const validKey = (key) => typeof key === 'string' && /^[a-zA-Z0-9]+$/.test(key)
const validProjectImageKey = (key) => typeof key === 'string' && /^[\p{L}\p{M}\p{N}-]+$/u.test(key)
const projectImages = Object.fromEntries(
  Object.entries(import.meta.glob('../assets/projects/*.webp', { eager: true, query: '?url', import: 'default' }))
    .map(([path, url]) => [path.normalize('NFC'), url]),
)
const validStudentNameId = (id) => typeof id === 'string' && /^[a-z][a-z0-9]*$/i.test(id)
const temporaryStudentId = (id) => /^student-(00[1-9]|0[1-9]\d|10\d|11[0-3])$/.test(id)
const projectNumber = (id) => /^project-\d{2}$/.test(id) ? id.slice(-2) : null
const teamPhotoSizes = {
  team01_LETSSYNC: [1562, 1649],
  team02_AQUI: [1562, 1649],
  team03_CHAK: [1447, 1070],
  team04_PLEV: [1562, 1649],
  team05_HAELON: [2006, 1649],
  team06_PARALLAX: [1562, 1649],
  team07_COMPASS: [2006, 1649],
  team08_OREUM: [1314, 1319],
  team09_EMORA: [1562, 1649],
  team10_JALGAGYE: [1615, 1319],
  team11_POPING: [1971, 1649],
  team12_MALMOE: [1562, 1649],
  team13_LIMEN: [950, 923],
  team14_RESONATOR: [1562, 1649],
  team15_ITDA: [1250, 1319],
  team16_LIFESTATION: [1766, 1661],
  team17_SEESAW: [1562, 1649],
}

// BASE_URL preserves the /Capstone_B/ deployment prefix; root deployments use /assets/.
function assetPath(folder, filename, baseUrl) {
  return `${baseUrl.replace(/\/$/, '')}/assets/${folder}/${filename}.webp`
}

export function getProjectImages(project, baseUrl = import.meta.env?.BASE_URL || '/') {
  const number = projectNumber(project.id)
  const teamPhoto = number && validKey(project.teamImageKey) ? `team${number}_${project.teamImageKey}` : null
  const projectPath = (suffix = '') => number && validProjectImageKey(project.imageKey)
    ? projectImages[`../assets/projects/project${number}_${project.imageKey}${suffix}.webp`.normalize('NFC')] || null
    : null
  const image = projectPath('_info') || projectPath() || projectPath('_card')
  return {
    cardImage: projectPath('_card') || image,
    image,
    handwritingImage: projectPath('_hand'),
    handwritingAlt: project.name ? `${project.name} 팀 손글씨` : '',
    teamImage: teamPhoto ? assetPath('teams', teamPhoto, baseUrl) : null,
    teamImageSize: teamPhotoSizes[teamPhoto],
  }
}

// An explicit key keeps existing filenames working; temporary IDs never become image keys.
function getStudentImageKey(student) {
  return student.imageKey || (validStudentNameId(student.studentId) ? student.studentId : '')
}

export function getStudentImage(student, baseUrl = import.meta.env?.BASE_URL || '/') {
  const imageKey = getStudentImageKey(student)
  return validKey(imageKey)
    ? assetPath('students', `student_${imageKey}`, baseUrl)
    : null
}

// Apply images to the existing placeholder surfaces without changing their geometry or effects.
export function imageBackgroundStyle(image) {
  return image ? {
    backgroundImage: `url(${JSON.stringify(image)})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : undefined
}

// Return diagnostics separately so validation is also usable from scripts/tests.
// Empty text, image keys and relationships are valid while entering exhibition data.
export function validateData(projects, students) {
  const warnings = []
  const projectMap = new Map(projects.map((project) => [project.id, project]))
  const studentMap = new Map(students.map((student) => [student.studentId, student]))
  const checkDuplicates = (items, field, label, normalize = (value) => value) => {
    const seen = new Set()
    for (const item of items) {
      const value = normalize(item[field] || '')
      if (!value) continue
      if (seen.has(value)) {
        const advice = field === 'studentId' || field === 'nameEn' ? ' — 동명이인은 별도의 고유 studentId를 지정하세요.' : ''
        warnings.push(`${label} 중복: ${item[field]}${advice}`)
      }
      seen.add(value)
    }
  }
  checkDuplicates(projects, 'id', '프로젝트 ID')
  checkDuplicates(students, 'studentId', '학생 ID')
  checkDuplicates(students.map((student) => ({ imageKey: getStudentImageKey(student) })), 'imageKey', '학생 이미지 키')
  checkDuplicates(students, 'nameEn', '학생 영문 이름', (name) => name.replace(/\s+/g, '').toLowerCase())

  for (const project of projects) {
    if (!/^project-(0[1-9]|1[0-7])$/.test(project.id)) warnings.push(`프로젝트 ID 형식 오류: ${project.id}`)
    for (const key of ['imageKey', 'teamImageKey']) {
      if (key === 'imageKey') {
        if (project[key] && !validProjectImageKey(project[key])) warnings.push(`${project.id}: imageKey는 실제 파일명의 이름 부분을 한글/영문/숫자/하이픈으로 입력하세요.`)
      } else if (project[key] && !validKey(project[key])) warnings.push(`${project.id}: ${key}는 공백/특수기호 없이 영문과 숫자만 입력하세요.`)
    }
    for (const key of Object.keys(categories)) {
      for (const value of [project[key]].flat().filter(Boolean)) {
        if (!categories[key].includes(value)) warnings.push(`${project.id}: 알 수 없는 ${key}: ${value}`)
      }
    }
    const memberIds = Array.isArray(project.memberIds) ? project.memberIds : []
    if (!Array.isArray(project.memberIds)) warnings.push(`${project.id}: memberIds는 배열이어야 합니다.`)
    if (new Set(memberIds).size !== memberIds.length) warnings.push(`${project.id}: memberIds에 중복된 학생 ID가 있습니다.`)
    for (const id of memberIds) {
      const student = studentMap.get(id)
      if (!student) warnings.push(`${project.id}: 존재하지 않는 학생 ID ${id}`)
      else if (student.projectId !== project.id) warnings.push(`${project.id} / ${id}: 학생의 projectId와 memberIds 연결이 일치하지 않습니다.`)
    }
  }
  for (const student of students) {
    if (!validStudentNameId(student.studentId) && !temporaryStudentId(student.studentId)) {
      warnings.push(`학생 ID 형식 오류: ${student.studentId} — 영문으로 시작하는 영문/숫자 ID를 입력하세요. 미입력 학생은 기존 임시 ID를 유지하세요.`)
    }
    if (student.imageKey && !validKey(student.imageKey)) warnings.push(`${student.studentId}: imageKey는 공백/특수기호 없이 영문과 숫자만 입력하세요.`)
    if (!student.projectId) continue
    const project = projectMap.get(student.projectId)
    if (!project) warnings.push(`${student.studentId}: 존재하지 않는 프로젝트 ID ${student.projectId}`)
    else if (!project.memberIds?.includes(student.studentId)) warnings.push(`${student.studentId} / ${project.id}: 프로젝트 memberIds에 학생 ID가 없습니다.`)
  }
  return warnings
}

export function buildExhibitionData(projects, students, {
  baseUrl = import.meta.env?.BASE_URL || '/',
  dev = import.meta.env?.DEV || false,
  warn = (message) => console.warn(message),
} = {}) {
  if (dev) validateData(projects, students).forEach((message) => warn(`[전시 데이터] ${message}`))
  const projectMap = new Map(projects.map((project) => [project.id, project]))
  const studentMap = new Map(students.map((student) => [student.studentId, student]))
  return {
    projects: projects.map((project) => ({
      ...project,
      ...getProjectImages(project, baseUrl),
      tags: [project.media, project.subject, project.target].flat().filter(Boolean),
      members: (Array.isArray(project.memberIds) ? project.memberIds : [])
        .map((id) => studentMap.get(id))
        .filter(Boolean)
        .map((student) => ({ studentId: student.studentId, name: student.name, role: student.role })),
    })),
    students: students.map((student) => ({
      ...student,
      image: getStudentImage(student, baseUrl),
      project: projectMap.get(student.projectId)?.name || '',
    })),
  }
}

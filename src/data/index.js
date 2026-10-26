import { projects as projectInputs } from '../pages/Project/projectData.js'
import { students as studentInputs } from '../pages/Student/studentData.js'
import { buildExhibitionData } from './dataUtils.js'

// 입력 원본 → 공통 변환 → 화면. 이 파일에는 실제 데이터를 입력하지 않습니다.
export const { projects, students } = buildExhibitionData(projectInputs, studentInputs)

export { categories } from './categories.js'

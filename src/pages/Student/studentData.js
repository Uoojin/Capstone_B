// 실제 정보는 이 파일에 입력합니다. 이름 미입력 학생은 기존 student-001 ~ student-113 임시 ID를 유지합니다.
// 이름 입력 후 studentId를 영문 이름 ID로 직접 변경합니다 (예: 'kwonnayeong'). memberIds도 함께 변경하세요.
// 동명이인은 별도의 고유 ID를 지정합니다 (예: kimyujin2). nameEn에서 ID를 자동 생성하지 않습니다.
// imageKey: 기존 사진 파일명이 ID와 다르면 입력합니다. 비워두면 영문 studentId를 사용합니다.
// projectId: 참여 프로젝트 ID (예: 'project-01'), 미입력 상태는 ''.
// 프로젝트 파일의 memberIds에도 이 학생 ID를 추가합니다. 이름/역할은 이 파일에서만 관리합니다.
export const students = [
  // ========== STUDENT 001 ==========
  {
    studentId: '',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 002 ==========
  {
    studentId: 'KWONNAYEONG',

    // 01. 기본 정보
    name: '권나영',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '발견을 변화로 연결하는 기획자 권나영입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'ni9htday@gmail.com',
    profileUrl: 'http://www.linkedin.com/in/ni9htday',

    // 05. 참여 프로젝트
    projectId: 'project-01',
  },

  // ========== STUDENT 003 ==========
  {
    studentId: 'JOOSIWON',

    // 01. 기본 정보
    name: '주시원',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '문제에 몰입해 답을 찾는 기획자 주시원입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'tldnjs248@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-01',
  },

  // ========== STUDENT 004 ==========
  {
    studentId: 'SEOYEHYUN',

    // 01. 기본 정보
    name: '서예현',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '다르게 보고 발견하는 디자이너 서예현입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'yehyun0107@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-01',
  },

  // ========== STUDENT 005 ==========
  {
    studentId: 'YANGYUBIN',

    // 01. 기본 정보
    name: '양유빈',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '낯선 감각을 연결하는 디자이너 양유빈입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'ygmo24393@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-01',
  },

  // ========== STUDENT 006 ==========
  {
    studentId: 'LEESEUNGYEON',

    // 01. 기본 정보
    name: '이승연',
 

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '개성을 피워내는 디자이너 이승연입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'yhl12313@naver.com',
    profileUrl: 'https://yhl12313.github.io/blooming-designer/',

    // 05. 참여 프로젝트
    projectId: 'project-01',
  },

  // ========== STUDENT 007 ==========
  {
    studentId: 'JUNGDAEUN24',

    // 01. 기본 정보
    name: '정다은',
  

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '고유한 결을 발견하는 디자이너 정다은입니다!',

    // 04. 연락처 및 포트폴리오
    contact: 'adneue.j@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-01',
  },

  // ========== STUDENT 008 ==========
  {
    studentId: 'JUNGYUJIN',

    // 01. 기본 정보
    name: '정유진',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PROGRAMMER',
    interview: '화면 너머의 경험을 연결하는 개발자 정유진입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'u.ooojini@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-01',
  },

  // ========== STUDENT 009 ==========
  {
    studentId: 'HANSOOHYUN',

    // 01. 기본 정보
    name: '한수현',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '작은 발견을 가치로 잇는 기획자 한수현입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'sky4194119@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-02',
  },

  // ========== STUDENT 010 ==========
  {
    studentId: 'KANGMINHA',

    // 01. 기본 정보
    name: '강민하',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '차이를 발견하는 디자이너 강민하입니다',

    // 04. 연락처 및 포트폴리오
    contact: 'miinnn027@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-02',
  },

  // ========== STUDENT 011 ==========
  {
    studentId: 'KIMYERYEONG',

    // 01. 기본 정보
    name: '김예령',
  

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PROGRAMMER',
    interview: '새로움을 발견하는 개발자 김예령입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'tenkakuu@gmail.com',
    profileUrl: 'https://github.com/yaeichemil',

    // 05. 참여 프로젝트
    projectId: 'project-02',
  },

  // ========== STUDENT 012 ==========
  {
    studentId: 'SONGYEHYUN',

    // 01. 기본 정보
    name: '송예현',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '개성만큼 발상도 과감한 기획자 송예현입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'songyehyun15@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-02',
  },

  // ========== STUDENT 013 ==========
  {
    studentId: 'CHOIEUNHWA',

    // 01. 기본 정보
    name: '최은화',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '의미와 감각을 연결하는 디자이너 최은화입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'ewa050311@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-02',
  },

  // ========== STUDENT 014 ==========
  {
    studentId: 'HWANGJEONGIN',

    // 01. 기본 정보
    name: '황정인',
  

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '몰입을 설계하는 디자이너 황정인입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'zxoolv@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-02',
  },

  // ========== STUDENT 015 ==========
  {
    studentId: 'JEONGSEOYEONG',

    // 01. 기본 정보
    name: '정서영',
  

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '공감과 연결로 성장하는 기획자 정서영입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'richardis6551@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-03',
  },

  // ========== STUDENT 016 ==========
  {
    studentId: 'KWONSERIN',

    // 01. 기본 정보
    name: '권세린',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '발견을 성장으로 잇는 디자이너 권세린입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'serin030614@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-03',
  },

  // ========== STUDENT 017 ==========
  {
    studentId: 'NOHSEUNGMIN',

    // 01. 기본 정보
    name: '노승민',
  

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '발견으로 성장하는 디자이너 노승민입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'sm507noh@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-03',
  },

  // ========== STUDENT 018 ==========
  {
    studentId: 'YANGYUNJI',

    // 01. 기본 정보
    name: '양윤지',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '연결로 가치를 찾아가는 기획자 양윤지입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'yoon353yoon@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-03',
  },

  // ========== STUDENT 019 ==========
  {
    studentId: 'LEEHANBYEOL',

    // 01. 기본 정보
    name: '이한별',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '낯선 연결을 발견하는 디자이너 이한별입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'hanstarleeee@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-03',
  },

  // ========== STUDENT 020 ==========
  {
    studentId: 'HANYOOKYUNG',

    // 01. 기본 정보
    name: '한유경',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '몰입으로 성장을 만드는 디자이너 한유경입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'dyolyo28@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-03',
  },

  // ========== STUDENT 021 ==========
  {
    studentId: 'KIMKIHYUN',

    // 01. 기본 정보
    name: '김기현',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '온전한 완성을 위해, 작은 다시를 반복하는 기획자 김기현입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'rlgus2022@naver.com',
    profileUrl: 'https://www.linkedin.com/in/kihyun-kim-aa4740424?utm_source=share_via&utm_content=profile&utm_medium=member_ios',

    // 05. 참여 프로젝트
    projectId: 'project-04',
  },

  // ========== STUDENT 022 ==========
  {
    studentId: 'KWONMINJAE',

    // 01. 기본 정보
    name: '권민재',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '새로운 워크플로우를 발견하고 성장하는 디자이너 권민재입니다',

    // 04. 연락처 및 포트폴리오
    contact: 'janobo964@gmail.com',
    profileUrl: 'https://www.heunta.work',

    // 05. 참여 프로젝트
    projectId: 'project-04',
  },

  // ========== STUDENT 023 ==========
  {
    studentId: 'KIMJUNA',

    // 01. 기본 정보
    name: '김준아',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PROGRAMMER',
    interview: '아이디어를 경험으로 완성하는 개발자 김준아입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'wnsdk3222@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-04',
  },

  // ========== STUDENT 024 ==========
  {
    studentId: 'JANGDOIK',

    // 01. 기본 정보
    name: '장도익',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '작은 차이를 연결하는 디자이너 장도익입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'doikk2002@gmail.com',
    profileUrl: 'https://0637522.cargo.site/',

    // 05. 참여 프로젝트
    projectId: 'project-04',
  },

  // ========== STUDENT 025 ==========
  {
    studentId: 'JUNGDAEUN25',

    // 01. 기본 정보
    name: '정다은',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '사소한 발견을 잇는 디자이너 정다은입니다. ',

    // 04. 연락처 및 포트폴리오
    contact: 'zungdaeung@gmail.com',
    profileUrl: 'https://www.linkedin.com/in/nnya30/',

    // 05. 참여 프로젝트
    projectId: 'project-04',
  },

  // ========== STUDENT 026 ==========
  {
    studentId: 'HONGJUNSANG',

    // 01. 기본 정보
    name: '홍준상',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '개성을 담아내는 디자이너 홍준상입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'junsang.business@gmail.com',
    profileUrl: 'https://www.instagram.com/junsang_mo/',

    // 05. 참여 프로젝트
    projectId: 'project-04',
  },

  // ========== STUDENT 027 ==========
  {
    studentId: 'KIMYURAN',

    // 01. 기본 정보
    name: '김유란',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '새로운 발견을 설계하는 기획자 김유란입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'knewrun25@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-05',
  },

  // ========== STUDENT 028 ==========
  {
    studentId: 'KIMKYUMIN',

    // 01. 기본 정보
    name: '김규민',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '작은 디테일까지 책임지는 디자이너 김규민입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'ejik0318@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-05',
  },

  // ========== STUDENT 029 ==========
  {
    studentId: 'KIMJIYOON',

    // 01. 기본 정보
    name: '김지윤',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '변화를 빠르게 읽고, 새로운 시각으로 풀어내는 디자이너 김지윤입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'jiyunie03@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-05',
  },

  // ========== STUDENT 030 ==========
  {
    studentId: 'LEEJOOBIN',

    // 01. 기본 정보
    name: '이주빈',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '작은 차이를 발견하는 디자이너 이주빈입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'qp2joobinqp@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-05',
  },

  // ========== STUDENT 031 ==========
  {
    studentId: 'CHANGHAJIUN',

    // 01. 기본 정보
    name: '장하준',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '상상을 구현하는 디자이너 장하준입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'kyounghoon.chang@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-05',
  },

  // ========== STUDENT 032 ==========
  {
    studentId: 'JEONGYUMIN',

    // 01. 기본 정보
    name: '정유민',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '몰입해 끝까지 파고드는 기획자 정유민입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'imyuminj@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-05',
  },

  // ========== STUDENT 033 ==========
  {
    studentId: 'ShonYechan',

    // 01. 기본 정보
    name: '손예찬',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '쓰는 이에 공감하는 AX 디자이너 손예찬입니다',

    // 04. 연락처 및 포트폴리오
    contact: 'shonzmag@gmail.com',
    profileUrl: 'http://www.shonyechan.com/',

    // 05. 참여 프로젝트
    projectId: 'project-06',
  },

  // ========== STUDENT 034 ==========
  {
    studentId: 'KOHAEEUN',

    // 01. 기본 정보
    name: '고해은',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '낯섦과 함께 성장하는 디자이너 고해은입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'hello.henkoo@outlook.com',
    profileUrl: 'https://henkoo-portfolio.vercel.app/',

    // 05. 참여 프로젝트
    projectId: 'project-06',
  },

  // ========== STUDENT 035 ==========
  {
    studentId: 'KimLia',

    // 01. 기본 정보
    name: '김리아',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '작은 발견으로 변화를 만드는 디자이너 김리아입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'liakim1804@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-06',
  },

  // ========== STUDENT 036 ==========
  {
    studentId: 'KimJiwook',

    // 01. 기본 정보
    name: '김지욱',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '몰입을 설계하는 UX 디자이너 김지욱입니다.',

    // 04. 연락처 및 포트폴리오
    contact: '010-4052-4489',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-06',
  },

  // ========== STUDENT 037 ==========
  {
    studentId: 'LeeSiheon',

    // 01. 기본 정보
    name: '이시헌',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '몰입할 이유를 만드는 기획자 이시헌입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'le2shun@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-06',
  },

  // ========== STUDENT 038 ==========
  {
    studentId: 'JungJaeHoon',

    // 01. 기본 정보
    name: '정재훈',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '경험을 연결하는 UX 디자이너 정재훈입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'junja03@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-06',
  },

  // ========== STUDENT 039 ==========
  {
    studentId: 'HanJungMin',

    // 01. 기본 정보
    name: '한정민',
    

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '질문을 통해 더 나은 답을 발견하는 기획자 한정민입니다',

    // 04. 연락처 및 포트폴리오
    contact: 'jungmin2209@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-06',
  },

  // ========== STUDENT 040 ==========
  {
    studentId: 'student-040',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 041 ==========
  {
    studentId: 'student-041',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 042 ==========
  {
    studentId: 'student-042',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 043 ==========
  {
    studentId: 'student-043',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 044 ==========
  {
    studentId: 'student-044',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 045 ==========
  {
    studentId: 'student-045',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 046 ==========
  {
    studentId: 'student-046',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 047 ==========
  {
    studentId: 'student-047',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 048 ==========
  {
    studentId: 'student-048',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 049 ==========
  {
    studentId: 'student-049',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 050 ==========
  {
    studentId: 'student-050',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 051 ==========
  {
    studentId: 'student-051',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 052 ==========
  {
    studentId: 'student-052',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 053 ==========
  {
    studentId: 'student-053',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 054 ==========
  {
    studentId: 'student-054',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 055 ==========
  {
    studentId: 'student-055',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 056 ==========
  {
    studentId: 'student-056',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 057 ==========
  {
    studentId: 'student-057',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 058 ==========
  {
    studentId: 'student-058',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 059 ==========
  {
    studentId: 'student-059',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 060 ==========
  {
    studentId: 'student-060',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 061 ==========
  {
    studentId: 'student-061',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 062 ==========
  {
    studentId: 'student-062',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 063 ==========
  {
    studentId: 'student-063',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 064 ==========
  {
    studentId: 'student-064',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 065 ==========
  {
    studentId: 'student-065',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 066 ==========
  {
    studentId: 'student-066',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 067 ==========
  {
    studentId: 'student-067',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 068 ==========
  {
    studentId: 'student-068',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 069 ==========
  {
    studentId: 'student-069',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 070 ==========
  {
    studentId: 'student-070',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 071 ==========
  {
    studentId: 'student-071',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 072 ==========
  {
    studentId: 'student-072',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 073 ==========
  {
    studentId: 'student-073',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 074 ==========
  {
    studentId: 'student-074',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 075 ==========
  {
    studentId: 'student-075',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 076 ==========
  {
    studentId: 'student-076',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 077 ==========
  {
    studentId: 'student-077',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 078 ==========
  {
    studentId: 'student-078',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 079 ==========
  {
    studentId: 'student-079',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 080 ==========
  {
    studentId: 'student-080',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 081 ==========
  {
    studentId: 'student-081',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 082 ==========
  {
    studentId: 'student-082',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 083 ==========
  {
    studentId: 'student-083',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 084 ==========
  {
    studentId: 'student-084',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 085 ==========
  {
    studentId: 'student-085',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 086 ==========
  {
    studentId: 'student-086',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 087 ==========
  {
    studentId: 'student-087',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 088 ==========
  {
    studentId: 'student-088',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 089 ==========
  {
    studentId: 'student-089',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 090 ==========
  {
    studentId: 'student-090',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 091 ==========
  {
    studentId: 'student-091',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 092 ==========
  {
    studentId: 'student-092',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 093 ==========
  {
    studentId: 'student-093',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 094 ==========
  {
    studentId: 'student-094',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 095 ==========
  {
    studentId: 'student-095',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 096 ==========
  {
    studentId: 'student-096',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 097 ==========
  {
    studentId: 'student-097',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 098 ==========
  {
    studentId: 'student-098',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 099 ==========
  {
    studentId: 'student-099',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 100 ==========
  {
    studentId: 'student-100',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 101 ==========
  {
    studentId: 'student-101',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 102 ==========
  {
    studentId: 'student-102',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 103 ==========
  {
    studentId: 'student-103',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 104 ==========
  {
    studentId: 'student-104',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 105 ==========
  {
    studentId: 'student-105',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 106 ==========
  {
    studentId: 'student-106',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 107 ==========
  {
    studentId: 'student-107',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 108 ==========
  {
    studentId: 'student-108',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 109 ==========
  {
    studentId: 'student-109',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 110 ==========
  {
    studentId: 'student-110',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 111 ==========
  {
    studentId: 'student-111',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 112 ==========
  {
    studentId: 'student-112',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

  // ========== STUDENT 113 ==========
  {
    studentId: 'student-113',

    // 01. 기본 정보
    name: '',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: '',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: '',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: '',
  },

]

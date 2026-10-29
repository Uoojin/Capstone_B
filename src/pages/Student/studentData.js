// 실제 정보는 이 파일에 입력합니다. 이름 미입력 학생은 기존 student-001 ~ student-113 임시 ID를 유지합니다.
// 이름 입력 후 studentId를 영문 이름 ID로 직접 변경합니다 (예: 'kwonnayeong'). memberIds도 함께 변경하세요.
// 동명이인은 별도의 고유 ID를 지정합니다 (예: kimyujin2). nameEn에서 ID를 자동 생성하지 않습니다.
// imageKey: 기존 사진 파일명이 ID와 다르면 입력합니다. 비워두면 영문 studentId를 사용합니다.
// projectId: 참여 프로젝트 ID (예: 'project-01'), 미입력 상태는 ''.
// 프로젝트 파일의 memberIds에도 이 학생 ID를 추가합니다. 이름/역할은 이 파일에서만 관리합니다.
export const students = [
  // ========== STUDENT 001 ==========
  {
    studentId: 'LEEHANSUP',

    // 01. 기본 정보
    name: '이한숲',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '집요하게 몰입하는 디자이너 이한숲입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'been.tct@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-01',
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
    studentId: 'SHONYECHAN',

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
    studentId: 'KIMLIA',

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
    studentId: 'KIMJIWOOK',

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
    studentId: 'LEESIHEON',

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
    studentId: 'JUNGJAEHOON',

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
    studentId: 'HANJUNGMIN',

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
    studentId: 'YOONCHAEWON',

    // 01. 기본 정보
    name: '윤채원',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '경험을 새롭게 만드는 디자이너 윤채원입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'y8nchaewon@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-07',
  },

  // ========== STUDENT 041 ==========
  {
    studentId: 'KIMAHYEON',

    // 01. 기본 정보
    name: '김아현',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '사소한 발견을 모으는 기획자 김아현입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'kwzzah@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-07',
  },

  // ========== STUDENT 042 ==========
  {
    studentId: 'KIMHAON',

    // 01. 기본 정보
    name: '김하온',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '숨은 가치를 발견하는 디자이너 김하온입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'haon0922@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-07',
  },

  // ========== STUDENT 043 ==========
  {
    studentId: 'SHINYUJIN',

    // 01. 기본 정보
    name: '신유진',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '작은 발견을 새로운 경험으로 잇는 신유진입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'syj21300@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-07',
  },

  // ========== STUDENT 044 ==========
  {
    studentId: 'YUNDAEUN',

    // 01. 기본 정보
    name: '윤다은',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '부딪혀 새로운 답을 발견하는 기획자 윤다은입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'dbsekdms8291@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-07',
  },

  // ========== STUDENT 045 ==========
  {
    studentId: 'JANGHYEONJIN',

    // 01. 기본 정보
    name: '장현진',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '탐구하여 개성으로 빚는 디자이너 장현진입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'satofeel@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-07',
  },

  // ========== STUDENT 046 ==========
  {
    studentId: 'BAEKKWIRI',

    // 01. 기본 정보
    name: '백귀리',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '다양한 개성을 연결하는 기획자 백귀리입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'oatrice100@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-08',
  },

  // ========== STUDENT 047 ==========
  {
    studentId: 'BAEMINSEO',

    // 01. 기본 정보
    name: '배민서',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '발견을 경험으로 잇는 디자이너 배민서입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'bms060321@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-08',
  },

  // ========== STUDENT 048 ==========
  {
    studentId: 'LEENAKYUNG',

    // 01. 기본 정보
    name: '이나경',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '핵심을 잇고 성장하는 디자이너 이나경입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'n2k2256@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-08',
  },

  // ========== STUDENT 049 ==========
  {
    studentId: 'LEEYEONJU',

    // 01. 기본 정보
    name: '이연주',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PROGRAMMER',
    interview: '사용자 경험에 몰입하는 개발자 이연주입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'yeonjuu.114@gmial.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-08',
  },

  // ========== STUDENT 050 ==========
  {
    studentId: 'LEEJUNSEOK',

    // 01. 기본 정보
    name: '이준석',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '기술과 기획을 연결하는 기획자 이준석입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'leejs30top2@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-08',
  },

  // ========== STUDENT 051 ==========
  {
    studentId: 'JEONYERIN',

    // 01. 기본 정보
    name: '전예린',
    nameEn: '',

    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '사용자에게 공감하는 디자이너 전예린입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'jeonyerin2006@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-08',
  },

  // ========== STUDENT 052 ==========
  {
    studentId: 'CHOYUNJEONG',

    // 01. 기본 정보
    name: '조윤정',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '생각을 연결하는 디자이너 조윤정입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'yunjeong.cho.design@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-09',
  },

  // ========== STUDENT 053 ==========
  {
    studentId: 'KIMHEEJUNG',

    // 01. 기본 정보
    name: '김희정',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PROGRAMMER',
    interview: '큰 가능성을 그리는 디자이너 김희정입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'gimhuijeong680@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-09',
  },

  // ========== STUDENT 054 ==========
  {
    studentId: 'PARKMINSEO',

    // 01. 기본 정보
    name: '박민서',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '공감으로 답을 찾는 디자이너 박민서입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'minseop4077@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-09',
  },

  // ========== STUDENT 055 ==========
  {
    studentId: 'LEEYUJIN',

    // 01. 기본 정보
    name: '이유진',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '생각을 시각화하는 디자이너 이유진입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'leeyujin060804@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-09',
  },

  // ========== STUDENT 056 ==========
  {
    studentId: 'LEEJIYOUNG',

    // 01. 기본 정보
    name: '이지영',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '경험에 몰입하는 디자이너 이지영입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'lee-jiyoung0826@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-09',
  },

  // ========== STUDENT 057 ==========
  {
    studentId: 'CHOISEOYUN',

    // 01. 기본 정보
    name: '최서윤',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '이야기를 연결하는 디자이너 최서윤입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'iris0512original@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-09',
  },

  // ========== STUDENT 058 ==========
  {
    studentId: 'KWAHKHYOJIN',

    // 01. 기본 정보
    name: '곽효진',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '작은 단서도 놓치지 않고, 답을 발견해가는 기획자 곽효진입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'hjinkwahk@gmail.com ',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-10',
  },

  // ========== STUDENT 059 ==========
  {
    studentId: 'KIMMINCHAN',

    // 01. 기본 정보
    name: '김민찬',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '한눈에 읽히도록 연결하는 디자이너 김민찬입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'rbnawoz@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-10',
  },

  // ========== STUDENT 060 ==========
  {
    studentId: 'KIMTAEYUN',

    // 01. 기본 정보
    name: '김태현',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '',

    // 04. 연락처 및 포트폴리오
    contact: 'kimth8025#gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-10',
  },

  // ========== STUDENT 061 ==========
  {
    studentId: 'LEESUYOUNG',

    // 01. 기본 정보
    name: '이수영',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '억센 물살도 가로질러 완주하는 수영선수같은 기획자 이수영입니다',

    // 04. 연락처 및 포트폴리오
    contact: 'leesy040711@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-10',
  },

  // ========== STUDENT 062 ==========
  {
    studentId: 'CHUNGHOEYOON',

    // 01. 기본 정보
    name: '정회윤',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '사람들이 공감할수 있는 부분을 발견하는 디자이너 정회윤 입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'henry1227@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-10',
  },

  // ========== STUDENT 063 ==========
  {
    studentId: 'JOTAEHEE',

    // 01. 기본 정보
    name: '조태희',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '시각적 즐거움과 명확한 메시지를 전하는 디자이너 조태희입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'anikajo0316@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-10',
  },

  // ========== STUDENT 064 ==========
  {
    studentId: 'LEEJUNE',

    // 01. 기본 정보
    name: '이준',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '발견하여 연결하는 융합형 기획자 이준입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'annie040224@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-11',
  },

  // ========== STUDENT 065 ==========
  {
    studentId: 'NOHNAMSU',

    // 01. 기본 정보
    name: '노남수',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: 'UIUX 전공인 정리하고 성장하는 디자이너, 노남수입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'jujono2@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-11',
  },

  // ========== STUDENT 066 ==========
  {
    studentId: 'BAECHAEWON',

    // 01. 기본 정보
    name: '배채원',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '개성적인 캐릭터 일러스트 전문 배채원입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'fiesta1022@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-11',
  },

  // ========== STUDENT 067 ==========
  {
    studentId: 'ONSEOYOUNG',

    // 01. 기본 정보
    name: '온서영',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '의견을 하나로 연결하는 기획자 온서영입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'queenhwq7700@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-11',
  },

  // ========== STUDENT 068 ==========
  {
    studentId: 'LEEJAEBEOM',

    // 01. 기본 정보
    name: '이재범',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PROGRAMMER',
    interview: '도전을 발견하여 끝까지 해내는 개발자입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'jb2jjang@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-11',
  },

  // ========== STUDENT 069 ==========
  {
    studentId: 'LEEHYUNGGYU',

    // 01. 기본 정보
    name: '이형규',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '3D에 몰입하는 디자이너 이형규입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'harry04le@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-11',
  },

  // ========== STUDENT 070 ==========
  {
    studentId: 'YOONSEOJIN',

    // 01. 기본 정보
    name: '윤서진',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PROGRAMMER',
    interview: '개성있는 개발자 윤서진 입니다',

    // 04. 연락처 및 포트폴리오
    contact: '010-8337-6425',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-11',
  },

  // ========== STUDENT 071 ==========
  {
    studentId: 'JOGANGHEE',

    // 01. 기본 정보
    name: '조강희',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '연결 속 가능성을 찾는 디자이너 조강희입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'ganghee0508@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-12',
  },

  // ========== STUDENT 072 ==========
  {
    studentId: 'GOSEOHYUN',

    // 01. 기본 정보
    name: '고서현',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '연결 속 가능성을 찾는 디자이너 조강희입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'seohyunn.go@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-12',
  },

  // ========== STUDENT 073 ==========
  {
    studentId: 'MINMYEONGHYE',

    // 01. 기본 정보
    name: '민명혜',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '해결의 버튼을 누르는 기획자 민명혜입니다. ',

    // 04. 연락처 및 포트폴리오
    contact: 'lois.min02@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-12',
  },

  // ========== STUDENT 074 ==========
  {
    studentId: 'LEEYOUJUNG',

    // 01. 기본 정보
    name: '이유정',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PROGRAMMER',
    interview: '경험을 연결하는 개발자 이유정입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'youkh0503@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-12',
  },

  // ========== STUDENT 075 ==========
  {
    studentId: 'LIMHYUNAH',

    // 01. 기본 정보
    name: '임현아',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '공감하는 디자이너 임현아 입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'sylvie29@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-12',
  },

  // ========== STUDENT 076 ==========
  {
    studentId: 'JANGYOONHEE',

    // 01. 기본 정보
    name: '장윤희',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '작은 발견을 경험으로 잇는 기획자 장윤희입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'xeexon27@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-12',
  },

  // ========== STUDENT 077 ==========
  {
    studentId: 'CHOISONGJOO',

    // 01. 기본 정보
    name: '최송주',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PROGRAMMER',
    interview: '몰입의 청사진을 그리는 개발자 최송주입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'songjoo0531@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-12',
  },

  // ========== STUDENT 078 ==========
  {
    studentId: 'CHOISEUNGJIN',

    // 01. 기본 정보
    name: '최승진',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '발견을 설계로 잇는 디자이너 최승진입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'sjin.c.26@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-12',
  },

  // ========== STUDENT 079 ==========
  {
    studentId: 'LEECHAEYEON',

    // 01. 기본 정보
    name: '이채연',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '한 겹 더 깊이 보는 기획자 이채연입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'lcyeooon@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-13',
  },

  // ========== STUDENT 080 ==========
  {
    studentId: 'KIMNOHEUN',

    // 01. 기본 정보
    name: '김노은',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '익숙함 속 새로움을 찾는 김노은입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'noeun0815@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-13',
  },

  // ========== STUDENT 081 ==========
  {
    studentId: 'KIMHYEONGI',

    // 01. 기본 정보
    name: '김현기',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '집요함으로 완성하는 디자이너 김현기입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'dokgiworker@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-13',
  },

  // ========== STUDENT 082 ==========
  {
    studentId: 'BAEJEONGHUN',

    // 01. 기본 정보
    name: '배정훈',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '장면을 연결하는 3D 디자이너 배정훈입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'wjdgns4265@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-13',
  },

  // ========== STUDENT 083 ==========
  {
    studentId: 'SIMHEAMIN',

    // 01. 기본 정보
    name: '심혜민',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '몰입을 만드는 3d 디자이너 심혜민입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'tlagpals134@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-13',
  },

  // ========== STUDENT 084 ==========
  {
    studentId: 'YUGISANG',

    // 01. 기본 정보
    name: '유기상',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PROGRAMMER',
    interview: '움직임을 경험으로 만드는 개발자 유기상입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'yu2647921@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-13',
  },

  // ========== STUDENT 085 ==========
  {
    studentId: 'CHOGAYEON',

    // 01. 기본 정보
    name: '조가연',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '개성으로 색을 더하는 디자이너 조가연입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'yelloww1114@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-13',
  },

  // ========== STUDENT 086 ==========
  {
    studentId: 'HONGSUNGJU',

    // 01. 기본 정보
    name: '홍성주',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '몰입을 설계하는 기획자 홍성주입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'jacobsungju@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-14',
  },

  // ========== STUDENT 087 ==========
  {
    studentId: 'KIMJIHEON',

    // 01. 기본 정보
    name: '김지헌',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '색다른 개성을 좇는 디자이너 김지헌입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'kkiowl@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-14',
  },

  // ========== STUDENT 088 ==========
  {
    studentId: 'MOONYEJI',

    // 01. 기본 정보
    name: '문예지',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '연결과 공감을 그리는 디자이너 문예지 입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'only.er0179@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-14',
  },

  // ========== STUDENT 089 ==========
  {
    studentId: 'PARKBIJU',

    // 01. 기본 정보
    name: '박비주',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '빈틈을 발견해 뛰어드는 기획자 박비주입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'bbi524429@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-14',
  },

  // ========== STUDENT 090 ==========
  {
    studentId: 'LEEHYEWON',

    // 01. 기본 정보
    name: '이혜원',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '물음표에 개성을 더하는 기획자 이혜원입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'urihyewon@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-14',
  },

  // ========== STUDENT 091 ==========
  {
    studentId: 'IMSOYUN',

    // 01. 기본 정보
    name: '임소윤',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PROGRAMMER',
    interview: '경험에서 의미를 발견하는 개발자 임소윤입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'dkrdjehfdl0602@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-14',
  },

  // ========== STUDENT 092 ==========
  {
    studentId: 'JEONYEJIN',

    // 01. 기본 정보
    name: '전예진',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '관찰하여 성장하는 디자이너 전예진입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'iftaurrisitdo@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-14',
  },

  // ========== STUDENT 093 ==========
  {
    studentId: 'JOUNGDAHYEON',

    // 01. 기본 정보
    name: '정다현',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '새 시각과 개성을 잇는 디자이너 정다현입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'zxxcvvbnnm@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-14',
  },

  // ========== STUDENT 094 ==========
  {
    studentId: 'JUNYOUNGSEO',

    // 01. 기본 정보
    name: '전영서',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '작은 발견으로 변화를 여는 기획자 전영서입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'wjsdudtj1209@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-15',
  },

  // ========== STUDENT 095 ==========
  {
    studentId: 'KANGMINKYUNG',

    // 01. 기본 정보
    name: '강민경',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '다르게 보고 새롭게 연결하는 디자이너 강민경입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'kangmk3220@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-15',
  },

  // ========== STUDENT 096 ==========
  {
    studentId: 'KOYEBUM',

    // 01. 기본 정보
    name: '고예범',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PROGRAMMER',
    interview: '기술과 예술을 연결하는 개발자 고예범입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'koyebum@kaywon.ac.kr',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-15',
  },

  // ========== STUDENT 097 ==========
  {
    studentId: 'KIMDAYUN',

    // 01. 기본 정보
    name: '김다윤',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PROGRAMMER',
    interview: '경험으로 공감하는 개발자 김다윤입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'dayun47@kaywon.ac.kr',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-15',
  },

  // ========== STUDENT 098 ==========
  {
    studentId: 'SONSEOYOON',

    // 01. 기본 정보
    name: '손서윤',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '사람과 기술을 연결하는 기획자 손서윤입니다.',

    // 04. 연락처 및 포트폴리오
    contact: '22161092@kaywon.ac.kr',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-15',
  },

  // ========== STUDENT 099 ==========
  {
    studentId: 'LEEHYEYOON',

    // 01. 기본 정보
    name: '이혜윤',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '경험으로 성장하는 영상디자이너 이혜윤입니다.',

    // 04. 연락처 및 포트폴리오
    contact: '2eeyoo643@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-15',
  },

  // ========== STUDENT 100 ==========
  {
    studentId: 'JUNGHYEJIN',

    // 01. 기본 정보
    name: '정혜진',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PROGRAMMER',
    interview: '공감을 설계하는 개발자 정혜진입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'jtt0226@kaywon.ac.kr',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-15',
  },

  // ========== STUDENT 101 ==========
  {
    studentId: 'JUNGSIJIN',

    // 01. 기본 정보
    name: '정시진',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '가능성의 연결을 만드는 디자이너 정시진입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'jeongsijin0@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-16',
  },

  // ========== STUDENT 102 ==========
  {
    studentId: 'KANGDAYEON',

    // 01. 기본 정보
    name: '강다연',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '호기심을 새로운 시도로 잇는 디자이너 강다연입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'singsonghmm@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-16',
  },

  // ========== STUDENT 103 ==========
  {
    studentId: 'MOONSOYEON',

    // 01. 기본 정보
    name: '문소연',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '발견을 경험으로 설계하는 기획자 문소연니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'moonsy553@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-16',
  },

  // ========== STUDENT 104 ==========
  {
    studentId: 'PARKYEJI',

    // 01. 기본 정보
    name: '박예지',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '다른 생각들을 연결하는 디자이너 박예지입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'chun65984@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-16',
  },

  // ========== STUDENT 105 ==========
  {
    studentId: 'CHOBOGYEONG',

    // 01. 기본 정보
    name: '조보경',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '실패를 두려워하지 않는 디자이너 조보경 입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'happyday184@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-16',
  },

  // ========== STUDENT 106 ==========
  {
    studentId: 'HAYEJIN',

    // 01. 기본 정보
    name: '하예진',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '나만의 개성을 펼치는 디자이너 하예진입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'yejin.haa00@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-16',
  },

  // ========== STUDENT 107 ==========
  {
    studentId: 'KIMWOOSUNG',

    // 01. 기본 정보
    name: '김우성',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '시선을 장면으로 만드는 디자이너 김우성입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'rladntjd9980@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-17',
  },

  // ========== STUDENT 108 ==========
  {
    studentId: 'KANGMINJUN',

    // 01. 기본 정보
    name: '강민준',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '감각의 경계를 허무는 기획자 강민준입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'opuskyle@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-17',
  },

  // ========== STUDENT 109 ==========
  {
    studentId: 'KIMMINSEO',

    // 01. 기본 정보
    name: '김민서',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '장면을 깨우는 디자이너 김민서 입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'kms201208@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-17',
  },

  // ========== STUDENT 110 ==========
  {
    studentId: 'MOONJIHOON',

    // 01. 기본 정보
    name: '문지훈',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '다음 가능성을 질문하는 기획자 문지훈입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'jihoon031214@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-17',
  },

  // ========== STUDENT 111 ==========
  {
    studentId: 'PARKYEIN',

    // 01. 기본 정보
    name: '박예인',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'PLANNER',
    interview: '세상을 고민하는 기획자, 박예인입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'yein_050202@naver.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-17',
  },

  // ========== STUDENT 112 ==========
  {
    studentId: 'SHINUIHYO',

    // 01. 기본 정보
    name: '신의효',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '경험에 재미를 더하는 디자이너 신의효입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'shinui1219@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-17',
  },

  // ========== STUDENT 113 ==========
  {
    studentId: 'JANGSEWON',

    // 01. 기본 정보
    name: '장세원',


    // 02. 이미지 파일명 생성용 (ID와 같으면 빈 문자열 유지)
    imageKey: '',

    // 03. 세부전공 및 자기소개 (역할 필터: DESIGNER / PLANNER / PROGRAMMER)
    role: 'DESIGNER',
    interview: '큰 꿈을 위해 투자 하는 디자이너 장세원입니다.',

    // 04. 연락처 및 포트폴리오
    contact: 'nnk1225@gmail.com',
    profileUrl: null,

    // 05. 참여 프로젝트
    projectId: 'project-17',
  },

]

// 실제 정보는 이 파일에 입력합니다. ID는 이름과 무관한 고정 식별자입니다.
// 이미지 키: 확정된 파일명의 영문명 부분만 입력 (예: letssync / tantan).
// memberIds: 학생 ID를 표시할 순서대로 입력 (예: ['student-001', 'student-002']).
// 학생 파일의 projectId에도 이 프로젝트 ID를 입력합니다. 배열 순서는 유지합니다.
export const projects = [
  // ========== PROJECT 01 ==========
  {
    id: 'project-01',

    // 01. 프로젝트 기본 정보 (팀 번호만 입력, TEAM 표시는 화면에서 처리)
    name: "LET'S SYNC!",
    team: '탄탄대로',
    slogan: 'Pull Play SYNCOPATE',
    desc: 'LET’S SYNC!는 113개의 서로 다른 개성이 만들어 내는 당김에서 시작합니다. 각자의 관점과 작업 방식은 서로를 움직이며 이전에 없던 리듬과 결과로 확장됩니다. 서로 다른 개성이 당기고 반응하며 만들어 낸 하나의 SYNC는 지금의 우리를 넘어 더 큰 가능성으로 나아가는 새로운 움직임이 됩니다.',

    // 02. 이미지 파일명 생성용 (확장자 및 경로 제외)
    imageKey: '',
    teamImageKey: '',

    // 03. 프로젝트 카테고리 (categories.js 참고)
    media: ['WEB', '공간/전시', '브랜딩'],
    subject: ['일상/라이프', '문화/예술'],
    target: ['대학생/청년', '일반 대중', '전시 관람객'],

    // 04. 외부 링크 (없으면 null)
    link: null,

    // 05. 참여 학생 (표시 순서대로)
    memberIds: ['LEEHANSUP', 'KWONNAYEONG', 'JOOSIWON', 'SEOYEHYUN', 'YANGYUBIN', 'LEESEUNGYEON', 'JUNGDAEUN24', 'JUNGYUJIN'],
  },

  // ========== PROJECT 02 ==========
  {
    id: 'project-02',

    // 01. 프로젝트 기본 정보 (팀 번호만 입력, TEAM 표시는 화면에서 처리)
    name: '아키 (aquí)',
    team: '끼잉끼잉클럽',
    slogan: '반려동물과의 이별 전후를 잇는 펫로스 케어',
    desc: '아키는 사별 전 마지막 돌봄부터 사별 이후까지 이어지는 펫로스 케어 서비스입니다. 생전에는 반려동물과 함께한 시간을 기록하고, 사후에는 필요한 절차와 다른 보호자의 이야기를 살펴보며 각자의 속도로 이별을 받아들이고 일상을 회복할 수 있도록 돕습니다.',

    // 02. 이미지 파일명 생성용 (확장자 및 경로 제외)
    imageKey: '',
    teamImageKey: '',

    // 03. 프로젝트 카테고리 (categories.js 참고)
    media: ['APP', 'WEB'],
    subject: ['심리/정서', '일상/라이프'],
    target: ['일반 대중'],

    // 04. 외부 링크 (없으면 null)
    link: null,

    // 05. 참여 학생 (표시 순서대로)
    memberIds: ['HANSOOHYUN', 'KANGMINHA', 'KIMYERYEONG', 'SONGYEHYUN', 'CHOIEUNHWA', 'HWANGJEONGIN'],
  },

  // ========== PROJECT 03 ==========
  {
    id: 'project-03',

    // 01. 프로젝트 기본 정보 (팀 번호만 입력, TEAM 표시는 화면에서 처리)
    name: '착! (Chak!)',
    team: '차칸 사람들',
    slogan: '선행의 즐거움을 발견하는 선행 챌린지 서비스',
    desc: '착!(Chak!)은 작은 선행을 일상 문화로 이어가는 캠페인 프로젝트입니다. 현장 캠페인과 SNS, 앱을 통해 배려를 가볍게 실천하고 경험과 감정을 기록하며 서로를 응원합니다. 한 사람의 실천이 다음 사람의 참여로 이어지는 일상을 만들어갑니다.',

    // 02. 이미지 파일명 생성용 (확장자 및 경로 제외)
    imageKey: '',
    teamImageKey: '',

    // 03. 프로젝트 카테고리 (categories.js 참고)
    media: ['APP'],
    subject: ['일상/라이프', '사회/공공'],
    target: ['아동/청소년', '대학생/청년', '일반 대중'],

    // 04. 외부 링크 (없으면 null)
    link: null,

    // 05. 참여 학생 (표시 순서대로)
    memberIds: ['JEONGSEOYEONG', 'KWONSERIN', 'NOHSEUNGMIN', 'YANGYUNJI', 'LEEHANBYEOL', 'HANYOOKYUNG'],
  },

  // ========== PROJECT 04 ==========
  {
    id: 'project-04',

    // 01. 프로젝트 기본 정보
    name: 'PLEV',
    team: '',
    slogan: '흩어진 사고 이후의 경험을, 단 하나의 흐름으로',
    desc: "PLEV는 단절된 이륜차의 사고 처리 및 정비 과정을 PV5를 통해 하나의 흐름으로 제공하는 서비스입니다.'이동수단을 넘어, 현장을 연결하는 서비스 거점' PLEV는 PV5의 적재 공간과 모듈형 구조를 활용해 사고 현장에서의 조치와 이륜차 적재, 안전한 운송을 지원합니다. 이어 차량 디스플레이와 모바일, 정비소 시스템을 연계해 이동 과정과 사고 처리를 하나로 연결합니다",

    // 02. 이미지 파일명 생성용
    imageKey: '',
    teamImageKey: '',

    // 03. 프로젝트 카테고리
    media: ['APP', 'WEB', '키오스크', '모빌리티'],
    subject: ['일상/라이프'],
    target: ['일반 대중'],

    // 04. 외부 링크
    link: null,

    // 05. 참여 학생
    memberIds: ['KIMKIHYUN', 'KWONMINJAE', 'KIMJUNA', 'JANGDOIK', 'JUNGDAEUN25', 'HONGJUNSANG'],
  },

  // ========== PROJECT 05 ==========
  {
    id: 'project-05',

    // 01. 프로젝트 기본 정보 (팀 번호만 입력, TEAM 표시는 화면에서 처리)
    name: 'HAELON',
    team: '공중도덕(空中道德)',
    slogan: '공항 드론 테러 감지·대응 통합 관제 서비스',
    desc: '헤일론은 공항 내 드론 테러에 신속하게 대응하기 위한 통합 보안 플랫폼입니다. 불법·위협 드론의 탐지와 위험도 분석, 실시간 관제, 상황별 대응 방향 제시를 하나의 흐름으로 연결해 초기 판단 시간을 줄이고 현장 대응의 정확성과 효율을 높입니다.',

    // 02. 이미지 파일명 생성용 (확장자 및 경로 제외)
    imageKey: '',
    teamImageKey: '',

    // 03. 프로젝트 카테고리 (categories.js 참고)
    media: ['APP', 'WEB', '키오스크', '웨어러블'],
    subject: ['사회/공공'],
    target: ['일반 대중', '특수/공공기관'],

    // 04. 외부 링크 (없으면 null)
    link: null,

    // 05. 참여 학생 (표시 순서대로)
    memberIds: ['KIMYURAN', 'KIMKYUMIN', 'KIMJIYOON', 'LEEJOOBIN', 'CHANGHAJIUN', 'JEONGYUMIN'],
  },

  // ========== PROJECT 06 ==========
  {
    id: 'project-06',

    // 01. 프로젝트 기본 정보 (팀 번호만 입력, TEAM 표시는 화면에서 처리)
    name: 'PARALLAX',
    team: '렛츠꺼어워',
    slogan: '사건의 모든 시선을, 하나의 흐름으로',
    desc: 'PARALLAX는 현장과, 관제, 지휘부, 후속 투입 인력 사이의 정보 격차를 줄이는 경찰 작전 지원 서비스입니다. 현장에 없는 관련 인력도 작전의 흐름과 상황을 쉽고 정확하게 이어받아, 각자의 자리에서 빠르게 대응할 수 있도록 연결합니다.',

    // 02. 이미지 파일명 생성용 (확장자 및 경로 제외)
    imageKey: '',
    teamImageKey: '',

    // 03. 프로젝트 카테고리 (categories.js 참고)
    media: ['APP', 'WEB', '실감미디어', '공간/전시', '웨어러블', '모빌리티', '브랜딩'],
    subject: ['사회/공공'],
    target: ['일반 대중', '특수/공공기관', '전시 관람객'],

    // 04. 외부 링크 (없으면 null)
    link: null,

    // 05. 참여 학생 (표시 순서대로)
    memberIds: ['SHONYECHAN', 'KOHAEEUN', 'KIMLIA', 'KIMJIWOOK', 'LEESIHEON', 'JUNGJAEHOON', 'HANJUNGMIN'],
  },

  // ========== PROJECT 07 ==========
  {
    id: 'project-07',

    // 01. 프로젝트 기본 정보 (팀 번호만 입력, TEAM 표시는 화면에서 처리)
    name: 'COMPASS',
    team: '복복복',
    slogan: '비교에서, 나만의 방향으로',
    desc: 'COMPASS는 타인과 비교하며 느낀 감정을 성장의 계기로 바꾸기 위해 기획한 서비스입니다. 다른 사람의 성장 과정을 살펴보며 자신의 감정과 원하는 모습을 발견하고, AI와 함께 나만의 목표와 7일 미션을 만들어 실천하며 자신만의 방향으로 성장하도록 돕습니다.',

    // 02. 이미지 파일명 생성용 (확장자 및 경로 제외)
    imageKey: '',
    teamImageKey: '',

    // 03. 프로젝트 카테고리 (categories.js 참고)
    media: ['APP', 'WEB', '공간/전시',],
    subject: ['일상/라이프'],
    target: ['일반 대중'],

    // 04. 외부 링크 (없으면 null)
    link: null,

    // 05. 참여 학생 (표시 순서대로)
    memberIds: ['YOONCHAEWON', 'KIMAHYEON', 'KIMHAON', 'SHINYUJIN', 'YUNDAEUN', 'JANGHYEONJIN'],
  },

  // ========== PROJECT 08 ==========
  {
    id: 'project-08',

    // 01. 프로젝트 기본 정보 (팀 번호만 입력, TEAM 표시는 화면에서 처리)
    name: '오름 oreum',
    team: '레츠기니',
    slogan: '고립/은둔형 쉬었음 청년 사회복귀 브릿지',
    desc: '오름(OREUM)은 고립·은둔 청년이 작은 행동부터 시작해 일상과 사회로 다시 나아가도록 돕는 앱입니다. 개인별 단계에 맞춘 하루 한 가지 미션, 사진 인증과 보상으로 꾸준한 실천을 돕고, 일상 회복부터 외출·관계 형성, 사회복귀 지원 프로그램 참여까지 연결합니다.',

    // 02. 이미지 파일명 생성용 (확장자 및 경로 제외)
    imageKey: '',
    teamImageKey: '',

    // 03. 프로젝트 카테고리 (categories.js 참고)
    media: ['APP', 'WEB', '공간/전시',],
    subject: ['심리/정서', '일상/라이프', '사회/공공'],
    target: ['대학생/청년'],

    // 04. 외부 링크 (없으면 null)
    link: null,

    // 05. 참여 학생 (표시 순서대로)
    memberIds: ['BAEKKWIRI', 'BAEMINSEO', 'LEENAKYUNG', 'LEEYEONJU', 'LEEJUNSEOK', 'JEONYERIN'],
  },

  // ========== PROJECT 09 ==========
  {
    id: 'project-09',

    // 01. 프로젝트 기본 정보 (팀 번호만 입력, TEAM 표시는 화면에서 처리)
    name: 'emora',
    team: 'hexagon',
    slogan: '마음을 알아채고 나만의 회복으로',
    desc: 'emora는 생체 변화 알림으로 감정 상태를 확인하고, 간단한 회복 행동으로 감정과 행동 사이에 틈을 만드는 워치·모바일 연계형 서비스입니다. 회복 전후의 변화와 반복되는 패턴을 돌아보고, 서로의 경험과 응원을 나누며 건강한 내일로 나아가도록 돕습니다.',

    // 02. 이미지 파일명 생성용 (확장자 및 경로 제외)
    imageKey: '',
    teamImageKey: '',

    // 03. 프로젝트 카테고리 (categories.js 참고)
    media: ['APP', 'WEB', '공간/전시', '웨어러블', '브랜딩'],
    subject: ['심리/정서', '일상/라이프'],
    target: ['대학생/청년', '일반 대중'],

    // 04. 외부 링크 (없으면 null)
    link: null,

    // 05. 참여 학생 (표시 순서대로)
    memberIds: ['CHOYUNJEONG', 'KIMHEEJUNG', 'PARKMINSEO', 'LEEYUJIN', 'LEEJIYOUNG', 'CHOISEOYUN'],
  },

  // ========== PROJECT 10 ==========
  {
    id: 'project-10',

    // 01. 프로젝트 기본 정보 (팀 번호만 입력, TEAM 표시는 화면에서 처리)
    name: '잘가계',
    team: 'Layer',
    slogan: '이별 후 공동 디지털 자산 정리 서비스, 잘가계',
    desc: '디지털 연결이 일상이 된 시대, 이별 후에도 남아 있는 공동 계정과 비용 문제에 주목했습니다. 잘가계는 네 명의 중재자가 대화를 대신 전달하고 항목별 정산과 합의를 도와 감정 소모 없이 남은 관계를 정리하는 앱 서비스입니다.',

    // 02. 이미지 파일명 생성용 (확장자 및 경로 제외)
    imageKey: '',
    teamImageKey: '',

    // 03. 프로젝트 카테고리 (categories.js 참고)
    media: ['APP', 'WEB'],
    subject: ['심리/정서', '일상/라이프'],
    target: ['대학생/청년', '일반 대중', '전시 관람객'],

    // 04. 외부 링크 (없으면 null)
    link: null,

    // 05. 참여 학생 (표시 순서대로)
    memberIds: ['KWAHKHYOJIN', 'KIMMINCHAN', 'KIMTAEYUN', 'LEESUYOUNG', 'CHUNGHOEYOON', 'JOTAEHEE'],
  },

  // ========== PROJECT 11 ==========
  {
    id: 'project-11',

    // 01. 프로젝트 기본 정보 (팀 번호만 입력, TEAM 표시는 화면에서 처리)
    name: 'POP-ING',
    team: 'WAVE',
    slogan: '당신의 세계가 지금 열립니다!',
    desc: '[POP-ING은 브랜드의 세계관과 소비자를 연결하는 새로운 디지털 팝업 경험을 제안합니다.] 기업에겐 공간·시간·비용적 한계를 보완하는 웹 기반 3D 플랫폼으로, 소비자에게는 시공간 제약을 넘어 관람·상품 체험·구매 경험을 제공합니다. 현실과 디지털 세계관을 잇는 서비스를 소개합니다.',

    // 02. 이미지 파일명 생성용 (확장자 및 경로 제외)
    imageKey: '',
    teamImageKey: '',

    // 03. 프로젝트 카테고리 (categories.js 참고)
    media: ['WEB'],
    subject: ['문화/예술'],
    target: ['전시 관람객'],

    // 04. 외부 링크 (없으면 null)
    link: null,

    // 05. 참여 학생 (표시 순서대로)
    memberIds: ['LEEJUNE', 'NOHNAMSU', 'BAECHAEWON', 'ONSEOYOUNG', 'LEEJAEBEOM', 'LEEHYUNGGYU', 'YOONSEOJIN'],
  },

  // ========== PROJECT 12 ==========
  {
    id: 'project-12',

    // 01. 프로젝트 기본 정보 (팀 번호만 입력, TEAM 표시는 화면에서 처리)
    name: '말모이',
    team: 'OCTAVE',
    slogan: '감정의 말을 모아 함께 채워가는 숲',
    desc: '감정을 표현하는 다양한 단어를 발견하고 확장하는 참여형 인터랙티브 게임입니다. 감정의 숲을 지키는 희·노·애·락 네 요정과 함께 리듬게임을 통해 감정 단어를 찾아 모으고, 발견한 단어를 기록해 하나의 나무를 함께 채워가는 경험을 제공합니다.',

    // 02. 이미지 파일명 생성용 (확장자 및 경로 제외)
    imageKey: '',
    teamImageKey: '',

    // 03. 프로젝트 카테고리 (categories.js 참고)
    media: ['WEB', '실감미디어', '공간/전시'],
    subject: ['사회/공공'],
    target: ['일반 대중'],

    // 04. 외부 링크 (없으면 null)
    link: null,

    // 05. 참여 학생 (표시 순서대로)
    memberIds: ['JOGANGHEE', 'GOSEOHYUN', 'MINMYEONGHYE', 'LEEYOUJUNG', 'LIMHYUNAH', 'JANGYOONHEE', 'CHOISONGJOO', 'CHOISEUNGJIN'],
  },

  // ========== PROJECT 13 ==========
  {
    id: 'project-13',

    // 01. 프로젝트 기본 정보 (팀 번호만 입력, TEAM 표시는 화면에서 처리)
    name: 'SNOOZE',
    team: 'LIMEN',
    slogan: '흐름 속에서, 나의 선택을 마주하다.',
    desc: 'LIMEN은 ‘내가 고른 방향은 정말 나만의 선택일까?’를 묻는 몰입형미디어아트입니다. 4면 영상과 관객 움직임에 반응하는 인터랙션으로 자신과 환경의 영향 관계를 경험하고, 전시 후 웹 AWAKE에서 일상의 선택을 돌아봅니다.',

    // 02. 이미지 파일명 생성용 (확장자 및 경로 제외)
    imageKey: '',
    teamImageKey: '',

    // 03. 프로젝트 카테고리 (categories.js 참고)
    media: ['APP', 'WEB', '실감미디어', '공간/전시'],
    subject: ['문화/예술'],
    target: ['일반 대중', '전시 관람객'],

    // 04. 외부 링크 (없으면 null)
    link: null,

    // 05. 참여 학생 (표시 순서대로)
    memberIds: ['LEECHAEYEON', 'KIMNOHEUN', 'KIMHYEONGI', 'BAEJEONGHUN', 'SIMHEAMIN', 'YUGISANG', 'CHOGAYEON'],
  },

  // ========== PROJECT 14 ==========
  {
    id: 'project-14',

    // 01. 프로젝트 기본 정보 (팀 번호만 입력, TEAM 표시는 화면에서 처리)
    name: '공명체',
    team: '42(사이)',
    slogan: '침묵하던 바다에 다시 울림이 번지는 순간',
    desc: '공명체(共鳴體)는 산호백화로 색과 생명의 기척을 잃어가는 바다를 소리와 진동의 변화로 감각화한 인터랙티브 전시입니다. 관람객의 움직임에 따라 산호와 해양생물이 반응하며, 인간과 바다가 서로의 변화에 울림을 주고받는 ‘공명체’가 되는 순간을 경험하게 하는 작품입니다.',

    // 02. 이미지 파일명 생성용 (확장자 및 경로 제외)
    imageKey: '',
    teamImageKey: '',

    // 03. 프로젝트 카테고리 (categories.js 참고)
    media: ['실감미디어', '공간/전시'],
    subject: ['문화/예술', '사회/공공'],
    target: ['일반 대중', '전시 관람객'],

    // 04. 외부 링크 (없으면 null)
    link: null,

    // 05. 참여 학생 (표시 순서대로)
    memberIds: ['HONGSUNGJU', 'KIMJIHEON', 'MOONYEJI', 'PARKBIJU', 'LEEHYEWON', 'IMSOYUN', 'JEONYEJIN', 'JOUNGDAHYEON'],
  },

  // ========== PROJECT 15 ==========
  {
    id: 'project-15',

    // 01. 프로젝트 기본 정보 (팀 번호만 입력, TEAM 표시는 화면에서 처리)
    name: 'FEELD',
    team: '잇다 IT-DA',
    slogan: '우리가 기록한 자연을, 당신의 감각으로',
    desc: '《FEELD》는 자연을 기록하는 기술과 몸으로 느끼는 감각을 잇는 인터랙티브 미디어 아트입나다. 가우시안 스플래팅으로 담은 풍경은 손이 닿으면 모습을 드러내고, 관객의 움직임을 따라 입자가 일렁입니다. 여기에 현장에서 녹음한 소리가 더해지며, 기록된 장소는 관객이 보고 듣고 만지는 경험으로 펼쳐집니다.',

    // 02. 이미지 파일명 생성용 (확장자 및 경로 제외)
    imageKey: '',
    teamImageKey: '',

    // 03. 프로젝트 카테고리 (categories.js 참고)
    media: ['WEB', '실감미디어', '공간/전시'],
    subject: ['심리/정서', '일상/라이프', '문화/예술'],
    target: ['아동/청소년', '대학생/청년', '시니어', '일반 대중', '전시 관람객'],

    // 04. 외부 링크 (없으면 null)
    link: null,

    // 05. 참여 학생 (표시 순서대로)
    memberIds: ['JUNYOUNGSEO', 'KANGMINKYUNG', 'KOYEBUM', 'KIMDAYUN', 'SONSEOYOON', 'LEEHYEYOON', 'JUNGHYEJIN'],
  },

  // ========== PROJECT 16 ==========
  {
    id: 'project-16',

    // 01. 프로젝트 기본 정보 (팀 번호만 입력, TEAM 표시는 화면에서 처리)
    name: '인생정거장',
    team: 'MOMO',
    slogan: '삶에는 정해진 하나의 모습이나 정답이 없다',
    desc: "「인생정거장」은 불확실한 미래를 준비하는 '레디코어' 트렌드에서 출발한 3D 모션그래픽 프로젝션 맵핑 작품이다. 졸업, 취업, 독립, 여행, 방황, 도약 등 각기 다른 삶의 전환점을 하나의 풍경으로 잇는다. 관객의 박수에 반응하는 인터랙션으로 몰입감을 높이며, 삶에 정해진 정답은 없으며 저마다의 선택과 속도가 존중받아야 한다는 메시지를 전한다.",

    // 02. 이미지 파일명 생성용 (확장자 및 경로 제외)
    imageKey: '',
    teamImageKey: '',

    // 03. 프로젝트 카테고리 (categories.js 참고)
    media: ['WEB', '실감미디어', '공간/전시'],
    subject: ['일상/라이프', '문화/예술'],
    target: ['대학생/청년', '일반 대중', '전시 관람객'],

    // 04. 외부 링크 (없으면 null)
    link: null,

    // 05. 참여 학생 (표시 순서대로)
    memberIds: ['JUNGSIJIN', 'KANGDAYEON', 'MOONSOYEON', 'PARKYEJI', 'CHOBOGYEONG', 'HAYEJIN'],
  },

  // ========== PROJECT 17 ==========
  {
    id: 'project-17',

    // 01. 프로젝트 기본 정보 (팀 번호만 입력, TEAM 표시는 화면에서 처리)
    name: 'SEESAW',
    team: 'REMNANT',
    slogan: '아티스트 앨범 발매 콘텐츠를 통합 제작합니다',
    desc: 'SEESAW는 앨범 발매를 준비하는 아티스트를 위한 통합 콘텐츠 제작 프로젝트입니다. REMNANT는 MV·티저, 앨범 홍보 웹사이트, 실물 앨범·굿즈를 기획·제작합니다. 매체별 콘셉트와 제작 과정을 함께 조율해 발매 콘텐츠를 일관된 방향으로 준비합니다.',

    // 02. 이미지 파일명 생성용 (확장자 및 경로 제외)
    imageKey: '',
    teamImageKey: '',

    // 03. 프로젝트 카테고리 (categories.js 참고)
    media: ['WEB', '공간/전시', '브랜딩'],
    subject: ['문화/예술'],
    target: ['일반 대중', '전시 관람객'],

    // 04. 외부 링크 (없으면 null)
    link: null,

    // 05. 참여 학생 (표시 순서대로)
    memberIds: ['KIMWOOSUNG', 'KANGMINJUN', 'KIMMINSEO', 'MOONJIHOON', 'PARKYEIN', 'SHINUIHYO', 'JANGSEWON'],
  },

]

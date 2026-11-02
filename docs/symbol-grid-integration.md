# Symbol Grid 이식 및 SVG 매핑

원본: 120개 심볼, 129개 레이어. 연결: 75개 레이어 / 75개 심볼. 미연결: 54개 레이어 / 45개 심볼.

## 매핑 기준

- ZIP assets는 비교 분석만 했으며 프로젝트에 복사하거나 실행 시 참조하지 않습니다.
- `assetMap.js`에 검증된 원본 레이어 ID → 프로젝트 상대 경로를 명시합니다. `import.meta.glob`으로 URL을 불러옵니다.
- 모든 프로젝트 SVG를 확인하고 path 명령·좌표(축소 비율과 export 반올림 고려), fill, viewBox 및 브라우저 렌더링을 대조했습니다.
- `S1C_S1` (1215:4090)은 도형/색상이 일치하는 `S1/S1T_S1.svg`에 연결합니다. 이름만으로 연결하지 않았습니다.
- `S2C_S2` (1215:3980)은 프로젝트의 같은 이름 파일과 도형·크기가 달라 미연결 상태입니다.
- `Y/S1Y_Y.svg`, `!/!_01.svg`, `!/!_06.svg`, apostrophe `_02`, `_03`은 대응 디자인이지만 원본 export와 내부 path/mask 구성에 차이가 있습니다. SVG 자체를 수정하지 않습니다.
- 느낌표/아포스트로피 SVG는 프로젝트 버전이 축소 export여서 viewBox 여백/종횡비 반올림에 따른 작은 시각 차이가 있습니다. 원본 레이어 좌표와 크기는 유지합니다.
- 프로젝트의 `!_default.svg`, apostrophe 기본 파일은 원본 목록에 대응하는 기본 심볼이 없어 새 항목을 만들지 않았습니다.

## 미연결 항목

아래 항목은 다른 SVG로 대체하지 않습니다. 목록과 선택 상태, 레이어 위치 데이터는 보존하며 미연결 레이어는 투명한 슬롯으로 남깁니다. 따라서 이 항목들은 빈 타일/프리뷰로 표시되며 시각적 100% 일치는 추가 SVG 없이 불가능합니다. 버튼 title과 접근성 설명에 누락을 표시합니다.

| 원본 ID | 원본 이름 | 누락 레이어 |
|---|---|---|
| 1215:3980 | S2C_S2 | figma-1215-3981.svg |
| 1215:4017 | S1Y_S1 | figma-1215-4018.svg |
| 1215:4023 | S1Y_S1 | figma-1215-4024.svg |
| 1215:4061 | S1Y_S1 | figma-1215-4062.svg |
| 1215:4045 | S1Y_S1 | figma-1215-4046.svg |
| 1215:4050 | S1Y_S1 | figma-1215-4051.svg |
| 1215:4056 | S1Y_S1 | figma-1215-4057.svg |
| 1215:3894 | TS1_S1 | figma-1215-3895.svg |
| 1215:3904 | TS1_S1 | figma-1215-3905.svg |
| 1215:3909 | TS1_S1 | figma-1215-3910.svg |
| 1215:3917 | TS1_S1 | figma-1215-3918.svg, figma-1215-3919.svg, figma-1215-3920.svg |
| 1215:3927 | TS1_S1 | figma-1215-3928.svg |
| 1215:3812 | ES1_S1 | figma-1215-3813.svg |
| 1215:3817 | ES1_S1 | figma-1215-3818.svg |
| 1215:3832 | ES1_S1 | figma-1215-3833.svg |
| 1215:3837 | ES1_S1 | figma-1215-3838.svg, figma-1215-3844.svg |
| 1215:3850 | ES1_S1 | figma-1215-3851.svg, figma-1215-3857.svg |
| 1215:3665 | apost | figma-1215-3666.svg |
| 1215:3670 | apost | figma-1215-3671.svg |
| 1215:3675 | apost | figma-1215-3676.svg |
| 1215:3680 | apost | figma-1215-3681.svg, figma-1215-3682.svg, figma-1215-3683.svg |
| 1215:3684 | apost | figma-1215-3685.svg, figma-1215-3686.svg, figma-1215-3687.svg |
| 1215:3688 | apost | figma-1215-3689.svg |
| 1215:3633 | apost | figma-1215-3637.svg |
| 1215:3874 | apost | figma-1215-3875.svg |
| 1215:3943 | apost | figma-1215-3944.svg |
| 1215:3990 | apost | figma-1215-3991.svg |
| 1215:4095 | apost | figma-1215-4096.svg |
| 1215:3643 | apost | figma-1215-3644.svg |
| 1215:3797 | apost | figma-1215-3798.svg |
| 1215:3879 | apost | figma-1215-3880.svg |
| 1215:3948 | apost | figma-1215-3949.svg |
| 1215:3995 | apost | figma-1215-3996.svg, figma-1215-4000.svg |
| 1215:4072 | apost | figma-1215-4073.svg |
| 1215:4100 | apost | figma-1215-4101.svg |
| 1215:3648 | apost | figma-1215-3649.svg |
| 1215:3802 | apost | figma-1215-3803.svg |
| 1215:3884 | apost | figma-1215-3885.svg |
| 1215:4004 | apost | figma-1215-4005.svg |
| 1215:4077 | apost | figma-1215-4078.svg |
| 1215:3653 | apost | figma-1215-3654.svg |
| 1215:3807 | apost | figma-1215-3808.svg |
| 1215:3958 | apost | figma-1215-3959.svg |
| 1215:4010 | apost | figma-1215-4011.svg |
| 1215:4111 | apost | figma-1215-4112.svg |

## 전체 연결표

| 원본 레이어 | src/assets/type 내 경로 |
|---|---|
| figma-1215-3534.svg | L_default.svg |
| figma-1215-3517.svg | L/LE_L.svg |
| figma-1215-4186.svg | L/LT_L.svg |
| figma-1215-4191.svg | L/LS1_L.svg |
| figma-1215-4201.svg | L/LS2_L.svg |
| figma-1215-4196.svg | L/LY_L.svg |
| figma-1215-4206.svg | L/LN_L.svg |
| figma-1215-4211.svg | L/LC_L.svg |
| figma-1215-3536.svg | E_default.svg |
| figma-1215-3619.svg | E/LE_E.svg |
| figma-1215-4155.svg | E/ET_E.svg |
| figma-1215-4160.svg | E/ES1_E.svg |
| figma-1215-4165.svg | E/ES2_E.svg |
| figma-1215-4170.svg | E/EY_E.svg |
| figma-1215-4175.svg | E/EN_E.svg |
| figma-1215-4180.svg | E/EC_E.svg |
| figma-1215-3538.svg | T_default.svg |
| figma-1215-3624.svg | T/LT_T.svg |
| figma-1215-4117.svg | T/ET_T.svg |
| figma-1215-4122.svg | T/TS1_T.svg |
| figma-1215-4127.svg | T/TS2_T.svg |
| figma-1215-4132.svg | T/TY_T.svg |
| figma-1215-4137.svg | T/TN_T.svg |
| figma-1215-4142.svg | T/TC_T.svg |
| figma-1215-3546.svg | S1_default.svg |
| figma-1215-3629.svg | S1/LS1_S1.svg |
| figma-1215-3788.svg | S1/ES1_S1.svg |
| figma-1215-3869.svg | S1/TS1_S1.svg |
| figma-1215-3939.svg | S1/S1S2_S1.svg |
| figma-1215-3986.svg | S1/S1Y_S1.svg |
| figma-1215-3512.svg | S1/S1N_S1.svg |
| figma-1215-4091.svg | S1/S1T_S1.svg |
| figma-1215-3548.svg | S2_default.svg |
| figma-1215-3694.svg | S2/LS2_S2.svg |
| figma-1215-3864.svg | S2/ES2_S2.svg |
| figma-1215-3933.svg | S2/TS2_S2.svg |
| figma-1215-3966.svg | S2/S1S2_S2.svg |
| figma-1215-3971.svg | S2/S2Y_S2.svg |
| figma-1215-3976.svg | S2/S2N_S2.svg |
| figma-1215-3570.svg | Y_default.svg |
| figma-1215-3699.svg | Y/LY_Y.svg |
| figma-1215-3740.svg | Y/EY_Y.svg |
| figma-1215-3745.svg | Y/TY_Y.svg |
| figma-1215-3765.svg | Y/S2Y_Y.svg |
| figma-1215-3770.svg | Y/YN_Y.svg |
| figma-1215-3775.svg | Y/YC_Y.svg |
| figma-1215-3572.svg | N_default.svg |
| figma-1215-3583.svg | N/LN_N.svg |
| figma-1215-3588.svg | N/EN_N.svg |
| figma-1215-3593.svg | N/TN_N.svg |
| figma-1215-3598.svg | N/S1N_N.svg |
| figma-1215-3603.svg | N/S2N_N.svg |
| figma-1215-3608.svg | N/YN_N.svg |
| figma-1215-3612.svg | N/NC_N.svg |
| figma-1215-3617.svg | C_default.svg |
| figma-1215-3704.svg | C/LC_C.svg |
| figma-1215-3709.svg | C/EC_C.svg |
| figma-1215-3714.svg | C/TC_C.svg |
| figma-1215-3719.svg | C/S1C_C.svg |
| figma-1215-3725.svg | C/S2C_C.svg |
| figma-1215-3730.svg | C/YC_C.svg |
| figma-1215-3735.svg | C/NC_C.svg |
| figma-1215-3922.svg | !/!_02.svg |
| figma-1215-3823.svg | !/!_03.svg |
| figma-1215-3828.svg | !/!_07.svg |
| figma-1215-3661.svg | !/!.svg |
| figma-1215-3793.svg | '/'_07.svg |
| figma-1215-3954.svg | '/'.svg |
| figma-1215-4106.svg | '/'_04.svg |
| figma-1215-3890.svg | '/'_01.svg |
| figma-1215-3900.svg | !/!_01.svg |
| figma-1215-4029.svg | !/!_06.svg |
| figma-1215-4067.svg | '/'_03.svg |
| figma-1215-4084.svg | '/'_02.svg |
| figma-1215-3750.svg | Y/S1Y_Y.svg |

## 통합 범위

- Home.jsx에 import와 `<SymbolGrid />`만 추가합니다.
- 원본 body/main은 기존 main 안의 section으로 변환하고 CSS 클래스·keyframes에 고유 접두사를 붙였습니다.
- 원본 외부 Pretendard CSS 대신 프로젝트에 이미 설치된 Pretendard를 사용합니다.
- 모바일 전용 Home에는 DesignMotifs가 없어 기존 모바일 메인 구성은 유지합니다. 컴포넌트 CSS 자체에는 원본 700px/1100px 반응형 규칙이 유지됩니다.
- 원본 프리뷰 페이드 및 hover transition만 보존하고 애니메이션을 추가하지 않았습니다.

## 검증 결과 (2026-11-02)

- `npm run build` 통과. 큰 JS 청크에 대한 Vite 경고는 있으나 빌드 오류는 없습니다.
- `npx eslint src/pages/Home/sections/SymbolGrid src/pages/Home/Home.jsx` 통과.
- 원본과 이식 데이터의 120개 항목, ID, 순서, 129개 레이어 좌표·크기 전체가 동일함을 비교 검증했습니다.
- 11개 필터 클릭: ALL 120, 문자별 8, EXCLAMATION 28, APOSTROPHE 28. 첫 항목 자동 선택과 활성 상태를 확인했습니다.
- 브라우저에서 120개 옵션을 모두 클릭하고 선택 1개 유지, 프리뷰 이름, 레이어 수·스타일·이미지 URL의 일치를 검증했습니다.
- 그리드 scrollTop 4290에서 동일 ALL 필터를 재선택한 후 0으로 초기화됨을 확인했습니다.
- 연결된 이미지 로딩 실패 0, 의도적으로 남긴 미연결 레이어 슬롯 54.
- 브라우저 warn/error 로그 없음.
- 메인 DOM 순서가 DesignMotifs → SymbolGrid → LastSec임을 확인했습니다. 기존 GROWTH 선택 시 motif data-active=3으로 변경됩니다.
- 1440px 화면 시각 검수, 1000px에서 padding 40px/4열/가로 넘침 없음 확인. 390px에서는 기존 모바일 포스터 및 전시 정보 페이지를 유지합니다.
- 새 컴포넌트의 700px 이하 CSS 규칙은 원본 그대로 보존했으나 기존 Home의 모바일 분기로 인해 실제 모바일 메인에는 이 섹션이 마운트되지 않습니다.
- 기존 모든 GSAP 타임라인의 장시간 회귀 검증까지 보증하는 것은 아니며 기존 GSAP/ScrollTrigger 소스는 수정하지 않았습니다.

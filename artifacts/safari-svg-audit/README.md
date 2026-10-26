# Safari 3번째 SVG 효과 호환성 보완

## 코드로 확인한 차이

1번째는 기존 getSyncTypographyImage로 선택한 Image를 직접 drawImage 합니다. 3번째도 동일 DEFAULT Image와 동일 함수에서 전달된 SYNC Image를 사용합니다. 별도 SVG 선택 인덱스는 없으며, orbitSvgState의 index는 두 알파벳의 0.16초 시차만 결정합니다.

3번째에서만 SVG를 픽셀로 읽어 실루엣을 보간하고, 임시 Canvas에 putImageData 후 메인 Canvas로 복사합니다. 기존에는 두 알파벳이 같은 가변 출력 Canvas와 ImageData를 번갈아 덮어썼습니다. SVG 필드 캐시는 Image 객체별 WeakMap이며 불변 데이터입니다.

SVG는 독립 Image 리소스로 로드하므로 DOM SVG 노드 재사용, 페이지 전역 ID 중복, CSS transform-origin/키프레임 방식의 전환이 아닙니다. 실제 SVG 64파일 내 중복 ID는 없으며 mask 1개를 제외하면 clipPath/filter/gradient도 없습니다. 기존 Canvas transform은 save/restore로 격리되어 있습니다.

## 변경

- orbit-morph.js: 알파벳별 출력 렌더러/Canvas/ImageData 분리, 종료 시 모두 정리.
- svg-state-morph.js: WebKit 경로에만 willReadFrequently 출력 컨텍스트 및 putImageData 직후 1픽셀 readback 동기화 추가. 픽셀 값은 수정하지 않습니다. Chrome 경로는 기존 그대로입니다.
- SVG 선택·원본, 보간 수식·크기, 전환·유지 시간, 탄성 모션, 1번째 효과, 랜덤 선택, 다른 페이지는 수정하지 않았습니다.

## 근거와 한계

WebKit에는 Canvas→Canvas 복사 후 putImageData가 다른 Canvas에 영향을 준 이력(256151), putImageData 결과를 복사하기 전 GPU 쓰기가 완료되지 않던 이력(240802)이 있습니다. 해당 이슈는 수정된 과거 버그이며, 이것이 사용자의 현재 Safari 오류와 동일한 원인이라는 뜻은 아닙니다. 이번 변경은 현재 3번째에만 존재하는 동일 종류의 버퍼 공유·동기화 경로를 좁게 보완한 것입니다.

https://bugs.webkit.org/show_bug.cgi?id=256151
https://bugs.webkit.org/show_bug.cgi?id=240802

실제 사용 중 Safari의 오류를 재현하거나 완전 해결됐다고 확정하지 않았습니다. 실제 Safari WebDriver는 원격 자동화 비활성으로 실행하지 못했습니다. Playwright WebKit 26.5는 Safari 자체 검증이 아닙니다.

## 검증

- Chrome / WebKit 각각 56개 SVG 조합 × 5단계: 수정 전후 280/280 출력 PNG가 정확히 동일.
- 실제 두 알파벳이 다른 출력 Canvas를 사용함을 확인. WebKit에서 두 버퍼 모두 복사 전 readback 실행 확인. 종료 시 버퍼 해제 확인.
- 기존 전환 함수를 0~7초 구간에서 비교: 동일. 전체 6.9초 / SYNC 0.9초 / DEFAULT 0.5초 유지.
- 기존 1·3번만 랜덤 실행 확인.
- ESLint / production build / diff 공백 검사 통과. 기존 번들 크기 경고는 유지.
- 추가 확인: 사용자의 실제 macOS Safari에서 문제 알파벳 조합의 재시험이 필요합니다.

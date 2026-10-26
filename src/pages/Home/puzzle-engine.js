// Port of /Users/yujin/Downloads/scroll.html; board data and animation timings are retained.
export function mountPuzzle(root) {
let disposed=false;
const events=new AbortController();
const animations=new Set();
const listen=(target,type,handler,options={})=>target.addEventListener(type,handler,{...options,signal:events.signal});
const animate=(element,...args)=>{
  const animation=element.animate(...args);
  animations.add(animation);
  animation.finished.then(()=>{
    if(!['both','forwards'].includes(animation.effect.getTiming().fill))animations.delete(animation);
  },()=>animations.delete(animation));
  return animation;
};
const T={
  gong:{name:'공감',vb:[328,325],desc:'우리는 서로 다른 생각과 감정을 나누며, 미처 알지 못했던 서로의 모습을 발견합니다. 그 차이를 이해하고 받아들이는 과정에서 우리의 관계는 더 깊고 넓어집니다.',
    p:["M261.848 86.2532C273.272 75.9504 274.185 58.3323 263.889 46.902C253.592 35.4717 235.985 34.5576 224.561 44.8604C213.138 55.1631 212.224 72.7812 222.521 84.2115C232.817 95.6418 250.425 96.5559 261.848 86.2532Z","M129.053 60.3265C144.098 57.1185 153.695 42.3142 150.489 27.2603C147.283 12.2064 132.488 2.60338 117.443 5.81143C102.398 9.01948 92.8003 23.8237 96.0064 38.8777C99.2126 53.9316 114.008 63.5346 129.053 60.3265Z","M61.5503 129.082C66.2938 114.448 58.2832 98.7378 43.6583 93.9915C29.0334 89.2452 13.3322 97.2605 8.58879 111.894C3.84533 126.528 11.8558 142.238 26.4807 146.985C41.1057 151.731 56.8068 143.716 61.5503 129.082Z","M85.4968 261.505C96.9203 251.202 97.8338 233.584 87.5372 222.153C77.2406 210.723 59.633 209.809 48.2095 220.112C36.786 230.415 35.8724 248.033 46.169 259.463C56.4657 270.893 74.0733 271.807 85.4968 261.505Z","M192.553 300.756C207.598 297.548 217.195 282.744 213.989 267.69C210.783 252.636 195.987 243.033 180.943 246.241C165.898 249.449 156.3 264.253 159.506 279.307C162.713 294.361 177.508 303.964 192.553 300.756Z","M301.41 194.276C306.153 179.642 298.143 163.932 283.518 159.185C268.893 154.439 253.192 162.454 248.448 177.088C243.705 191.722 251.715 207.432 266.34 212.178C280.965 216.925 296.666 208.909 301.41 194.276Z","M223.803 106.305C235.227 96.0027 236.141 78.3846 225.844 66.9543C215.547 55.524 197.94 54.6099 186.516 64.9126C175.093 75.2154 174.179 92.8335 184.476 104.264C194.772 115.694 212.38 116.608 223.803 106.305Z","M132.022 111.35C147.067 108.142 156.664 93.3381 153.458 78.2842C150.252 63.2303 135.456 53.6273 120.411 56.8354C105.366 60.0434 95.769 74.8477 98.9752 89.9016C102.181 104.956 116.977 114.558 132.022 111.35Z","M111.839 160.076C116.583 145.442 108.572 129.732 93.9474 124.986C79.3225 120.239 63.6213 128.255 58.8779 142.888C54.1344 157.522 62.1449 173.232 76.7698 177.979C91.3947 182.725 107.096 174.71 111.839 160.076Z","M142.094 241.466C153.518 231.163 154.432 213.545 144.135 202.115C133.838 190.685 116.231 189.771 104.807 200.073C93.3836 210.376 92.4701 227.994 102.767 239.424C113.063 250.855 130.671 251.769 142.094 241.466Z","M208.139 249.734C223.184 246.526 232.781 231.721 229.575 216.668C226.369 201.614 211.573 192.011 196.528 195.219C181.483 198.427 171.886 213.231 175.092 228.285C178.298 243.339 193.094 252.942 208.139 249.734Z","M269.675 163.287C274.419 148.654 266.408 132.943 251.783 128.197C237.158 123.451 221.457 131.466 216.714 146.1C211.97 160.733 219.981 176.444 234.606 181.19C249.231 185.936 264.932 177.921 269.675 163.287Z"]},
  mol:{name:'몰입',vb:[344,344],desc:'그렇게 각자가 쌓아온 경험을 나누며, 혼자서는 풀기 어려웠던 문제의 실마리를 찾습니다. 우리는 익숙한 방식과 한계를 넘어, 함께 나아갈 새로운 길을 열어갑니다.',
    p:["M164.141 116.605L107.859 23.1213C105.384 19.013 109.739 14.1978 114.074 16.2386L148.561 32.505C159.846 37.6004 172.838 37.2803 183.862 31.6314L218.969 13.8844C223.224 11.7302 227.699 16.372 225.398 20.547L172.537 116.445C170.737 119.713 166.068 119.8 164.147 116.605H164.141Z","M116.598 168.846L23.1145 225.122C19.0062 227.596 14.191 223.241 16.2318 218.906L32.4982 184.419C37.5936 173.135 37.2734 160.143 31.6245 149.118L13.8775 114.018C11.7233 109.763 16.3652 105.288 20.5402 107.589L116.438 160.45C119.706 162.25 119.793 166.919 116.598 168.839V168.846Z","M168.838 216.385L225.12 309.869C227.594 313.977 223.239 318.793 218.904 316.752L184.417 300.485C173.133 295.39 160.141 295.71 149.116 301.359L114.016 319.113C109.761 321.267 105.286 316.625 107.587 312.45L160.448 216.552C162.248 213.284 166.917 213.198 168.838 216.392V216.385Z","M216.373 164.147L309.856 107.864C313.965 105.39 318.78 109.745 316.739 114.08L300.473 148.567C295.377 159.852 295.697 172.843 301.346 183.868L319.1 218.968C321.254 223.223 316.612 227.698 312.437 225.398L216.54 172.537C213.272 170.736 213.185 166.067 216.379 164.147H216.373Z","M129.564 132.882L23.6627 106.578C19.0142 105.424 18.6807 98.9351 23.1958 97.3145L59.0833 84.4294C70.6679 80.0543 79.6314 70.6373 83.4263 58.8526L95.6911 21.4778C97.1784 16.9494 103.621 17.0628 104.948 21.6446L135.38 126.833C136.421 130.421 133.179 133.782 129.558 132.882H129.564Z","M132.88 203.434L106.577 309.329C105.423 313.977 98.9336 314.311 97.313 309.796L84.4279 273.908C80.0528 262.324 70.6358 253.36 58.8511 249.565L21.4764 237.3C16.9479 235.813 17.0613 229.371 21.6431 228.043L126.831 197.611C130.419 196.571 133.781 199.812 132.88 203.434Z","M203.439 200.11L309.335 226.413C313.983 227.567 314.317 234.056 309.802 235.677L273.914 248.562C262.329 252.937 253.366 262.354 249.571 274.139L237.306 311.514C235.819 316.042 229.376 315.929 228.049 311.347L197.617 206.159C196.577 202.571 199.818 199.209 203.439 200.11Z","M200.12 129.557L226.424 23.6548C227.578 19.0063 234.067 18.6729 235.688 23.188L248.573 59.0755C252.948 70.6601 262.365 79.6236 274.15 83.4185L311.525 95.6833C316.053 97.1706 315.94 103.613 311.358 104.94L206.17 135.372C202.581 136.413 199.22 133.171 200.12 129.55V129.557Z"]},
  bal:{name:'발견',vb:[338,343],desc:'서로 다른 시선으로 바라보면 각자의 관점도 넓어집니다. 그 과정에서 혼자서는 보지 못했던 관점과 가능성을 발견합니다.',
    p:["M204.758 1.12898C210.654 -2.76442 217.647 4.22857 213.754 10.1254C199.435 31.8225 199.435 59.9759 213.754 81.6731C217.647 87.5699 210.654 94.5629 204.758 90.6695C183.06 76.3508 154.907 76.3508 133.21 90.6695C127.313 94.5629 120.32 87.5699 124.213 81.6731C138.532 59.9759 138.532 31.8225 124.213 10.1254C120.32 4.22857 127.313 -2.76442 133.21 1.12898C154.907 15.4476 183.06 15.4476 204.758 1.12898Z","M39.378 55.3022C38.9546 48.2487 48.5105 45.6858 51.6705 52.006C63.3053 75.253 87.6787 89.3297 113.632 87.7799C120.686 87.3565 123.241 96.9123 116.928 100.072C93.6814 111.707 79.6047 136.081 81.1545 162.034C81.5778 169.088 72.022 171.65 68.8619 165.33C57.2271 142.083 32.8537 128.007 6.9003 129.556C-0.153171 129.98 -2.71601 120.424 3.60414 117.264C26.8511 105.629 40.9278 81.2556 39.378 55.3022Z","M3.60414 225.606C-2.71601 222.446 -0.153171 212.89 6.9003 213.314C32.8537 214.863 57.2271 200.787 68.8619 177.54C72.022 171.22 81.5778 173.782 81.1545 180.836C79.6047 206.789 93.6814 231.163 116.928 242.798C123.248 245.958 120.686 255.513 113.632 255.09C87.6787 253.54 63.3053 267.617 51.6705 290.864C48.5105 297.184 38.9546 294.621 39.378 287.568C40.9278 261.614 26.8511 237.241 3.60414 225.606Z","M133.21 341.742C127.313 345.636 120.32 338.643 124.213 332.746C138.532 311.049 138.532 282.895 124.213 261.198C120.32 255.301 127.313 248.308 133.21 252.202C154.907 266.52 183.06 266.52 204.758 252.202C210.654 248.308 217.647 255.301 213.754 261.198C199.435 282.895 199.435 311.049 213.754 332.746C217.647 338.643 210.654 345.636 204.758 341.742C183.06 327.424 154.907 327.424 133.21 341.742Z","M298.595 287.568C299.018 294.621 289.462 297.184 286.302 290.864C274.667 267.617 250.294 253.54 224.34 255.09C217.287 255.513 214.732 245.958 221.044 242.798C244.291 231.163 258.368 206.789 256.818 180.836C256.395 173.782 265.951 171.22 269.111 177.54C280.745 200.787 305.119 214.863 331.072 213.314C338.126 212.89 340.689 222.446 334.368 225.606C311.121 237.241 297.045 261.614 298.595 287.568Z","M334.372 117.264C340.692 120.424 338.129 129.98 331.076 129.556C305.122 128.007 280.749 142.083 269.114 165.33C265.954 171.65 256.398 169.088 256.821 162.034C258.371 136.081 244.294 111.707 221.048 100.072C214.727 96.9123 217.29 87.3565 224.344 87.7799C250.297 89.3297 274.67 75.253 286.305 52.006C289.465 45.6858 299.021 48.2487 298.598 55.3022C297.048 81.2556 311.125 105.629 334.372 117.264Z"]},
  seong:{name:'성장',vb:[376,376],desc:'누군가의 작은 시도는 다른 이에게도 해볼 수 있다는 용기와 영감을 건넵니다. 우리는 가능성을 발견하고 응원하며, 새로운 도전을 시작할 힘을 얻습니다.',
    p:["M175.336 35.2571L162.151 43.728C159.392 45.5003 158.593 49.1732 160.365 51.9318L203.58 119.194C205.353 121.953 209.026 122.752 211.784 120.98L224.969 112.509C227.727 110.737 228.527 107.064 226.754 104.305L183.539 37.0428C181.767 34.2843 178.094 33.4848 175.336 35.2571Z","M71.4239 89.11L68.0908 104.423C67.3935 107.626 69.4253 110.789 72.6291 111.486L150.748 128.491C153.952 129.188 157.115 127.156 157.812 123.952L161.145 108.64C161.843 105.436 159.811 102.273 156.607 101.576L78.4876 84.5717C75.2838 83.8743 72.1213 85.9062 71.4239 89.11Z","M105.078 149.238L37.8151 192.453C35.0565 194.225 34.257 197.898 36.0294 200.657L44.5002 213.841C46.2725 216.6 49.9455 217.399 52.704 215.627L119.967 172.412C122.725 170.64 123.525 166.967 121.752 164.208L113.281 151.024C111.509 148.265 107.836 147.466 105.078 149.238Z","M102.335 219.377L85.3311 297.496C84.6337 300.7 86.6655 303.862 89.8693 304.56L105.182 307.893C108.386 308.59 111.548 306.558 112.246 303.354L129.25 225.235C129.947 222.031 127.915 218.869 124.712 218.171L109.399 214.838C106.195 214.141 103.033 216.173 102.335 219.377Z","M164.974 254.24L151.79 262.711C149.031 264.483 148.232 268.156 150.004 270.915L193.219 338.177C194.991 340.936 198.664 341.735 201.423 339.963L214.607 331.492C217.366 329.72 218.165 326.047 216.393 323.288L173.178 256.026C171.406 253.267 167.733 252.468 164.974 254.24Z","M218.932 251.271L215.599 266.584C214.901 269.788 216.933 272.95 220.137 273.647L298.256 290.652C301.46 291.349 304.623 289.317 305.32 286.113L308.653 270.801C309.35 267.597 307.319 264.434 304.115 263.737L225.995 246.733C222.792 246.035 219.629 248.067 218.932 251.271Z","M324.056 159.593L256.794 202.808C254.035 204.58 253.236 208.253 255.008 211.011L263.479 224.196C265.251 226.954 268.924 227.754 271.683 225.982L338.945 182.767C341.704 180.994 342.503 177.321 340.731 174.563L332.26 161.378C330.488 158.62 326.815 157.82 324.056 159.593Z","M264.497 71.8667L247.493 149.986C246.796 153.19 248.828 156.352 252.031 157.05L267.344 160.383C270.548 161.08 273.71 159.048 274.408 155.845L291.412 77.7252C292.109 74.5215 290.078 71.3589 286.874 70.6616L271.561 67.3285C268.357 66.6311 265.195 68.663 264.497 71.8667Z","M132.043 23.8793L126.754 43.6192C125.78 47.2543 127.937 50.9908 131.572 51.9648L217.126 74.8888C220.761 75.8628 224.497 73.7056 225.471 70.0705L230.76 50.3305C231.734 46.6954 229.577 42.959 225.942 41.9849L140.389 19.061C136.754 18.0869 133.017 20.2442 132.043 23.8793Z","M32.7537 111.667L42.9719 129.365C44.8535 132.625 49.021 133.741 52.2801 131.86L128.985 87.5738C132.244 85.6922 133.361 81.5247 131.479 78.2656L121.261 60.5672C119.38 57.3081 115.212 56.1914 111.953 58.0731L35.2478 102.359C31.9887 104.24 30.872 108.408 32.7537 111.667Z","M24.6215 243.956L44.3614 249.245C47.9965 250.219 51.733 248.062 52.707 244.427L75.631 158.873C76.605 155.238 74.4477 151.502 70.8127 150.528L51.0727 145.239C47.4376 144.265 43.7011 146.422 42.7271 150.057L19.8032 235.61C18.8291 239.245 20.9864 242.982 24.6215 243.956Z","M112.406 343.249L130.105 333.031C133.364 331.149 134.48 326.982 132.599 323.723L88.3131 247.018C86.4314 243.759 82.264 242.642 79.0048 244.524L61.3065 254.742C58.0473 256.623 56.9307 260.791 58.8123 264.05L103.098 340.755C104.98 344.014 109.147 345.131 112.406 343.249Z","M244.701 351.38L249.99 331.64C250.964 328.004 248.807 324.268 245.172 323.294L159.619 300.37C155.983 299.396 152.247 301.553 151.273 305.188L145.984 324.928C145.01 328.563 147.167 332.3 150.802 333.274L236.355 356.198C239.991 357.172 243.727 355.015 244.701 351.38Z","M343.992 263.587L333.774 245.888C331.893 242.629 327.725 241.513 324.466 243.394L247.761 287.68C244.502 289.562 243.385 293.729 245.267 296.988L255.485 314.687C257.367 317.946 261.534 319.062 264.793 317.181L341.498 272.895C344.757 271.013 345.874 266.846 343.992 263.587Z","M352.113 131.295L332.373 126.006C328.738 125.032 325.001 127.189 324.027 130.824L301.103 216.378C300.129 220.013 302.287 223.749 305.922 224.723L325.662 230.012C329.297 230.986 333.033 228.829 334.007 225.194L356.931 139.641C357.905 136.006 355.748 132.269 352.113 131.295Z","M264.328 32.0139L246.63 42.2321C243.371 44.1138 242.254 48.2812 244.136 51.5404L288.421 128.245C290.303 131.505 294.47 132.621 297.73 130.74L315.428 120.521C318.687 118.64 319.804 114.472 317.922 111.213L273.636 34.5081C271.755 31.2489 267.587 30.1323 264.328 32.0139Z"]}
};

const ORDER=['gong','mol','bal','seong'];
const MOTIF={
  gong:'<circle cx="50" cy="50" r="46"/>',
  mol:'<path class="tri" d="M50 12 L92 86 L8 86 Z"/>',
  bal:'<path d="M50 2 Q56 44 98 50 Q56 56 50 98 Q44 56 2 50 Q44 44 50 2 Z"/>',
  seong:'<rect x="8" y="8" width="84" height="84" rx="16"/>'
};
// 최종 배치 (보내주신 이미지 그대로)
const MAP=["SE.E",".ES.","ESE.","..ES"];
const SYM_AT={gong:[0,0],mol:[1,2],bal:[2,1],seong:[3,3]};
const INFO_AT={gong:'0,1',mol:'1,1',bal:'2,2',seong:'3,2'};
const EMPTY_AT=[];MAP.forEach((row,r)=>[...row].forEach((ch,c)=>{if(ch==='E')EMPTY_AT.push([r,c])}));
// 퍼즐 보드: 모양별로 가로 3칸이 맞춰질 줄
const BOARDS={
  wide:{mask:[".XXX.XX.X.","XXXXXXXXXX",".XXXXXXXXX","XXX..XXXX."],trip:{gong:[1,1],mol:[2,5],bal:[0,1],seong:[3,5]}},
  narrow:{mask:[".XXX.X","XXXXXX","X.XXXX","XXXXX.","XX.XXX",".XXXX."],trip:{gong:[1,2],mol:[3,1],bal:[0,1],seong:[4,3]}}
};

const $=id=>root.querySelector(`[data-puzzle="${id}"]`);
const scene=$('scene'),sticky=$('sticky'),layer=$('layer'),cue=$('cue'),caption=$('caption');
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const symSvg=k=>`<svg class="sy" viewBox="0 0 ${T[k].vb.join(' ')}" aria-hidden="true">${T[k].p.map(d=>`<path d="${d}"/>`).join('')}</svg>`;
const moSvg=k=>`<svg class="mo" viewBox="0 0 100 100" aria-hidden="true">${MOTIF[k]}</svg>`;
const mk=(cls,html)=>{const d=document.createElement('div');d.className='blk '+cls;d.innerHTML=`<div class="face">${html}</div>`;layer.appendChild(d);return d};
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const lerp=(a,b,t)=>a+(b-a)*t;

// 최종 배치 블록
const slots={},empties={},infos={};
EMPTY_AT.forEach(([r,c])=>{empties[`${r},${c}`]=mk('slot empty','')});
ORDER.forEach(k=>{const d=mk('slot sym',symSvg(k));d.dataset.k=k;d.setAttribute('role','button');d.setAttribute('aria-label',T[k].name);d.tabIndex=-1;slots[k]=d;bind(k,d)});
ORDER.forEach(k=>{const i=document.createElement('div');i.className='info';i.dataset.k=k;i.innerHTML=`<h3>${T[k].name}</h3><p>${T[k].desc}</p>`;empties[INFO_AT[k]].firstChild.appendChild(i);infos[k]=i});

// 퍼즐 보드 블록
let BD,BR,BC,tiles=[],groups={},narrow=null;
function buildBoard(mode){
  tiles.forEach(t=>t.el.remove());tiles=[];groups={};
  BD=BOARDS[mode];BR=BD.mask.length;BC=BD.mask[0].length;
  let seed=mode==='wide'?5:9;const rand=()=>{seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  const grid=BD.mask.map(row=>[...row].map(ch=>ch==='X'?'':null));
  ORDER.forEach(k=>{const [r,c]=BD.trip[k];for(let j=0;j<3;j++)grid[r][c+j]=k});
  for(let r=0;r<BR;r++)for(let c=0;c<BC;c++){if(grid[r][c]!=='')continue;
    let k,n=0;do{k=ORDER[Math.floor(rand()*4)];n++}while(n<20&&((c>=1&&grid[r][c-1]===k)||(c+1<BC&&grid[r][c+1]===k)));grid[r][c]=k}
  for(let r=0;r<BR;r++)for(let c=0;c<BC;c++){const k=grid[r][c];if(!k)continue;
    const d=mk('tile',moSvg(k));tiles.push({k,r,c,el:d,face:d.firstChild,isSym:false})}
  ORDER.forEach(k=>{const [r,c]=BD.trip[k];const f=cc=>tiles.find(t=>t.r===r&&t.c===cc);groups[k]={a:f(c),m:f(c+1),b:f(c+2),k}});
  // 남은 블록 중 6개는 빈 블록 자리로, 나머지는 떨어져 사라짐 (열 순서대로 짝지어 서로 덜 엇갈리게)
  const inG=new Set(ORDER.flatMap(k=>[groups[k].a,groups[k].m,groups[k].b]));
  const rest=tiles.filter(t=>!inG.has(t));
  const order=[...EMPTY_AT].sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
  const pickIdx=order.map((_,i)=>Math.round((i+.5)*rest.length/order.length-.5));
  const sortedRest=[...rest].sort((a,b)=>a.c-b.c||a.r-b.r);
  sortedRest.forEach(t=>t.dest=null);
  order.forEach(([r,c],i)=>{sortedRest[pickIdx[i]].dest=[r,c]});
  ORDER.forEach(k=>{groups[k].m.dest=SYM_AT[k]});
  fallen=false;
}

let s,sg,stripW,stripH,bx,by,cell,gap,M,vh;
function measure(){
  const W=layer.clientWidth;vh=innerHeight;
  const nm=W<700;if(nm!==narrow){resetFall();narrow=nm;buildBoard(narrow?'narrow':'wide')}
  root.classList.toggle('narrow',narrow);
  // 최종 배치
  const R=25/430;cell=W/(4+R*3);gap=cell*R;M=Math.min(60,vh*.06);
  const H=4*cell+3*gap;layer.style.height=(M+H+M)+'px';
  EMPTY_AT.forEach(([r,c])=>place(empties[`${r},${c}`],c,r));
  ORDER.forEach(k=>place(slots[k],SYM_AT[k][1],SYM_AT[k][0]));
  // 보드는 첫 화면 가운데
  s=Math.min(W/(BC+.1*(BC-1)),(vh*.74)/(BR+.1*(BR-1)));sg=s*.1;
  stripW=BC*s+(BC-1)*sg;stripH=BR*s+(BR-1)*sg;bx=(W-stripW)/2;by=(vh-stripH)/2;
  tiles.forEach(t=>{t.el.style.width=t.el.style.height=s+'px'});
  cue.style.top=Math.min(vh-60,by+stripH+40)+'px';
  scene.style.height=(M+H+M+vh*2)+'px';
  fitInfo();
  if(fallen){fallen=false;resetFall();}
  frame();
}
function place(d,c,r){d.style.width=d.style.height=cell+'px';d.style.transform=`translate(${c*(cell+gap)}px,${M+r*(cell+gap)}px)`}
function fitInfo(){
  Object.values(infos).forEach(i=>{const h=i.querySelector('h3'),p=i.querySelector('p');
    let fs=Math.max(11,cell*.045);h.style.fontSize=cell*.115+'px';p.style.fontSize=fs+'px';i.classList.add('measure');
    while(i.scrollHeight>i.clientHeight+1&&fs>9){fs-=.5;p.style.fontSize=fs+'px';h.style.fontSize=Math.max(16,fs*2.5)+'px'}
    i.classList.remove('measure')});
}
const tc=t=>[bx+t.c*(s+sg)+s/2,by+t.r*(s+sg)+s/2];             // 보드 칸 중심
const sc=([r,c])=>[c*(cell+gap)+cell/2,M+r*(cell+gap)+cell/2];   // 최종 칸 중심
function put(el,[x,y],size,extra=''){el.style.transform=`translate(${x-s/2}px,${y-s/2}px) scale(${size/s}) ${extra}`}

// 합쳐질 때 '팡'
function impact(t){
  if(reduce)return;
  animate(t.face,[{transform:'scale(1)'},{transform:'scale(1.22,.8)',offset:.16},{transform:'scale(.86,1.12)',offset:.36},{transform:'scale(1.06,.96)',offset:.56},{transform:'scale(.99,1.01)',offset:.78},{transform:'none'}],{duration:780,easing:'linear'});
  animate(t.face,[{background:'var(--pink)'},{background:'var(--pink)',offset:.2},{background:'var(--tile)'}],{duration:700,easing:'ease-out'});
  t.face.querySelectorAll('.sy path').forEach((p,i)=>animate(p,[{transform:'scale(.1) rotate(-40deg)',opacity:0},{opacity:1,offset:.3},{transform:'scale(1.1) rotate(4deg)',offset:.7},{transform:'none'}],{duration:720,delay:i*16,easing:'cubic-bezier(.2,.9,.3,1)',fill:'backwards'}));
  tiles.forEach(o=>{if(o===t||o.el.style.opacity==='0')return;const dx=o.c-t.c,dy=o.r-t.r,d=Math.hypot(dx,dy);if(d>2.3)return;
    const m=s*(d<1.5?.09:.045);animate(o.face,[{transform:'none'},{transform:`translate(${dx/d*m}px,${dy/d*m}px)`,offset:.3},{transform:`translate(${-dx/d*m*.35}px,${-dy/d*m*.35}px)`,offset:.65},{transform:'none'}],{duration:560,delay:d*45,easing:'ease-out'})});
}

// ② 우수수: 남은 블록과 심볼이 함께 떨어져 각자 자리에 앉음
let fallen=false,fallAnims=[];
function fall(){
  fallen=true;fallAnims=[];
  const order=tiles.filter(t=>t.dest).sort((a,b)=>(a.dest[0]*4+a.dest[1])-(b.dest[0]*4+b.dest[1]));
  order.forEach((t,i)=>{
    const [x0,y0]=tc(t),[x1,y1]=sc(t.dest),k=cell/s,delay=i*45;
    t.el.style.zIndex=3;
    const a=animate(t.el,[
      {transform:`translate(${x0-s/2}px,${y0-s/2}px) scale(1)`,easing:'cubic-bezier(.3,0,.4,1)'},
      {transform:`translate(${x0-s/2}px,${y0-s/2-s*.22}px) scale(1.06,.95)`,offset:.16,easing:'cubic-bezier(.55,0,.95,.5)'},
      {transform:`translate(${x1-s/2}px,${y1-s/2}px) scale(${k*.9},${k*1.1})`,offset:.78,easing:'ease-out'},
      {transform:`translate(${x1-s/2}px,${y1-s/2}px) scale(${k*1.08},${k*.88})`,offset:.88,easing:'ease-out'},
      {transform:`translate(${x1-s/2}px,${y1-s/2}px) scale(${k})`}
    ],{duration:reduce?1:720,delay:reduce?0:delay,fill:'both'});
    fallAnims.push(a);
    a.onfinish=()=>{if(!fallen)return;t.el.style.visibility='hidden';land(t)};
  });
  // 자리 없는 블록은 화면 아래로 떨어지며 사라짐
  tiles.filter(t=>!t.dest&&!t.gone).forEach(t=>{const [x0,y0]=tc(t),rot=((t.r*7+t.c*3)%9-4)*6;
    const a=animate(t.el,[{transform:`translate(${x0-s/2}px,${y0-s/2}px)`,opacity:1,easing:'cubic-bezier(.55,0,1,.45)'},
      {transform:`translate(${x0-s/2}px,${y0-s/2+vh}px) rotate(${rot}deg) scale(.9)`,opacity:0}],{duration:reduce?1:650,delay:reduce?0:(t.c*25+((t.r*5)%3)*40),fill:'both'});
    fallAnims.push(a)});
}
function land(t){
  const d=t.dest&&(t.isSym?slots[t.k]:empties[`${t.dest[0]},${t.dest[1]}`]);if(!d)return;
  d.classList.add('landed');if(t.isSym)d.tabIndex=0;
  if(reduce)return;
  animate(d.firstChild,[{transform:'scale(1)'},{transform:'scale(1.04,.94)',offset:.3},{transform:'scale(.99,1.02)',offset:.65},{transform:'none'}],{duration:420,easing:'ease-out'});
}
function resetFall(){
  fallAnims.forEach(a=>a.cancel());fallAnims=[];
  tiles.forEach(t=>{t.el.style.visibility='';t.el.style.zIndex=''});
  layer.querySelectorAll('.slot').forEach(d=>{d.classList.remove('landed');d.tabIndex=-1});show(null);
}
function unfall(){ // 위로 되돌리면 블록이 보드로 되돌아감
  fallen=false;show(null);
  layer.querySelectorAll('.slot').forEach(d=>{d.classList.remove('landed');d.tabIndex=-1});
  tiles.forEach(t=>{t.el.style.visibility=''});
  const as=fallAnims;fallAnims=[];
  as.forEach(a=>{a.onfinish=null;if(reduce){a.cancel();return}a.updatePlaybackRate(2.2);a.reverse();a.finished.then(()=>a.cancel()).catch(()=>{})});
}

function frame(){
  const top=scene.getBoundingClientRect().top,pin=scene.offsetHeight-sticky.offsetHeight;
  const P=clamp(-top/Math.max(1,pin));
  cue.style.opacity=1-clamp(P/.04);
  if(active&&(top>vh||top+scene.offsetHeight<0))show(null);
  // ① 같은 모양 3개가 맞춰짐
  ORDER.forEach((k,g)=>{
    const {a,m,b}=groups[k],w=clamp((P-(.03+g*.1))/.14);
    const lit=w>.04&&w<.74;[a,m,b].forEach(t=>t.el.classList.toggle('lit',lit));
    const pm=tc(m),u=ease(clamp((w-.22)/.5)),st=Math.sin(Math.PI*u);
    if(!fallen)[a,b].forEach(t=>{const p0=tc(t),dir=Math.sign(pm[0]-p0[0]);
      const back=w<.22?Math.sin(Math.PI*clamp(w/.22))*-dir*s*.08:0;
      put(t.el,[lerp(p0[0],pm[0],u)+back,lerp(p0[1],pm[1],u)],s,`scale(${1+.25*st},${1-.18*st})`);t.el.style.opacity=u>=.98?0:1;t.gone=u>=.98});
    const merged=w>=.72;
    if(merged!==m.isSym){m.isSym=merged;m.face.innerHTML=merged?symSvg(k):moSvg(k);m.el.classList.remove('lit');if(merged)impact(m)}
    if(!fallen)put(m.el,pm,s);
  });
  // 남은 블록은 모양이 빠지며 빈 블록이 됨
  const inG=new Set(ORDER.flatMap(k=>[groups[k].a,groups[k].m,groups[k].b]));
  tiles.forEach(t=>{if(inG.has(t))return;const d=((t.r*3+t.c*7)%11)/11;t.el.classList.toggle('blank',P>.46+d*.05);if(!fallen)put(t.el,tc(t),s)});
  // ② 우수수 (되돌릴 때를 위해 간격을 둠)
  if(!fallen&&P>=.54)fall();
  else if(fallen&&P<.48){
    unfall();
    // Restore merged side tiles in this frame, even if scrolling stops here.
    frame();
  }
}

// 호버·포커스·탭: 심볼 핑크 + 옆 칸 설명
let active=null;
function show(k){
  active=k;ORDER.forEach(x=>{slots[x].classList.toggle('on',x===k);infos[x].classList.toggle('on',x===k)});
  if(k)caption.innerHTML=`<h3>${T[k].name}</h3><p>${T[k].desc}</p>`;caption.classList.toggle('on',!!k);
}
function bind(k,d){
  const ok=()=>d.classList.contains('landed');
  listen(d,'pointerenter',e=>{if(e.pointerType==='mouse'&&ok())show(k)});
  listen(d,'pointerleave',e=>{if(e.pointerType==='mouse'&&active===k)show(null)});
  listen(d,'click',()=>{if(ok())show(active===k&&!matchMedia('(hover:hover)').matches?null:k)});
  listen(d,'focus',()=>{if(ok())show(k)});
  listen(d,'blur',()=>{if(active===k)show(null)});
  listen(d,'keydown',e=>{if((e.key==='Enter'||e.key===' ')&&ok()){e.preventDefault();show(k)}});
}
listen(window,'pointerdown',e=>{if(active&&!e.target.closest('.sym'))show(null)});

let ticking=false,raf=0;
listen(window,'scroll',()=>{if(!ticking){ticking=true;raf=requestAnimationFrame(()=>{ticking=false;if(!disposed)frame()})}},{passive:true});
listen(window,'resize',measure);
measure();
document.fonts.ready.then(()=>{if(!disposed){fitInfo();frame()}});
return () => {
  disposed=true;
  cancelAnimationFrame(raf);
  events.abort();
  animations.forEach(animation=>{animation.onfinish=null;animation.cancel()});
  animations.clear();
  layer.replaceChildren();
  caption.replaceChildren();
  root.classList.remove('narrow');
};

}

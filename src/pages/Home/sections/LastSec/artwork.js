import titleSvg from '../../../../assets/heroTitle.svg?raw'

// Reuse the existing title outlines, including their rounded sticker edge.
// An isolated image keeps the SVG's internal mask IDs out of the page DOM.
export const titleImage = `data:image/svg+xml,${encodeURIComponent(titleSvg
  .replace('viewBox="0 0 487 128"', 'viewBox="0 10 487 95"')
  .replace('height="128"', 'height="95"')
  .replaceAll('#FD00A0', '#949494')
  .replaceAll('#FAFAFA', '#f0f0f0')
  .replace('stroke-width="30"', 'stroke-width="24"'))}`

const assets = import.meta.glob('../../../../assets/type/*/*.svg', {
  eager: true, query: '?url', import: 'default',
})

// Reference artwork: six staggered rows, with eight / seven marks per row.
// Rotations belong to the final layout; animation transforms use a child layer.
const rows = [
  [['L/LE_L', -20], ['E/EY_E', 18], ['T/TS2_T', -5], ['S1/S1N_S1', -20], ['S2/LS2_S2', 0], ['Y/LY_Y', 20], ['N/TN_N', -20], ['C/TC_C', 20]],
  [['L/LS2_L', 18], ['E/ES1_E', -20], ['T/TS1_T', -40], ['S1/S1Y_S1', -30], ['S2/TS2_S2', 0], ['Y/TY_Y', -25], ['N/YN_N', 20]],
  [['L/LY_L', -25], ['E/LE_E', 20], ['T/TC_T', -25], ['S1/ES1_S1', 0], ['S2/S1S2_S2', 15], ['Y/S1Y_Y', -15], ['N/EN_N', 0], ['C/S2C_C', 40]],
  [['L/LT_L', -25], ['E/EC_E', -20], ['T/ET_T', 20], ['S1/TS1_S1', -25], ['S2/S2Y_S2', 20], ['Y/EY_Y', -20], ['N/S1N_N', -25]],
  [['L/LC_L', 15], ['E/EN_E', -20], ['T/TN_T', -25], ['S1/S1S2_S1', 0], ['S2/TS2_S2', 0], ['Y/S2Y_Y', 20], ['N/NC_N', 20], ['C/NC_C', -20]],
  [['L/LS1_L', 15], ['E/ES2_E', 15], ['T/TY_T', -25], ['S1/LS1_S1', -35], ['S2/ES2_S2', 15], ['Y/YC_Y', 0], ['N/LN_N', -40]],
]

export const marks = rows.flatMap((row, rowIndex) => row.map(([asset, rotation], column) => ({
  src: assets[`../../../../assets/type/${asset}.svg`],
  x: (rowIndex % 2 ? 11 : 3.5) + column * 13.1,
  y: 4.7 + rowIndex * 18,
  rotation,
  shape: column % 4,
})))

// Reuse the four unit geometries from PageTransition's Shape, without changing
// that shared component or its transition behavior. Order: sparkle, square, circle, triangle.
export const unitPaths = [
  'M13 2 A13.5 13.5 0 0 0 24 13 A13.5 13.5 0 0 0 13 24 A13.5 13.5 0 0 0 2 13 A13.5 13.5 0 0 0 13 2 Z',
  'M4 1 H22 Q25 1 25 4 V22 Q25 25 22 25 H4 Q1 25 1 22 V4 Q1 1 4 1 Z',
  'M26 13 A13 13 0 1 1 0 13 A13 13 0 1 1 26 13 Z',
  'M13 4.5 L23.5 22.5 L2.5 22.5 Z',
]

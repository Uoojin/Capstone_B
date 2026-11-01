export const ENGLISH_FONT_FAMILY = '"Helvetica Neue", "Pretendard"'
export const KOREAN_FONT_FAMILY = '"Pretendard"'
export const containsHangul = text => /\p{Script=Hangul}/u.test(String(text ?? ''))
export const fontFamilyForText = text => containsHangul(text) ? KOREAN_FONT_FAMILY : ENGLISH_FONT_FAMILY

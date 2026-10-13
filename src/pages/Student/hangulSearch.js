const initials = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'
const vowels = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'
const finals = 'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'
const compoundJamo = {
  ㄳ: 'ㄱㅅ', ㄵ: 'ㄴㅈ', ㄶ: 'ㄴㅎ', ㄺ: 'ㄹㄱ', ㄻ: 'ㄹㅁ',
  ㄼ: 'ㄹㅂ', ㄽ: 'ㄹㅅ', ㄾ: 'ㄹㅌ', ㄿ: 'ㄹㅍ', ㅀ: 'ㄹㅎ', ㅄ: 'ㅂㅅ',
  ㅘ: 'ㅗㅏ', ㅙ: 'ㅗㅐ', ㅚ: 'ㅗㅣ', ㅝ: 'ㅜㅓ', ㅞ: 'ㅜㅔ', ㅟ: 'ㅜㅣ', ㅢ: 'ㅡㅣ',
}

function decomposeHangul(value) {
  return Array.from(value.normalize('NFKD').toLowerCase(), (character) => {
    const code = character.codePointAt(0)
    let jamo = character
    if (code >= 0x1100 && code <= 0x1112) jamo = initials[code - 0x1100]
    else if (code >= 0x1161 && code <= 0x1175) jamo = vowels[code - 0x1161]
    else if (code >= 0x11a8 && code <= 0x11c2) jamo = finals[code - 0x11a8]
    return compoundJamo[jamo] || jamo
  }).join('')
}

export function matchesHangulName(name, searchTerm) {
  const query = decomposeHangul(searchTerm.trim())
  if (!query) return true

  if (/^[ㄱ-ㅎ]+$/.test(query)) {
    const nameInitials = Array.from(name.normalize('NFKC'), (character) => {
      const syllable = character.codePointAt(0) - 0xac00
      return syllable >= 0 && syllable < 11172
        ? initials[Math.floor(syllable / 588)]
        : decomposeHangul(character)
    }).join('')
    return nameInitials.includes(query)
  }

  return decomposeHangul(name).includes(query)
}

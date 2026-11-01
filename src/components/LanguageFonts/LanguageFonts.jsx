import { useLayoutEffect } from 'react'
import { installLanguageFonts } from './languageFontPolicy.js'

// Cover routes, native dialogs and portals without wrapping or replacing text.
export default function LanguageFonts() {
  useLayoutEffect(() => installLanguageFonts(document.body), [])
  return null
}

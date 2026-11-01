import { containsHangul } from '../../utils/textFonts.js'

const ATTRIBUTE = 'data-text-font'
const TEXT_ELEMENTS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'LABEL', 'LEGEND', 'DT', 'DD', 'TH', 'TD', 'SUMMARY', 'FIGCAPTION', 'OPTION', 'TEXT', 'TSPAN'])
const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'CANVAS', 'TITLE', 'DESC'])
const BLOCK = /^(block|flex|grid|table|list-item|flow-root)/
const letters = /\p{Letter}/u
const tagOf = element => element.tagName.toUpperCase()
const ignored = element => SKIP.has(tagOf(element)) || element.classList.contains('home-rounded-stroke-layer')

function renderedText(element) {
  const tag = tagOf(element)
  if (tag === 'INPUT' || tag === 'TEXTAREA') return element.value || element.placeholder || ''
  if (tag === 'SELECT') return element.selectedOptions[0]?.textContent || ''
  let text = ''
  for (const child of element.childNodes) {
    if (child.nodeType === 3) text += child.textContent
    else if (child.nodeType === 1 && !ignored(child)) text += renderedText(child)
  }
  return text
}

function textUnit(element) {
  const tag = tagOf(element)
  if (tag === 'LABEL' && element.querySelector('input, textarea, select')) return false
  if (TEXT_ELEMENTS.has(tag) || ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return true
  if (element.namespaceURI === 'http://www.w3.org/2000/svg') return false
  if (['HTML', 'BODY', 'MAIN', 'HEADER', 'FOOTER', 'NAV', 'SECTION', 'ARTICLE', 'FORM', 'DIALOG', 'UL', 'OL', 'TABLE', 'THEAD', 'TBODY', 'TR', 'FIELDSET'].includes(tag)) return false
  const hasOwnText = [...element.childNodes].some(node => node.nodeType === 3 && node.textContent.trim())
  if (!hasOwnText && /^(inline-)?(flex|grid)$/.test(getComputedStyle(element).display)) return false
  // A paragraph/heading is one unit even when split into inline spans. A card
  // or metadata grid instead contains independent names, labels and captions.
  return ![...element.children].some(child => {
    if (ignored(child) || !renderedText(child).trim()) return false
    return TEXT_ELEMENTS.has(tagOf(child)) || BLOCK.test(getComputedStyle(child).display)
  })
}

function clearMarks(element) {
  element.removeAttribute(ATTRIBUTE)
  element.querySelectorAll(`[${ATTRIBUTE}]`).forEach(child => child.removeAttribute(ATTRIBUTE))
}

export function classifyTextTree(element) {
  if (!element || element.nodeType !== 1 || ignored(element)) return
  const text = renderedText(element).trim()
  if (!text) { clearMarks(element); return }
  if (textUnit(element)) {
    clearMarks(element)
    // Numbers/punctuation inherit their text context, using one of the same
    // two permitted families. No language attributes are used for detection.
    if (letters.test(text)) element.setAttribute(ATTRIBUTE, containsHangul(text) ? 'ko' : 'en')
    if (tagOf(element) === 'SELECT') for (const option of element.querySelectorAll('option')) classifyTextTree(option)
    return
  }
  element.removeAttribute(ATTRIBUTE)
  const ownText = [...element.childNodes].filter(node => node.nodeType === 3).map(node => node.textContent).join('')
  if (letters.test(ownText)) element.setAttribute(ATTRIBUTE, containsHangul(ownText) ? 'ko' : 'en')
  for (const child of element.children) classifyTextTree(child)
}

export function installLanguageFonts(container) {
  const scan = element => {
    if (!element?.isConnected || ignored(element)) return
    // Re-evaluate the whole existing text unit when an inline child changes.
    const owner = element.closest(`[${ATTRIBUTE}]`)
    classifyTextTree(owner || element)
  }
  classifyTextTree(container)
  const observer = new MutationObserver(records => {
    const roots = new Set()
    for (const record of records) {
      const element = record.target.nodeType === 1 ? record.target : record.target.parentElement
      if (!element || element.closest('.home-rounded-stroke-layer')) continue
      if (record.type === 'childList' && [...record.addedNodes, ...record.removedNodes].every(node => node.nodeType === 1 && ignored(node))) continue
      roots.add(element)
    }
    for (const element of roots) if (![...roots].some(parent => parent !== element && parent.contains(element))) scan(element)
  })
  observer.observe(container, { subtree: true, childList: true, characterData: true,
    attributes: true, attributeFilter: ['value', 'placeholder', 'open', 'hidden'] })
  const input = event => scan(event.target)
  const reset = event => queueMicrotask(() => scan(event.target))
  const resize = () => classifyTextTree(container)
  container.addEventListener('input', input, true)
  container.addEventListener('change', input, true)
  container.addEventListener('reset', reset, true)
  window.addEventListener('resize', resize)
  return () => {
    observer.disconnect()
    container.removeEventListener('input', input, true)
    container.removeEventListener('change', input, true)
    container.removeEventListener('reset', reset, true)
    window.removeEventListener('resize', resize)
    clearMarks(container)
  }
}

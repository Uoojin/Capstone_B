import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function GuestbookModal({ children, onClose, className = '', labelledBy }) {
  const closeRef = useRef(null)
  const modalRef = useRef(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    const pageRoot = document.getElementById('root')
    const wasInert = pageRoot?.inert
    if (pageRoot) pageRoot.inert = true
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const controls = [...modalRef.current.querySelectorAll('button, input, textarea, [tabindex]')]
          .filter((element) => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length)
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      if (pageRoot) pageRoot.inert = wasInert
      previousFocus?.focus()
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return createPortal(
    <div className="gb-modal" role="presentation" ref={modalRef}>
      <div className="gb-modal__overlay" aria-hidden="true" />
      <div
        aria-labelledby={labelledBy}
        aria-modal="true"
        className={`gb-modal__dialog ${className}`}
        role="dialog"
      >
        {children}
      </div>
      <button
        aria-label="닫기"
        className="gb-modal__close"
        onClick={onClose}
        ref={closeRef}
        type="button"
      >
        <span className="gb-close-icon" aria-hidden="true">×</span>
      </button>
    </div>,
    document.body,
  )
}


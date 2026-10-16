import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import '../Guestbook/Guestbook.css'
import PhotoBooth from '../Guestbook/PhotoBooth.jsx'
import Message from './Message.jsx'
import { fetchGuestbookEntries, subscribeToGuestbookEntries, isSupabaseConfigured } from '../../lib/supabase02.js'

function GuestbookHero({ onPhotoBooth, onMessage }) {
  return (
    <section className="gb-hero" aria-labelledby="gb-hero-title">
      <div className="gb-hero__symbols" aria-hidden="true" />
      <h1 id="gb-hero-title" className="gb-hero__title">
        졸업하는 학생들에게
        <br />
        축하 메시지를 보내주세요!
      </h1>

      <p className="gb-hero__description">
        적당히 아무 문구 넣어주면 좋을 것 같아요.
      </p>

      <div className="gb-hero__actions" aria-label="방명록 작성 방식 선택">
        <button
          className="gb-button gb-button--primary"
          onClick={onPhotoBooth}
        >
          <span className="gb-hero__button-title">PHOTO BOOTH</span>
          <span className="gb-hero__button-description">사진과 함께 메시지 남기기</span>
        </button>

        <button
          className="gb-button gb-button--secondary"
          onClick={onMessage}
        >
          <span className="gb-hero__button-title">MESSAGE</span>
          <span className="gb-hero__button-description">메시지만 남기기</span>
        </button>
      </div>
    </section>
  );
}

function GuestbookCard({ entry }) {
  if (entry.type === 'photo') {
    return (
      <article className="gb-card gb-card--photo">
        {entry.imageUrl ? (
          <img className="gb-card__completed-image" src={entry.imageUrl} alt="폴라로이드 방명록" loading="lazy" />
        ) : (
          <span>PHOTO</span>
        )}
      </article>
    )
  }

  return (
    <article className="gb-card gb-card--message">
      <p className="gb-card__name">To. {entry.toName || 'OOO'}</p>
      <p className="gb-card__message">{entry.message}</p>
      <p className="gb-card__from">From. {entry.fromName || 'OOO'}</p>
    </article>
  )
}

function GuestbookArchive({ entries, status, error }) {
  const boardRef = useRef(null)
  const [layout, setLayout] = useState({ height: 0, positions: {} })

  useLayoutEffect(() => {
    const board = boardRef.current
    if (!board) return

    function arrangeCards() {
      const width = board.clientWidth
      if (!width) return
      const columns = Number(getComputedStyle(board).getPropertyValue('--gb-columns')) || 4
      const gap = parseFloat(getComputedStyle(board).getPropertyValue('--gb-gap')) || 20
      const cardWidth = (width - gap * (columns - 1)) / columns
      const heights = Array(columns).fill(0)
      const positions = {}
      for (const slot of board.children) {
        const column = heights.indexOf(Math.min(...heights))
        positions[slot.dataset.entryId] = {
          left: column * (cardWidth + gap),
          top: heights[column],
        }
        heights[column] += slot.getBoundingClientRect().height + gap
      }
      const next = { height: Math.max(0, ...heights) - gap, positions }
      setLayout((current) => JSON.stringify(current) === JSON.stringify(next) ? current : next)
    }

    arrangeCards()
    const observer = new ResizeObserver(arrangeCards)
    observer.observe(board)
    for (const slot of board.children) observer.observe(slot.firstElementChild)
    return () => observer.disconnect()
  }, [entries])

  return (
    <section className="gb-archive" aria-labelledby="gb-archive-title">


      {status === 'loading' && (
        <p className="gb-archive__state">불러오는 중입니다.</p>
      )}

      {status === 'error' && (
        <p className="gb-archive__state gb-archive__state--error">
          방명록을 불러오지 못했습니다. {error}
        </p>
      )}

      {status === 'not-configured' && (
        <p className="gb-archive__state">
          {error} 화면 구조는 준비되어 있으며, 더미 데이터는 표시하지 않습니다.
        </p>
      )}

      {status === 'ready' && entries.length === 0 && (
        <p className="gb-archive__state">
          아직 남겨진 방명록이 없습니다. 첫 메시지를 남겨주세요.
        </p>
      )}

      {entries.length > 0 && (
        <div className="gb-archive__masonry" aria-live="polite" ref={boardRef} style={{ height: layout.height }}>
          {entries.map((entry) => (
            <div
              className="gb-archive__slot"
              data-entry-id={entry.id}
              key={entry.id}
              style={{ ...layout.positions[entry.id], visibility: layout.positions[entry.id] ? 'visible' : 'hidden' }}
            >
              <GuestbookCard entry={entry} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function Guestbook() {
  const [entries, setEntries] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [activeModal, setActiveModal] = useState(null)

  useLayoutEffect(() => {
    const root = document.documentElement
    const className = 'gb-page-scrollbar-hidden'
    const property = '--gb-page-scrollbar-padding'
    const hadClass = root.classList.contains(className)
    const previousValue = root.style.getPropertyValue(property)
    const previousPriority = root.style.getPropertyPriority(property)
    const gutter = window.innerWidth - root.clientWidth
    const padding = parseFloat(getComputedStyle(root).paddingRight) || 0

    // Keep the content width unchanged when the native scrollbar disappears.
    root.style.setProperty(property, `${padding + gutter}px`)
    root.classList.add(className)

    return () => {
      if (!hadClass) root.classList.remove(className)
      if (previousValue) root.style.setProperty(property, previousValue, previousPriority)
      else root.style.removeProperty(property)
    }
  }, [])

  const sortedEntries = useMemo(
    () =>
      [...entries].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      ),
    [entries],
  )

  useEffect(() => {
    let ignore = false

    async function loadEntries() {
      if (!isSupabaseConfigured) {
        setStatus('not-configured')
        setError('Supabase 환경 변수를 설정하면 실제 방명록이 표시됩니다.')
        return
      }

      try {
        setStatus('loading')
        const nextEntries = await fetchGuestbookEntries()
        if (!ignore) {
          setEntries((current) => {
            const ids = new Set(current.map((entry) => entry.id))
            return [...current, ...nextEntries.filter((entry) => !ids.has(entry.id))]
          })
          setStatus('ready')
        }
      } catch (requestError) {
        if (!ignore) {
          setStatus('error')
          setError(requestError.message)
        }
      }
    }

    loadEntries()

    const unsubscribe = subscribeToGuestbookEntries((entry) => {
      setEntries((current) => {
        if (current.some((item) => item.id === entry.id)) return current
        return [entry, ...current]
      })
      setStatus('ready')
    })

    return () => {
      ignore = true
      unsubscribe()
    }
  }, [])

  function handleCreateMessage(entry) {
    setEntries((current) => current.some((item) => item.id === entry.id) ? current : [entry, ...current])
    setStatus('ready')
    setError('')
  }

  function handlePhotoCreated(entry) {
    setEntries((current) => current.some((item) => item.id === entry.id) ? current : [entry, ...current])
    setStatus('ready')
    setError('')
  }

  return (
    <main className="gb-page">
      <GuestbookHero
        onPhotoBooth={() => setActiveModal('photo')}
        onMessage={() => setActiveModal('message')}
      />
      <GuestbookArchive entries={sortedEntries} status={status} error={error} />
      {activeModal === 'photo' && (
        <PhotoBooth
          onClose={() => setActiveModal(null)}
          onCreated={handlePhotoCreated}
        />
      )}
      {activeModal === 'message' && (
        <Message
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateMessage}
        />
      )}
    </main>
  )
}

export default Guestbook

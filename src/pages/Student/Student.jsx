import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { students } from '../../data/index.js'
import { imageBackgroundStyle } from '../../data/dataUtils.js'
import { matchesHangulName } from './hangulSearch.js'
import { shuffle } from '../../utils/shuffle.js'
import './Student.css'

const roles = ['ALL', 'DESIGNER', 'PLANNER', 'PROGRAMMER']
const cardBackColors = ['#FD00A0', '#00BFA3', '#8223A5', '#1D9F10', '#F7A600', '#5F50D8', '#009DEB']

export default function Student() {
  const [shuffledStudents] = useState(() => shuffle(students))
  const [activeRole, setActiveRole] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [flippedStudentId, setFlippedStudentId] = useState(null)
  const [isFlipStaggered, setIsFlipStaggered] = useState(false)
  const [backColors, setBackColors] = useState({})
  const [floatingY, setFloatingY] = useState(0)
  const navigate = useNavigate()
  const sidebarRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const startThreshold = 60

      if (window.scrollY <= startThreshold) {
        setFloatingY(0)
        return
      }

      let moveY = window.scrollY - startThreshold + 30

      if (sidebarRef.current && menuRef.current) {
        const maxMove = sidebarRef.current.offsetHeight - menuRef.current.offsetHeight
        moveY = Math.min(moveY, Math.max(0, maxMove))
      }

      setFloatingY(moveY)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const displayStudents = useMemo(() => {
    const filtered = shuffledStudents.filter((student) => {
      const matchesRole = activeRole === 'ALL' || student.role === activeRole
      const matchesSearch = matchesHangulName(student.name, searchTerm)
      return matchesRole && matchesSearch
    })

    const emptyCount = filtered.length % 4 === 0 ? 0 : 4 - (filtered.length % 4)
    const emptySlots = Array.from({ length: emptyCount }, (_, index) => ({
      id: `empty-student-${index}`,
      isEmpty: true,
    }))

    return [...filtered, ...emptySlots]
  }, [activeRole, searchTerm, shuffledStudents])

  // Forget a hidden card so clearing the filter cannot flip it back over.
  if (flippedStudentId !== null && !displayStudents.some((student) => student.studentId === flippedStudentId)) {
    setFlippedStudentId(null)
  }

  const handleCardFlip = (studentId, randomValue) => {
    // CSS delays only the incoming card; another click cancels its pending transition.
    setIsFlipStaggered(flippedStudentId !== null && flippedStudentId !== studentId)
    if (flippedStudentId !== studentId) {
      const color = cardBackColors[Math.floor(randomValue * cardBackColors.length)]
      setBackColors((current) => ({ ...current, [studentId]: color }))
    }
    setFlippedStudentId((current) => current === studentId ? null : studentId)
  }

  const handleProjectClick = (event) => {
    event.stopPropagation()
    navigate('/project', { state: { skipPageTransition: true } })
  }

  const handleLinkClick = (event, url) => {
    event.stopPropagation()
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <main className="student-page">
      <section className="student-content" aria-label="Student list">
        <div className="student-grid">
          {displayStudents.map((item) =>
            item.isEmpty ? (
              <div key={item.id} className="student-empty-card" />
            ) : (
              <article key={item.studentId} className="student-card">
                <button
                  className={`student-flipper ${flippedStudentId === item.studentId ? `flipped${isFlipStaggered ? ' flip-staggered' : ''}` : ''}`}
                  type="button"
                  onClick={() => handleCardFlip(item.studentId, Math.random())}
                  aria-label={`${item.name} card`}
                >
                  <span className="card-face card-front">
                    <span className="student-img-placeholder" style={imageBackgroundStyle(item.image)} />
                  </span>

                  <span className="card-face card-back" style={{ backgroundColor: backColors[item.studentId] }}>
                    <span className="back-interview">{item.interview}</span>

                    <span className="back-meta-list">
                      <span className="back-meta-row">
                        <span className="back-label">Contact</span>
                        <span className="back-value">{item.contact}</span>
                      </span>
                      <span className="back-meta-row">
                        <span className="back-label">Profile</span>
                        <span className="back-link" onClick={(event) => handleLinkClick(event, item.profileUrl)}>
                          site &gt;
                        </span>
                      </span>
                      <span className="back-meta-row">
                        <span className="back-label">Project</span>
                        <span className="back-link" onClick={handleProjectClick}>
                          {item.project} &gt;
                        </span>
                      </span>
                    </span>
                  </span>
                </button>

                <div className="student-info">
                  <h2 className="student-name">{item.name}</h2>
                  <p className="student-meta">
                    {item.project} | {item.role}
                  </p>
                </div>
              </article>
            ),
          )}
        </div>
      </section>

      <aside className="student-sidebar" ref={sidebarRef}>
        <div
          className="student-floating-menu"
          ref={menuRef}
          style={{ transform: `translateY(${floatingY}px)` }}
        >
          <label className="student-search-box">
            <input
              type="text"
              placeholder="SEARCH"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="student-search-input"
            />
            <svg
              className="search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </label>

          <div className="role-group" aria-label="Student role filters">
            {roles.map((role) => (
              <button
                key={role}
                className={`role-btn ${activeRole === role ? 'active' : ''}`}
                type="button"
                onClick={() => setActiveRole(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </main>
  )
}

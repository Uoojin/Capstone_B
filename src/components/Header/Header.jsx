import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './Header.css'

const menuItems = [
  { label: 'PROJECT', path: '/project' },
  { label: 'STUDENT', path: '/student' },
  { label: 'SYNCOPATE', path: '/syncopate', isExtra: true },
  { label: 'GUESTBOOK', path: '/guestbook', isExtra: true },
  { label: 'CURRICULUM', path: '/curriculum', isExtra: true },
  { label: 'BEHIND', path: '/credit', isExtra: true },
]

export default function Header() {
  const { pathname } = useLocation()
  const isDetailPage = menuItems.some((item) => item.isExtra &&
    (pathname === item.path || pathname.startsWith(`${item.path}/`)))
  const [isOpen, setIsOpen] = useState(isDetailPage)
  const [previousPathname, setPreviousPathname] = useState(pathname)

  if (previousPathname !== pathname) {
    setPreviousPathname(pathname)
    setIsOpen(isDetailPage)
  }

  return (
    <header
      className={`site-header ${isOpen ? 'is-menu-open' : ''}`}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setIsOpen(false)
      }}
    >
      <Link className="site-logo" to="/" aria-label="SYNCOPATE Home" onClick={(event) => {
        setIsOpen(false)
        if (pathname === '/' && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
          event.preventDefault()
          window.location.reload()
        }
      }}>
        LET&apos;S SYNC!
      </Link>

      <nav className="site-header-menu" aria-label="Main navigation">
        <div className="site-header-menu-items" id="site-header-menu">
          {menuItems.map((item) =>
            item.path ? (
              <NavLink
                key={item.label}
                className={`site-header-pill ${item.isExtra ? 'is-extra' : ''}`}
                to={item.path}
                aria-hidden={!isOpen && item.isExtra ? true : undefined}
                tabIndex={!isOpen && item.isExtra ? -1 : undefined}
                onClick={() => setIsOpen(Boolean(item.isExtra))}
              >
                <span className="site-header-menu-label">{item.label}</span>
              </NavLink>
            ) : (
              <span
                key={item.label}
                className="site-header-pill is-extra is-disabled"
                aria-hidden={!isOpen}
                aria-disabled="true"
              >
                {item.label}
              </span>
            ),
          )}
          <button
            className="site-header-pill site-menu-toggle"
            type="button"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="site-header-menu"
            onClick={() => setIsOpen((current) => !current)}
          >
            <span className="site-menu-plus" aria-hidden="true"><span>+</span></span>
          </button>
        </div>
      </nav>
    </header>
  )
}

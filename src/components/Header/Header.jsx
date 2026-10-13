import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
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
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header
      className={`site-header ${isOpen ? 'is-menu-open' : ''}`}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setIsOpen(false)
      }}
    >
      <Link className="site-logo" to="/" aria-label="SYNCOPATE Home" onClick={() => setIsOpen(false)}>
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
                onClick={() => setIsOpen(false)}
              >
                {item.label}
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
            {isOpen ? '×' : '+'}
          </button>
        </div>
      </nav>
    </header>
  )
}

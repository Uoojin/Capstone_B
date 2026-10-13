import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { categories, projects } from './projectData.js'
import './Project.css'

const DISPLAY_CARD_COUNT = 17
const TOP_FOCUS_ANGLE = 0
const FOCUS_RANGE = 92
const LOGICAL_ANGLE_STEP = 360 / DISPLAY_CARD_COUNT
const WHEEL_RADIUS_CARD_MULTIPLIER = 2.7
const CARD_GAP_RATIO = 0.18
const DETAIL_SECTION_DURATION = 1100
const DETAIL_WHEEL_THRESHOLD = 12

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const signedAngleDistance = (from, to = TOP_FOCUS_ANGLE) => ((from - to + 540) % 360) - 180

export default function Project() {
  const [selectedFilters, setSelectedFilters] = useState([])
  const [openFilter, setOpenFilter] = useState(null)
  const [activeDetailIndex, setActiveDetailIndex] = useState(null)
  const [isListVisible, setIsListVisible] = useState(false)
  const [gridUpdating, setGridUpdating] = useState(false)
  const [indexY, setIndexY] = useState(0)
  const stageRef = useRef(null)
  const ringRef = useRef(null)
  const cardRefs = useRef([])
  const projectListRef = useRef(null)
  const indexAsideRef = useRef(null)
  const indexFloatRef = useRef(null)
  const detailViewRef = useRef(null)
  const detailScrollerRef = useRef(null)
  const detailSectionRefs = useRef([])
  const carouselRef = useRef({
    angle: LOGICAL_ANGLE_STEP,
    orbitalAngleStep: 0,
    radius: 650,
    wheelCenterX: 0,
    wheelCenterY: 0,
    topFocusY: 0,
    cardWidth: 0,
    cardHeight: 0,
    rotation: 0,
    velocity: 0,
    dragging: false,
    dragDistance: 0,
    lastX: 0,
    lastFrame: 0,
    hoveringCard: false,
    hoveredIndex: null,
    pointerX: null,
    pointerY: null,
    wheelInteracting: false,
    pressedCardIndex: null,
  })
  const detailStateRef = useRef({ section: 0, moving: false, raf: null })
  const scrollStateRef = useRef({ raf: null, landingGuard: false, lastWheelAt: 0, gestureDelta: 0, gestureTime: 0 })

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const filteredProjects = useMemo(
    () =>
      projects
        .map((project, originalIndex) => ({ project, originalIndex }))
        .filter(({ project }) => selectedFilters.length === 0 || selectedFilters.some((filter) => project.tags.includes(filter))),
    [selectedFilters],
  )

  const displayProjects = useMemo(() => {
    if (filteredProjects.length === 0) return []
    if (filteredProjects.length >= DISPLAY_CARD_COUNT) return filteredProjects.slice(0, DISPLAY_CARD_COUNT)
    return Array.from({ length: DISPLAY_CARD_COUNT }, (_, index) => filteredProjects[index % filteredProjects.length])
  }, [filteredProjects])

  const activeDetail = activeDetailIndex === null ? null : projects[activeDetailIndex]

  const getOrbitalTheta = useCallback((index) => {
    const state = carouselRef.current
    const slotOffset = index + state.rotation / LOGICAL_ANGLE_STEP
    const wrappedSlotOffset =
      ((slotOffset + DISPLAY_CARD_COUNT / 2) % DISPLAY_CARD_COUNT + DISPLAY_CARD_COUNT) % DISPLAY_CARD_COUNT -
      DISPLAY_CARD_COUNT / 2
    return wrappedSlotOffset * state.orbitalAngleStep
  }, [])

  const calcRadius = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return

    const state = carouselRef.current
    const stageRect = stage.getBoundingClientRect()
    const stageWidth = stageRect.width
    state.cardWidth = window.matchMedia('(max-width: 900px)').matches
      ? Math.min(stageWidth * 0.62, 380)
      : clamp(stageWidth * 0.48, 380, 600)
    state.cardHeight = state.cardWidth * 0.75

    if (displayProjects.length === 0) {
      state.radius = 0
      state.orbitalAngleStep = 0
      state.wheelCenterX = stageRect.width / 2
      state.wheelCenterY = stageRect.height
      state.topFocusY = stageRect.height / 2
      return
    }

    state.radius = state.cardWidth * WHEEL_RADIUS_CARD_MULTIPLIER
    state.orbitalAngleStep = ((state.cardWidth * (1 + CARD_GAP_RATIO)) / state.radius) * (190 / Math.PI)
    state.wheelCenterX = stageRect.width / 2
    state.topFocusY = stageRect.height * 0.4
    state.wheelCenterY = state.topFocusY + state.radius
  }, [displayProjects.length])

  const nearestIndex = useCallback(() => {
    if (displayProjects.length === 0 || carouselRef.current.angle === 0) return -1
    return displayProjects.reduce(
      (nearest, _item, index) => {
        const distance = Math.abs(signedAngleDistance(getOrbitalTheta(index)))
        return distance < nearest.distance ? { index, distance } : nearest
      },
      { index: 0, distance: Infinity },
    ).index
  }, [displayProjects, getOrbitalTheta])

  const updateCarousel = useCallback(() => {
    const state = carouselRef.current
    const activeIndex = nearestIndex()
    const orbitalFocusRange = state.orbitalAngleStep * (FOCUS_RANGE / LOGICAL_ANGLE_STEP)

    cardRefs.current.forEach((card, index) => {
      if (!card) return
      const hit = card.querySelector('.project-hit')
      const theta = getOrbitalTheta(index)
      const signedDistance = signedAngleDistance(theta)
      const absDistance = Math.abs(signedDistance)
      const thetaRad = (theta * Math.PI) / 180
      const x = state.wheelCenterX + state.radius * Math.sin(thetaRad)
      const y = state.wheelCenterY - state.radius * Math.cos(thetaRad)
      const focusWeight = clamp(1 - absDistance / orbitalFocusRange, 0, 1)
      const hoverBoost = index === state.hoveredIndex ? 0.06 : 0

      card.classList.toggle('is-active', index === activeIndex)
      card.style.zIndex = String(Math.round(focusWeight * 1000))
      card.style.transform = `
        translate(${x}px, ${y}px)
        translate(-50%, -50%)
        rotateZ(${signedDistance}deg)
        translateZ(0)
      `
      card.style.opacity = String(0.18 + focusWeight * 0.82)
      card.style.filter = `
        brightness(${0.56 + focusWeight * 0.44})
        saturate(${0.42 + focusWeight * 0.58})
      `
      if (hit) {
        hit.style.transform = `scale(${0.9 + focusWeight * 0.155 + hoverBoost})`
      }
    })
  }, [getOrbitalTheta, nearestIndex])

  const clearHoveredCard = useCallback(() => {
    const state = carouselRef.current
    const wasHovering = state.hoveringCard
    state.hoveringCard = false
    state.hoveredIndex = null
    if (wasHovering) state.velocity = 0
  }, [])

  const findCardAtPoint = useCallback(
    (x, y) => {
      const ring = ringRef.current
      if (!ring) return null
      const directHit = document.elementFromPoint(x, y)?.closest('.project-card')
      if (directHit && ring.contains(directHit)) return Number(directHit.dataset.index)

      const candidates = cardRefs.current
        .map((card, index) => {
          const rect = card?.querySelector('.project-hit')?.getBoundingClientRect()
          const focusDistance = Math.abs(signedAngleDistance(getOrbitalTheta(index)))
          return { index, rect, focusDistance }
        })
        .filter(({ rect }) => rect && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom)
        .sort((a, b) => a.focusDistance - b.focusDistance)

      return candidates.length ? candidates[0].index : null
    },
    [getOrbitalTheta],
  )

  const findHoveredImageAtPoint = useCallback((x, y) => {
    const ring = ringRef.current
    if (x === null || y === null || !ring) return null
    const hit = document.elementFromPoint(x, y)?.closest('.project-hit')
    return hit && ring.contains(hit) ? Number(hit.closest('.project-card').dataset.index) : null
  }, [])

  const updateHoveredImage = useCallback(
    (x, y) => {
      const state = carouselRef.current
      if (state.wheelInteracting) return
      const nextHoveredIndex = findHoveredImageAtPoint(x, y)

      if (nextHoveredIndex === null) {
        clearHoveredCard()
        return
      }

      if (nextHoveredIndex !== state.hoveredIndex) {
        state.hoveringCard = true
        state.hoveredIndex = nextHoveredIndex
        state.velocity = 0
      }
    },
    [clearHoveredCard, findHoveredImageAtPoint],
  )

  const openDetail = useCallback((index) => {
    const detailState = detailStateRef.current
    if (detailState.raf) {
      cancelAnimationFrame(detailState.raf)
      detailState.raf = null
    }
    detailState.section = 0
    detailState.moving = false
    setActiveDetailIndex(index)
    document.body.classList.add('body-detail-open')
    requestAnimationFrame(() => {
      if (detailScrollerRef.current) detailScrollerRef.current.scrollTop = 0
    })
  }, [])

  const closeDetail = useCallback(() => {
    const detailState = detailStateRef.current
    if (detailState.raf) cancelAnimationFrame(detailState.raf)
    detailState.raf = null
    detailState.section = 0
    detailState.moving = false
    setActiveDetailIndex(null)
    document.body.classList.remove('body-detail-open')
  }, [])

  const moveDetailToSection = useCallback((nextSection) => {
    const detailState = detailStateRef.current
    const scroller = detailScrollerRef.current
    const sections = detailSectionRefs.current
    if (detailState.moving || !scroller || !sections.length) return

    const targetSection = clamp(nextSection, 0, sections.length - 1)
    if (targetSection === detailState.section) return

    detailState.moving = true
    const start = scroller.scrollTop
    const target = sections[targetSection].offsetTop
    const distance = target - start
    const startTime = performance.now()
    const easeInOutCubic = (time) => (time < 0.5 ? 4 * time * time * time : 1 - Math.pow(-2 * time + 2, 3) / 2)

    const animateSectionScroll = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / DETAIL_SECTION_DURATION, 1)
      scroller.scrollTop = start + distance * easeInOutCubic(progress)

      if (progress < 1) {
        detailState.raf = requestAnimationFrame(animateSectionScroll)
      } else {
        scroller.scrollTop = target
        detailState.section = targetSection
        detailState.moving = false
        detailState.raf = null
      }
    }

    detailState.raf = requestAnimationFrame(animateSectionScroll)
  }, [])

  const cancelPageScroll = useCallback(() => {
    const scrollState = scrollStateRef.current
    if (scrollState.raf) cancelAnimationFrame(scrollState.raf)
    scrollState.raf = null
    scrollState.landingGuard = false
  }, [])

  const smoothScrollTo = useCallback(
    (target, duration = 1000) => {
      const scrollState = scrollStateRef.current
      cancelPageScroll()
      const start = window.scrollY
      const startTime = performance.now()
      const move = (now) => {
        const time = reducedMotion ? 1 : Math.min((now - startTime) / duration, 1)
        const ease = time < 0.5 ? 4 * time * time * time : 1 - Math.pow(-2 * time + 2, 3) / 2
        window.scrollTo(0, start + (target - start) * ease)

        if (time < 1) {
          scrollState.raf = requestAnimationFrame(move)
        } else {
          window.scrollTo(0, target)
          scrollState.raf = null
          scrollState.landingGuard = true
        }
      }

      scrollState.raf = requestAnimationFrame(move)
    },
    [cancelPageScroll, reducedMotion],
  )

  const toggleFilter = (filter) => {
    setSelectedFilters((current) => (current.includes(filter) ? current : [...current, filter]))
    setOpenFilter(null)
    setGridUpdating(true)
  }

  const removeFilter = (filter) => {
    setSelectedFilters((current) => current.filter((item) => item !== filter))
    setGridUpdating(true)
  }

  const getListScrollTarget = useCallback(() => {
    const projectList = projectListRef.current
    if (!projectList) return 0
    const listTop = projectList.getBoundingClientRect().top + window.scrollY
    return Math.max(0, listTop)
  }, [])

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, displayProjects.length)
    carouselRef.current.angle = displayProjects.length > 0 ? LOGICAL_ANGLE_STEP : 0
    calcRadius()
    updateCarousel()
  }, [calcRadius, displayProjects, updateCarousel])

  useEffect(() => {
    let animationId
    const animate = (now) => {
      const state = carouselRef.current
      const dt = state.lastFrame ? Math.min((now - state.lastFrame) / 1000, 0.08) : 0
      state.lastFrame = now

      if (!state.dragging && !state.wheelInteracting && state.pointerX !== null && state.pointerY !== null) {
        const currentHover = findHoveredImageAtPoint(state.pointerX, state.pointerY)
        if (currentHover === null) {
          clearHoveredCard()
        } else if (currentHover !== state.hoveredIndex) {
          state.hoveringCard = true
          state.hoveredIndex = currentHover
          state.velocity = 0
        }
      }

      if (!state.dragging) {
        if (state.hoveringCard) {
          state.velocity = 0
        } else if (Math.abs(state.velocity) > 0.03) {
          state.rotation += state.velocity * dt
          state.velocity *= 0.94
        } else {
          state.rotation += 4 * dt
        }
      }

      updateCarousel()
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [clearHoveredCard, findHoveredImageAtPoint, updateCarousel])

  useEffect(() => {
    const handleResize = () => {
      calcRadius()
      updateCarousel()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [calcRadius, updateCarousel])

  useEffect(() => {
    const projectList = projectListRef.current
    if (!projectList) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setIsListVisible(true)
      },
      { threshold: 0.05 },
    )
    observer.observe(projectList)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!gridUpdating) return undefined
    const timer = window.setTimeout(() => setGridUpdating(false), 220)
    return () => window.clearTimeout(timer)
  }, [gridUpdating])

  useEffect(() => {
    let frameId
    const floatIndex = () => {
      const aside = indexAsideRef.current
      const follower = indexFloatRef.current
      const projectList = projectListRef.current

      if (aside && follower && projectList) {
        const rect = aside.getBoundingClientRect()
        const paddingTop = parseFloat(getComputedStyle(aside).paddingTop)
        const followerHeight = follower.offsetHeight
        const sectionBottom = projectList.getBoundingClientRect().bottom
        const max = Math.max(
          0,
          Math.min(
            aside.clientHeight - paddingTop - followerHeight,
            sectionBottom - rect.top - paddingTop - followerHeight - 80,
          ),
        )
        const target = clamp(52 - rect.top - paddingTop + 64, 0, max)
        setIndexY((current) => clamp(reducedMotion ? target : current + (target - current) * 0.065, 0, max))
      }

      frameId = requestAnimationFrame(floatIndex)
    }

    frameId = requestAnimationFrame(floatIndex)
    return () => cancelAnimationFrame(frameId)
  }, [reducedMotion])

  useEffect(() => {
    const handleClick = (event) => {
      if (!event.target.closest('.filter-bar')) setOpenFilter(null)
    }

    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        setOpenFilter(null)
        closeDetail()
      }
      cancelPageScroll()
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKeydown)
    window.addEventListener('pointerdown', cancelPageScroll)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('pointerdown', cancelPageScroll)
      document.body.classList.remove('body-detail-open')
    }
  }, [cancelPageScroll, closeDetail])

  useEffect(() => {
    const handleWheel = (event) => {
      if (activeDetailIndex !== null) return
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.deltaY === 0 || event.ctrlKey) return

      const scrollState = scrollStateRef.current
      const projectList = projectListRef.current
      if (!projectList) return

      const now = performance.now()
      const freshGesture = now - scrollState.lastWheelAt > 180
      scrollState.lastWheelAt = now
      if (freshGesture) scrollState.landingGuard = false

      if (scrollState.raf || scrollState.landingGuard) {
        event.preventDefault()
        return
      }

      const listStart = getListScrollTarget()
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1)

      if (delta < 0 && window.scrollY > listStart + 3) {
        if (window.scrollY + delta <= listStart) {
          event.preventDefault()
          smoothScrollTo(listStart, 850)
        }
        return
      }

      const enteringList = delta > 0 && window.scrollY < listStart - 3
      const returningHome = delta < 0 && window.scrollY > 0 && window.scrollY <= listStart + 3
      if (!enteringList && !returningHome) return

      event.preventDefault()
      scrollState.gestureDelta =
        now - scrollState.gestureTime < 180 && Math.sign(scrollState.gestureDelta) === Math.sign(delta)
          ? scrollState.gestureDelta + delta
          : delta
      scrollState.gestureTime = now

      if (Math.abs(scrollState.gestureDelta) >= 65) {
        scrollState.gestureDelta = 0
        smoothScrollTo(enteringList ? listStart : 0)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [activeDetailIndex, getListScrollTarget, smoothScrollTo])

  const handlePointerDown = (event) => {
    const state = carouselRef.current
    clearHoveredCard()
    state.pressedCardIndex = findCardAtPoint(event.clientX, event.clientY)
    state.dragging = true
    state.dragDistance = 0
    state.lastX = event.clientX
    state.velocity = 0
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    const state = carouselRef.current
    state.pointerX = event.clientX
    state.pointerY = event.clientY

    if (!state.dragging) {
      updateHoveredImage(state.pointerX, state.pointerY)
      return
    }

    const dx = event.clientX - state.lastX
    state.lastX = event.clientX
    state.dragDistance += Math.abs(dx)
    state.rotation += dx * 0.21
    state.velocity = dx * 22
  }

  const endDrag = (event, activateCard) => {
    const state = carouselRef.current
    const clickedCardIndex = state.pressedCardIndex
    const releasedCardIndex = activateCard ? findCardAtPoint(event.clientX, event.clientY) : null
    const isCardClick =
      activateCard && clickedCardIndex !== null && releasedCardIndex === clickedCardIndex && state.dragDistance < 8

    state.dragging = false
    state.pressedCardIndex = null
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      /* pointer capture may already be released */
    }

    if (isCardClick) {
      const originalIndex = displayProjects[clickedCardIndex]?.originalIndex
      if (originalIndex !== undefined) openDetail(originalIndex)
    }
  }

  const handleDetailWheel = (event) => {
    if (activeDetailIndex === null) return
    event.preventDefault()
    if (detailStateRef.current.moving || Math.abs(event.deltaY) < DETAIL_WHEEL_THRESHOLD) return
    moveDetailToSection(detailStateRef.current.section + (event.deltaY > 0 ? 1 : -1))
  }

  const moveToList = () => {
    if (projectListRef.current) smoothScrollTo(getListScrollTarget())
  }

  return (
    <main className="project-page" aria-label="Project">
      <section className="project-overview" aria-label="Project carousel">
        <div
          className="carousel-stage"
          ref={stageRef}
          aria-label="Drag to browse projects"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => {
            const state = carouselRef.current
            state.pointerX = null
            state.pointerY = null
            clearHoveredCard()
          }}
          onPointerUp={(event) => endDrag(event, true)}
          onPointerCancel={(event) => endDrag(event, false)}
        >
          <div className="ring-shell">
            <div className="ring" ref={ringRef}>
              {displayProjects.map(({ project, originalIndex }, index) => (
                <div
                  className="project-card"
                  data-index={index}
                  data-original-index={originalIndex}
                  key={`${project.id}-${index}`}
                  ref={(element) => {
                    cardRefs.current[index] = element
                  }}
                >
                  <button className="project-hit" type="button" aria-label={`${project.name} 상세 보기`}>
                    <span className="project-face" />
                    <span className="project-face back" />
                  </button>
                  <div className="card-label">
                    <div className="team-label">{`Team.${String(originalIndex + 1).padStart(2, '0')}`}</div>
                    <h1 className="project-title">{project.name}</h1>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button className="scroll-indicator" type="button" aria-label="Scroll to project list" onClick={moveToList} />
      </section>

      <section
        className={`project-list ${isListVisible ? 'is-visible' : ''}`}
        ref={projectListRef}
        aria-label="Project list"
      >
        <div className="list-layout">
          <div className="list-main">
            <div className="filter-bar" aria-label="Project filters">
              <div className="filter-controls">
                {Object.entries(categories).map(([key, values]) => (
                  <div className={`filter-group ${openFilter === key ? 'is-open' : ''}`} key={key}>
                    <button
                      className="filter-trigger"
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={openFilter === key}
                      onClick={(event) => {
                        event.stopPropagation()
                        setOpenFilter((current) => (current === key ? null : key))
                      }}
                    >
                      <span>{key.toUpperCase()}</span>
                      <span className="chevron">⌄</span>
                    </button>
                    <div className="filter-menu" role="menu">
                      {values
                        .filter((item) => !selectedFilters.includes(item))
                        .map((item) => (
                          <button key={item} type="button" role="menuitem" onClick={() => toggleFilter(item)}>
                            {item}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className={`selected-area ${selectedFilters.length > 0 ? 'has-selection' : ''}`} aria-label="Selected filters">
                {selectedFilters.map((filter) => (
                  <button className="selected-chip" type="button" key={filter} onClick={() => removeFilter(filter)}>
                    <span>{filter}</span>
                    <span className="chip-remove">×</span>
                  </button>
                ))}
              </div>

              <button
                className={`clear-btn ${selectedFilters.length > 0 ? 'is-active' : ''}`}
                type="button"
                disabled={selectedFilters.length === 0}
                onClick={() => {
                  setSelectedFilters([])
                  setOpenFilter(null)
                  setGridUpdating(true)
                }}
              >
                Clear All
              </button>
            </div>

            <div className={`project-grid ${gridUpdating ? 'is-updating' : ''}`}>
              {projects.map((project, index) => {
                const hidden = !filteredProjects.some(({ originalIndex }) => originalIndex === index)
                return (
                  <button
                    className="list-card"
                    type="button"
                    key={project.id}
                    hidden={hidden}
                    aria-label={`Team.${String(index + 1).padStart(2, '0')} Project Name`}
                    onClick={() => openDetail(index)}
                  >
                    <span className="list-card-media" />
                  </button>
                )
              })}
            </div>
          </div>

          <aside className="project-index" ref={indexAsideRef} aria-label="Project index">
            <div className="index-reveal">
              <div className="index-float" ref={indexFloatRef} style={{ transform: `translate3d(0, ${indexY}px, 0)` }}>
                {projects.map((project, index) => (
                  <button
                    type="button"
                    key={project.id}
                    onClick={() => openDetail(index)}
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span>Project Name</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section
        className={`detail-view ${activeDetail ? 'is-open' : ''}`}
        ref={detailViewRef}
        aria-hidden={!activeDetail}
      >
        <div className="detail-bg" aria-hidden="true" />
        <button className="close-detail" type="button" aria-label="Close project detail" onClick={closeDetail}>
          ×
        </button>
        <div className="detail-scroller" ref={detailScrollerRef} onWheel={handleDetailWheel}>
          <article
            className="detail-hero"
            ref={(element) => {
              detailSectionRefs.current[0] = element
            }}
          >
            <div className="detail-intro">
              <div className="project-link-row">
                <h1 className="detail-title">{activeDetail?.name || 'Project Name'}</h1>
                <a className="site-link" href={activeDetail?.link || '#'} aria-label="Open project site">
                  →
                </a>
              </div>
              <p className="detail-slogan">{activeDetail?.slogan || '슬로건 내용이 들어가는 영역입니다.'}</p>
              <p className="detail-desc">{activeDetail?.desc || '프로젝트 설명 내용이 들어가는 영역입니다.'}</p>
              <div className="detail-tags">
                {(activeDetail?.tags || []).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </article>

          <article
            className="detail-content"
            ref={(element) => {
              detailSectionRefs.current[1] = element
            }}
          >
            <section className="detail-left">
              <div className="detail-image-left" aria-label="Project image placeholder" />
              <div className="team-block">
                <h2 className="team-title">{activeDetail?.team || 'TEAM.000'}</h2>
                <div className="members">
                  {(activeDetail?.members || []).map(([name, role], index) => (
                    <div key={`${name}-${role}-${index}`}>
                      <p className="member-name">{name}</p>
                      <p className="member-role">{role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className="detail-right">
              <div className="detail-image-right" aria-label="Project content image placeholder" />
            </section>
          </article>
        </div>
      </section>
    </main>
  )
}

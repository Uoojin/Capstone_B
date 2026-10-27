import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePageTransitionReady } from '../../components/PageTransition/PageTransitionContext.js'
import { categories, projects } from '../../data/index.js'
import { imageBackgroundStyle } from '../../data/dataUtils.js'
import { shuffle } from '../../utils/shuffle.js'
import projectLinkIcon from '../../assets/project/linkIcon.svg'
import './Project.css'

const DISPLAY_CARD_COUNT = 17
const TOP_FOCUS_ANGLE = 0
const FOCUS_RANGE = 92
const LOGICAL_ANGLE_STEP = 360 / DISPLAY_CARD_COUNT
const WHEEL_RADIUS_CARD_MULTIPLIER = 2.7
const CARD_GAP_RATIO = 0.18
const mobileProjectViewport = window.matchMedia('(max-width: 767px)')

function subscribeToMobileViewport(onChange) {
  mobileProjectViewport.addEventListener('change', onChange)
  return () => mobileProjectViewport.removeEventListener('change', onChange)
}

function getMobileViewport() {
  return mobileProjectViewport.matches
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const signedAngleDistance = (from, to = TOP_FOCUS_ANGLE) => ((from - to + 540) % 360) - 180

export default function Project() {
  const location = useLocation()
  const navigate = useNavigate()
  const pageReady = usePageTransitionReady()
  const requestedProjectId = new URLSearchParams(location.search).get('projectId')
  const [shuffledProjects] = useState(() => shuffle(projects.map((project, originalIndex) => ({ project, originalIndex }))))
  const isMobile = useSyncExternalStore(subscribeToMobileViewport, getMobileViewport)
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
  const scrollStateRef = useRef({ raf: null, landingGuard: false, lastWheelAt: 0, gestureDelta: 0, gestureTime: 0 })

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const filteredProjects = useMemo(
    () =>
      shuffledProjects
        .filter(({ project }) => selectedFilters.length === 0 || selectedFilters.some((filter) => project.tags.includes(filter))),
    [selectedFilters, shuffledProjects],
  )

  const displayProjects = useMemo(() => {
    if (filteredProjects.length === 0) return []
    if (filteredProjects.length >= DISPLAY_CARD_COUNT) return filteredProjects.slice(0, DISPLAY_CARD_COUNT)
    return Array.from({ length: DISPLAY_CARD_COUNT }, (_, index) => filteredProjects[index % filteredProjects.length])
  }, [filteredProjects])

  const activeDetail = activeDetailIndex === null ? null : projects[activeDetailIndex]
  const projectLink = activeDetail?.link?.trim() || ''
  const hasProjectLink = /^https?:\/\/\S+$/i.test(projectLink)

  const isDetailOpen = activeDetail !== null
  const detailProjectOrder = filteredProjects.some(({ project }) => project.id === activeDetail?.id)
    ? filteredProjects
    : shuffledProjects
  const detailPosition = detailProjectOrder.findIndex(({ project }) => project.id === activeDetail?.id)
  const previousProject = detailPosition < 0 ? null
    : detailProjectOrder[(detailPosition - 1 + detailProjectOrder.length) % detailProjectOrder.length]?.project
  const nextProject = detailPosition < 0 ? null
    : detailProjectOrder[(detailPosition + 1) % detailProjectOrder.length]?.project

  useLayoutEffect(() => {
    if (activeDetailIndex !== null) detailScrollerRef.current.scrollTop = 0
  }, [activeDetailIndex])

  useLayoutEffect(() => {
    if (activeDetailIndex === null) return undefined
    const title = detailScrollerRef.current.querySelector('.detail-title')
    const link = detailScrollerRef.current.querySelector('.site-link')
    if (!title || !link) return undefined

    let disposed = false
    const alignLinkToFirstLine = () => {
      if (disposed) return
      const range = document.createRange()
      range.selectNodeContents(title)
      const firstLine = Array.from(range.getClientRects()).find((rect) => rect.width > 0)
      const offset = firstLine ? Math.min(0, firstLine.right - title.getBoundingClientRect().right) : 0
      link.style.setProperty('--project-link-offset', `${offset}px`)
    }

    alignLinkToFirstLine()
    const observer = new ResizeObserver(alignLinkToFirstLine)
    observer.observe(title)
    document.fonts.ready.then(alignLinkToFirstLine)
    document.fonts.addEventListener('loadingdone', alignLinkToFirstLine)
    return () => {
      disposed = true
      observer.disconnect()
      document.fonts.removeEventListener('loadingdone', alignLinkToFirstLine)
    }
  }, [activeDetailIndex])

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
    // Use the rendered responsive card size for orbital spacing in the middle range.
    // The original desktop/mobile geometry and all motion calculations stay intact.
    if (stageWidth >= 768 && stageWidth < 1600 && cardRefs.current[0]) {
      state.cardWidth = parseFloat(getComputedStyle(cardRefs.current[0]).width)
    }
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
    // Stop an in-flight list transition before preserving its current position.
    const scrollState = scrollStateRef.current
    if (scrollState.raf) cancelAnimationFrame(scrollState.raf)
    scrollState.raf = null
    scrollState.landingGuard = false
    setActiveDetailIndex(index)
  }, [])

  const openProjectById = (projectId) => {
    const index = projects.findIndex((project) => project.id === projectId)
    if (index === -1) return
    if (requestedProjectId !== null && requestedProjectId !== projectId) {
      const search = new URLSearchParams(location.search)
      search.set('projectId', projectId)
      navigate({ pathname: location.pathname, search: search.toString(), hash: location.hash }, { replace: true, state: location.state })
    }
    openDetail(index)
  }

  const closeDetail = useCallback(() => {
    setActiveDetailIndex(null)
    if (requestedProjectId !== null) {
      const search = new URLSearchParams(location.search)
      search.delete('projectId')
      navigate({ pathname: location.pathname, search: search.toString(), hash: location.hash }, { replace: true, state: location.state })
    }
  }, [location, navigate, requestedProjectId])

  useEffect(() => {
    if (!pageReady) return undefined
    // Run after the loading layer has released its scroll lock.
    const frame = requestAnimationFrame(() => {
      const index = projects.findIndex((project) => project.id === requestedProjectId)
      if (index !== -1) openDetail(index)
      else setActiveDetailIndex(null)
    })
    return () => cancelAnimationFrame(frame)
  }, [location.key, pageReady, requestedProjectId, openDetail])

  const visitStudent = (studentId) => {
    // Release the modal scroll lock before the loading layer acquires its own.
    flushSync(() => setActiveDetailIndex(null))
    navigate(`/student?${new URLSearchParams({ studentId })}`)
  }

  useLayoutEffect(() => {
    if (!isDetailOpen || !pageReady) return undefined

    const dialog = detailViewRef.current
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    document.body.classList.add('body-detail-open')
    root.style.overflow = 'hidden'
    dialog.showModal()

    return () => {
      dialog.close()
      root.style.overflow = previousOverflow
      document.body.classList.remove('body-detail-open')
      window.scrollTo(scrollX, scrollY)
    }
  }, [isDetailOpen, pageReady])

  useEffect(() => {
    if (isMobile || reducedMotion || activeDetailIndex === null) return undefined
    const scroller = detailScrollerRef.current
    let frameId = null
    let target = scroller.scrollTop
    let lastFrame = 0

    const stop = () => {
      if (frameId !== null) cancelAnimationFrame(frameId)
      frameId = null
      target = scroller.scrollTop
    }
    const advance = (now) => {
      const elapsed = Math.min(now - lastFrame, 32)
      lastFrame = now
      target = clamp(target, 0, Math.max(0, scroller.scrollHeight - scroller.clientHeight))
      const remaining = target - scroller.scrollTop
      // A short, frame-rate-independent tail without increasing wheel distance.
      if (Math.abs(remaining) < 0.75) {
        scroller.scrollTop = target
        frameId = null
        return
      }
      scroller.scrollTop += remaining * (1 - Math.exp(-elapsed / 55))
      frameId = requestAnimationFrame(advance)
    }
    const handleWheel = (event) => {
      // Native scrolling owns laptop detail snapping, including scrolling inside tall sections.
      // Repeated JS scrollTop writes would compete with the browser's snap destination.
      if (window.matchMedia('(min-width: 1025px) and (max-width: 1599px)').matches) {
        stop()
        return
      }
      if (mobileProjectViewport.matches || event.ctrlKey || event.metaKey || event.shiftKey ||
        !event.cancelable || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) {
        stop()
        return
      }
      const unit = event.deltaMode === 1
        ? parseFloat(getComputedStyle(scroller).lineHeight) || 16
        : event.deltaMode === 2 ? scroller.clientHeight : 1
      if (frameId === null) target = scroller.scrollTop
      // Reversing the wheel responds immediately instead of exhausting the old tail.
      if ((target - scroller.scrollTop) * event.deltaY < 0) target = scroller.scrollTop
      target = clamp(target + event.deltaY * unit, 0, Math.max(0, scroller.scrollHeight - scroller.clientHeight))
      event.preventDefault()
      if (frameId === null) {
        lastFrame = performance.now()
        frameId = requestAnimationFrame(advance)
      }
    }

    scroller.addEventListener('wheel', handleWheel, { passive: false })
    scroller.addEventListener('pointerdown', stop, { passive: true })
    scroller.addEventListener('keydown', stop)
    return () => {
      stop()
      scroller.removeEventListener('wheel', handleWheel)
      scroller.removeEventListener('pointerdown', stop)
      scroller.removeEventListener('keydown', stop)
    }
  }, [activeDetailIndex, isMobile, reducedMotion])

  const cancelPageScroll = useCallback(() => {
    const scrollState = scrollStateRef.current
    if (scrollState.raf) cancelAnimationFrame(scrollState.raf)
    scrollState.raf = null
    scrollState.landingGuard = false
  }, [])

  const smoothScrollTo = useCallback(
    (target, duration = 1000) => {
      if (mobileProjectViewport.matches) return
      const scrollState = scrollStateRef.current
      cancelPageScroll()
      const start = window.scrollY
      const startTime = performance.now()
      const move = (now) => {
        if (mobileProjectViewport.matches) {
          cancelPageScroll()
          return
        }
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
    if (isMobile) return
    cardRefs.current = cardRefs.current.slice(0, displayProjects.length)
    carouselRef.current.angle = displayProjects.length > 0 ? LOGICAL_ANGLE_STEP : 0
    calcRadius()
    updateCarousel()
  }, [calcRadius, displayProjects, isMobile, updateCarousel])

  useEffect(() => {
    if (isMobile) return undefined
    const carouselState = carouselRef.current
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
    return () => {
      cancelAnimationFrame(animationId)
      carouselState.lastFrame = 0
    }
  }, [clearHoveredCard, findHoveredImageAtPoint, isMobile, updateCarousel])

  useEffect(() => {
    if (isMobile) return undefined
    const handleResize = () => {
      calcRadius()
      updateCarousel()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [calcRadius, isMobile, updateCarousel])

  useEffect(() => {
    if (isMobile) return undefined
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
  }, [isMobile])

  useEffect(() => {
    if (!gridUpdating) return undefined
    const timer = window.setTimeout(() => setGridUpdating(false), 220)
    return () => window.clearTimeout(timer)
  }, [gridUpdating])

  useEffect(() => {
    if (isMobile) return undefined
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
  }, [isMobile, reducedMotion])

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
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKeydown)
      document.body.classList.remove('body-detail-open')
    }
  }, [cancelPageScroll, closeDetail])

  useEffect(() => {
    if (isMobile) return undefined
    window.addEventListener('pointerdown', cancelPageScroll)
    return () => window.removeEventListener('pointerdown', cancelPageScroll)
  }, [cancelPageScroll, isMobile])

  useEffect(() => {
    // Mobile keeps the browser's native scrolling and has no wheel interceptor.
    if (isMobile) return undefined
    const scrollState = scrollStateRef.current
    const handleWheel = (event) => {
      if (mobileProjectViewport.matches || activeDetailIndex !== null) return
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.deltaY === 0 || event.ctrlKey) return

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
    return () => {
      window.removeEventListener('wheel', handleWheel)
      cancelPageScroll()
      scrollState.gestureDelta = 0
      scrollState.gestureTime = 0
      scrollState.lastWheelAt = 0
    }
  }, [activeDetailIndex, cancelPageScroll, getListScrollTarget, isMobile, smoothScrollTo])

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
      const project = displayProjects[clickedCardIndex]?.project
      if (project) openProjectById(project.id)
    }
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
                  key={`${project.id}-${Math.floor(index / filteredProjects.length)}`}
                  ref={(element) => {
                    cardRefs.current[index] = element
                  }}
                >
                  <button className="project-hit" type="button" aria-label={`${project.name} 상세 보기`}>
                    <span className="project-face" style={imageBackgroundStyle(project.cardImage)} />
                    <span className="project-face back" style={imageBackgroundStyle(project.cardImage)} />
                  </button>
                  <div className="card-label">
                    <div className="team-label">{project.team}</div>
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
              {shuffledProjects.map(({ project, originalIndex: index }) => {
                const hidden = !filteredProjects.some(({ originalIndex }) => originalIndex === index)
                return (
                  <button
                    className="list-card"
                    type="button"
                    key={project.id}
                    hidden={hidden}
                    aria-label={`${project.team} ${project.name}`}
                    onClick={() => openProjectById(project.id)}
                  >
                    <span className="list-card-media" style={imageBackgroundStyle(project.cardImage)} />
                    <span className="list-card-caption">
                      <span className="list-card-name">{project.name}</span>
                      <span className="list-card-keywords">{project.tags.join(' · ')}</span>
                    </span>
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
                    onClick={() => openProjectById(project.id)}
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span>{project.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <dialog
        className="detail-view"
        ref={detailViewRef}
        aria-labelledby="detail-title"
        onCancel={(event) => {
          event.preventDefault()
          closeDetail()
        }}
      >
        <button className="close-detail" type="button" aria-label="프로젝트 상세 닫기" onClick={closeDetail} autoFocus>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m5 5 14 14M19 5 5 19" />
          </svg>
        </button>
        <div className="detail-scroller" ref={detailScrollerRef} tabIndex={0} aria-label="프로젝트 상세 콘텐츠">
          {activeDetail && (
            <>
              <article className="detail-section detail-hero" data-project-id={activeDetail.id}>
                <div className="project-link-row detail-identity">
                  <h1 className="detail-title" id="detail-title">{activeDetail.name}</h1>
                  {hasProjectLink && (
                    <a className="site-link" href={projectLink} target="_blank" rel="noopener noreferrer" aria-label={`${activeDetail.name} 외부 사이트 새 탭에서 열기`}>
                      <img src={projectLinkIcon} alt="" aria-hidden="true" />
                    </a>
                  )}
                </div>
                <div className="detail-intro">
                  {activeDetail.slogan && <p className="detail-slogan">{activeDetail.slogan}</p>}
                  {activeDetail.desc && <p className="detail-desc">{activeDetail.desc}</p>}
                </div>
                <dl className="detail-metadata">
                  {['media', 'subject', 'target'].map((key) => activeDetail[key] && (
                    <div key={key}>
                      <dt>{key.toUpperCase()}</dt>
                      <dd>{Array.isArray(activeDetail[key]) ? activeDetail[key].join(', ') : activeDetail[key]}</dd>
                    </div>
                  ))}
                </dl>
                <div className="detail-media">
                  {activeDetail.image && <img src={activeDetail.image} alt={`${activeDetail.name} 대표 이미지`} />}
                </div>
              </article>

              <article className="detail-section detail-team" aria-label="팀 소개">
                <div className="detail-team-info">
                  {activeDetail.team && <h2 className="team-title"><span>TEAM</span>{activeDetail.team}</h2>}
                  <div className={`detail-handwriting${activeDetail.handwritingImage ? ' has-image' : ''}`}>
                    {activeDetail.handwritingImage && (
                      <img src={activeDetail.handwritingImage} alt={activeDetail.handwritingAlt || '팀 손글씨'} />
                    )}
                  </div>
                </div>
                <div className="detail-media detail-team-media">
                  {activeDetail.teamImage && <img src={activeDetail.teamImage} alt={`${activeDetail.team || activeDetail.name} 팀 사진`} />}
                </div>
                <div className="members">
                  {(activeDetail.members || []).map(({ studentId, name, role }) => (
                    <button className="member-link" type="button" key={studentId} onClick={() => visitStudent(studentId)} aria-label={`${name} 학생 카드 보기`}>
                      {name && <p className="member-name">{name}</p>}
                      {role && <p className="member-role">{role}</p>}
                    </button>
                  ))}
                </div>
              </article>
            </>
          )}
        </div>
        {activeDetail && previousProject && nextProject && detailProjectOrder.length > 1 && (
          <nav className="detail-project-nav" aria-label="프로젝트 상세 이동">
            <button type="button" className="detail-previous" onClick={() => openProjectById(previousProject.id)} aria-label={`이전 프로젝트: ${previousProject.name}`}>
              <span aria-hidden="true">←</span><span>{previousProject.name}</span>
            </button>
            <button type="button" className="detail-next" onClick={() => openProjectById(nextProject.id)} aria-label={`다음 프로젝트: ${nextProject.name}`}>
              <span>{nextProject.name}</span><span aria-hidden="true">→</span>
            </button>
          </nav>
        )}
      </dialog>
    </main>
  )
}

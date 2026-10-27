import { createContext, useContext } from 'react'

export const PageTransitionReadyContext = createContext(true)
export const usePageTransitionReady = () => useContext(PageTransitionReadyContext)

import { createContext, useContext } from 'react'

export const PageTransitionReadyContext = createContext(true)
export const usePageTransitionReady = () => useContext(PageTransitionReadyContext)

export const PageTransitionImagesReadyContext = createContext(null)
export const usePageTransitionImagesReady = () => useContext(PageTransitionImagesReadyContext)

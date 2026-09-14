import { createContext } from 'react'

export const WindowTitleContext = createContext<((title: string | null) => void) | null>(null)

import { createContext, type PropsWithChildren } from "react"
import { usePhaserCore } from "./usePhaser"

export interface PhaserContextType {
    usePhaser: ReturnType<typeof usePhaserCore>
}
export const PhaserContext = createContext<PhaserContextType | null>(null)

export const PhaserProvider = ({ children }: PropsWithChildren) => {
    const usePhaser = usePhaserCore()
    return (
        <PhaserContext.Provider value={{ usePhaser }}>
            {children}
        </PhaserContext.Provider>
    )
}
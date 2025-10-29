import React, { createContext, type PropsWithChildren } from "react"
import { useColyseusCore } from "./useColyseus"
    
export interface ColyseusContextType {
  useColyseus: ReturnType<typeof useColyseusCore>
}

export const ColyseusContext = createContext<ColyseusContextType | undefined>(
    undefined,
)

export const ColyseusProvider = ({ children }: PropsWithChildren) => {
    const useColyseus = useColyseusCore()
    return (
        <ColyseusContext.Provider value={{ useColyseus }}>
            {children}
        </ColyseusContext.Provider>
    )
}

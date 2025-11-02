import { useOpenHome } from "./useOpenHome"

export const useHomeEventsCore = () => {
    const { openHome } = useOpenHome()
    return { openHome }
}

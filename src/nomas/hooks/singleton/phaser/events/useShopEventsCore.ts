import { useOpenShop } from "./useOpenShop"
import { useCloseShop } from "./useCloseShop"

/**
 * Core hook for managing shop events
 * Consolidates all shop-related event hooks
 */
export const useShopEventsCore = () => {
  const { openShop } = useOpenShop()
  const { closeShop } = useCloseShop()

  return {
    openShop,
    closeShop,
  }
}

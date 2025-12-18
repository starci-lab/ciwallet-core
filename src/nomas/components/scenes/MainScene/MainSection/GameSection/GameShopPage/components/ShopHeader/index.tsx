import { NomasImage } from "@/nomas/components"

interface ShopHeaderProps {
    assets: ReturnType<typeof import("@/nomas/resources").assetsConfig>["game"]
    onClose: () => void
}

/**
 * ShopHeader - Header section with logo and close button
 */
export const ShopHeader = ({ assets, onClose }: ShopHeaderProps) => {
    return (
        <div className="relative bg-card-dark-4 px-3 py-2 border-b border-muted rounded-t-(--card-radius-inner)">
            {/* Back/Close Button */}
            <button
                onClick={onClose}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-card-dark-5 rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-card-dark-6 transition-colors"
            >
                <svg className="w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Title/Logo */}
            <div className="flex items-center justify-center">
                <NomasImage
                    src={assets.petRisingStoreLogo}
                    alt="Pet Rising Store Logo"
                    className="h-9 w-auto object-contain"
                />
            </div>
        </div>
    )
}

import { chainManagerObj } from "@/nomas/obj"
import { Platform, type ChainMetadata } from "@ciwallet-sdk/types"

export interface TokenIconsProps {
    platform: Platform
}
export const TokenIcons = ({ platform }: TokenIconsProps) => {
    switch (platform) {
    case Platform.Evm:
        return <div className="flex items-center gap-2">
            <RenderTokenIcons chains={chainManagerObj.getChainsByPlatform(platform)} />
        </div>
    case Platform.Solana:
        return <div className="flex items-center gap-2">
            <RenderTokenIcons chains={chainManagerObj.getChainsByPlatform(platform)} />
        </div>
    case Platform.Sui:
        return <div className="flex items-center gap-2">
            <RenderTokenIcons chains={chainManagerObj.getChainsByPlatform(platform)} />
        </div>
    case Platform.Aptos:
        return <div className="flex items-center gap-2">
            <RenderTokenIcons chains={chainManagerObj.getChainsByPlatform(platform)} />
        </div>
    case Platform.Bitcoin:
        return <div className="flex items-center gap-2">
            <RenderTokenIcons chains={chainManagerObj.getChainsByPlatform(platform)} />
        </div>
    default:
        throw new Error(`Unsupported platform: ${platform}`)
    }
}

export interface RenderTokenIconsProps {
    chains: Array<ChainMetadata>
}
const RenderTokenIcons = ({ chains }: RenderTokenIconsProps) => {
    const visible = chains.slice(0, 5)
    const remaining = chains.length - visible.length
    return (
        <div className="flex items-center -space-x-2">
            {visible.map((chain) => (
                <img
                    key={chain.id}
                    src={chain.iconUrl}
                    alt={chain.name}
                    className="w-5 h-5 rounded-full"
                />
            ))}

            {remaining > 0 && (
                <span className="text-xstext-text-muted bg-muted/20 w-5 h-5 rounded-full grid place-items-center">+{remaining}</span>
            )}
        </div>
    )
}
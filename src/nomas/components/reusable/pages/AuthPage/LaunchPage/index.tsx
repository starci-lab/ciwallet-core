import React from "react"
import { NomasCard, NomasCardBody, NomasCardVariant } from "../../../../extends"
import { NomasButtonTextWithIcon } from "../../../../extends/NomasButton"
import { RocketLaunchIcon } from "@phosphor-icons/react"
import { useWalletBootstrap } from "@/nomas/hooks/singleton/wallet"

export interface LaunchProps {
    onLaunched?: () => void;
}

export const Launch = ({ onLaunched }: LaunchProps) => {
    const { bootstrap } = useWalletBootstrap()
    return (
        <NomasCard
            variant={NomasCardVariant.Gradient}
        >
            <NomasCardBody className="flex flex-col items-center gap-8">
                <div className="w-16 h-16 rounded-full grid place-items-center bg-muted border border-border">
                    <img src="/icons/common/nomas-logo.png" alt="Nomas Wallet" className="w-16 h-16" />
                </div>

                <div className="text-center">
                    <div className="text-4xl font-extrabold tracking-tight text-foreground">Nomas Wallet</div>
                    <div className="mt-2 text-sm text-foreground-500">Simple - Seamless - Synergy</div>
                </div>

                <NomasButtonTextWithIcon
                    size="lg"
                    className="w-full justify-between"
                    icon={<RocketLaunchIcon className="w-5 h-5" weight="fill" />}
                    onPress={async () => {
                        await bootstrap()
                        onLaunched?.()
                    }}
                >
                    Rocket Launch
                </NomasButtonTextWithIcon>

                <div className="w-full flex items-center justify-between gap-4 text-sm">
                    {/* <NomasButtonTextWithIcon
                        className="px-3"
                        icon={<SignIn className="w-4 h-4" />}
                    >
                        I already have a Wallet
                    </NomasButtonTextWithIcon>

                    <NomasButtonTextWithIcon
                        className="px-3"
                        icon={<PaperPlaneTilt className="w-4 h-4" weight="fill" />}
                    >
                        Connect Telegram
                    </NomasButtonTextWithIcon> */}
                </div>
            </NomasCardBody>
        </NomasCard>
    )
}

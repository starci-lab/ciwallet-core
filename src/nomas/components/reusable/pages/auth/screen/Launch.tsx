import { NomasCard, NomasCardBody } from "@/nomas/components/extends"
import { NomasButtonTextWithIcon } from "@/nomas/components/extends/NomasButton"
import { RocketLaunchIcon } from "@phosphor-icons/react"
import { useWalletBootstrap } from "@/nomas/hooks/singleton"

export interface LaunchProps {
    onLaunched?: () => void;
}

export const Launch = ({ onLaunched }: LaunchProps) => {
    const { bootstrap } = useWalletBootstrap()
    return (
        <NomasCard
            asCore
            radius="lg"
            className="w-full max-w-xl mx-auto px-6 py-10 bg-gradient-to-b from-[#2D2D2D] to-[#242424] border-t border-content3-200"
        >
            <NomasCardBody className="flex flex-col items-center gap-8">
                <div className="w-16 h-16 rounded-full grid place-items-center bg-content3-200/30 border border-content3-100">
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

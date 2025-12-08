/* eslint-disable indent */
import type { ReactNode } from "react"
import { NomasButton, NomasImage, NomasInput } from "@/nomas/components"
import { assetsConfig } from "@/nomas/resources"
import { useAppSelector } from "@/nomas/redux"

interface ReactModalLayoutProps {
  onClose: () => void
  children: ReactNode
  showBalance?: boolean
  showEarnings?: boolean
  title?: string
  titleLogo?: boolean
}

export function ReactModalLayout({
  onClose,
  children,
  showBalance = true,
  showEarnings = false,
  title = "Pet Rising",
  titleLogo = true,
}: ReactModalLayoutProps) {
  const assets = assetsConfig().game
  const balance = useAppSelector((state) => state.stateless.user.nomToken)

  return (
    <div className="w-full max-w-md h-full max-h-[600px] bg-card-dark-3 rounded-2xl overflow-hidden flex flex-col mx-auto">
      {/* Header */}
      <div className="relative bg-card-dark-4 px-3 py-2 border-b border-muted">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-card-dark-5 rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-[hsl(0,0%,22.7%)] transition-colors"
        >
          <svg
            className="w-3.5 h-3.5 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Title/Logo */}
        <div className="flex items-center justify-center">
          {titleLogo ? (
            <NomasImage
              src={assets.petRisingStoreLogo}
              alt="Pet Rising Store Logo"
              className="h-9 w-auto object-contain"
            />
          ) : (
            <h2 className="text-lg font-bold text-white">{title}</h2>
          )}
        </div>
      </div>

      {/* Balance Section (optional) */}
      {showBalance && (
        <div className="bg-card-dark-4 px-2 py-1 border-b border-muted">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-2">
              <div>
                <div className="text-xstext-text-muted pl-1">Balance</div>
                <NomasInput
                  value={balance.toLocaleString()}
                  prefixIcon={
                    <NomasImage
                      src={assets.nomasCoin}
                      alt="NOM"
                      className="w-3 h-3"
                    />
                  }
                  currency="NOM"
                  numericOnly
                  readOnly
                />
              </div>
            </div>
            {showEarnings && (
              <>
                <div className="flex items-center gap-2">
                  <div>
                    <div className="text-xstext-text-muted pl-1">Earnings</div>
                    <NomasInput
                      value="0"
                      prefixIcon={
                        <NomasImage
                          src={assets.nomasCoin}
                          alt="NOM"
                          className="w-3 h-3"
                        />
                      }
                      currency="NOM"
                      numericOnly
                      readOnly
                    />
                  </div>
                </div>
                <NomasButton>Claim</NomasButton>
              </>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  )
}

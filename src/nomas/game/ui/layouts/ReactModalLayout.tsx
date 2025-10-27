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
    <div className="w-full h-full bg-[#1a1a1a] rounded-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="relative bg-[#2a2a2a] px-4 py-3 border-b border-[rgba(135,135,135,0.25)]">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#323232] rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-[#3a3a3a] transition-colors"
        >
          <svg
            className="w-4 h-4 text-gray-300"
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
              className="h-12 w-auto object-contain"
            />
          ) : (
            <h2 className="text-xl font-bold text-white">{title}</h2>
          )}
        </div>
      </div>

      {/* Balance Section (optional) */}
      {showBalance && (
        <div className="bg-[#2a2a2a] px-2 py-1.5 border-b border-[rgba(135,135,135,0.25)]">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-sm text-muted pl-1">Balance</div>
                <NomasInput
                  value={balance.toLocaleString()}
                  prefixIcon={
                    <NomasImage
                      src={assets.nomasCoin}
                      alt="NOM"
                      className="w-4 h-4"
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
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-sm text-muted pl-1">Earnings</div>
                    <NomasInput
                      value="0"
                      prefixIcon={
                        <NomasImage
                          src={assets.nomasCoin}
                          alt="NOM"
                          className="w-4 h-4"
                        />
                      }
                      currency="NOM"
                      numericOnly
                      readOnly
                    />
                  </div>
                </div>
                <NomasButton xlSize>Claim</NomasButton>
              </>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}

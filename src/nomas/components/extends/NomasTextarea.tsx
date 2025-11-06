import React, { useState, useRef, useEffect } from "react"
import { twMerge } from "tailwind-merge"
import { EyeIcon, EyeClosedIcon } from "@phosphor-icons/react"
import { NomasWarningText } from "./NomasWarningText"

export interface NomasTextareaProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "onChange" | "value"
  > {
  label?: string
  value?: string
  onValueChange?: (value: string) => void
  isInvalid?: boolean
  errorMessage?: string
  isRequired?: boolean
  isPassword?: boolean
  prefixIcon?: React.ReactNode
  minRows?: number
  maxRows?: number
}

/**
 * Styled multiline textarea used in Nomas UI — consistent with NomasInput.
 * Supports password visibility toggle and auto-resizing.
 */
export const NomasTextarea = React.forwardRef<HTMLTextAreaElement, NomasTextareaProps>(
    (
        {
            label,
            value = "",
            onValueChange,
            onBlur,
            placeholder,
            isInvalid,
            errorMessage,
            className,
            isPassword,
            prefixIcon,
            minRows = 3,
            maxRows = 8,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false)
        const textareaRef = useRef<HTMLTextAreaElement | null>(null)

        // Auto-resize effect
        useEffect(() => {
            const el = textareaRef.current
            if (!el) return
            el.style.height = "auto"
            const scrollHeight = Math.min(el.scrollHeight, maxRows * 24)
            el.style.height = `${scrollHeight}px`
        }, [value, maxRows])

        return (
            <div className="flex flex-col gap-2 w-full">
                <div
                    className={twMerge(
                        "flex items-start relative border bg-input border-input transition-colors radius-input",
                        prefixIcon && "pl-3",
                        isPassword && "pr-8",
                        isInvalid && "border-danger",
                        className
                    )}
                >
                    {/* Prefix Icon */}
                    {prefixIcon && (
                        <div className="flex items-start justify-center mt-3 text-muted">
                            {prefixIcon}
                        </div>
                    )}

                    {/* Textarea */}
                    <textarea
                        ref={(node) => {
                            textareaRef.current = node
                            if (typeof ref === "function") ref(node)
                            else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
                        }}
                        placeholder={label ?? placeholder}
                        value={value}
                        onChange={(e) => onValueChange?.(e.target.value)}
                        onBlur={onBlur}
                        rows={minRows}
                        spellCheck={false}
                        className={twMerge(
                            "resize-none outline-none border-none bg-transparent flex-1 text-sm text-textleading-relaxed w-full p-3",
                            "placeholder:text-muted focus:ring-0 focus-visible:ring-0"
                        )}
                        {...props}
                    />

                    {/* Password Toggle */}
                    {isPassword &&
            (showPassword ? (
                <EyeIcon
                    onClick={() => setShowPassword(false)}
                    className="absolute top-3 right-3 w-5 h-5 cursor-pointer text-muted"
                />
            ) : (
                <EyeClosedIcon
                    onClick={() => setShowPassword(true)}
                    className="absolute top-3 right-3 w-5 h-5 cursor-pointer text-muted"
                />
            ))}
                </div>

                {isInvalid && errorMessage && (
                    <NomasWarningText>{errorMessage}</NomasWarningText>
                )}
            </div>
        )
    }
)

NomasTextarea.displayName = "NomasTextarea"
import React, { useState } from "react"
import { twMerge } from "tailwind-merge"
import { Input } from "../shadcn"
import { EyeIcon, EyeClosedIcon } from "@phosphor-icons/react"
import { NomasWarningText } from "./NomasWarningText"
import { sanitizeNumericInput } from "@ciwallet-sdk/utils"

export interface NomasInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  label?: string
  value?: string
  onValueChange?: (value: string) => void
  isInvalid?: boolean
  errorMessage?: string
  isRequired?: boolean
  isPassword?: boolean
  numericOnly?: boolean
  prefixIcon?: React.ReactNode
  suffixText?: string
  currency?: string
}

export const NomasInput = React.forwardRef<HTMLInputElement, NomasInputProps>(
    (
        {
            label,
            value,
            onValueChange,
            onBlur,
            placeholder,
            isInvalid,
            errorMessage,
            className,
            isPassword,
            numericOnly,
            prefixIcon,
            suffixText,
            currency,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false)

        // Format value with currency if provided
        const displayValue = currency && value ? `${value} ${currency}` : value

        return (
            <div className="flex flex-col gap-2 w-full">
                <div
                    className={twMerge(
                        "flex items-center",
                        "h-12",
                        "border bg-input border-input transition-colors",
                        "radius-input",
                        prefixIcon && "pl-3",
                        (isPassword || suffixText) && "pr-3",
                        isInvalid && "border-danger",
                        className
                    )}
                >
                    {/* Prefix Icon */}
                    {prefixIcon && (
                        <div className="flex items-center justify-center text-muted">
                            {prefixIcon}
                        </div>
                    )}

                    <Input
                        ref={ref}
                        value={displayValue}
                        placeholder={label ?? placeholder}
                        onChange={(event) => {
                            let inputValue = event.target.value

                            // Remove currency suffix if present
                            if (currency && inputValue.endsWith(` ${currency}`)) {
                                inputValue = inputValue.replace(` ${currency}`, "")
                            }

                            if (numericOnly) {
                                onValueChange?.(sanitizeNumericInput(inputValue) || "")
                            } else {
                                onValueChange?.(inputValue)
                            }
                        }}
                        onBlur={onBlur}
                        type={isPassword ? (showPassword ? "text" : "password") : "text"}
                        className={twMerge(
                            "ring-0 focus-visible:ring-0 !border-none text-sm text flex-1"
                        )}
                        {...props}
                    />

                    {/* Suffix Text */}
                    {suffixText && (
                        <div className="flex items-center justify-center ml-2 text-muted text-sm">
                            {suffixText}
                        </div>
                    )}

                    {/* Password Toggle */}
                    {isPassword &&
            (showPassword ? (
                <EyeIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="w-5 h-5 cursor-pointer text-muted ml-2"
                />
            ) : (
                <EyeClosedIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="w-5 h-5 cursor-pointer text-muted ml-2"
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

NomasInput.displayName = "NomasInput"

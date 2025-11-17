import React, { useState } from "react"
import { twMerge } from "tailwind-merge"
import { Input } from "../shadcn"
import { EyeIcon, EyeClosedIcon } from "@phosphor-icons/react"
import { NomasWarningText } from "./NomasWarningText"
import { sanitizeNumericInput } from "@ciwallet-sdk/utils"

export enum NomasInvalidVariant {
    Danger = "danger",
    Warning = "warning",
}

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
  currency?: string
  postfixIcon?: React.ReactNode
  textAlign?: "left" | "center" | "right"
  containerClassName?: string
  invalidVariant?: NomasInvalidVariant
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
            currency,
            postfixIcon,
            textAlign = "left",
            invalidVariant = NomasInvalidVariant.Danger,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false)

        // Format value with currency if provided
        const displayValue = currency && value ? `${value} ${currency}` : value

        return (
            <div className={twMerge("flex flex-col gap-2 w-full", className)}>
                <div
                    className={twMerge(
                        "flex items-center",
                        "h-12",
                        "border bg-input border-border transition-colors",
                        "focus-within:ring-4 focus-within:ring-input-ring/50 duration-300 ease-out",
                        "rounded-input",
                        prefixIcon && "pl-3",
                        (isPassword || postfixIcon) && "pr-3",
                        isInvalid && invalidVariant === NomasInvalidVariant.Danger && "border-danger focus-within:ring-4 focus-within:ring-danger/50",
                        isInvalid && invalidVariant === NomasInvalidVariant.Warning && "border-warning focus-within:ring-4 focus-within:ring-warning/50"
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
                            "ring-0 focus-visible:ring-0 !border-none text-sm text-text flex-1",
                            textAlign === "center" && "text-center",
                            textAlign === "right" && "text-right"
                        )}
                        {...props}
                    />
                    {/* Postfix Icon */}
                    {postfixIcon && (
                        <div className="flex items-center justify-center text-text-muted text-sm">
                            {postfixIcon}
                        </div>
                    )}

                    {/* Password Toggle */}
                    {isPassword &&
            (showPassword ? (
                <EyeIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="w-5 h-5 cursor-pointer text-text-muted ml-2"
                />
            ) : (
                <EyeClosedIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="w-5 h-5 cursor-pointer text-text-muted ml-2"
                />
            ))}
                </div>
                {isInvalid && errorMessage && (
                    <NomasWarningText color={invalidVariant === NomasInvalidVariant.Warning ? "warning" : "danger"}>{errorMessage}</NomasWarningText>
                )}
            </div>
        )
    }
)

NomasInput.displayName = "NomasInput"

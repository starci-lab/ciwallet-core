import React, { useState } from "react"
import { twMerge } from "tailwind-merge"
import { Input } from "../shadcn"
import { EyeIcon, EyeClosedIcon } from "@phosphor-icons/react"
import { NomasWarningText } from "./NomasWarningText"

export interface NomasInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label?: string
  value?: string
  onValueChange?: (value: string) => void
  isInvalid?: boolean
  errorMessage?: string
  isRequired?: boolean
  isPassword?: boolean
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
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false)
        return (
            <div className="flex flex-col gap-2 w-full">
                <div className={
                    twMerge(
                        "flex items-center justify-between",
                        "h-12",
                        "border bg-input border-input transition-colors",
                        "radius-input pr-3",
                        isInvalid && "border-danger",
                        className
                    )}
                >
                    <Input
                        ref={ref}
                        value={value}
                        placeholder={label ?? placeholder}
                        onChange={(e) => onValueChange?.(e.target.value)}
                        onBlur={onBlur}
                        type={isPassword ? (showPassword ? "text" : "password") : "text"}
                        className={
                            twMerge(
                                "ring-0 focus-visible:ring-0 !border-none text-sm text-base",
                            )}
                        {...props}
                    />
                    {isPassword && (
                        showPassword ? (
                            <EyeIcon onClick={() => setShowPassword(!showPassword)} className="w-5 h-5 cursor-pointer text-muted" />
                        ) : (
                            <EyeClosedIcon onClick={() => setShowPassword(!showPassword)} className="w-5 h-5 cursor-pointer text-muted" />
                        )
                    )}
                </div>
                {isInvalid && errorMessage && (
                    <NomasWarningText>{errorMessage}</NomasWarningText>
                )}
            </div>
        )
    }
)

NomasInput.displayName = "NomasInput"
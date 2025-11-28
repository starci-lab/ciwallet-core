import React, { useEffect } from "react"
import { twMerge } from "tailwind-merge"

export interface NomasImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  radius?: "none" | "sm" | "md" | "lg" | "full"
  fallbackSrc?: string
}

export const NomasImage = React.forwardRef<HTMLImageElement, NomasImageProps>(
    ({ className, radius = "none", fallbackSrc, src, alt, ...props }, ref) => {
        const [imgSrc, setImgSrc] = React.useState(src)
        useEffect(() => {
            setImgSrc(src)
        }, [src])
        const handleError = () => {
            if (fallbackSrc) {
                setImgSrc(fallbackSrc)
            }
        }
        return (
            <img
                ref={ref}
                src={imgSrc}
                alt={alt ?? ""}
                onError={handleError}
                className={twMerge(
                    "object-cover w-8 h-8",
                    radius === "none" && "rounded-none",
                    radius === "sm" && "rounded-sm",
                    radius === "md" && "rounded-md",
                    radius === "lg" && "rounded-lg",
                    radius === "full" && "rounded-full",
                    className
                )}
                {...props}
            />
        )
    }
)

NomasImage.displayName = "NomasImage"
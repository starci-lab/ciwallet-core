import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { twMerge } from "tailwind-merge"
import { setDraggable, useAppDispatch } from "@/nomas/redux"

export interface NomasSliderProps {
    className?: string
    defaultValue?: number | Array<number>
    value?: number | Array<number>
    min?: number
    max?: number
    onValueChange?: (value: number | Array<number>) => void
}
export const NomasSlider = ({
    className,
    defaultValue,
    value,
    min = 0,
    max = 100,
    onValueChange,
    ...props
}: NomasSliderProps) => {
    const _values = React.useMemo(
        () =>
            Array.isArray(value)
                ? value
                : Array.isArray(defaultValue)
                    ? defaultValue
                    : [min, max],
        [value, defaultValue, min, max]
    )
    const dispatch = useAppDispatch()
    return (
        <SliderPrimitive.Root
            data-slot="slider"
            defaultValue={Array.isArray(defaultValue) ? defaultValue : [defaultValue || min, max]}
            value={Array.isArray(value) ? value : [value || min, max]}
            min={min}
            max={max}
            onPointerDownCapture={() => dispatch(setDraggable(false))}
            onPointerUpCapture={() => dispatch(setDraggable(true))}
            className={twMerge(
                "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
                className
            )}
            onValueChange={onValueChange}
            {...props}
        >
            <SliderPrimitive.Track
                data-slot="slider-track"
                className={twMerge(
                    "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
                )}
            >
                <SliderPrimitive.Range
                    data-slot="slider-range"
                    className={twMerge(
                        "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
                    )}
                />
            </SliderPrimitive.Track>
            {Array.from({ length: _values.length }, (_, index) => (
                <SliderPrimitive.Thumb
                    data-slot="slider-thumb"
                    key={index}
                    className={twMerge(
                        "block cursor-pointer size-5 shrink-0 rounded-full border bg-white shadow-sm transition-all duration-300 ease-out",
                        "hover:shadow-md active:scale-105",
                        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        "disabled:pointer-events-none disabled:opacity-50"
                    )}
                >
                </SliderPrimitive.Thumb>
            ))}
        </SliderPrimitive.Root>
    )
}

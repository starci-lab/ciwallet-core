import React, { useMemo } from "react"
import { Alphabet } from "@konfirm/alphabet"
import { NomasSpacer } from "../../extends"

export interface AlphabetItem<T> {
    letter: string
    item: T
    key: string
}

export interface AlphabetListProps<T> {
    items: Array<AlphabetItem<T>>
    renderItem: ({ item, letter }: AlphabetItem<T>) => React.ReactNode
    onFilter: (item: T) => boolean
    filterValue: string
    popularItems: Array<AlphabetItem<T>>
    popularTitle: string
}

export const AlphabetList = <T,>({
    items,
    renderItem,
    onFilter,
    filterValue,
    popularItems,
    popularTitle,
}: AlphabetListProps<T>) => {
    // Precompute filtered items
    const filteredItems = useMemo(
        () => items.filter((item) => onFilter(item.item)),
        [items, onFilter]
    )

    // Build alphabet letters
    const letters = useMemo(() => {
        const alphabet = new Alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
        return alphabet.characters.split("")
    }, [])

    // Render all items when a filter is applied
    const renderByFilterValue = () => (
        <div className="flex flex-col gap-4">
            {filteredItems.map((item) => (
                <React.Fragment key={item.key}>{renderItem(item)}</React.Fragment>
            ))}
        </div>
    )

    // Render items grouped by letter
    const renderLetter = (letter: string) => {
        const group = filteredItems.filter(
            (item) => item.letter.toUpperCase() === letter.toUpperCase()
        )
        if (group.length === 0) return null

        return (
            <div key={letter}>
                <div className="text-sm text-muted">{letter}</div>
                <NomasSpacer y={4} />
                <div className="flex flex-col gap-4">
                    {group.map((item) => (
                        <React.Fragment key={item.key}>{renderItem(item)}</React.Fragment>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Popular section */}
            {popularItems?.length > 0 && filterValue.length === 0 && (
                <div>
                    <div className="text-sm text-muted">{popularTitle}</div>
                    <NomasSpacer y={4} />
                    <div className="flex flex-col gap-4">
                        {popularItems.map((item) => (
                            <React.Fragment key={item.key}>{renderItem(item)}</React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {/* Filtered results */}
            {filterValue.length > 0
                ? renderByFilterValue()
                : letters.map((letter) => renderLetter(letter))}
        </div>
    )
}
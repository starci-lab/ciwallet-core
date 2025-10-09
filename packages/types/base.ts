export interface WithClassName {
    className?: string
}

export interface WithClassNames<T> extends WithClassName {
    classNames?: T

}
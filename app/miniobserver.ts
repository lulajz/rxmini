export interface MiniObserver {
    name(): string
    next(val?: any)
    error(val?: any)
    complete(val?: any)
}
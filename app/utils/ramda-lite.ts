export interface Array<T> {
  flat(): Array<T>
  flatMap(func: (x: T) => T): Array<T>
}

export const mergeAll = (ars: any[]) => ars.reduce((r, c) => Object.assign(r, c), {})
export const flatten = (ars: any[]) => ars.flat()

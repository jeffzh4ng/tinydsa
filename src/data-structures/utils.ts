/**
 * Function signature for checking equality
 */
export interface EqualsFunction<T> {
  (a: T, b: T): boolean
}

/**
 * Function signature for comparing
 * > 0 => a is larger than b
 * = 0 => a equals b
 * < 0 => a is smaller than b
 */
export interface CompareFunction<T> {
  (a: T, b: T): number
}

/**
 * Default function to test equality.
 * @function
 */
export const defaultEquals = <T>(a: T, b: T): boolean => {
  return a === b
}

export const VALUE_DOES_NOT_EXIST_ERROR = 'Value does not exist.'

/**
 * Default function to compare element order.
 * @function
 */
export function defaultCompare<T>(a: T, b: T): number {
  if (a < b) {
    return -1
  } else if (a === b) {
    return 0
  } else {
    return 1
  }
}

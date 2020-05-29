/**
 * Function signature for checking equality
 */
export interface EqualsFunction<T> {
  (a: T, b: T): boolean
}

/**
 * Default function to test equality.
 * @function
 */
export const defaultEquals = <T>(a: T, b: T): boolean => {
  return a === b
}

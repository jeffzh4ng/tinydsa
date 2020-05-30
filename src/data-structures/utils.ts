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

export const OUT_OF_BOUNDS_ERROR = 'Index is out of bounds.'
export const EMPTY_LIST_ERROR = 'Structure is empty.'
export const VALUE_DOES_NOT_EXIST_ERROR =
  'No element found with specified value.'

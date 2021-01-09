export type Item = number | string

/**
 * Iteratively search an array of sorted items for a target item and returns its index.
 *
 * Time complexity:
 *    - for an array of numbers: O(log(n)),
 *    - for an array of strings: O(m*log(n)),
 *    - where n is the number of array elements and m is the average string length.
 *
 * Space complexity: O(1)
 *
 * @param arr - Sorted array of numbers or strings to be searched
 * @param target - Number or string to be searched for
 * @return index of target in array (or -1 if target is not found)
 */
export const binarySearchIterative = (arr: Item[], target: Item): number => {
  let lo = 0
  let hi = arr.length - 1
  let mid
  while (lo <= hi) {
    mid = Math.floor((lo + hi) / 2)
    if (arr[mid] > target) {
      hi = mid - 1
    } else if (arr[mid] < target) {
      lo = mid + 1
    } else {
      return mid
    }
  }
  return -1
}

/**
 * Recursively search an array of sorted items for a target item and returns its index.
 *
 * Time complexity:
 *    - for an array of numbers: O(log(n)),
 *    - for an array of strings: O(m*log(n)),
 *    - where n is the number of array elements and m is the average string length.
 *
 * Space complexity: O(log(n))
 *
 * @param arr - Sorted array of numbers or strings to be searched
 * @param target - Number or string to be searched for
 * @return index of target in array (or -1 if target is not found)
 */
export const binarySearchRecursive = (arr: Item[], target: Item): number => {
  const search = (arr: Item[], target: Item, lo: number, hi: number): number => {
    if (lo > hi) return -1
    const mid = Math.floor((lo + hi) / 2)
    if (arr[mid] > target) {
      return search(arr, target, lo, mid - 1)
    } else if (arr[mid] < target) {
      return search(arr, target, mid + 1, hi)
    } else {
      return mid
    }
  }

  return search(arr, target, 0, arr.length - 1)
}

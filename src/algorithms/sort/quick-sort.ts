/**
 * Returns a random integer between min and max.
 * @param min - lower bound (returned int will be greater than or equal to min)
 * @param max - upper bound (returned int will be less than max)
 */
const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

/**
 * Swap elements at idx1 and idx2 in arr.
 * @param arr - array containing at least two elements to swap
 * @param idx1 - index of first element
 * @param idx2 - index of second element
 */
const swap = (arr: number[], idx1: number, idx2: number): void => {
  const temp = arr[idx2]
  arr[idx2] = arr[idx1]
  arr[idx1] = temp
}

/**
 * Partition subarray around a random pivot and return the final pivot position.
 * @param arr - array of numbers to be sorted
 * @param left - index of left bound of subarray
 * @param right - index of right bound of subarray
 */
const partition = (arr: number[], left: number, right: number): number => {
  const pivotIdx = getRandomInt(left, right + 1) // pick a random pivot
  const pivotVal = arr[pivotIdx]
  swap(arr, left, pivotIdx)

  // partition so that elements less than pivot value are grouped together on the left
  let i = left + 1
  for (let j = left + 1; j <= right; j++) {
    if (arr[j] < pivotVal) {
      swap(arr, i, j)
      i++
    }
  }
  swap(arr, left, i - 1)
  return i - 1 // return final position of pivot
}

/**
 * Sort an array of numbers in-place and in ascending order.
 * Partitioning is done by choosing a random element as the pivot.
 *
 * Time complexity: O(n*log(n)) on average, where n is the number of elements to sort
 *
 * Space complexity: O(log(n)) for recursion stack
 *
 * @param arr - array of numbers to be sorted
 * @param left - Optional: index of left bound
 * @param right - Optional: index of right bound
 */
const quickSort = (arr: number[], left = 0, right = arr.length - 1): void => {
  // check that indices are intergers
  if (!Number.isInteger(left) || !Number.isInteger(right)) {
    console.error('Index Error: Left and right indices must be integers.')
    return
  }

  // implement quick sort algorithm
  if (left >= right) return
  const pivot = partition(arr, left, right)
  quickSort(arr, left, pivot - 1)
  quickSort(arr, pivot + 1, right)
}

export default quickSort

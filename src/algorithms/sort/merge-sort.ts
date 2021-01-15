/**
 * Helper function to merge left half and right half of a subarray.
 * The sorted left half is arr[left : mid+1].
 * The sorted right half is arr[mid+1 : right+1].
 * Merging occurs in-place such that arr[left : right+1] will be sorted after function is executed.
 *
 * @param arr - array of numbers to be sorted
 * @param left - starting index of left half
 * @param mid - ending index of left half
 * @param right - ending index of right half
 */
const merge = (arr: number[], left: number, mid: number, right: number): void => {
  const leftArr = arr.slice(left, mid + 1) // copy of left half
  const rightArr = arr.slice(mid + 1, right + 1) // copy of right half
  let i = 0 // starting index of leftArr
  let j = 0 // starting index of rightArr
  let k = left // starting index of merged subarray (i.e. arr[left:right+1])
  while (i < leftArr.length && j < rightArr.length) {
    if (leftArr[i] < rightArr[j]) {
      arr[k] = leftArr[i]
      i++
    } else {
      arr[k] = rightArr[j]
      j++
    }
    k++
  }

  // if not all elements of leftArr have been traversed, copy the remaining elements
  while (i < leftArr.length) {
    arr[k] = leftArr[i]
    i++
    k++
  }

  // else if not all elements of rightArr have been traversed, copy remaining elements
  while (j < rightArr.length) {
    arr[k] = rightArr[j]
    j++
    k++
  }
}

/**
 * Sort an array of numbers in-place and in ascending order using top-down merge sort.
 * A subarray of arr can be sorted by specifying its left and right bounds.
 *
 * Time complexity: O(n*log(n)), where n is the number of elements to sort
 *
 * Space complexity: O(n)
 *
 * @param arr - array of numbers to sort
 * @param left - Optional: index of left bound
 * @param right - Optional: index of right bound
 */
const mergeSort = (arr: number[], left = 0, right = arr.length - 1): void => {
  // immediately return if array is empty
  if (arr.length === 0) return

  // check that indices are integers
  if (!Number.isInteger(left) || !Number.isInteger(right)) {
    console.error('Index Error: Left and right indices must be integers.')
    return
  }

  // implement merge sort algorithm
  if (left >= right) return
  const mid = Math.floor((left + right) / 2) // find middle index of current subarray
  mergeSort(arr, left, mid) // sort left half
  mergeSort(arr, mid + 1, right) // sort right half
  merge(arr, left, mid, right) // merge left and right halves
}

export default mergeSort

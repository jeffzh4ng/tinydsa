/**
 * Swap elements at idx1 and idx2 in arr.
 * @param arr - array containing two elements to swap
 * @param idx1 - index of first element
 * @param idx2 - index of second element
 */
const swap = (arr: number[], idx1: number, idx2: number): void => {
  const temp = arr[idx2]
  arr[idx2] = arr[idx1]
  arr[idx1] = temp
}

/**
 * Heapifies the heap or sub-heap, putting the largest element at rootIdx.
 * @param arr - array containing numbers to heapify
 * @param heapSize - size of heap
 * @param rootIdx - root of the heap or sub-heap to heapify
 */
const heapify = (arr: number[], heapSize: number, rootIdx: number): void => {
  let maxIdx = rootIdx // assume element at rootIdx is the largest
  const leftChild = 2 * rootIdx + 1
  const rightChild = 2 * rootIdx + 2

  // if left child is larger than element at maxIdx
  if (leftChild < heapSize && arr[leftChild] > arr[maxIdx]) {
    maxIdx = leftChild
  }

  // if right child is larger than element at maxIdx
  if (rightChild < heapSize && arr[rightChild] > arr[maxIdx]) {
    maxIdx = rightChild
  }

  // if maxIdx was changed
  if (maxIdx != rootIdx) {
    swap(arr, rootIdx, maxIdx)
    heapify(arr, heapSize, maxIdx) // heapify the affected subtree
  }
}

/**
 * Sort an array of numbers in-place and in ascending order using heap sort.
 *
 * Time complexity: O(n*log(n))
 *
 * Space complexity: O(log(n)) for recursion stack in heapify
 *
 * @param arr - array of numbers to sort
 */
const heapSort = (arr: number[]): void => {
  const heapSize = arr.length

  /**
   * Build max binary heap by rearranging array.
   *  - We want to heapify nodes with children, which are nodes at the second to last level of the heap.
   *  - The index of the last node on the second to last level is given by floor(heapSize/2) - 1.
   *  - To heapify the entire array, we start at the second to last level and work upwards.
   */
  const startIdx = Math.floor(heapSize / 2) - 1
  for (let i = startIdx; i >= 0; i--) {
    heapify(arr, heapSize, i)
  }

  for (let i = heapSize - 1; i > 0; i--) {
    swap(arr, 0, i) // remove largest element from heap and put it at the back of the array
    heapify(arr, i, 0) // new heap contains elements from 0 to i - 1, inclusive
  }
}

export default heapSort

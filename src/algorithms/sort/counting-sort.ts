/**
 * Sort an array of integers in-place and in ascending order using counting sort.
 *
 * Time complexity: O(n + k), where n is the number of elements in arr
 * and k is the range of numbers in arr.
 *
 * Space complexity: O(n + k)
 *
 * @param arr - array of integers to sort
 */
const countingSort = (arr: number[]): void => {
  if (arr.length == 0) {
    return
  }

  // check that arr elements are integers
  for (let idx = 0; idx < arr.length; idx++) {
    if (!Number.isInteger(arr[idx])) {
      console.error(`arr[${idx}] is not an integer`)
      return
    }
  }

  // implementation of counting sort below
  const max = Math.max(...arr) // find largest integer in arr
  const min = Math.min(...arr) // find smallest integer in arr
  const range = max - min + 1 // calculate range of possible numbers
  const counts: number[] = new Array(range).fill(0) // contains counts for each number in arr
  const sortedArr: number[] = new Array(arr.length) // final sorted array

  // get counts of each number in arr
  arr.forEach((num: number, idx: number) => {
    counts[num - min]++
  })

  // modify counts array such that each element is the sum of previous counts
  for (let i = 1; i < counts.length; i++) {
    counts[i] += counts[i - 1]
  }

  // fill in sortedArr using the indices stored in the counts array
  // traversing arr in reverse keeps the sort stable
  for (let i = arr.length - 1; i >= 0; i--) {
    const sortedIndex = counts[arr[i] - min] - 1
    counts[arr[i] - min]--
    sortedArr[sortedIndex] = arr[i]
  }

  // copy elements of sortedArr to input array
  for (let i = 0; i < arr.length; i++) {
    arr[i] = sortedArr[i]
  }
}

export default countingSort

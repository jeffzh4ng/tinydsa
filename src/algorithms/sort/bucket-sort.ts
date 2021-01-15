/**
 * Sort an array of positive numbers in-place and in ascending order using bucket sort.
 * Individual buckets are sorted using the JS sort function.
 * @param arr - array of positive numbers to sort
 * @param n - number of buckets
 */
const bucketSortPositives = (arr: number[], n: number): void => {
  // create empty buckets
  const buckets: number[][] = []
  for (let i = 0; i < n; i++) {
    buckets[i] = []
  }

  // put array elements in buckets
  const max = Math.max(...arr)
  arr.forEach((num: number) => {
    let bucketIdx = Math.floor((n * num) / max) // determine bucket index
    bucketIdx = bucketIdx >= n ? n - 1 : bucketIdx // ensure bucket index is a valid array index
    buckets[bucketIdx].push(num)
  })

  // sort each bucket and put sorted elements into arr
  let arrIdx = 0
  buckets.forEach((bucket: number[]) => {
    bucket.sort((a, b) => a - b)
    for (let bucketIdx = 0; bucketIdx < bucket.length; bucketIdx++) {
      arr[arrIdx] = bucket[bucketIdx]
      arrIdx++
    }
  })
}

/**
 * Sort an array of numbers in-place and in ascending order using bucket sort.
 *
 * Note that the traditional bucket sort algorithm does not work on negative numbers.
 * Thus, the below algorithm is modified such that any negative numbers in the array are converted
 * to positive numbers and sorted separately from the original positive numbers.
 *
 * Time complexity:
 *  - O(n + k) average
 *  - O(n^2) worst case
 *  - where n is the number of array elements and k is the number of buckets
 *
 * Space complexity: O(n*k)
 *
 * @param arr - array of numbers to sort
 * @param posBuckets - (Optional) number of buckets to use when sorting positive array elements
 * @param negBuckets - (Optional) number of buckets to use when sorting negative array elements
 */
const bucketSort = (arr: number[], posBuckets = arr.length, negBuckets = arr.length): void => {
  if (arr.length === 0) return

  // raise error if number of specified buckets is 0 or less
  if (posBuckets <= 0 || negBuckets <= 0) {
    console.error('Number of buckets must be greater than zero')
    return
  }

  // separate positive from negative numbers
  const positiveNums: number[] = []
  const negativeNums: number[] = []
  arr.forEach((num: number) => {
    if (num >= 0) {
      positiveNums.push(num)
    } else {
      negativeNums.push(-1 * num) // convert negative numbers to positive
    }
  })

  // sort both arrays
  bucketSortPositives(positiveNums, posBuckets)
  bucketSortPositives(negativeNums, negBuckets)

  // put sorted values back into input arr
  let arrIdx = 0
  for (let i = negativeNums.length - 1; i >= 0; i--) {
    arr[arrIdx] = -1 * negativeNums[i]
    arrIdx++
  }
  for (let i = 0; i < positiveNums.length; i++) {
    arr[arrIdx] = positiveNums[i]
    arrIdx++
  }
}

export default bucketSort

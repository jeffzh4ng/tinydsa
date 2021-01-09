/**
 * Binary search an array of sorted numbers for a target value
 * Time complexity: O(log(n))
 * Space complexity: O(1)
 * @param nums - array of sorted numbers to be searched
 * @param target - number to be searched for
 * @return index - position of target in nums array (or -1 if target is not found)
 */
const binarySearch = (nums: number[], target: number): number => {
  let lo = 0
  let hi = nums.length - 1
  let mid
  while (lo <= hi) {
    mid = Math.floor((lo + hi) / 2)
    if (nums[mid] > target) {
      hi = mid - 1
    } else if (nums[mid] < target) {
      lo = mid + 1
    } else {
      return mid
    }
  }
  return -1
}

export default binarySearch

const search = (nums: number[], target: number) => {
  // find index of smallest number
  const n = nums.length
  let l = 0,
    r = n - 1

  while (l < r) {
    const m = Math.floor((l + r) / 2)

    if (nums[m] > nums[r]) l = m + 1
    else r = m
  }

  // rotations = index of smallest number
  const rotations = l
  l = 0
  r = n - 1

  // perform regular binary search where realMid = (mid+rotations) % n
  while (l <= r) {
    const m = Math.floor((l + r) / 2)
    const realMid = (m + rotations) % n

    if (nums[realMid] === target) return realMid
    else if (nums[realMid] < target) l = m + 1
    else r = m - 1
  }

  return -1
}

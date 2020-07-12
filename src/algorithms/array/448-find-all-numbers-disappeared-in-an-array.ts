const findDisappearedNumbers = (nums: number[]) => {
  for (const n of nums) {
    const i = Math.abs(n) - 1

    if (nums[i] > 0) nums[i] = -nums[i]
  }

  const output = []

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) output.push(i + 1)
  }

  return output
}

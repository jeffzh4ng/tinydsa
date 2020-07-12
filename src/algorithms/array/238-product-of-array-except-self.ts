const productExceptSelf = (nums: number[]) => {
  if (nums.length === 0) return []

  const L = new Array<number>(nums.length).fill(1)

  for (let i = 1; i < nums.length; i++) {
    L[i] = nums[i - 1] * L[i - 1]
  }

  let R = 1

  for (let i = L.length - 1; i >= 0; i--) {
    L[i] *= R
    R *= nums[i]
  }

  return L
}

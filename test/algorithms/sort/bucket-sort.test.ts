import bucketSort from '../../../src/algorithms/sort/bucket-sort'
import testCases from './test-cases'

describe('bucketSort', () => {
  console.error = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  for (const [description, inputArray] of Object.entries(testCases)) {
    it(`correctly sorts ${description}`, () => {
      const soln = [...inputArray]
      soln.sort((a, b) => a - b) // sort the copy inplace using native JS function
      bucketSort(inputArray) //sort the original inplace using bucketSort
      expect(inputArray).toEqual(soln)
    })
  }

  it('correctly sorts when only posBuckets is specified', () => {
    const array = [5, 3, 4, 1, 2]
    const soln = [...array].sort((a, b) => a - b)
    bucketSort(array, 1)
    expect(array).toEqual(soln)
  })

  it('correctly sorts when only negBuckets is specified', () => {
    const array = [-5, -3, -4, -1, -2]
    const soln = [...array].sort((a, b) => a - b)
    bucketSort(array, undefined, 1)
    expect(array).toEqual(soln)
  })

  it('correctly sorts when both posBuckets and negBuckets are specified', () => {
    const array = [-5, -3, 7, -4, -1, -2, 9, 0]
    const soln = [...array].sort((a, b) => a - b)
    bucketSort(array, 5, 3)
    expect(array).toEqual(soln)
  })

  it('raises error when number of specified buckets <= 0', () => {
    const array = [1, 2, 3]
    bucketSort(array, 0, 1)
    expect(console.error).toHaveBeenCalledTimes(1)
  })
})

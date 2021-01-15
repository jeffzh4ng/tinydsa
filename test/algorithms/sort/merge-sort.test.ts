import mergeSort from '../../../src/algorithms/sort/merge-sort'
import testCases from './test-cases'

describe('mergeSort', () => {
  for (const [description, inputArray] of Object.entries(testCases)) {
    it(`correctly sorts ${description}`, () => {
      const soln = [...inputArray]
      soln.sort((a, b) => a - b) // sort the copy inplace using native JS function
      mergeSort(inputArray) //sort the original inplace using mergeSort
      expect(inputArray).toEqual(soln)
    })
  }

  it('correctly sorts a subarray', () => {
    const array = [100, 39, -4, 11, 5, -87, -2, 6, 0, 7]
    const soln1 = [100, 39, -87, -4, -2, 0, 5, 6, 7, 11]
    const soln2 = [39, 100, -87, -4, -2, 0, 5, 6, 7, 11]
    mergeSort(array, 2)
    expect(array).toEqual(soln1)
    mergeSort(array, undefined, 1)
    expect(array).toEqual(soln2)
  })

  describe('index error', () => {
    console.error = jest.fn()
    const array = [1, 2, 3]

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('is raised when left or right indices are not integers', () => {
      mergeSort(array, 0.1, 2)
      mergeSort(array, 0, 1.1)
      expect(console.error).toHaveBeenCalledTimes(2)
    })
  })
})

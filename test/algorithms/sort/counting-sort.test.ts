import countingSort from '../../../src/algorithms/sort/counting-sort'
import testCases from './test-cases'

describe('countingSort', () => {
  console.error = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  for (const [description, inputArray] of Object.entries(testCases)) {
    if (description === 'array of floats') {
      it(`raises error for ${description}`, () => {
        countingSort(inputArray)
        expect(console.error).toHaveBeenCalledTimes(1)
      })
      continue
    }

    it(`correctly sorts ${description}`, () => {
      const soln = [...inputArray]
      soln.sort((a, b) => a - b) // sort the copy in-place using native JS function
      countingSort(inputArray)
      expect(inputArray).toEqual(soln)
    })
  }
})

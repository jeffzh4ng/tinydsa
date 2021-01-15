import heapSort from '../../../src/algorithms/sort/heap-sort'
import testCases from './test-cases'

describe('heapSort', () => {
  for (const [description, inputArray] of Object.entries(testCases)) {
    it(`correctly sorts ${description}`, () => {
      const soln = [...inputArray]
      soln.sort((a, b) => a - b) // sort the copy inplace using native JS function
      heapSort(inputArray) //sort the original inplace
      expect(inputArray).toEqual(soln)
    })
  }
})

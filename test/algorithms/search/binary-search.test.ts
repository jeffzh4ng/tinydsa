import binarySearch from '../../../src/algorithms/search/binary-search'

describe('binarySearch', () => {
  it('does not find target in an empty array', () => {
    const array: number[] = []
    expect(binarySearch(array, 1)).toBe(-1)
  })

  describe('array with odd number of elements', () => {
    const array: number[] = [2, 5, 8.1, 9, 30.234, 42, 121]

    it('does not find target', () => {
      expect(binarySearch(array, 1)).toBe(-1) // nonexistent target less than min element
      expect(binarySearch(array, 121.2)).toBe(-1) // nonexistent target greater than max element
      expect(binarySearch(array, 5.1)).toBe(-1) // nonexistent target between min and max elements
    })

    it('finds target when it exists in array', () => {
      expect(binarySearch(array, 5)).toBe(1)
    })
  })

  describe('array with even number of elements', () => {
    const array: number[] = [2, 5, 8.1, 30.234, 42, 121]

    it('finds target when it exists in array', () => {
      expect(binarySearch(array, 30.234)).toBe(3)
    })
  })
})

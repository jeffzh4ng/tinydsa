import {
  binarySearchIterative,
  binarySearchRecursive,
  Item,
} from '../../../src/algorithms/search/binary-search'

describe('binarySearch', () => {
  type BinarySearch = (arr: Item[], target: Item) => number

  const runTest = (binarySearch: BinarySearch) => {
    it('does not find target in an empty array', () => {
      const array: number[] = []
      expect(binarySearch(array, 1)).toBe(-1)
    })

    describe('array with odd number of elements', () => {
      const arrayNums: number[] = [2, 5, 8.1, 9, 30.234, 42, 121]

      it('does not find target', () => {
        expect(binarySearch(arrayNums, 1)).toBe(-1) // nonexistent target less than min element
        expect(binarySearch(arrayNums, 121.2)).toBe(-1) // nonexistent target greater than max element
        expect(binarySearch(arrayNums, 5.1)).toBe(-1) // nonexistent target between min and max elements
      })

      it('finds target when it exists in array', () => {
        expect(binarySearch(arrayNums, 5)).toBe(1)
      })
    })

    describe('array with even number of elements', () => {
      const arrayNums: number[] = [2, 5, 8.1, 30.234, 42, 121]

      it('finds target when it exists in array', () => {
        expect(binarySearch(arrayNums, 30.234)).toBe(3)
      })
    })

    describe('array of strings', () => {
      const arrayStrs: string[] = [
        'reappear',
        'rearrange',
        'redo',
        'regroup',
        'remake',
        'replay',
        'rewrite',
      ]

      it('finds word when it exists in array', () => {
        expect(binarySearch(arrayStrs, 'replay')).toBe(5)
      })

      it('does not find word when it is not in array', () => {
        expect(binarySearch(arrayStrs, '')).toBe(-1)
        expect(binarySearch(arrayStrs, 'rewrote')).toBe(-1)
        expect(binarySearch(arrayStrs, 'rearranged')).toBe(-1)
      })
    })
  }

  describe('iterative method', () => runTest(binarySearchIterative))
  describe('recursive method', () => runTest(binarySearchRecursive))
})

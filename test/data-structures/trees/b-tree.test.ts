import BTree from '../../../src/data-structures/trees/b-tree/b-tree'

describe('AVL Tree', () => {
  let tree: BTree<number>

  beforeEach(() => {
    tree = new BTree(2)
  })

  describe('inspection', () => {
    it('isEmpty()', () => {
      expect(tree.size()).toBe(0)
      expect(tree.isEmpty()).toBe(true)
      expect(tree.height()).toBe(0)
    })
  })

  describe('search', () => {
    it('find()', () => {
      tree.insert(10)
      tree.insert(5)
      tree.insert(2)

      // 2, 5, 10

      if (tree.root === null) throw new Error()
      tree.insert(18)

      // 2, 5, 10          5           5
      //           ->   2   10  ->   2  10, 18

      if (!tree.root.children) throw new Error()
      tree.insert(17)
      //    5
      // 2     10, 17, 18

      tree.insert(3)
      tree.insert(4)

      //          5
      // 2, 3, 4    10, 17, 18

      tree.insert(15)

      //          5                                                                5,   17
      // 2, 3, 4    10, 17, 18    -->  split bc [10, 17, 18] is full -->   2, 3, 4   10,   18

      // then insert 15

      //         5,     17
      // 2, 3, 4   10,15   18

      tree.insert(12)

      //         5,         17
      // 2, 3, 4   10,12,15   18

      //         5,         17
      // 2, 3, 4   10,12,15   18

      tree.insert(13)

      //         5,         17                  5,   12,       17
      // 2, 3, 4   10,12,15   18     -> 2, 3, 4   10,   13,15   18

      tree.insert(1)

      //                                                   12                                 12
      //         5,   12,       17                  5,             17                 3,5,           17
      //   2 3 4   10   13,15   18   ->      2 3 4   10     13,15   18     -->  1,2    4  10   13,15   18

      expect(tree.find(12)).toEqual([tree.root, 0])
      expect(tree.find(5)).toEqual([tree.root.children[0], 1])
      expect(tree.find(4)).toEqual([tree.root.children[0].children[1], 0])
      expect(tree.find(6)).toEqual(null)
    })
  })

  describe('insertion', () => {
    it('insert()', () => {
      tree.insert(10)
      tree.insert(5)
      tree.insert(2)

      // 2, 5, 10

      if (tree.root === null) throw new Error()
      expect(tree.root.values).toEqual([2, 5, 10])

      tree.insert(18)

      // 2, 5, 10          5           5
      //           ->   2   10  ->   2  10, 18

      expect(tree.root.values).toEqual([5])

      if (!tree.root.children) throw new Error()
      expect(tree.root.children[0].values).toEqual([2])
      expect(tree.root.children[1].values).toEqual([10, 18])

      tree.insert(17)
      //    5
      // 2     10, 17, 18

      expect(tree.root.values).toEqual([5])
      expect(tree.root.children[0].values).toEqual([2])
      expect(tree.root.children[1].values).toEqual([10, 17, 18])

      tree.insert(3)
      tree.insert(4)

      //          5
      // 2, 3, 4    10, 17, 18

      expect(tree.root.values).toEqual([5])
      expect(tree.root.children[0].values).toEqual([2, 3, 4])
      expect(tree.root.children[1].values).toEqual([10, 17, 18])

      tree.insert(15)

      //          5                                                                5,   17
      // 2, 3, 4    10, 17, 18    -->  split bc [10, 17, 18] is full -->   2, 3, 4   10,   18

      // then insert 15

      //         5,     17
      // 2, 3, 4   10,15   18

      expect(tree.root.values).toEqual([5, 17])
      expect(tree.root.children[0].values).toEqual([2, 3, 4])
      expect(tree.root.children[1].values).toEqual([10, 15])
      expect(tree.root.children[2].values).toEqual([18])

      tree.insert(12)

      //         5,         17
      // 2, 3, 4   10,12,15   18

      expect(tree.root.values).toEqual([5, 17])
      expect(tree.root.children[0].values).toEqual([2, 3, 4])
      expect(tree.root.children[1].values).toEqual([10, 12, 15])
      expect(tree.root.children[2].values).toEqual([18])

      //         5,         17
      // 2, 3, 4   10,12,15   18

      tree.insert(13)

      //         5,         17                  5,   12,       17
      // 2, 3, 4   10,12,15   18     -> 2, 3, 4   10,   13,15   18

      expect(tree.root.values).toEqual([5, 12, 17])
      expect(tree.root.children[0].values).toEqual([2, 3, 4])
      expect(tree.root.children[1].values).toEqual([10])
      expect(tree.root.children[2].values).toEqual([13, 15])
      expect(tree.root.children[3].values).toEqual([18])

      tree.insert(1)

      //                                                   12                                 12
      //         5,   12,       17                  5,             17                 3,5,           17
      //   2 3 4   10   13,15   18   ->      2 3 4   10     13,15   18     -->  1,2    4  10   13,15   18
      expect(tree.root.values).toEqual([12])
      expect(tree.root.children[0].values).toEqual([3, 5])
      expect(tree.root.children[1].values).toEqual([17])

      expect(tree.root.children[0].children[0].values).toEqual([1, 2])
      expect(tree.root.children[0].children[1].values).toEqual([4])
      expect(tree.root.children[0].children[2].values).toEqual([10])

      expect(tree.root.children[1].children[0].values).toEqual([13, 15])
      expect(tree.root.children[1].children[1].values).toEqual([18])
    })
  })

  describe('deletion', () => {
    it('remove()', () => {
      tree.insert(10)
      tree.insert(5)
      tree.insert(2)

      // 2, 5, 10

      if (tree.root === null) throw new Error()
      tree.insert(18)

      // 2, 5, 10          5           5
      //           ->   2   10  ->   2  10, 18

      if (!tree.root.children) throw new Error()
      tree.insert(17)
      //    5
      // 2     10, 17, 18

      tree.insert(3)
      tree.insert(4)

      //          5
      // 2, 3, 4    10, 17, 18

      tree.insert(15)

      //          5                                                                5,   17
      // 2, 3, 4    10, 17, 18    -->  split bc [10, 17, 18] is full -->   2, 3, 4   10,   18

      // then insert 15

      //         5,     17
      // 2, 3, 4   10,15   18

      tree.insert(12)

      //         5,         17
      // 2, 3, 4   10,12,15   18

      //         5,         17
      // 2, 3, 4   10,12,15   18

      tree.insert(13)

      //         5,         17                  5,   12,       17
      // 2, 3, 4   10,12,15   18     -> 2, 3, 4   10,   13,15   18

      tree.insert(1)

      //                                                   12                                 12
      //         5,   12,       17                  5,             17                 3,5,           17
      //   2 3 4   10   13,15   18   ->      2 3 4   10     13,15   18     -->  1,2    4  10   13,15   18

      tree.insert(6)
      tree.insert(7)

      expect(tree.root.children[0].children[2].values).toEqual([6, 7, 10])
      //                  12
      //        3, 5              17
      //   1,2   4  6,7,10   13,15   18

      tree.remove(7)

      //                  12
      //        3--5               17
      //   1,2   4   6,10   13,15   18

      expect(tree.root.children[0].children[2].values).toEqual([6, 10])
    })
  })
})

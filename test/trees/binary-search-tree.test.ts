import BinarySearchTree from '../../src/data-structures/trees/binary-search-tree'
import TreeNode from '../../src/data-structures/trees/tree-node'

describe('Binary Search Tree', () => {
  let tree: BinarySearchTree<number>

  beforeEach(() => {
    tree = new BinarySearchTree()
  })

  describe('Inspection', () => {
    it('size()', () => {
      expect(tree.size()).toBe(0)
    })

    it('isEmpty()', () => {
      expect(tree.isEmpty()).toBe(true)
      tree.insert(8)
      expect(tree.isEmpty()).toBe(false)
    })

    it('height()', () => {
      // Tree should look like:
      //        10
      //      5  15
      //    2   12 21
      //  1

      // No tree
      expect(tree.height()).toBe(0)

      // Layer One
      tree.insert(10)
      expect(tree.height()).toBe(1)

      // Layer Two
      tree.insert(5)
      expect(tree.height()).toBe(2)
      tree.insert(15)
      expect(tree.height()).toBe(2)

      // Layer Three
      tree.insert(2)
      expect(tree.height()).toBe(3)
      tree.insert(12)
      expect(tree.height()).toBe(3)
      tree.insert(21)
      expect(tree.height()).toBe(3)

      // Layer 4
      tree.insert(1)
      expect(tree.height()).toBe(4)
    })
  })

  describe('Searching', () => {
    const treeB = new BinarySearchTree<number>()

    const a = new TreeNode(5, null)
    const b = new TreeNode(4, a)
    const c = new TreeNode(3, b)
    const d = new TreeNode(2, c)
    const e = new TreeNode(1, d)

    const f = new TreeNode(6, a)
    const g = new TreeNode(7, f)
    const h = new TreeNode(8, g)

    a.left = b
    b.left = c
    c.left = d
    d.left = e

    a.right = f
    f.right = g
    g.right = h

    treeB.root = a

    it('find()', () => {
      expect(treeB.find(5)).toBe(a)
      expect(treeB.find(4)).toBe(b)
      expect(treeB.find(3)).toBe(c)
      expect(treeB.find(2)).toBe(d)
      expect(treeB.find(1)).toBe(e)
      expect(treeB.find(6)).toBe(f)
      expect(treeB.find(7)).toBe(g)
      expect(treeB.find(8)).toBe(h)
    })

    it('findMin()', () => {
      expect(treeB.findMin()).toBe(e)
    })

    it('findMax()', () => {
      expect(treeB.findMax()).toBe(h)
    })

    it('findSucessor()', () => {
      expect(treeB.findSucessor(a)).toBe(f)
      expect(treeB.findSucessor(e)).toBe(d)
      expect(treeB.findSucessor(f)).toBe(g)

      const treeC = new BinarySearchTree<number>()

      const m = new TreeNode(5, null)
      const n = new TreeNode(3, m)
      const o = new TreeNode(2, n)
      const p = new TreeNode(1, o)
      const q = new TreeNode(4, n)

      m.left = n
      n.left = o
      o.left = p

      n.right = q

      treeC.root = m

      expect(treeC.findSucessor(q)).toBe(m)
    })

    it('findPredecessor()', () => {
      expect(treeB.findPredecessor(a)).toBe(b)
      expect(treeB.findPredecessor(e)).toBe(null)
      expect(treeB.findPredecessor(f)).toBe(a)
    })
  })

  describe('Insertion/Deletion', () => {
    it('insert()', () => {
      tree.insert(5)
      expect(tree.size()).toBe(1)

      tree.insert(3)
      expect(tree.size()).toBe(2)

      tree.insert(2)
      expect(tree.size()).toBe(3)

      tree.insert(6)
      expect(tree.size()).toBe(4)

      tree.insert(9)
      expect(tree.size()).toBe(5)

      tree.insert(4)
      expect(tree.size()).toBe(6)
    })

    it('remove()', () => {
      tree.remove(tree.insert(3))
      expect(tree.size()).toBe(0)
      expect(tree.find(3)).toBe(null)

      tree.insert(5)
      tree.insert(8)
      tree.remove(tree.insert(3))
      expect(tree.size()).toBe(2)
      expect(tree.find(3)).toBe(null)
    })

    it('remove() node with left child', () => {
      const a = new TreeNode(5, null)
      const b = new TreeNode(3, null)

      a.left = b
      tree.root = a

      tree.remove(a)

      expect(tree.find(5)).toBe(null)
    })

    it('remove() node with two children', () => {
      const a = new TreeNode(5, null)
      const b = new TreeNode(3, null)
      const c = new TreeNode(8, null)

      a.left = b
      a.right = c

      tree.root = a

      tree.remove(a)

      expect(tree.find(5)).toBe(null)
    })

    it('remove() node with two children and successor is not immediate right child', () => {
      const a = new TreeNode(5, null)
      const b = new TreeNode(3, null)
      const c = new TreeNode(8, null)
      const d = new TreeNode(7, null)

      a.left = b
      a.right = c

      c.left = d

      tree.root = a

      tree.remove(a)

      expect(tree.find(5)).toBe(null)
    })
  })

  describe('Traversals', () => {
    const treeB = new BinarySearchTree<number>()

    const a = new TreeNode(5, null)
    const b = new TreeNode(4, a)
    const c = new TreeNode(3, b)
    const d = new TreeNode(2, c)
    const e = new TreeNode(1, d)

    const f = new TreeNode(6, a)
    const g = new TreeNode(7, f)
    const h = new TreeNode(8, g)

    a.left = b
    b.left = c
    c.left = d
    d.left = e

    a.right = f
    f.right = g
    g.right = h

    treeB.root = a

    it('inorder()', () => {
      for (const _ of tree.inorderTraversal()) {
        throw new Error()
      }

      const inorderNumbers = [1, 2, 3, 4, 5, 6, 7, 8]
      let i = 0

      for (const n of treeB.inorderTraversal()) {
        expect(n).toBe(inorderNumbers[i])
        i += 1
      }
    })

    it('preorder()', () => {
      for (const _ of tree.preorderTraversal()) {
        throw new Error()
      }

      // Tree should look like:
      //        10
      //      5  15
      //    2   12 21
      //  1

      // Layer One
      tree.insert(10)

      // Layer Two
      tree.insert(5)
      tree.insert(15)

      // Layer Three
      tree.insert(2)
      tree.insert(12)
      tree.insert(21)

      // Layer 4
      tree.insert(1)

      const preorderNumbers = [10, 5, 2, 1, 15, 12, 21]
      let i = 0

      for (const n of tree.preorderTraversal()) {
        expect(n).toBe(preorderNumbers[i])
        i += 1
      }
    })

    it('postorder()', () => {
      for (const _ of tree.postorderTraversal()) {
        throw new Error()
      }

      // Tree should look like:
      //        10
      //      5  15
      //    2   12 21
      //  1

      // Layer One
      tree.insert(10)

      // Layer Two
      tree.insert(5)
      tree.insert(15)

      // Layer Three
      tree.insert(2)
      tree.insert(12)
      tree.insert(21)

      // Layer 4
      tree.insert(1)

      const postorderNumbers = [1, 2, 5, 12, 21, 15, 10]
      let i = 0

      for (const n of tree.postorderTraversal()) {
        expect(n).toBe(postorderNumbers[i])
        i += 1
      }
    })
  })
})

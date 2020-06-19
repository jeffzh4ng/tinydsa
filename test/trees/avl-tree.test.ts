import AVLTree from '../../src/data-structures/trees/avl-tree'
import AVLTreeNode from '../../src/data-structures/trees/avl-tree-node'

describe('AVL Tree', () => {
  let tree: AVLTree<number>

  beforeEach(() => {
    tree = new AVLTree()
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
      tree.insert(7)
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
    const treeB = new AVLTree<number>()

    const a = new AVLTreeNode(5, null)
    const b = new AVLTreeNode(4, a)
    const c = new AVLTreeNode(3, b)
    const d = new AVLTreeNode(2, c)
    const e = new AVLTreeNode(1, d)

    const f = new AVLTreeNode(6, a)
    const g = new AVLTreeNode(7, f)
    const h = new AVLTreeNode(8, g)

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

      const treeC = new AVLTree<number>()

      const m = new AVLTreeNode(5, null)
      const n = new AVLTreeNode(3, m)
      const o = new AVLTreeNode(2, n)
      const p = new AVLTreeNode(1, o)
      const q = new AVLTreeNode(4, n)

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
    describe('rotations after insertion', () => {
      describe('left heavy', () => {
        it('left left simple case', () => {
          //    5        3
          //   3    ->  1 5
          //  1
          tree.insert(5)
          expect(tree.height()).toBe(1)

          tree.insert(3)
          expect(tree.height()).toBe(2)

          tree.insert(1)
          expect(tree.height()).toBe(2)

          const three = tree.find(3)
          const one = tree.find(1)
          const five = tree.find(5)

          if (!three || !one || !five) throw new Error()

          expect(three.balanceFactor).toBe(0)
          expect(three.height).toBe(2)

          expect(one.balanceFactor).toBe(0)
          expect(one.height).toBe(1)

          expect(five.balanceFactor).toBe(0)
          expect(five.height).toBe(1)
        })

        it('left left advanced case', () => {
          // Before:
          //        10
          //      5   15
          //    4  8 12 21
          //  2
          // 1

          // After:
          //        10
          //      5   15
          //    2  8 12 21
          //  1  4

          // Layer One
          tree.insert(10)
          expect(tree.height()).toBe(1)

          // Layer Two
          tree.insert(5)
          tree.insert(15)
          expect(tree.height()).toBe(2)

          // Layer Three
          tree.insert(4)
          tree.insert(8)
          tree.insert(12)
          tree.insert(21)
          expect(tree.height()).toBe(3)

          // Layer 4
          tree.insert(2)
          expect(tree.height()).toBe(4)
          tree.insert(1)
          expect(tree.height()).toBe(4)

          const two = tree.find(2)
          const one = tree.find(1)
          const four = tree.find(4)

          if (!two || !one || !four) throw new Error()

          expect(two.balanceFactor).toBe(0)
          expect(two.height).toBe(2)

          expect(one.balanceFactor).toBe(0)
          expect(one.height).toBe(1)

          expect(four.balanceFactor).toBe(0)
          expect(four.height).toBe(1)
        })

        it('left right case', () => {
          //    5        5       4
          //   3    ->  4   ->  3 5
          //    4      3

          tree.insert(5)
          expect(tree.height()).toBe(1)

          tree.insert(3)
          expect(tree.height()).toBe(2)

          tree.insert(4)
          expect(tree.height()).toBe(2)

          const four = tree.find(4)
          const three = tree.find(3)
          const five = tree.find(5)

          if (!three || !four || !five) throw new Error()

          expect(four.balanceFactor).toBe(0)
          expect(four.height).toBe(2)

          expect(three.balanceFactor).toBe(0)
          expect(three.height).toBe(1)

          expect(five.balanceFactor).toBe(0)
          expect(five.height).toBe(1)
        })

        describe('right heavy', () => {
          it('right right case', () => {
            //    5           7
            //     7    ->   5 8
            //      8
            tree.insert(5)
            expect(tree.height()).toBe(1)

            tree.insert(7)
            expect(tree.height()).toBe(2)

            tree.insert(8)
            expect(tree.height()).toBe(2)

            const seven = tree.find(7)
            const five = tree.find(8)
            const eight = tree.find(5)

            if (!seven || !five || !eight) throw new Error()

            expect(seven.balanceFactor).toBe(0)
            expect(seven.height).toBe(2)

            expect(five.balanceFactor).toBe(0)
            expect(five.height).toBe(1)

            expect(eight.balanceFactor).toBe(0)
            expect(eight.height).toBe(1)
          })

          it('right left case', () => {
            //    5           5            6
            //     7    ->     6     ->   5 7
            //    6             7
            tree.insert(5)
            expect(tree.height()).toBe(1)

            tree.insert(7)
            expect(tree.height()).toBe(2)

            tree.insert(6)
            expect(tree.height()).toBe(2)

            const six = tree.find(6)
            const five = tree.find(5)
            const seven = tree.find(7)

            if (!six || !five || !seven) throw new Error()

            expect(six.balanceFactor).toBe(0)
            expect(six.height).toBe(2)

            expect(five.balanceFactor).toBe(0)
            expect(five.height).toBe(1)

            expect(seven.balanceFactor).toBe(0)
            expect(seven.height).toBe(1)
          })
        })
      })
    })

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

    describe('removal', () => {
      beforeEach(() => {
        // Before:
        //        10
        //      5   15
        //    4  8 12 21
        //  2
        // 1

        // After:
        //        10
        //      5   15
        //    2  8 12 21
        //  1  4

        // Layer One
        tree.insert(10)

        // Layer Two
        tree.insert(5)
        tree.insert(15)

        // Layer Three
        tree.insert(4)
        tree.insert(8)
        tree.insert(12)
        tree.insert(21)

        // Layer 4
        tree.insert(2)
        tree.insert(1)
      })

      it('removes node with no children', () => {
        const four = tree.find(4)
        const two = tree.find(2)

        if (!four || !two) throw new Error()

        expect(two.balanceFactor).toBe(0)
        tree.remove(four)

        expect(tree.find(4)).toBe(null)
        expect(two.right).toBe(null)
        expect(two.balanceFactor).toBe(1)
      })

      it('removes node with 1 left child', () => {
        const four = tree.find(4)
        const two = tree.find(2)

        if (!four || !two) throw new Error()

        expect(two.balanceFactor).toBe(0)
        tree.remove(four)

        expect(tree.find(4)).toBe(null)
        expect(two.right).toBe(null)
        expect(two.balanceFactor).toBe(1)

        // new part
        tree.remove(two)

        expect(tree.find(2)).toBe(null)

        const one = tree.find(1)
        if (!one) throw new Error()

        expect(one.balanceFactor).toBe(0)
      })

      it('removes node with two children', () => {
        // Before:
        //        10
        //      5   15
        //    4  8 12 21
        //  2
        // 1

        // After:
        //        10
        //      5   15
        //    2  8 12 21
        //  1 4 6

        // Layer One
        tree.insert(10)

        // Layer Two
        tree.insert(5)
        tree.insert(15)

        // Layer Three
        tree.insert(4)
        tree.insert(8)
        tree.insert(12)
        tree.insert(21)

        // Layer 4
        tree.insert(2)
        tree.insert(1)
        tree.insert(6)

        const five = tree.find(5)
        if (!five) throw new Error()

        //        10
        //      XX   15
        //    2  8 12 21
        //  1 4 6

        //        10
        //      6   15
        //    2  8 12 21
        //  1 4

        tree.remove(five)
        expect(tree.find(5)).toBe(null)

        const six = tree.find(6)
        if (!six || !six.right) throw new Error()
        expect(six.right.value).toBe(8)
      })
    })
  })

  describe('Traversals', () => {
    const treeB = new AVLTree<number>()

    const a = new AVLTreeNode(5, null)
    const b = new AVLTreeNode(4, a)
    const c = new AVLTreeNode(3, b)
    const d = new AVLTreeNode(2, c)
    const e = new AVLTreeNode(1, d)

    const f = new AVLTreeNode(6, a)
    const g = new AVLTreeNode(7, f)
    const h = new AVLTreeNode(8, g)

    a.left = b
    b.left = c
    c.left = d
    d.left = e

    a.right = f
    f.right = g
    g.right = h

    treeB.root = a

    it('inorder()', () => {
      const inorderNumbers = [1, 2, 3, 4, 5, 6, 7, 8]
      let i = 0

      for (const n of treeB.inorderTraversal()) {
        expect(n).toBe(inorderNumbers[i])
        i += 1
      }
    })

    it('preorder()', () => {
      // Tree should look like:
      //        10
      //      5  15
      //    2 7  12 21
      //

      // Layer One
      tree.insert(10)

      // Layer Two
      tree.insert(5)
      tree.insert(15)

      // Layer Three
      tree.insert(2)
      tree.insert(7)
      tree.insert(12)
      tree.insert(21)

      const preorderNumbers = [10, 5, 2, 7, 15, 12, 21]
      let i = 0

      for (const n of tree.preorderTraversal()) {
        expect(n).toBe(preorderNumbers[i])
        i += 1
      }
    })

    it('postorder()', () => {
      // Tree should look like:
      //        10
      //      5  15
      //    2 7  12 21

      // Layer One
      tree.insert(10)

      // Layer Two
      tree.insert(5)
      tree.insert(15)

      // Layer Three
      tree.insert(2)
      tree.insert(7)
      tree.insert(12)
      tree.insert(21)

      const postorderNumbers = [2, 7, 5, 12, 21, 15, 10]
      let i = 0

      for (const n of tree.postorderTraversal()) {
        expect(n).toBe(postorderNumbers[i])
        i += 1
      }
    })
  })
})

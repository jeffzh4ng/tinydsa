import RBTreeNode from './red-black-tree-node'
import Stack from '../../sequences/stack'
import * as utils from '../../utils'

/***************************************************************************************************
* A red-black tree is a binary tree that satisfies the red-black properties:

* 1. Every node is either red or black
* 2. The root is black
* 3. Every leaf (null) is black
* 4. If a node is red, both it's children are black
* 5. For all ndoes, all paths from the node to descendant leaves contain the same number of black nodes

* You might be wondering how did anyone come up with all these rules?

* Red-black trees are really just isometries of 2-3-4 trees. If you lift up the red nodes into their
* parents, the red-black tree becomes a 2-3-4 tree - a B-tree with branching factor 2.

* The complex rules of red-black trees make perfect sense if you connect it back to 2-3-4 trees.
* Since 2-3-4 trees support O(logn) insertions and deletions, so does the red-black tree.

* Dont memorize red/black rotations and color flips. If you're going to code up a red-black tree,
* just open up CLRS and translate the pseudocode.

* search() - O(logn)
* insert() - O(logn)
* remove() - O(logn)

* Implementation is based off CLRS, chapter 13.
**************************************************************************************************/

class RedBlackTree<T> {
  root: RBTreeNode<T> | null

  private sz: number
  private compare: utils.CompareFunction<T>

  constructor(compareFunction?: utils.CompareFunction<T>) {
    this.root = null
    this.sz = 0

    this.compare = compareFunction || utils.defaultCompare
  }

  /*****************************************************************************
                                  INSPECTION
  *****************************************************************************/
  size(): number {
    return this.sz
  }

  isEmpty(): boolean {
    return this.size() === 0
  }

  // O(n)
  height(): number {
    return this.heightHelper(this.root)
  }

  // O(n) because we recurse on all nodes in the tree
  private heightHelper(root: RBTreeNode<T> | null): number {
    if (root === null) return 0

    return Math.max(this.heightHelper(root.left), this.heightHelper(root.right)) + 1
  }

  /*****************************************************************************
                                  SEARCHING
  *****************************************************************************/
  // All search operations can be implemented iteratively and in O(logn) time.

  // O(logn) because we're just tracing a path down the tree
  find(value: T): RBTreeNode<T> | null {
    let cur = this.root

    while (cur !== null && cur.value !== value) {
      if (this.compare(value, cur.value) < 0) cur = cur.left
      else cur = cur.right
    }

    return cur
  }

  // finds the min node in the subtree rooted at given root, or top-most parent by default
  // O(logn) because we're just tracing a path down the tree
  findMin(root?: RBTreeNode<T> | null): RBTreeNode<T> | null {
    let cur = root || this.root

    while (cur && cur.left !== null) {
      cur = cur.left
    }

    return cur
  }

  // finds the max node in the subtree rooted at given root, or top-most parent by default
  // O(logn) because we're just tracing a path down the tree
  findMax(root?: RBTreeNode<T> | null): RBTreeNode<T> | null {
    let cur = root || this.root

    while (cur && cur.right !== null) {
      cur = cur.right
    }

    return cur
  }

  // O(logn) since we follow a path down the tree or up the tree
  findSucessor(root: RBTreeNode<T>): RBTreeNode<T> | null {
    // if the right child exists, the successor is the left-most node of the right-child
    const rightChildExists = root.right !== null
    if (rightChildExists) return this.findMin(root.right)

    // otherwise, the successor is the lowest ancestor of the current node whose
    //  left child is also an ancestor of the current node

    let cur = root
    let parent = root.parent

    // Go up the tree from cur until we find a node that is the left child of the parent.
    // If the node is the right child of the parent that means we haven't crossed
    // "up and over" to the successor side of the binary tree
    while (parent !== null && cur === parent.right) {
      cur = parent
      parent = parent.parent
    }

    return parent
  }

  // O(logn) since we follow a path down the tree or up the tree
  findPredecessor(root: RBTreeNode<T>): RBTreeNode<T> | null {
    // if the left child exists, the successor is the right-most node of the left-child
    const leftChildExists = root.left !== null
    if (leftChildExists) return this.findMax(root.left)

    // otherwise, the successor is the lowest ancestor of the current node whose
    // right child is also an ancestor of the current node

    let cur = root
    let parent = root.parent

    // Go up the tree from cur until we find a node that is the right child of the parent
    // If the node is the left child of the parent that means we haven't crossed
    // "up and over" to the predecessor side of the binary tree
    while (parent !== null && cur === parent.left) {
      cur = parent
      parent = parent.parent
    }

    return parent
  }

  /*****************************************************************************
                                  INSERTION/DELETION
  *****************************************************************************/
  // O(logn) time since we follow a path down the tree
  insert(value: T): RBTreeNode<T> {
    let parent: RBTreeNode<T> | null = null
    let cur = this.root

    // walk down our tree until cur pointer is null
    while (cur !== null) {
      parent = cur

      if (this.compare(value, cur.value) < 0) cur = cur.left
      else cur = cur.right
    }

    const newNode = new RBTreeNode(value, 'red', parent)

    if (parent === null) {
      // if the root was empty, just set the root pointer to newNode
      this.root = newNode
    } else if (newNode.value < parent.value) {
      parent.left = newNode
    } else {
      parent.right = newNode
    }

    this.sz += 1

    this.insertFix(newNode)

    return newNode
  }

  insertFix(z: RBTreeNode<T>): void {
    if (z.parent === null || z.parent.parent === null) throw new Error()

    while (z && z.parent && z.parent.parent && z.parent.color === 'red') {
      if (z.parent === z.parent.parent.left) {
        const y = z.parent.parent.right

        if (!y) throw new Error()

        if (y.color === 'red') {
          z.parent.color = 'black'
          y.color = 'black'
          z.parent.parent.color = 'red'
          z = z.parent.parent
        } else {
          if (z === z.parent.right) {
            z = z.parent
            this.leftRotate(z)
          }

          if (!z.parent || !z.parent.parent) throw new Error()

          z.parent.color = 'black'
          z.parent.parent.color = 'red'
          this.rightRotate(z.parent.parent)
        }
      } else {
        const y = z.parent.parent.left

        if (!y) throw new Error()

        if (y.color === 'red') {
          z.parent.color = 'black'
          y.color = 'black'
          z.parent.parent.color = 'red'
          z = z.parent.parent
        } else {
          if (z === z.parent.left) {
            z = z.parent
            this.rightRotate(z)
          }

          if (!z.parent || !z.parent.parent) throw new Error()

          z.parent.color = 'black'
          z.parent.parent.color = 'red'
          this.leftRotate(z.parent.parent)
        }
      }
    }

    if (!this.root) throw new Error()

    this.root.color = 'black'
  }

  remove(z: RBTreeNode<T>): boolean {
    let y: RBTreeNode<T> = z // temporary reference y
    let yOriginalColor = y.color

    let x: RBTreeNode<T> | null

    if (z.left === null) {
      x = z.right
      this.transplant(z, z.right)
    } else if (z.right === null) {
      x = z.left
      this.transplant(z, z.left)
    } else {
      y = this.findSucessor(z.right)!
      yOriginalColor = y.color
      x = y.right
      if (!x) throw new Error()

      if (y.parent === z) x.parent = y
      else {
        this.transplant(y, y.right)
        y.right = z.right
        y.right.parent = y
      }
      this.transplant(z, y)
      y.left = z.left
      y.left.parent = y
      y.color = z.color
    }

    if (yOriginalColor === 'black') this.removeFix(x!)

    this.sz -= 1
    return true
  }

  private removeFix(x: RBTreeNode<T>): void {
    while (x !== this.root && x.color === 'black') {
      if (!x || !x.parent) throw new Error()
      if (x === x.parent.left) {
        let w = x.parent.right

        if (!w) throw new Error()

        if (w.color === 'red') {
          w.color = 'black'
          x.parent.color = 'red'
          this.leftRotate(x.parent)
          w = x.parent.right
        }

        if (!w || !w.left || !w.right) throw new Error()

        if (w.left.color === 'black' && w.right.color === 'black') {
          w.color = 'red'
          x = x.parent
          continue
        } else if (w.right.color === 'black') {
          w.left.color = 'black'
          w.color = 'red'
          this.rightRotate(w)
          w = x.parent.right
        }

        if (!w || !w.left || !w.right) throw new Error()

        if (w.right.color === 'red') {
          w.color = x.parent.color
          x.parent.color = 'black'
          w.right.color = 'black'
          this.leftRotate(x.parent)
          x = this.root!
        }
      } else {
        let w = x.parent.left

        if (!w) throw new Error()

        if (w.color === 'red') {
          w.color = 'black'
          x.parent.color = 'red'
          this.rightRotate(x.parent)
          w = x.parent.left
        }
        if (!w || !w.left || !w.right) throw new Error()
        if (w.right.color === 'black' && w.left.color === 'black') {
          w.color = 'red'
          x = x.parent
          continue
        } else if (w.left.color === 'black') {
          w.right.color = 'black'
          w.color = 'red'
          this.leftRotate(w)
          w = x.parent.left
        }
        if (!w || !w.left || !w.right) throw new Error()
        if (w.left.color === 'red') {
          w.color = x.parent.color
          x.parent.color = 'black'
          w.left.color = 'black'
          this.rightRotate(x.parent)
          x = this.root!
        }
      }
    }
    x.color = 'black'
  }

  private leftRotate(A: RBTreeNode<T>) {
    const P = A.parent // save A's parent for later
    const B = A.right

    if (B === null) throw new Error()

    A.right = B.left // swing B's predecessors to A

    // set B's predecessors parent to A now
    if (B.left !== null) B.left.parent = A // set BPredecessor.Parent = A

    B.left = A // rotate A left

    // link up parents
    A.parent = B
    B.parent = P

    if (P !== null) {
      if (P.left === A) P.left = B
      else P.right = B
    } else {
      // that means A was root, so now point root to B
      this.root = B
    }
  }

  private rightRotate(A: RBTreeNode<T>) {
    const P = A.parent
    const B = A.left

    if (B === null) throw new Error()

    A.left = B.right // swing B's successors to A since B.right will now be A

    // if B has a sucessor, set it's new parent to A now
    if (B.right !== null) B.right.parent = A // set BSuccessor.parent = A

    B.right = A // rotate A right

    // link up parents
    A.parent = B
    B.parent = P

    if (P !== null) {
      if (P.left === A) P.left = B
      else P.right = B
    } else {
      // that means A was root, so now point root to B
      this.root = B
    }
  }

  // Replaces the subtree rooted at u with the subtree rooted at v. Node u's
  // parent now becomes node v's parent. Note that transplant does not update
  // v.left or v.right
  private transplant(u: RBTreeNode<T>, v: RBTreeNode<T> | null) {
    if (u.parent === null) {
      this.root = v
    } else if (u == u.parent.left) {
      u.parent.left = v
    } else u.parent.right = v

    // set v's parent pointer to point to u's parent
    if (v) v.parent = u.parent
  }

  /*****************************************************************************
                                  READING
  *****************************************************************************/
  inorderTraversal(): { [Symbol.iterator](): Iterator<T> } {
    let root = this.root
    const stack = new Stack<RBTreeNode<T>>()

    return {
      [Symbol.iterator]: (): Iterator<T> => ({
        next(): IteratorResult<T> {
          // dig left
          while (root !== null) {
            stack.push(root)
            root = root.left
          }

          // we're done exploring the left branch
          if (stack.isEmpty()) {
            // if stack is empty, we have no more nodes to process
            return { value: null, done: true }
          }

          root = stack.pop()! // root is not null bc stack is not empty

          const value = root.value
          root = root.right

          return {
            value,
            done: false,
          }
        },
      }),
    }
  }

  preorderTraversal(): { [Symbol.iterator](): Iterator<T> } {
    let root = this.root

    const stack = new Stack<RBTreeNode<T>>()
    if (root !== null) stack.push(root)

    return {
      [Symbol.iterator]: (): Iterator<T> => ({
        next(): IteratorResult<T> {
          if (stack.isEmpty()) return { value: null, done: true }

          root = stack.pop()! // root is non-null bc stack is not empty

          const value = root.value

          if (root.right !== null) stack.push(root.right)
          if (root.left !== null) stack.push(root.left)

          return {
            value,
            done: false,
          }
        },
      }),
    }
  }

  postorderTraversal(): { [Symbol.iterator](): Iterator<T> } {
    let root = this.root

    const stack1 = new Stack<RBTreeNode<T>>()
    const stack2 = new Stack<RBTreeNode<T>>()
    if (root !== null) stack1.push(root)

    while (!stack1.isEmpty()) {
      root = stack1.pop()! // non-null bc stack1 is not empty
      stack2.push(root)

      if (root.left !== null) stack1.push(root.left)
      if (root.right !== null) stack1.push(root.right)
    }

    return {
      [Symbol.iterator]: (): Iterator<T> => ({
        next(): IteratorResult<T> {
          if (stack2.isEmpty()) return { value: null, done: true }

          const { value } = stack2.pop()! // non-null bc stack2 is not empty

          return {
            value,
            done: false,
          }
        },
      }),
    }
  }
}

export default RedBlackTree

import AVLTreeNode from './avl-tree-node'
import Stack from '../sequences/stack'
import * as utils from '../utils'

class AVLTree<T> {
  root: AVLTreeNode<T> | null

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

  // O(1)
  height(): number {
    if (this.root === null) return 0

    return this.root.height
  }

  /*****************************************************************************
                                  SEARCHING
  *****************************************************************************/
  // All search operations can be implemented iteratively and in O(logn) time.

  // O(logn) because we're just tracing a path down the tree
  find(value: T): AVLTreeNode<T> | null {
    let cur = this.root

    while (cur !== null && cur.value !== value) {
      if (this.compare(value, cur.value) < 0) cur = cur.left
      else cur = cur.right
    }

    return cur
  }

  contains(value: T): boolean {
    return this.find(value) !== null
  }

  // finds the min node in the subtree rooted at given root, or top-most parent by default
  // O(logn) because we're just tracing a path down the tree
  findMin(root?: AVLTreeNode<T> | null): AVLTreeNode<T> | null {
    let cur = root || this.root

    while (cur && cur.left !== null) {
      cur = cur.left
    }

    return cur
  }

  // finds the max node in the subtree rooted at given root, or top-most parent by default
  // O(logn) because we're just tracing a path down the tree
  findMax(root?: AVLTreeNode<T> | null): AVLTreeNode<T> | null {
    let cur = root || this.root

    while (cur && cur.right !== null) {
      cur = cur.right
    }

    return cur
  }

  // O(logn) since we follow a path down the tree or up the tree
  findSucessor(root: AVLTreeNode<T>): AVLTreeNode<T> | null {
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
  findPredecessor(root: AVLTreeNode<T>): AVLTreeNode<T> | null {
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
  insert(value: T): AVLTreeNode<T> | null {
    if (this.contains(value)) return null

    this.root = this.insertHelper(this.root, value, null)
    this.sz += 1

    return this.root
  }

  private insertHelper(
    root: AVLTreeNode<T> | null,
    value: T,
    parent: AVLTreeNode<T> | null
  ): AVLTreeNode<T> {
    if (root === null) return new AVLTreeNode(value, parent)

    // regular BST insert first
    const cmp = this.compare(value, root.value)

    if (cmp < 0) {
      root.left = this.insertHelper(root.left, value, root)
    } else {
      root.right = this.insertHelper(root.right, value, root)
    }

    // update balance factor and height values in subtree rooted at node
    this.update(root)

    // re-balance tree to satisfy AVL invariant
    return this.balance(root)
  }

  // update node's height and balance factor
  private update(node: AVLTreeNode<T> | null): void {
    if (node === null) return
    const leftNodeHeight = node.left ? node.left.height : 0
    const rightNodeHeight = node.right ? node.right.height : 0

    node.height = Math.max(leftNodeHeight, rightNodeHeight) + 1

    node.balanceFactor = leftNodeHeight - rightNodeHeight

    this.update(node.parent)
  }

  // re-balance a node if balance factor is +2 or -2
  private balance(node: AVLTreeNode<T>): AVLTreeNode<T> {
    // left heavy since balanceFactor = leftChildHeight - rightChildHeight
    if (node.balanceFactor === 2) {
      // if left child has left child, we have three nodes forming a line so
      // perform a right rotation

      // node.left should be not null bc this method gets called only when node is left heavy ==> node.left is not null
      if (node.left === null) throw new Error()

      if (node.left.balanceFactor >= 0) {
        return this.leftLeftCase(node)
      } else {
        // o/w left child has a right child so

        // 1. left rotate left child so we now have three nodes forming a line
        // 2. right rotate the root
        return this.leftRightCase(node)
      }
    } else if (node.balanceFactor === -2) {
      // if right child has right child, we have three nodes forming a line so
      // perform a left rotation

      // node.right should be not null bc this method gets called only when node is right heavy ==> node.right is not null
      if (node.right === null) throw new Error()

      if (node.right.balanceFactor <= 0) {
        return this.rightRightCase(node)
      } else {
        // o/w right child has left child so

        // 1. right rotate right child so we now have three nodes forming a line
        // 2. left rotate the root
        return this.rightLeftCase(node)
      }
    }

    // o/w, node.balanceFactor is -1, 0, or 1. This is ok.

    return node
  }

  private leftLeftCase(node: AVLTreeNode<T>): AVLTreeNode<T> {
    return this.rightRotation(node)
  }

  private leftRightCase(node: AVLTreeNode<T>): AVLTreeNode<T> {
    // node.left should be not null bc this method gets called only when node is left heavy ==> node.left is not null
    if (node.left === null) throw new Error()

    this.leftRotation(node.left)

    return this.leftLeftCase(node)
  }

  private rightRightCase(node: AVLTreeNode<T>): AVLTreeNode<T> {
    return this.leftRotation(node)
  }

  private rightLeftCase(node: AVLTreeNode<T>): AVLTreeNode<T> {
    // node.right should be not null bc this method gets called only when node is right heavy ==> node.right is not null
    if (node.right === null) throw new Error()

    this.rightRotation(node.right)

    return this.rightRightCase(node)
  }

  private leftRotation(A: AVLTreeNode<T>): AVLTreeNode<T> {
    const P = A.parent // save A's parent for later
    const B = A.right

    if (B === null) throw new Error()

    A.right = B.left // swing B's predecessors to A since B.left will now be A

    // set B's predecessors parent to A now
    if (B.left !== null) B.left.parent = A // set BPredecessor.Parent = A

    B.left = A // rotate A left

    // link up parents
    A.parent = B
    B.parent = P

    if (P !== null) {
      if (P.left === A) P.left = B
      else P.right = B
    }

    // re-update height and balance factor
    this.update(A)
    this.update(B)

    return B
  }

  private rightRotation(A: AVLTreeNode<T>): AVLTreeNode<T> {
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
    }

    // re-update height and balance factor
    this.update(A)
    this.update(B)

    return B
  }

  // O(logn) because in the worst case we have to find the successor of node.
  // This means calling this.findMin() which takes O(logn) time
  remove(node: AVLTreeNode<T>): boolean {
    if (!this.contains(node.value)) return false

    this.removeHelper(node)
    this.sz -= 1
    return true
  }

  // O(logn) because in the worst case we have to find the successor of node.
  // This means calling this.findMin() which takes O(logn) time
  private removeHelper(node: AVLTreeNode<T>): void {
    // cases:
    // if node has no children, we simply remove it by modifying node.parent's pointer
    // if node has one child, we promote the child to take node's place
    // if node has two chldren, we replace node with node's successor to maintain BST invariant

    if (node.left === null) {
      // is node has just a right child, we replace node with it's right child which may
      // or may not be null
      this.transplant(node, node.right)
    } else if (node.right === null) {
      // if node has just a left child then we replace node with the left child
      this.transplant(node, node.left)
    } else {
      // otherwise node has two children

      const sucessor = this.findSucessor(node) // O(h)

      if (node.right === sucessor) {
        // if node's sucessor is the right child of node, then we replace node with
        // the sucessor
        this.transplant(node, sucessor)

        // link nodes left subtree with sucessor
        sucessor.left = node.left
        sucessor.left.parent = sucessor
      } else {
        // otherwise, the sucessor lies within node's right subtree but is not
        // node's immediate right child. then, replace the successor with it's own
        // right child, and then replace node with the sucessor

        // note: sucessor can't be null here. node has two children, so it
        // definitely does have a sucessor
        if (sucessor === null) throw new Error()

        // before we transplant node with sucessor, transplant sucessor with IT's
        // right subtree (sucessor subtree)
        this.transplant(sucessor, sucessor.right)

        this.transplant(node, sucessor)

        // link node's right subtree with sucessor
        sucessor.right = node.right
        sucessor.right.parent = sucessor

        // link node's left subtree with sucessor
        sucessor.left = node.left
        sucessor.left.parent = sucessor
      }
    }

    this.update(node)
    this.balance(node)
  }

  // Replaces the subtree rooted at u with the subtree rooted at v. Node u's
  // parent now becomes node v's parent. Note that transplant does not update
  // v.left or v.right
  private transplant(u: AVLTreeNode<T>, v: AVLTreeNode<T> | null) {
    if (u.parent === null) {
      // then u is the root of the tree so set root pointer to point to v
      this.root = v
    } else if (u === u.parent.left) {
      u.parent.left = v
    } else {
      u.parent.right = v
    }

    // set v's parent pointer to point to u's parent
    if (v) v.parent = u.parent
  }

  /*****************************************************************************
                                  READING
  *****************************************************************************/
  inorderTraversal(): { [Symbol.iterator](): Iterator<T> } {
    let root = this.root
    const stack = new Stack<AVLTreeNode<T>>()

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

    const stack = new Stack<AVLTreeNode<T>>()
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

    const stack1 = new Stack<AVLTreeNode<T>>()
    const stack2 = new Stack<AVLTreeNode<T>>()
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

export default AVLTree

import TreeNode from './tree-node'
import Stack from '../../sequences/stack'
import * as utils from '../../utils'

class BinarySearchTree<T> {
  root: TreeNode<T> | null

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
  private heightHelper(root: TreeNode<T> | null): number {
    if (root === null) return 0

    return Math.max(this.heightHelper(root.left), this.heightHelper(root.right)) + 1
  }

  /*****************************************************************************
                                  SEARCHING
  *****************************************************************************/
  // All search operations can be implemented iteratively and in O(h) time.

  // O(h) because we're just tracing a path down the tree
  find(value: T): TreeNode<T> | null {
    let cur = this.root

    while (cur !== null && cur.value !== value) {
      if (this.compare(value, cur.value) < 0) cur = cur.left
      else cur = cur.right
    }

    return cur
  }

  // finds the min node in the subtree rooted at given root, or top-most parent by default
  // O(h) because we're just tracing a path down the tree
  findMin(root?: TreeNode<T> | null): TreeNode<T> | null {
    let cur = root || this.root

    while (cur && cur.left !== null) {
      cur = cur.left
    }

    return cur
  }

  // finds the max node in the subtree rooted at given root, or top-most parent by default
  // O(h) because we're just tracing a path down the tree
  findMax(root?: TreeNode<T> | null): TreeNode<T> | null {
    let cur = root || this.root

    while (cur && cur.right !== null) {
      cur = cur.right
    }

    return cur
  }

  // O(h) since we follow a path down the tree or up the tree
  findSucessor(root: TreeNode<T>): TreeNode<T> | null {
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

  // O(h) since we follow a path down the tree or up the tree
  findPredecessor(root: TreeNode<T>): TreeNode<T> | null {
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
  // O(h) time since we follow a path down the tree
  insert(value: T): TreeNode<T> {
    let parent: TreeNode<T> | null = null
    let cur = this.root

    // walk down our tree until cur pointer is null
    while (cur !== null) {
      parent = cur

      if (this.compare(value, cur.value) < 0) cur = cur.left
      else cur = cur.right
    }

    const newNode = new TreeNode(value, parent)

    if (parent === null) {
      // if the root was empty, just set the root pointer to newNode
      this.root = newNode
    } else if (newNode.value < parent.value) {
      parent.left = newNode
    } else {
      parent.right = newNode
    }

    this.sz += 1

    return newNode
  }

  // O(h) because in the worst case we have to find the successor of node.
  // This means calling this.findMin() which takes O(h) time
  remove(node: TreeNode<T>): void {
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

        // link node's right subtree with sucessor
        sucessor.right = node.right
        sucessor.right.parent = sucessor

        this.transplant(node, sucessor)

        // link node's left subtree with sucessor
        sucessor.left = node.left
        sucessor.left.parent = sucessor
      }
    }

    this.sz -= 1
  }

  // Replaces the subtree rooted at u with the subtree rooted at v. Node u's
  // parent now becomes node v's parent. Note that transplant does not update
  // v.left or v.right
  private transplant(u: TreeNode<T>, v: TreeNode<T> | null) {
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
    const stack = new Stack<TreeNode<T>>()

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

    const stack = new Stack<TreeNode<T>>()
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

    const stack1 = new Stack<TreeNode<T>>()
    const stack2 = new Stack<TreeNode<T>>()
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

export default BinarySearchTree

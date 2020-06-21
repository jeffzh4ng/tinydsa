import BTreeNode from './b-tree-node'
import * as utils from '../utils'

class BTree<T> {
  root: BTreeNode<T> | null

  private B: number
  private maxValues: number
  private maxChildren: number

  private h: number
  private sz: number
  private compare: utils.CompareFunction<T> // comparison function if generic type T isn't primitive

  constructor(B: number, compareFunction?: utils.CompareFunction<T>) {
    if (B < 2) throw new Error('Branching factor must be greater than or equal to 2.')
    this.root = null

    this.B = B
    this.maxValues = this.B * 2 - 1
    this.maxChildren = this.B * 2

    this.sz = 0
    this.h = 0

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
    return this.h
  }

  /*****************************************************************************
                                  SEARCHING
  *****************************************************************************/
  // O(logn) because we're just tracing a path down the tree
  find(value: T): [BTreeNode<T>, number] | null {
    if (!this.root) return null

    return this.findHelper(this.root, value)
  }

  private findHelper(root: BTreeNode<T>, k: T): [BTreeNode<T>, number] | null {
    const values = root.values

    let i = values.length - 1

    if (k > values[i]) {
      i += 1
    } else {
      // use linear search to find the smallest index such that value <= root.values[i]
      while (i > 0 && this.compare(k, values[i]) < 0) {
        i -= 1
      }

      if (k > values[i]) i += 1
    }

    // if our index, i, is not out of bounds and we indeed have root.values[i] === value then return the value found
    if (i < values.length && this.compare(values[i], k) === 0) {
      return [root, i]
    } else if (root.isLeaf) {
      // otherwise, there was no match in this node
      // but root.isLeaf ==> we reached bottom of tree, so value is not in our tree
      // so we return null
      return null
    } else {
      // otherwise, there was no match in this node BUT we still have subtree to search
      // hope is not lost! let us recurse.

      return this.findHelper(root.children[i], k)
    }
  }

  /*****************************************************************************
                                  INSERTION/DELETION
  *****************************************************************************/
  insert(value: T): void {
    // Like BSTs, we trace a path down the tree until we find a leaf in which to insert the new key
    // However, we can't create a new leaf node. The resulting tree would not be a B-tree since all
    // leaves must be at the same level. Creating a new leaf would create a new level.
    // ...
    // Splitting the root is the only way to increase the height of a B-tree.
    // Unlike the BST, a B-tree increases height at the top, not the bottom.

    // insertNotFull() recurses as necessary down the tree, at all times guaranteeing
    // that the node to which it recurses is not full by calling splitChild as necessary

    // if root is full
    if (this.root && this.root.values.length === this.maxValues) {
      const newRoot = new BTreeNode<T>()

      newRoot.isLeaf = false
      newRoot.children.push(this.root)
      this.root = newRoot

      // split newRoot, which promotes median value of root into newRoot
      this.splitChild(newRoot, 0)
      this.insertHelper(newRoot, value)
    } else if (this.root) {
      this.insertHelper(this.root, value)
    } else {
      this.root = new BTreeNode<T>()
      this.root.isLeaf = true
      this.root.values.push(value)
      this.h += 1
    }

    this.sz += 1
  }

  // assuming root is not full
  private insertHelper(root: BTreeNode<T>, value: T) {
    if (root.isLeaf) {
      // if root is leaf, find correct spot in root.values
      let i = root.values.length - 1

      if (this.compare(value, root.values[i]) > 0) {
        root.values.splice(i + 1, 0, value)
      } else {
        while (i > 0 && this.compare(value, root.values[i]) < 0) {
          i -= 1
        }

        if (value > root.values[i]) i += 1

        root.values.splice(i, 0, value)
      }
    } else {
      // root is not leaf, find correct child to recurse into
      let i = root.values.length - 1

      while (i >= 0 && this.compare(value, root.values[i]) < 0) {
        i -= 1
      }

      i += 1

      // if the node we are about to recurse in is full, split it first
      // this guarantees that we never recurse to a full node, and hence overflow it
      if (root.children[i].values.length === this.maxValues) {
        this.splitChild(root, i)
        if (value > root.values[i]) i += 1
      }

      this.insertHelper(root.children[i], value)
    }
  }

  // Takes a nonfull internal node, (call it x), and an index, i, where
  // x.children[i] is a full child. The method splits the child, y into two (y and z)
  // and promotes the median value in the child up to the x. The length of y and z
  // children will now go from 2B to B

  // splitChild works by "cutting and pasting".

  // run time: O(B)
  private splitChild(x: BTreeNode<T>, i: number) {
    const y = x.children[i]
    const medianValue = y.values[this.B - 1]

    const z = new BTreeNode<T>()
    z.isLeaf = y.isLeaf // if y is a leaf, so is z

    // copy paste the second half of y's values into z in O(B) time
    const firstValueAfterMiddle = this.B
    for (let j = firstValueAfterMiddle; j < this.maxValues; j++) {
      z.values.push(y.values[j])
    }

    // if y is not a leaf, copy paste the second half of y's children into z in O(B) time
    if (!y.isLeaf) {
      const firstChildOfSecondHalf = this.B
      for (let j = firstChildOfSecondHalf; j < this.maxChildren; j++) {
        z.children.push(y.children[j])
      }
    }

    // cut the second half of y's values and children
    y.values.length = this.B - 1
    if (!y.isLeaf) y.children.length = this.B

    // now insert z into x's children
    // z belongs at i+1 because y is at i (the original child)
    x.children.splice(i + 1, 0, z) // O(B)

    // now promote the middle element of old y up to x
    x.values.splice(i, 0, medianValue) // O(B)
  }

  // Deletion is analagous to insertion but a bit more complicated. We can delete
  // from any node, not just a leaf. During insertion, we had to ensure nodes
  // did not overflow. In deletion, we have to ensure nodes don't underflow.
  remove(value: T): void {
    if (!this.root) return

    this.removeNode(this.root, value)

    if (this.root.values.length === 0) {
      this.root = this.root.children[0]
      this.h -= 1
    }
  }

  // assumes node will not underflow
  private removeNode(x: BTreeNode<T>, k: T): void {
    let i = x.values.length - 1

    if (this.compare(k, x.values[i]) > 0) {
      i += 1
    } else {
      while (i > 0 && this.compare(k, x.values[i]) < 0) {
        i -= 1
      }
    }

    const valueIsInX = i < x.values.length && x.values[i] === k

    if (valueIsInX && x.isLeaf) {
      // case 1: value is in x, and x is leaf
      // We can freely remove value from x since we don't have to worry about
      // any children.

      x.values.splice(i, 1)
      return
    } else if (valueIsInX && !x.isLeaf) {
      // case 2: value is in x but x is not leaf
      // This means when we remove the value, we have 1 too many children.

      const y = x.children[i]
      const z = x.children[i + 1]

      if (y.values.length >= this.B) {
        // case 2a: if y has at least B values, let k's predecessor in y replace k
        // this is allowed because a node only needs minimum k-1 values

        // paste k's predecessor into x
        x.values[i] = y.values[y.values.length - 1]

        // delete k's predecessor from y
        y.values.length -= 1
      } else if (z.values.length >= this.B) {
        // case 2b: y has B-1 values, so we cannot steal any from y, but z
        // has at least B values, so we can steal k's sucessor from z.

        // paste k's predecessor into x
        x.values[i] = z.values[0]

        // delete k's predecessor from y
        z.values.splice(0, 1) // O(n) operation TODO: use tombstones to mark deleted values
      } else {
        // case 2c: both y and z don't have enough values to steal in order to replace k
        // ==> len(y.values) = B - 1 = len(z.values) => y+z = 2B - 2
        // 2B - 2 < max values allowed = 2B.

        // this gives us the idea of merging y and z into one child
        // now, when we delete k from x.values, k's left child and k's right child
        // will merge into one.

        // copy all of z values over into y, so y is now y + z (merged)
        for (const value of z.values) {
          y.values.push(value)
        }

        // delete k from x.values
        x.values.splice(i, 1)

        // delete z from x.children
        x.children.splice(i + 1, 1)
      }
    }

    // otherwise the value is not in x

    // if x is a leaf, we can no longer search and recurse, so return
    if (x.isLeaf) return

    // case 3: x is not a leaf, so we are able to recurse, so lets recurse into x.children[i]

    // before we recurse, if the child we recurse into has the minimum number of values (B-1) then...
    if (x.children[i].values.length === this.B - 1) {
      // execute step 3a or 3b to guaranteee it has B values. We need the node to have at least B values
      // because if the deletion does so happen to occur at that child, we want to make sure it doesn't underflow.
      // So in worst case the child will have B-1 values, which is OK. We do this with rotations.

      // case 3a: right sibling has at least B values, do a rotate left on root value
      const childHasRightSibling = i < x.children.length - 1
      const rightSiblingHasValuesToGive = x.children[i + 1].values.length >= this.B
      if (childHasRightSibling && rightSiblingHasValuesToGive) {
        // left rotate on parent
        x.children[i].values.push(x.values[i])

        const firstValueOfRightSibling = x.children[i + 1].values.shift() // TODO: go from O(n) -> O(1) by using tombstones
        if (firstValueOfRightSibling === undefined) throw new Error()
        x.values[i] = firstValueOfRightSibling
      }

      const childHasLeftSibling = i > 0
      const leftSiblingHasValuesToGive = x.children[i - 1].values.length >= this.B

      // case 3a: left sibling has at least B values, do a rotate right on right value
      if (childHasLeftSibling && leftSiblingHasValuesToGive) {
        // right rotate on parent
        x.children[i].values.push(x.values[i])

        const lastValueOfLeftSibling = x.children[i + 1].values.pop()
        if (lastValueOfLeftSibling === undefined) throw new Error()
        x.values[i] = lastValueOfLeftSibling
      }

      // case 3b: left and right siblings don't have values to donate, so merge child we're going to
      // recurse into with either sibling

      if (childHasRightSibling) {
        const child = x.children[i]
        const rightSibling = x.children[i + 1]

        // push parent down
        child.values.push(x.values[i])

        // copy over all values from rightSibling into the merging child
        for (const value of rightSibling.values) {
          child.values.push(value)
        }

        // delete parent from x.values since we pushed it down
        x.values.splice(i, 1)

        // delete rightSibling from x.children
        x.children.splice(i + 1, 1)
      } else {
        // childHasLeftSibling
        const child = x.children[i]
        const leftSibling = x.children[i - 1]

        // push parent down
        child.values.push(x.values[i])

        // copy over all values from leftSibling into the merging child
        for (const value of leftSibling.values) {
          child.values.push(value)
        }

        // delete parent from x.values since we pushed it down
        x.values.splice(i, 1)

        // delete leftSibling from x.children
        x.children.splice(i - 1, 1)
      }
    }

    this.removeNode(x.children[i], k)
  }
}

export default BTree

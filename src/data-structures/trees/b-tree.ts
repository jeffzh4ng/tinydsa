// import BTreeNode from './b-tree-node'
// import Stack from '../sequences/stack'
// import * as utils from '../utils'

// class BTree<T> {
//   root: BTreeNode<T> | null

//   private B: number
//   private maxValues: number
//   private maxChildren: number

//   private sz: number
//   private compare: utils.CompareFunction<T> // comparison function if generic type T isn't primitive

//   constructor(B: number, compareFunction?: utils.CompareFunction<T>) {
//     if (B < 2) throw new Error('Branching factor must be greater than or equal to 2.')
//     this.B = B
//     this.maxValues = this.B * 2 - 1
//     this.maxChildren = this.B * 2

//     this.root = null
//     this.sz = 0

//     this.compare = compareFunction || utils.defaultCompare
//   }

//   /*****************************************************************************
//                                   INSPECTION
//   *****************************************************************************/
//   size(): number {
//     return this.sz
//   }

//   isEmpty(): boolean {
//     return this.size() === 0
//   }

//   // O(n)
//   height(): number {
//     return this.heightHelper(this.root)
//     // return this.height
//   }

//   /*****************************************************************************
//                                   SEARCHING
//   *****************************************************************************/
//   // O(logn) because we're just tracing a path down the tree
//   find(value: T): Entry<T> | null {
//     return this.findHelper(this.root, value)
//   }

//   private findHelper(root: BTreeNode<T>, value: T): Entry<T> | null {
//     let i = 0

//     // TODO: convert to binary search

//     const values = root.values

//     // use linear search to find the smallest index such that value <= root.values[i]
//     while (i < values.length && this.compare(value, values[i].value) < 0) {
//       i += 1
//     }

//     // if our index, i, is not out of bounds and we indeed have root.values[i] === value then return the value found
//     if (i < values.length && this.compare(values[i], value) === 0) {
//       return values[i]
//     } else if (root.isLeaf) {
//       // otherwise, there was no match in this node
//       // but root.isLeaf ==> we reached bottom of tree, so value is not in our tree
//       // so we return null
//       return null
//     } else {
//       // otherwise, there was no match in this node BUT we still have subtree to search
//       // hope is not lost! let us recurse.

//       return this.findHelper(root, values[i])
//     }
//   }

//   /*****************************************************************************
//                                   INSERTION/DELETION
//   *****************************************************************************/
//   insert(value: T): void {
//     // Like BSTs, we trace a path down the tree until we find a leaf in which to insert the new key
//     // However, we can't create a new leaf node. The resulting tree would not be a B-tree since all
//     // leaves must be at the same level. Creating a new leaf would create a new level.
//     // ...
//     // Splitting the root is the only way to increase the height of a B-tree.
//     // Unlike the BST, a B-tree increases height at the top, not the bottom.

//     // insertNotFull() recurses as necessary down the tree, at all times guaranteeing
//     // that the node to which it recurses is not full by calling splitChild as necessary

//     const rootIsFull = this.root && this.root.values.length === this.maxValues

//     if (this.root && rootIsFull) {
//       const newRoot = new BTreeNode<T>()

//       newRoot.isLeaf = false
//       newRoot.children.push(this.root)
//       this.root = newRoot

//       // split newRoot, which promotes median value of root into newRoot
//       this.splitChild(newRoot, 0)
//       this.insertHelper(newRoot, value)
//     } else if (this.root) {
//       this.insertHelper(this.root, value)
//     } else {
//       this.root = new BTreeNode<T>()
//       this.root.values.push(value)
//     }

//     this.sz += 1
//   }

//   // assuming root is not full
//   private insertHelper(root: BTreeNode<T>, value: T) {
//     if (root.isLeaf) {
//       // if root is leaf, find correct spot in root.values
//       let i = 0
//       while (i < root.values.length && this.compare(value, root.values[i]) < 0) {
//         i += 1
//       }

//       root.values.splice(i, 0, value)
//     } else {
//       // root is not leaf, find correct child to recurse into

//       let i = root.values.length - 1

//       while (i < root.values.length && this.compare(value, root.values[i]) < 0) {
//         i += 1
//       }

//       i -= 1

//       // if the node we are about to recurse in is full, split it first
//       // this guarantees that we never recurse to a full node, and hence overflow it
//       if (root.children[i].values.length === this.maxValues) {
//         this.splitChild(root, i)
//         if (value > root.values[i]) i += 1
//       }

//       this.insertHelper(root.children[i], value)
//     }
//   }

//   // Takes a nonfull internal node, (call it x), and an index, i, where
//   // x.children[i] is a full child. The method splits the child, y into two (y and z)
//   // and promotes the median value in the child up to the x. The length of y and z
//   // children will now go from 2B to B

//   // splitChild works by "cutting and pasting".

//   // run time: O(B)
//   private splitChild(x: BTreeNode<T>, i: number) {
//     const y = x.children[i]
//     const medianValue = y.values[this.B - 1]

//     const z = new BTreeNode<T>()
//     z.isLeaf = y.isLeaf // if y is a leaf, so is z

//     // copy paste the second half of y's values into z in O(B) time
//     const firstValueAfterMiddle = this.B
//     for (let j = firstValueAfterMiddle + 1; j < this.maxValues; j++) {
//       z.values.push(y.values[j])
//     }

//     // if y is not a leaf, copy paste the second half of y's children into z in O(B) time
//     const firstChildOfSecondHalf = this.B + 1
//     for (let j = firstChildOfSecondHalf; j < this.maxChildren; j++) {
//       z.children.push(y.children[j])
//     }

//     // cut the second half of y's values and children
//     y.values.length = this.B - 1
//     y.children.length = this.B

//     // now insert z into x's children
//     // z belongs at i+1 because y is at i (the original child)
//     x.children.splice(i + 1, 0, z) // O(B)

//     // now promote the middle element of old y up to x
//     x.values.splice(i, 0, medianValue) // O(B)
//   }

//   // Deletion is analagous to insertion but a bit more complicated. We can delete
//   // from any node, not just a leaf. During insertion, we had to ensure nodes
//   // did not overflow. In deletion, we have to ensure nodes don't underflow.
//   remove(value: T) {}

//   private removeNode(root: BTreeNode<T>, value: T) {
//     let i = 0
//     while (i < root.values.length && this.compare(value, root.values[i]) < 0) {
//       i += 1
//     }
//   }

//   /*****************************************************************************
//                                   READING
//   *****************************************************************************/
//   inorderTraversal(): { [Symbol.iterator](): Iterator<T> } {
//     let root = this.root
//     const stack = new Stack<BTreeNode<T>>()

//     return {
//       [Symbol.iterator]: (): Iterator<T> => ({
//         next(): IteratorResult<T> {
//           // dig left
//           while (root !== null) {
//             stack.push(root)
//             root = root.left
//           }

//           // we're done exploring the left branch
//           if (stack.isEmpty()) {
//             // if stack is empty, we have no more nodes to process
//             return { value: null, done: true }
//           }

//           root = stack.pop()! // root is not null bc stack is not empty

//           const value = root.value
//           root = root.right

//           return {
//             value,
//             done: false,
//           }
//         },
//       }),
//     }
//   }
// }

// export default BTree

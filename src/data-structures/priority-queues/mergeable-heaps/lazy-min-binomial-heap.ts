import BinomialNode from './binomial-node'
import * as utils from '../../utils'
import * as util from 'util'

/*******************************************************************************
 * A binomial heap is a forest of binomial trees.
 *
 * A binomial tree of degree 0 is a single node.
 * A binomial tree of degree k has a root node with k children. The degrees of those
 * children are k-1, k-2,..., 2, 1, 0.
 *
 * A binomial tree of degree k has 2^k nodes.
 *
 * A binomial heap is a forest of binomial trees that satisfy the heap invariant.
 * There can be only 0 or 1 binomial tree of degree k in the forest.
 *
 * The two key features of binomial heaps are:
 *
 * 1. The roots of the forest are <= log(n)
 * 2. Merging two heaps is binary addition
 *
 * This brings merge() from O(n + m) to O(logn + logm)!!!
 *
 * But because we now have a forest instead of one single tree, findMin() now
 * takes O(logn) to traverse the entire forest :( Check out the lazy binomial heap
 * to see how we can bring this back down to O(1)
 *
 * enqueue() - O(logn)
 * extractMin() - O(logn)
 * findMin() - O(logn) ~~~got worse from O(1) :(
 * merge() - O(logn + logm) ~~~improved from O(n+m)!
 *
 * More info can be found here: https://en.wikipedia.org/wiki/Binomial_heap
 * The Implementation belowbased off Binomial Heap pseudocode from CLRS ed 2 (Chapter 19)
 ******************************************************************************/

class LazyMinBinomialHeap<T> {
  head: BinomialNode<T> | null
  size: number

  minRoot: BinomialNode<T> | null

  // smallestValue for deleteNode(node)
  // deleteNode will decrease the node to the smallest value so it swims up to
  // the root, and then calls dequeue()
  private smallestValue: T

  // comparison function if the generic type T is non-primitive
  private compare: utils.CompareFunction<T>

  constructor(smallestValue: T, compareFunction?: utils.CompareFunction<T>) {
    this.head = null
    this.minRoot = null

    this.size = 0
    this.smallestValue = smallestValue

    this.compare = compareFunction || utils.defaultCompare
  }

  /*****************************************************************************
                                  INSPECTION
  *****************************************************************************/
  /**
   * Returns true if the heap is empty, false otherwise - O(1)
   * @returns {boolean}
   */
  isEmpty(): boolean {
    return this.size === 0
  }

  /*****************************************************************************
                                  INSERTION/DELETION
  *****************************************************************************/
  /**
   * Enqueues element onto the heap - O(1)
   * @param {T} element
   * @returns {void}
   */
  enqueue(element: T): BinomialNode<T> {
    const newRoot = new BinomialNode(element)

    // lazily enqueue the element to the forest
    if (this.head) newRoot.sibling = this.head
    this.head = newRoot

    this.size += 1

    // set minRoot pointer
    if (!this.minRoot) this.minRoot = this.head
    if (this.compare(this.head.value, this.minRoot.value) < 0) this.minRoot = this.head

    return this.head
  }

  /**
   * Dequeues the smallest element from the heap // O(logn)
   * @param {T} element
   * @returns {void}
   */
  dequeue(): BinomialNode<T> | null {
    // remove smallest root of smallest tree B_k from heap
    const smallestRoot = this.removeSmallestRoot() // O(logn)
    this.size -= 1

    if (!smallestRoot) return smallestRoot

    // if the root has children, add it to the forest
    if (smallestRoot.child) {
      // delete all parent pointers in children
      let child: BinomialNode<T> | null = smallestRoot.child
      let lastChild: BinomialNode<T> | null = null

      while (child) {
        lastChild = child
        child.parent = null
        child = child.sibling
      }

      if (this.head) {
        lastChild!.sibling = this.head
      }

      this.head = smallestRoot.child
    }

    // console.log('before consolidating')
    // console.log(util.inspect(this.head, { depth: null }))
    this.head = this.consolidate()
    // console.log('after consolidating')
    // console.log(util.inspect(this.head, { depth: null }))

    // if we removed the smallest root, recalculate the minRoot pointer
    if (this.minRoot === smallestRoot) this.recalculateMin()

    // return the removed root
    return smallestRoot
  }

  /**
   * Deletes the given node - O(logn)
   * @param {BinomialNode<T>} node
   * @returns {void}
   */
  deleteNode(node: BinomialNode<T>): BinomialNode<T> | null {
    // make it the smallest node in the heap so it swims up
    this.decreaseKey(node, this.smallestValue) // O(logn)

    // dequeue the smallest node from the heap
    return this.dequeue() // O(logn)
  }

  // O(logn)
  private removeSmallestRoot(): BinomialNode<T> | null {
    if (!this.head) return null

    let cur: BinomialNode<T> | null = this.head
    let prev = cur

    let min = cur
    let prevMin = null
    cur = cur.sibling

    // O(logn) since we traverse entire forest
    while (cur) {
      const currentIsLessThanMin = this.compare(cur.value, min.value) < 0
      if (currentIsLessThanMin) {
        min = cur
        prevMin = prev
      }

      prev = cur
      cur = cur.sibling
    }

    // if smallest root is head, then move heap.head pointer one root forwards
    if (prev === null || prevMin === null) {
      this.head = this.head.sibling
    } else {
      // otherwise link prev root with min's right root
      prevMin.sibling = min.sibling
    }

    return min
  }

  // O(logn)
  private recalculateMin(): void {
    if (!this.head) return
    let cur = this.head.sibling
    let min = this.head

    while (cur) {
      if (cur.value < min.value) min = cur
      cur = cur.sibling
    }

    this.minRoot = min
  }

  /*****************************************************************************
                                  READING
  *****************************************************************************/
  /**
   * Returns the smallest node in the heap, null if the heap is empty O(1)
   * @returns {BinomialNode<T> | null}
   */
  peek(): BinomialNode<T> | null {
    if (!this.head) return null

    return this.minRoot
  }

  /*****************************************************************************
                                  UPDATING
  *****************************************************************************/
  /**
   * Unions supplied heap with current heap - O(1). Current implementation
   * is destructive.
   * @param {BinomialHeap<T>} otherHeap
   * @returns {BinomialHeap<T>}
   */
  union(otherHeap: LazyMinBinomialHeap<T>): LazyMinBinomialHeap<T> {
    const unionedHeap = new LazyMinBinomialHeap<T>(this.smallestValue)
    unionedHeap.head = this.head

    let cur = unionedHeap.head

    while (cur && cur.sibling) {
      cur = cur.sibling
    }

    cur!.sibling = otherHeap.head

    unionedHeap.size = this.size + otherHeap.size

    return unionedHeap
  }

  /**
   * Consolidates the current state of the heap such that only one tree exists
   * for degree k - O(t + logn)
   * @returns {LazyMinBinomialHeap<T>}
   */
  private consolidate(): BinomialNode<T> | null {
    // 1. sort the trees according to degree with bucket sort O(t + logn)
    const sortedTrees = this.sortForest() // O(t + logn)

    // 2. link trees until at most one tree remains for a specific degree k - O(t)
    for (let k = 0; k < sortedTrees.length; k++) {
      const degreeKTrees = sortedTrees[k]

      if (!degreeKTrees) continue

      let numberOfDegreeKTrees = degreeKTrees.length

      while (numberOfDegreeKTrees >= 2) {
        const treeA = degreeKTrees.pop()!
        const treeB = degreeKTrees.pop()!

        const linkedTree =
          treeA.value < treeB.value ? this.linkTrees(treeA, treeB) : this.linkTrees(treeB, treeA)

        sortedTrees[k + 1].push(linkedTree)

        numberOfDegreeKTrees -= 2
      }
    }

    let cur = null
    let head = null

    for (let i = sortedTrees.length - 1; i >= 0; i--) {
      const trees = sortedTrees[i]
      if (trees.length === 0) continue

      const tree = trees[0]

      if (!cur) {
        cur = tree
        head = cur
      } else {
        cur.sibling = tree
        cur = cur.sibling
      }
    }

    return head
  }

  // Links two trees with degree k-1, B_(k-1), and makes one tree with degree
  // k, B_k, where nodeA becomes the root of the new tree.
  // It does this by making treeB the new head of treeA's children in O(1)
  private linkTrees(treeA: BinomialNode<T>, treeB: BinomialNode<T>): BinomialNode<T> {
    treeB.parent = treeA
    treeB.sibling = treeA.child

    treeA.child = treeB
    treeA.degree += 1

    treeA.sibling = null

    return treeA
  }

  // Sorts the list of trees (forest) in O(t + logn) time using bucket sort.
  // Bucket sort is used because we have a cap on the degrees of our tree - logt.
  // Using a traditional sorting algorithm would take O(tlogt).
  private sortForest(): Array<Array<BinomialNode<T>>> {
    // Initialize an array of size logn - O(logn)
    const sortedTrees = new Array<Array<BinomialNode<T>>>(Math.ceil(Math.log2(this.size + 1)))

    // intialize buckets in sortedTrees
    for (let i = 0; i < sortedTrees.length; i++) {
      sortedTrees[i] = []
    }

    let cur = this.head

    // distribute the trees into buckets - O(t)
    while (cur) {
      const nextCur = cur.sibling
      cur.sibling = null

      const index = cur.degree

      sortedTrees[index].push(cur)
      cur = nextCur
    }

    return sortedTrees
  }

  /**
   * Decreases the value of the given node to the new value. Returns true if
   * successful, and false otherwise - O(logn)
   * @param {BinomialNode<T>} node
   * @param {T} newValue
   * @returns {boolean}
   */
  decreaseKey(node: BinomialNode<T>, newValue: T): boolean {
    // if newKey >= key, don't update
    if (this.compare(node.value, newValue) < 0) return false

    node.value = newValue

    let cur = node
    let parent = cur.parent

    // swim in O(logn)
    while (parent && cur.value < parent.value) {
      const temp = parent.value
      parent.value = cur.value
      cur.value = temp

      cur = parent
      parent = cur.parent
    }

    return true
  }
}

export default LazyMinBinomialHeap

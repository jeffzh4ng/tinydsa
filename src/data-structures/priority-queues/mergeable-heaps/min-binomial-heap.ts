import BinomialNode from './binomial-node'
import * as utils from '../../utils'

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
 * findMin() - O(1)
 * merge() - O(logn + logm) ~~~improved from O(n+m)!
 *
 * More info can be found here: https://en.wikipedia.org/wiki/Binomial_heap
 * The Implementation belowbased off Binomial Heap pseudocode from CLRS ed 2 (Chapter 19)
 ******************************************************************************/

class MinBinomialHeap<T> {
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
   * Enqueues element onto the heap.
   * @param {T} element
   * @returns {void}
   */
  enqueue(element: T): BinomialNode<T> {
    // create a heap containing the single new element, hPrime
    const heapWithElement = new MinBinomialHeap<T>(this.smallestValue)
    const insertedElement = new BinomialNode(element)
    heapWithElement.head = insertedElement

    // union that heap with our current heap
    const newHeap = this.union(heapWithElement) // O(logn)! not O(n)
    this.size += 1

    // set the current heap's head pointer to the newHeap's head pointer
    this.head = newHeap.head

    this.recalculateMin()

    return insertedElement
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

    if (smallestRoot.child) {
      // make a new heap out of the reversed linked list of B_k's children
      const reversedChildren = new MinBinomialHeap<T>(this.smallestValue)
      reversedChildren.head = this.reverseListOfRoots(smallestRoot.child) // O(???)

      // union the reversedChildren heap with the current heap to form the new heap
      const newHeap = this.union(reversedChildren) // O(logn)
      this.head = newHeap.head
    }

    this.recalculateMin()

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

  // reverses linked list of trees in O(t) time where t is the number of trees/roots
  private reverseListOfRoots(head: BinomialNode<T>): BinomialNode<T> {
    let cur: BinomialNode<T> | null = head
    let prev: BinomialNode<T> | null = null
    let next: BinomialNode<T> | null = null

    while (cur) {
      next = cur.sibling
      cur.sibling = prev
      prev = cur
      cur = next
    }

    // eslint-disable-next-line
    return prev!
  }

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
   * Unions supplied heap with current heap - O(logn + logm)
   * @param {MinBinomialHeap<T>} otherHeap
   * @returns {MinBinomialHeap<T>}
   */
  union(otherHeap: MinBinomialHeap<T>): MinBinomialHeap<T> {
    // FIRST PHASE
    // =========================================================================

    // this.mergeForests() merges the root lists of otherHeap (H1) and thisHeap (H2)
    // into a single root list H that is sorted by monotonically increasing
    // degree

    // this.mergeForests() runs in O(m) times where m = n1 + n2
    // by applying the merge step in merge sort to the two linked lists of roots
    const newHeap = this.mergeForests(this, otherHeap) // O(n + m)

    if (newHeap.head === null) return newHeap // return null if both H1 and H2 were null

    // SECOND PHASE
    // =========================================================================

    // From the merge, there might now be two roots (but no more) of some degree k.
    // Second phase links roots of equal degree until at most one root remains of each degree.

    let prevRoot: BinomialNode<T> | null = null
    let root = newHeap.head
    let nextRoot = root.sibling

    while (nextRoot !== null) {
      const currentTwoRootsAreNotEqual = root.degree !== nextRoot.degree
      const nextTwoRootsAreEqual =
        nextRoot.sibling !== null && nextRoot.sibling.degree === nextRoot.degree

      const movePointers = currentTwoRootsAreNotEqual || nextTwoRootsAreEqual

      // nextTwoRootsAreEqual only gets evaluated if currentTwoRootsAreNotEqual is false
      // this ==> that the next three roots are equal
      // this occurs after linking two  B_(k-1) trees to B_k, but the next two
      // roots are B_k as well

      // degree[root] = degree[root.sibling] = degree[root.sibling.sibling]

      if (movePointers) {
        prevRoot = root
        root = nextRoot

        // we don't update nextRoot in this branch
        // we do it outside  the if/else bc it's common to all cases
      } else {
        // the smaller root becomes the new root when linking to maintain the
        // heap invariant
        if (root.value <= nextRoot.value) {
          root.sibling = nextRoot.sibling // removes nextRoot from list

          this.linkTrees(root, nextRoot)
        } else {
          // then nextRoot.value < root.value
          if (prevRoot === null) {
            // if root is the head, point newHeap.head to nextRoot
            newHeap.head = nextRoot
          } else {
            // otherwise, just remove current root by linking prevRoot.sibling to nextRoot
            prevRoot.sibling = nextRoot
          }

          this.linkTrees(nextRoot, root)
          root = nextRoot
        }
      }

      // root now points to a binomial tree that is now the first of one, two,
      // or three B_(k+1) trees on newHeap linked list of roots

      nextRoot = root.sibling
    }

    return newHeap
  }

  // Links two trees with degree k-1, B_(k-1), and makes one tree with degree
  // k, B_k, where nodeA becomes the root of the new tree.
  // It does this by making treeB the new head of treeA's children in O(1)
  private linkTrees(treeA: BinomialNode<T>, treeB: BinomialNode<T>): void {
    treeB.parent = treeA
    treeB.sibling = treeA.child

    treeA.child = treeB
    treeA.degree += 1
  }

  // Merges two forests and returns one forest sorted by degree in O(t)
  // time where t is the total number of trees in both forests.
  private mergeForests(heapA: MinBinomialHeap<T>, heapB: MinBinomialHeap<T>): MinBinomialHeap<T> {
    if (!heapA.head) return heapB
    if (!heapB.head) return heapA

    let head = null

    let a: BinomialNode<T> | null = heapA.head
    let b: BinomialNode<T> | null = heapB.head

    if (a.degree < b.degree) {
      head = a
      a = a.sibling
    } else {
      head = b
      b = b.sibling
    }

    let cur: BinomialNode<T> | null = head

    while (a !== null && b !== null) {
      if (a.degree < b.degree) {
        cur.sibling = a
        a = a.sibling
      } else {
        cur.sibling = b
        b = b.sibling
      }

      cur = cur.sibling
    }

    if (a !== null) {
      cur.sibling = a
    }

    if (b !== null) {
      cur.sibling = b
    }

    const mergedHeap = new MinBinomialHeap<T>(this.smallestValue)
    mergedHeap.head = head
    mergedHeap.size = heapA.size + heapB.size

    return mergedHeap
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

export default MinBinomialHeap

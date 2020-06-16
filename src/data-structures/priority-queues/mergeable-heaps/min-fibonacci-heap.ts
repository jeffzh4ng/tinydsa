import FibonacciNode from './fibonacci-node'
import * as utils from '../../utils'

/*******************************************************************************
 * A fibonacci heap is a lazy binomial heap with lazy decreaseKey(). Some important
 * algorithms heavily rely on decreaseKey(). Dijkstra's shortest path, Prim's
 * minimum spanning tree. Fibonacci heaps give the theoretically optimal implementation
 * of Prim's and Dijkstra's algorithms.
 *
 * decreaseKey() is implemented as follows:
 *
 * If a node's value gets decreased such that it's value is less than it's parents,
 * (violating heap invariant), we don't swim it up. Instead, we cut the child off
 * from it's parent and make it a root in our list of roots.
 *
 * However, if we're allowed to cut off any number of nodes from a tree, than
 * our trees will degenerate into trees into shapes we don't want. A tree of
 * degree k will only have k + 1 nodes. Then, the number of nodes in the tree
 * is no longer exponential (2^k). This in turn makes decreaseKey() inefficient,
 * running in O(n) time.
 *
 * The problem is that a rank k tree thinks they're big. But the'yre losing all their
 * descendants. We need to convey to them that they're losing all their
 * children/descendants.
 *
 * We want the tree's to only become somewhat imbalanced, slowly propagating this
 * information to the root.
 *
 * Here's the solution:
 * ===================
 * Rule 1. Lose one child, you’re a loser.
 * Rule 2. Lose two, and you're dumped into the root list.
 *
 * If a node loses two children, we'll cut it from IT'S parent and move it to
 * our main root list.
 *
 * Then, a tree can only become "maximally damaged". The number of nodes in the
 * sequence of maximally damaged trees is the fibonacci sequence, hence the name
 * of the data structure.
 *
 * enqueue() - O(1)
 * extractMin() - O(logn) amortized
 * findMin() - O(1)
 * merge() - O(1)
 * decreaseKey() - O(1) ~~ down from O(logn) due to being lazy :)
 *
 * More info can be found here: https://en.wikipedia.org/wiki/Fibonacci_heap
 *
 * The implementation below is based off the Fibonacci Heap pseudocode from CLRS Chapter 20
 ******************************************************************************/

class MinFibonacciHeap<T> {
  head: FibonacciNode<T> | null
  size: number

  minRoot: FibonacciNode<T> | null

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
  enqueue(element: T): FibonacciNode<T> {
    const newRoot = new FibonacciNode(element)

    // lazily enqueue the element to the forest
    if (this.head) {
      newRoot.sibling = this.head
      this.head.prevSibling = newRoot
    }

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
  dequeue(): FibonacciNode<T> | null {
    // remove smallest root of smallest tree B_k from heap
    const smallestRoot = this.removeSmallestRoot() // O(logn)
    this.size -= 1

    if (!smallestRoot) return smallestRoot

    // if the root has children, add it to the forest
    if (smallestRoot.child) {
      let child: FibonacciNode<T> | null = smallestRoot.child
      let lastChild: FibonacciNode<T> | null = null

      // delete all parent pointers in children while traversing to the last child
      while (child) {
        lastChild = child
        child.parent = null
        child = child.sibling
      }

      if (this.head) {
        lastChild!.sibling = this.head
        this.head.prevSibling = lastChild
      }

      this.head = smallestRoot.child
    }

    this.head = this.consolidate()

    // if we removed the smallest root, recalculate the minRoot pointer
    if (this.minRoot === smallestRoot) this.recalculateMin()

    // return the removed root
    return smallestRoot
  }

  // O(logn)
  private removeSmallestRoot(): FibonacciNode<T> | null {
    if (!this.head) return null

    let cur: FibonacciNode<T> | null = this.head
    let prev = cur

    let min = cur
    let prevMin = null
    cur = cur.sibling

    // find the min root in O(logn)
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

      if (this.head) this.head.prevSibling = null
    } else {
      // otherwise link prev root with min's right root
      prevMin.sibling = min.sibling
      if (min.sibling) min.sibling.prevSibling = prevMin
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

  /**
   * Deletes the given node - O(logn)
   * @param {FibonacciNode<T>} node
   * @returns {void}
   */
  deleteNode(node: FibonacciNode<T>): FibonacciNode<T> | null {
    // make it the smallest node in the heap so it swims up
    this.decreaseKey(node, this.smallestValue) // O(logn)

    // dequeue the smallest node from the heap
    return this.dequeue() // O(logn)
  }

  /*****************************************************************************
                                  READING
  *****************************************************************************/
  /**
   * Returns the smallest node in the heap, null if the heap is empty O(1)
   * @returns {FibonacciNode<T> | null}
   */
  peek(): FibonacciNode<T> | null {
    if (!this.head) return null

    return this.minRoot
  }

  /*****************************************************************************
                                  UPDATING
  *****************************************************************************/
  /**
   * Unions supplied heap with current heap - O(1). Current implementation
   * is destructive.
   * @param {FibonacciHeap<T>} otherHeap
   * @returns {FibonacciHeap<T>}
   */
  union(otherHeap: MinFibonacciHeap<T>): MinFibonacciHeap<T> {
    const unionedHeap = new MinFibonacciHeap<T>(this.smallestValue)
    unionedHeap.head = this.head

    let cur = unionedHeap.head

    while (cur && cur.sibling) {
      cur = cur.sibling
    }

    cur!.sibling = otherHeap.head
    if (otherHeap.head) otherHeap.head.prevSibling = cur

    unionedHeap.size = this.size + otherHeap.size

    return unionedHeap
  }

  /**
   * Consolidates the current state of the heap such that only one tree exists
   * for degree k - O(t + logn)
   * @returns {MinFibonacciHeap<T>}
   */
  private consolidate(): FibonacciNode<T> | null {
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
        tree.prevSibling = cur
        cur = cur.sibling
      }
    }

    return head
  }

  // Links two trees with degree k-1, B_(k-1), and makes one tree with degree
  // k, B_k, where nodeA becomes the root of the new tree.
  // It does this by making treeB the new head of treeA's children in O(1)
  private linkTrees(treeA: FibonacciNode<T>, treeB: FibonacciNode<T>): FibonacciNode<T> {
    treeB.parent = treeA
    treeB.sibling = treeA.child
    if (treeA.child) treeA.child.prevSibling = treeB
    treeB.prevSibling = null
    treeB.mark = false // important

    treeA.child = treeB
    treeA.degree += 1

    treeA.sibling = null
    treeB.prevSibling = null

    return treeA
  }

  // Sorts the list of trees (forest) in O(t + logn) time using bucket sort.
  // Bucket sort is used because we have a cap on the degrees of our tree - logt.
  // Using a traditional sorting algorithm would take O(tlogt).
  private sortForest(): Array<Array<FibonacciNode<T>>> {
    // Initialize an array of size logn - O(logn)
    const sortedTrees = new Array<Array<FibonacciNode<T>>>(Math.ceil(Math.log2(this.size + 1)))

    // intialize buckets in sortedTrees
    for (let i = 0; i < sortedTrees.length; i++) {
      sortedTrees[i] = []
    }

    let cur = this.head

    // distribute the trees into buckets - O(t)
    while (cur) {
      const nextCur = cur.sibling
      cur.parent = null
      cur.sibling = null
      cur.prevSibling = null

      const index = cur.degree

      sortedTrees[index].push(cur)
      cur = nextCur
    }

    return sortedTrees
  }

  /**
   * Decreases the value of the given node to the new value. If the new value is
   * smaller than it's parent, it lazily promotes the node to become a root of
   * the forest instead of swimming it up. Returns true if successful, and false
   * otherwise - O(1)
   * @param {FibonacciNode<T>} node
   * @param {T} newValue
   * @returns {boolean}
   */
  decreaseKey(node: FibonacciNode<T>, newValue: T): boolean {
    // if newKey >= key, don't update
    if (this.compare(node.value, newValue) < 0) return false

    node.value = newValue

    if (node.parent && node.value < node.parent.value) {
      this.cut(node.parent, node)
      this.cascadingCut(node.parent)

      const nodeIsSmallestNode = !this.minRoot || node.value < this.minRoot.value
      if (nodeIsSmallestNode) this.minRoot = node
    }

    return true
  }

  // Cuts child from parent in O(1) time
  private cut(parent: FibonacciNode<T>, child: FibonacciNode<T>): void {
    // remove the node from the parent's list of children
    if (parent.child === child) {
      parent.child = child.sibling
      child.prevSibling = null
    } else {
      if (!child.prevSibling) throw new Error()
      child.prevSibling.sibling = child.sibling
    }

    // decrement parents degree
    parent.degree -= 1

    // prepare child to become a root
    child.parent = null
    child.mark = false

    // promote child to a root of a new tree
    if (this.head) {
      child.sibling = this.head
      child.prevSibling = null
      this.head.prevSibling = child
    }
    this.head = child
  }

  private cascadingCut(parent: FibonacciNode<T>): void {
    if (!parent || !parent.parent) return

    // if the parent.mark is false, it's first child was just removed
    // so let's set parent.mark to true now
    if (parent.mark === false) {
      parent.mark = true
    } else {
      // O/w, parent.mark is true. This means it's second child was just removed,
      // so we have to cut the current node, and cascade

      this.cut(parent.parent, parent)
      this.cascadingCut(parent.parent)
    }
  }
}

export default MinFibonacciHeap

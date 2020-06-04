import * as utils from '../utils'

/*******************************************************************************
 * A D-ary implements the Priority Queue ADT, just like the binary heap.
 * What's different is that it has d children.
 *
 * D-ary heaps are better for decreaseKey operations because decreaseKey()
 * means we must swim the node up (min heap). Since d > 2, log_d(n) < log_2(n),
 * meaning we swim up fewer levels.
 *
 * This is preferred for algorithms with heavy decreaseKey() calls like
 * Djikstra's shortest path and Prim's minimum spanning tree.
 *
 *
 * add(element) - O(log_dn) no comparisons needed for swimming up
 * poll() - O(dlog_dn) (d child comparisons when sinking to find min child)
 * decreaseKey() - O(log_dn) bc we swim up
 * peek() - O(1)
 *
 * More info can be found here: https://www.geeksforgeeks.org/k-ary-heap/
 ******************************************************************************/

class MinDHeap<T> {
  // a dynamic array to hold our elements
  private heap: T[]
  private d: number

  private compare: utils.CompareFunction<T>

  constructor(degree: number, compareFunction?: utils.CompareFunction<T>) {
    this.heap = []
    this.d = Math.max(2, degree) // degree must be at least 2

    this.compare = compareFunction || utils.defaultCompare
  }

  /*****************************************************************************
                                  NICETIES
  *****************************************************************************/
  /**
   * Returns the size of the heap - O(1)
   * @returns {number}
   */
  size(): number {
    return this.heap.length
  }
  /**
   * Returns true if the heap is empty, false otherwise - O(1)
   * @returns {boolean}
   */
  isEmpty(): boolean {
    return this.size() == 0
  }

  /*****************************************************************************
                                  INSERTION
  *****************************************************************************/
  /**
   * Adds an element to the heap, while maintaing the heap invariant - O(log_d(n))
   * @param {T} element
   * @returns {void}
   */
  add(element: T): void {
    this.heap.push(element)
    const indexOfLastElement = this.size() - 1
    this.swim(indexOfLastElement) // O(log_d(n))
  }

  /*****************************************************************************
                                  ACCESSING
  *****************************************************************************/
  /**
   * Peeks at the top most element in the heap - O(1)
   * @returns {T}
   */
  peek(): T | null {
    if (this.isEmpty()) return null

    return this.heap[0]
  }

  /*****************************************************************************
                                  SEARCHING
  *****************************************************************************/
  /**
   * Returns true if element is in heap, false otherwise - O(n)
   * @param {T} element
   * @returns {boolean}
   */
  contains(element: T): boolean {
    return this.heap.includes(element)
  }

  /*****************************************************************************
                                  DELETION
  *****************************************************************************/
  /**
   * Removes and returns top most element of heap - O(log_d(n))
   * @returns {T}
   */
  poll(): T | null {
    if (this.isEmpty()) return null

    return this.removeAt(0) // O(log(n))
  }
  /**
   * Removes element if it exists. Returns true if success, false otherwise - O(n)
   * @param {T} element
   * @returns {boolean}
   */
  remove(element: T): boolean {
    // O(n), linear scan to find elementIndex
    const elementIndex = this.heap.findIndex((h: T) => this.compare(element, h) === 0)

    if (elementIndex === -1) return false

    this.removeAt(elementIndex) // O(log(n))
    return true
  }
  /**
   * Clears the heap - O(1)
   * @returns {void}
   */
  clear(): void {
    this.heap.length = 0
  }

  /*****************************************************************************
                                  HELPERS
  *****************************************************************************/
  // O(1)
  private getChildrenIndices(parentIndex: number): number[] {
    const indices = []
    for (let i = 1; i <= this.d; i++) {
      indices.push(parentIndex * this.d + i)
    }

    return indices
  }
  // O(1)
  private getParentIndex(childIndex: number): number {
    return Math.floor((childIndex - 1) / this.d)
  }

  /**
   * Returns true if a is less than b, false otherwise
   * @param {number} a
   * @param {number} b
   */
  private less(a: number, b: number) {
    return this.compare(this.heap[a], this.heap[b]) < 0
  }

  /**
   * Sinks element with index k until heap invariant is satisfied - O(dlog(n))
   * O(dlog(n)) because in the worst case we sink the element down the entire
   * height of the tree. At each level, we have to do d comparisons to find
   * smallest child to swim down.
   * @param {number} k
   * @returns {void}
   */
  private sink(k: number): void {
    // eslint-disable-next-line
    while (true) {
      const childrenIndices = this.getChildrenIndices(k)

      // get smallest index O(d)
      let smallestIndex = childrenIndices[0] // assume left most child is smallest at first
      for (const childIndex of childrenIndices) {
        if (childIndex < this.size() && this.less(childIndex, smallestIndex)) {
          smallestIndex = childIndex
        }
      }

      const indexOutOfBounds = smallestIndex >= this.size()
      const elementIsLessThanChild = this.less(k, smallestIndex)
      if (indexOutOfBounds || elementIsLessThanChild) break

      this.swap(smallestIndex, k) // O(1)
      k = smallestIndex // set k to child index, and we repeat loop
    }
  }

  /**
   * Swims an element with index k until heap invariant is satisfied - O(log_d(n))
   * O(logd(n)) because in the worst case we swim the element up the entire tree
   * @param {number} k
   * @returns {void}
   */
  private swim(k: number): void {
    let parentIndex = this.getParentIndex(k)

    while (k > 0 && this.less(k, parentIndex)) {
      this.swap(parentIndex, k)
      k = parentIndex // move k pointer up

      parentIndex = this.getParentIndex(k)
    }
  }

  // O(1)
  private swap(i: number, j: number): void {
    const temp = this.heap[i]

    this.heap[i] = this.heap[j]
    this.heap[j] = temp
  }

  /**
   * Removes element at provided index by swapping it with last element, and
   * heapifying the swapped element by sinking/swimming it - O(dlog(n)).
   *
   * O(dlog(n)) because in worst case we have to sink element throughout entire
   * tree
   * @param {number} indexToRemove
   * @returns {T}
   * @throws {OUT_OF_BOUNDS_ERROR, EMPTY_ERROR}
   */
  private removeAt(indexToRemove: number): T {
    // Following these 3 loc never execute. removeAt() is only called with
    // removeAt(0) and in remove() which finds the specified index

    // const indexOutOfBounds = indexToRemove < 0 || indexToRemove > this.size()
    // if (indexOutOfBounds) throw new Error(utils.OUT_OF_BOUNDS_ERROR)
    // if (this.isEmpty()) return null

    const indexOfLastElement = this.size() - 1
    // save the removed element so we can return it after heapifying
    const removedElement = this.heap[indexToRemove]

    // swap the removed element with the last element
    this.swap(indexToRemove, indexOfLastElement)
    // delete the removed element!
    this.heap.pop()

    // if last element is being removed, no need to heapify
    const lastElementIsBeingRemoved = indexToRemove === indexOfLastElement
    if (lastElementIsBeingRemoved) return removedElement

    // try sinking
    const indexToBeHeapified = indexToRemove
    const elementToBeHeapified = this.heap[indexToBeHeapified]
    this.sink(indexToBeHeapified)

    const elementDidNotMove = this.heap[indexToBeHeapified] === elementToBeHeapified
    if (elementDidNotMove) this.swim(indexToBeHeapified) // swim if sinking didn't work

    // return saved value from before
    return removedElement
  }
}

export default MinDHeap

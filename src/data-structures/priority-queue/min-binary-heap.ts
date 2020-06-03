import * as utils from '../utils'

/*******************************************************************************
 * A min binary heap implements the Priority Queue ADT. It has constant access
 * to the min element of the heap in O(1).
 *
 * add(element) - O(logn)
 * poll() - O(logn)
 * peek() - O(1)
 ******************************************************************************/
class MinBinaryHeap<T> {
  // a dynamic array to hold our elements
  private heap: T[]
  private compare: utils.CompareFunction<T>

  constructor(
    elements?: Iterable<T>,
    compareFunction?: utils.CompareFunction<T>
  ) {
    this.heap = []
    this.compare = compareFunction || utils.defaultCompare

    if (elements) {
      this.heap = Array.from(elements)
      this.heapify()
    }
  }

  // O(n)
  private heapify(): void {
    let i = Math.max(0, Math.floor(this.size() / 2) - 1)
    for (; i >= 0; i--) {
      this.sink(i)
    }
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
   * Adds an element to the heap, while maintaing the heap invariant - O(log(n))
   * @param {T} element
   * @returns {void}
   */
  add(element: T): void {
    this.heap.push(element)
    const indexOfLastElement = this.size() - 1
    this.swim(indexOfLastElement)
  }

  /*****************************************************************************
                                  ACCESSING
  *****************************************************************************/
  /**
   * Peeks at the top most element in the heap - O(1)
   * @returns {T}
   * @throws {EMPTY_ERROR}
   */
  peek(): T {
    if (this.isEmpty()) throw utils.EMPTY_ERROR

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
   * Removes and returns top most element of heap - O(log(n))
   * @returns {T}
   * @throws {EMPTY_ERROR}
   */
  poll(): T {
    if (this.isEmpty()) throw utils.EMPTY_ERROR

    return this.removeAt(0) // O(log(n))
  }
  /**
   * Removes element if it exists. Returns true if success, false otherwise - O(n)
   * @param {T} element
   * @returns {boolean}
   */
  remove(element: T): boolean {
    // O(n), linear scan to find elementIndex
    const elementIndex = this.heap.findIndex(
      (h: T) => this.compare(element, h) === 0
    )

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
  private getLeftChildIndex(parentIndex: number): number {
    return parentIndex * 2 + 1
  }
  // O(1)
  private getRightChildIndex(parentIndex: number): number {
    return parentIndex * 2 + 2
  }
  // O(1)
  private getParentIndex(childIndex: number): number {
    return Math.floor((childIndex - 1) / 2)
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
   * Sinks element with index k until heap invariant is satisfied - O(log(n))
   * O(log(n)) because in the worst case we sink the element down the entire
   * height of the tree
   * @param {number} k
   * @returns {void}
   */
  private sink(k: number): void {
    while (true) {
      const leftChildIndex = this.getLeftChildIndex(k)
      const rightChildIndex = this.getRightChildIndex(k)

      // get smallest index
      let smallestIndex = leftChildIndex
      const rightChildIsSmallerThanLeft =
        rightChildIndex < this.size() &&
        this.less(rightChildIndex, leftChildIndex)
      if (rightChildIsSmallerThanLeft) smallestIndex = rightChildIndex

      const indexOutOfBounds = leftChildIndex >= this.size()
      const elementIsLessThanChild = this.less(k, smallestIndex)
      if (indexOutOfBounds || elementIsLessThanChild) break

      this.swap(smallestIndex, k) // O(1)
      k = smallestIndex // set k to child index, and we repeat loop
    }
  }

  /**
   * Swims an element with index k until heap invariant is satisfied - O(log(n))
   * O(log(n)) because in the worst case we swim the element up the entire tree
   * @param {number} k
   * @returns {void}
   */
  private swim(k: number): void {
    let parentIndex = this.getParentIndex(k)

    while (k > 0 && this.less(k, parentIndex)) {
      this.swap(parentIndex, k)
      k = parentIndex

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
   * heapifying the swapped element by sinking/swimming it - O(log(n)).
   *
   * O(log(n)) because in worst case we swink/swim element throughout the entire tree
   * @param {number} indexToRemove
   * @returns {T}
   * @throws {OUT_OF_BOUNDS_ERROR, EMPTY_ERROR}
   */
  private removeAt(indexToRemove: number): T {
    // Following these 3 loc never execute. removeAt() is only called with
    // removeAt(0) and in remove() which finds the specified index

    // const indexOutOfBounds = indexToRemove < 0 || indexToRemove > this.size()
    // if (indexOutOfBounds) throw new Error(utils.OUT_OF_BOUNDS_ERROR)
    // if (this.isEmpty()) throw new Error(utils.EMPTY_ERROR)

    const indexOfLastElement = this.size() - 1
    // save the removed element so we can return it after heapifying
    const removedElement = this.heap[indexToRemove]

    // swap the removed element with the last element
    this.swap(indexToRemove, indexOfLastElement)
    // delete the removed element!
    this.heap.pop()

    // if last element is being removed, no need to heapify (sink/swim)
    const lastElementIsBeingRemoved = indexToRemove === indexOfLastElement
    if (lastElementIsBeingRemoved) return removedElement

    // try sinking
    const indexToBeHeapified = indexToRemove
    const elementToBeHeapified = this.heap[indexToBeHeapified]
    this.sink(indexToBeHeapified)

    // if sinking did not work try swimming
    if (this.heap[indexToBeHeapified] === elementToBeHeapified) {
      this.swim(indexToBeHeapified)
    }

    // return saved value from before
    return removedElement
  }
}

export default MinBinaryHeap

import * as utils from '../utils'

/*******************************************************************************
 * An indexed version of the min D-heap. For more information on D-heaps, see
 * ./min-d-heap.ts
 *
 * This version of a heap allows us to add key value pairs. This gives us
 * logarithmic removals and updates, instead of linear.
 *
 * We could add do this in a hacky way by adding a mapping from values to indices.
 * So if we wanted to update or remove a specific value we know the index in the heap
 * in O(1) time.
 *
 * But then using non-primitive complex objects become a hassle. We have to tell
 * the heap class how to access the value. A better solution is to base it off
 * unique keys associated with all the nodes.
 *
 * enqueue(val) - O(log_d(n))
 * dequeue() - O(log_d(n))
 * peek() - O(1)
 * remove(val) - O(log_d(n))! improved from O(n)
 * update(key, val) - O(log_d(n))! improved from O(n)
 * decreaseKey(key, val) - O(log_d(n))! improved from O(n)
 * increaseKey(key, val) - O(log_d(n))! improved from O(n)
 *
 * More info can be found here: https://algs4.cs.princeton.edu/24pq/IndexMinPQ.java.html
 ******************************************************************************/

class MinIndexedDHeap<T> {
  private d: number // the degree of every node in the heap
  private sz: number // size of heap

  private values: Array<T | null> // maps key indices -> values
  public heap: number[] // maps positions in heap -> key indices
  public pm: number[] // maps key indices -> positions in heap

  private compare: utils.CompareFunction<T>

  constructor(degree: number, compareFunction?: utils.CompareFunction<T>) {
    this.d = Math.max(2, degree) // degree must be at least 2
    this.sz = 0

    this.values = []
    this.heap = []
    this.pm = []

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
    return this.sz
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
   * Adds an value with index to the heap, while maintaing heap invariant - O(log_d(n))
   * @param {number} key - index of node
   * @param {T} value - value of node
   * @returns {void}
   */
  add(key: number, value: T): boolean {
    if (this.contains(key)) return false

    this.values[key] = value // add element to value lookup first

    this.heap.push(key) // update heap
    this.sz += 1

    const keyPosition = this.size() - 1
    this.pm[key] = keyPosition // update position map

    this.swim(keyPosition) // O(log_d(n))

    return true
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

    const key = this.heap[0] // get top most element
    const value = this.values[key]
    return value // get the value associated with key
  }

  valueOf(key: number): T | null {
    if (!this.contains(key)) return null

    const value = this.values[key]
    return value
  }

  /*****************************************************************************
                                  UPDATING
  *****************************************************************************/
  updateKey(key: number, value: T): boolean {
    if (!this.contains(key)) return false
    if (!this.values[key]) return false // this means key was unset, so technically it does not exist

    // update key value lookup first
    this.values[key] = value

    // find the key's position in the heap
    const position = this.pm[key] // O(1) access! no linear seach required :)

    // and then heapify
    this.sink(position)
    this.swim(position)

    return true
  }

  decreaseKey(key: number, newValue: T): boolean {
    if (!this.contains(key)) return false

    const oldValue = this.values[key]
    if (!oldValue) return false

    // ensure newValue is less than oldValue before updating key value lookup
    if (this.lessForValues(newValue, oldValue)) this.values[key] = newValue

    // find position of key
    const positionOfKey = this.pm[key] // O(1) access! no linear search required

    // and heapify
    this.swim(positionOfKey) // O(log_dn)

    return true
  }

  increaseKey(key: number, newValue: T): boolean {
    if (!this.contains(key)) return false

    const oldValue = this.values[key]
    if (!oldValue) return false

    // ensure newValue is greater than oldValue before updating key value lookup
    if (this.lessForValues(oldValue, newValue)) this.values[key] = newValue

    // find position of key
    const positionOfKey = this.pm[key] // O(1) access! no linear search required

    // and heapify
    this.sink(positionOfKey) // O(log_dn)

    return true
  }

  /*****************************************************************************
                                  SEARCHING
  *****************************************************************************/
  /**
   * Returns true if key is in heap, false otherwise - O(1)
   * @param {number} key
   * @returns {boolean}
   */
  contains(key: number): boolean {
    // position map tells us if key exists in heap
    return this.pm[key] !== undefined && this.pm[key] !== -1 // O(1) access! no linear search required
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

    const keyToBeRemoved = this.heap[0]
    const removedValue = this.values[keyToBeRemoved] // get the key's value

    this.deleteKey(keyToBeRemoved) // O(log(n))

    return removedValue
  }

  deleteKey(key: number): T | null {
    if (!this.contains(key)) return null

    // save value for return, and delete it
    const value = this.values[key]
    if (value === null) throw new Error()
    this.values[key] = null

    // swap root node with last node
    const removedElementPosition = this.pm[key]
    const lastElementPosition = this.size() - 1
    this.swap(removedElementPosition, lastElementPosition)

    // remove last key from heap
    this.heap.pop()
    this.sz -= 1

    // heapify the last element which was swapped
    this.sink(removedElementPosition)
    this.swim(removedElementPosition)

    // remove key from position map
    this.pm[key] = -1

    return value
  }

  /**
   * Clears the heap - O(1)
   * @returns {void}
   */
  clear(): void {
    this.values.length = 0
    this.pm.length = 0
    this.heap.length = 0
    this.sz = 0
  }

  /*****************************************************************************
                                  HELPERS
  *****************************************************************************/
  // O(1)
  private getChildrenPositions(parentIndex: number): number[] {
    const indices = []
    for (let i = 1; i <= this.d; i++) {
      indices.push(parentIndex * this.d + i)
    }

    return indices
  }
  // O(1)
  private getParentPosition(childIndex: number): number {
    return Math.floor((childIndex - 1) / this.d)
  }

  /**
   * Returns true if value of value at positionA is less than value at positionB
   * @param {number} positionA
   * @param {number} positionB
   */
  private lessForPositions(positionA: number, positionB: number): boolean {
    // we need to compare values, but we were given positions...

    // find the keys first from positions with heap
    const keyA = this.heap[positionA]
    const keyB = this.heap[positionB]

    // then find values of keys with key value lookup
    const valueA = this.values[keyA]
    const valueB = this.values[keyB]

    if (valueA === null || valueB === null) throw new Error(utils.VALUE_DOES_NOT_EXIST_ERROR)

    // now we can compare the raw values
    return this.compare(valueA, valueB) < 0
  }

  private lessForValues(a: T, b: T): boolean {
    return this.compare(a, b) < 0
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
    while (true) {
      const childrenPositions = this.getChildrenPositions(k)

      // get position of smallest child - O(d)
      let smallestChildPosition = childrenPositions[0] // assume left most child is smallest at first
      for (const childPosition of childrenPositions) {
        const childPositionIsInBounds = childPosition < this.size()
        const currentChildIsSmallerThanCurrentMin = this.lessForPositions(childPosition, smallestChildPosition)

        if (childPositionIsInBounds && currentChildIsSmallerThanCurrentMin) {
          smallestChildPosition = childPosition
        }
      }

      const childPositionOutOfBounds = smallestChildPosition >= this.size()
      const elementIsLessThanChild = this.lessForPositions(k, smallestChildPosition)
      if (childPositionOutOfBounds || elementIsLessThanChild) break

      this.swap(smallestChildPosition, k) // O(1)
      k = smallestChildPosition // point k to child node, and we repeat loop
    }
  }

  /**
   * Swims an element with index k until heap invariant is satisfied - O(log_d(n))
   * O(logd(n)) because in the worst case we swim the element up the entire tree
   * @param {number} k
   * @returns {void}
   */
  private swim(k: number): void {
    let parentPosition = this.getParentPosition(k)

    while (k > 0 && this.lessForPositions(k, parentPosition)) {
      this.swap(parentPosition, k)
      k = parentPosition // move k pointer up after swapping

      parentPosition = this.getParentPosition(k) // update parentIndex
    }
  }
  // O(1)
  private swap(positionI: number, positionJ: number): void {
    // notice how we don't touch this.values at all
    // this.values maps keys -> value
    // we only update heap and positionMap

    // swap their positions in position map
    // 1. first get keys...
    const keyI = this.heap[positionI]
    const keyJ = this.heap[positionJ]
    // 2. then swap them in the lookup map for positions
    this.pm[keyI] = positionJ // keyI will now be at positionJ
    this.pm[keyJ] = positionI // keyJ will now be at positionI

    // ====================================
    // now swap keys in actual heap
    const temp = this.heap[positionI]
    this.heap[positionI] = this.heap[positionJ]
    this.heap[positionJ] = temp
  }
}

export default MinIndexedDHeap

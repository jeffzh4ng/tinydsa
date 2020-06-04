import * as utils from '../../utils'

class CircularBuffer<T> {
  private list: T[]
  private sz: number
  private capacity: number

  private readIndex: number
  private writeIndex: number

  private equalsF: utils.EqualsFunction<T> = utils.defaultEquals

  constructor(capacity: number, equalsFunction?: utils.EqualsFunction<T>) {
    this.list = new Array(capacity)
    this.sz = 0
    this.capacity = capacity

    this.readIndex = 0
    this.writeIndex = 0

    if (equalsFunction) this.equalsF = equalsFunction
  }

  /*****************************************************************************
                                  NICETIES
  *****************************************************************************/
  /**
   * Returns size of queue - O(1)
   */
  size(): number {
    return this.sz
  }

  /**
   * Returns true if buffer is empty, false otherwise - O(1)
   */
  isEmpty(): boolean {
    return this.sz === 0
  }

  /**
   * Deletes all elements in buffer - O(capacity)
   */
  clear(): void {
    this.list = new Array(this.capacity)
    this.sz = 0
  }

  /*****************************************************************************
                                  INSERTION/DELETION
  *****************************************************************************/
  /**
   * Enqueues element into queue - O(1)
   * @param {T} element - element to be enqueued
   */
  enqueue(element: T): void {
    this.list[this.writeIndex] = element

    const elementIsOverWritten = this.sz !== 0 && this.writeIndex === this.readIndex
    if (elementIsOverWritten) this.readIndex = (this.readIndex + 1) % this.capacity

    this.writeIndex = (this.writeIndex + 1) % this.capacity

    this.sz += 1
  }

  /**
   * Dequeues element from queue - O(1)
   * @returns {T}
   */
  dequeue(): T | null {
    if (this.isEmpty()) return null

    const removedVal = this.list[this.readIndex]
    this.readIndex += 1

    this.sz -= 1
    return removedVal
  }

  /*****************************************************************************
                                  ACCESSING
  *****************************************************************************/
  /**
   * Peeks the element at the front of the buffer - O(1)
   * @returns {T} - Frontmost element
   */
  peekFront(): T | null {
    if (this.isEmpty()) return null
    return this.list[this.readIndex]
  }

  /**
   * Peeks the element at the back of the buffer - O(1)
   * @returns {T} - Backmost element
   */
  peekBack(): T | null {
    if (this.isEmpty()) return null
    let readIndex = this.writeIndex - 1
    if (readIndex < 0) readIndex = this.sz - 1

    return this.list[readIndex]
  }

  /*****************************************************************************
                                  SEARCHING
  *****************************************************************************/
  /**
   * Checks if element is in buffer - O(n)
   * @param {T} element  - element to search for
   * @returns {boolean}
   */
  contains(element: T): boolean {
    return this.list.some((val: T) => {
      return this.equalsF(val, element)
    })
  }
}

export default CircularBuffer

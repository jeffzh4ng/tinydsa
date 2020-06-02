import LinkedList from '../linked-list'
import * as utils from '../utils'

class Queue<T> implements Iterable<T> {
  private list: LinkedList<T>

  constructor(equalsFunction?: utils.EqualsFunction<T>) {
    if (equalsFunction) this.list = new LinkedList(equalsFunction)
    else this.list = new LinkedList()
  }

  /*****************************************************************************
                                  NICETIES
  *****************************************************************************/
  /**
   * Returns size of queue - O(1)
   */
  size(): number {
    return this.list.size()
  }
  /**
   * Returns true if queue is empty, false otherwise - O(1)
   */
  isEmpty(): boolean {
    return this.list.isEmpty()
  }
  /**
   * Deletes all elements in queue - O(1)
   */
  clear(): void {
    this.list.clear()
  }

  /*****************************************************************************
                                  INSERTION/DELETION
  *****************************************************************************/
  /**
   * Enqueues element into queue - O(1)
   * @param {T} element - element to be enqueued
   */
  enqueue(element: T): void {
    this.list.addFront(element)
  }
  /**
   * Dequeues element from queue - O(1)
   * @returns {T}
   * @throws {EMPTY_LIST_ERROR}
   */
  dequeue(): T {
    if (this.isEmpty()) throw new Error(utils.EMPTY_ERROR)
    return this.list.removeBack()
  }

  /*****************************************************************************
                                  ACCESSING
  *****************************************************************************/
  /**
   * Peeks at the element at the front of the queue - O(1)
   * @returns {T} - Frontmost element
   * @throws {EMPTY_LIST_ERROR}
   */
  peekFront(): T {
    if (this.isEmpty()) throw new Error(utils.EMPTY_ERROR)
    return this.list.peekBack()
  }
  /**
   * Peeks at the element at the back of the queue - O(1)
   * @returns {T} - Backmost element
   * @throws {EMPTY_LIST_ERROR}
   */
  peekBack(): T {
    if (this.isEmpty()) throw new Error(utils.EMPTY_ERROR)
    return this.list.peekFront()
  }

  /*****************************************************************************
                                  SEARCHING
  *****************************************************************************/
  /**
   * Checks if value is in queue
   * @param {T} element  - element to search for
   * @returns {boolean}
   */
  contains(element: T): boolean {
    return this.list.contains(element)
  }

  /*****************************************************************************
                                  HELPERS
  *****************************************************************************/
  [Symbol.iterator](): Iterator<T> {
    return this.list[Symbol.iterator]()
  }
}

export default Queue

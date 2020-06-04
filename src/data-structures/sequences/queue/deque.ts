import LinkedList from '../linked-list'
import * as utils from '../../utils'

class Deque<T> implements Iterable<T> {
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
   * Pushes element into front of queue - O(1)
   * @param {T} element - element to be enqueued
   */
  pushFront(element: T): void {
    this.list.addFront(element)
  }

  /**
   * Pushes element from back of queue - O(1)
   * @param {T} element - element to be enqueued
   */
  pushBack(element: T): void {
    this.list.addBack(element)
  }

  /**
   * Pops element from back queue - O(1)
   * @returns {T | null}
   */
  popFront(): T | null {
    if (this.isEmpty()) return null
    return this.list.removeFront()
  }

  /**
   * Pops element from back queue - O(1)
   * @returns {T | null}
   */
  popBack(): T | null {
    if (this.isEmpty()) return null
    return this.list.removeBack()
  }

  /*****************************************************************************
                                  ACCESSING
  *****************************************************************************/
  /**
   * Peeks at the element at the front of the queue - O(1)
   * @returns {T} - Frontmost element
   */
  peekFront(): T | null {
    if (this.isEmpty()) return null
    return this.list.peekFront()
  }

  /**
   * Peeks at the element at the back of the queue - O(1)
   * @returns {T} - Backmost element
   */
  peekBack(): T | null {
    if (this.isEmpty()) return null
    return this.list.peekBack()
  }

  /*****************************************************************************
                                  SEARCHING
  *****************************************************************************/
  /**
   * Checks if value is in queue - O(n)
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

export default Deque

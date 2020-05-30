import LinkedList from '../linked-list'
import { EqualsFunction } from '../utils'

class Queue<T> implements Iterable<T> {
  private list: LinkedList<T>

  constructor() {
    this.list = new LinkedList()
  }

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
   * Enqueues element into queue - O(1)
   * @param {T} element - element to be enqueued
   */
  enqueue(element: T): void {
    this.list.addFront(element)
  }
  /**
   * Dequeues element from queue - O(1)
   * @returns {T}
   */
  dequeue(): T {
    return this.list.removeBack()
  }

  /**
   * Checks if value is in queue
   * Equals function must be supplied for non-primitive values.
   * @param {T} element  - element to search for
   * @param {EqualsFunction<T>} equalsFunction - optional
   * function to check if two items are equal
   * @returns {boolean}
   */
  contains(element: T, equalsFunction?: EqualsFunction<T>): boolean {
    return this.list.contains(element, equalsFunction)
  }

  /**
   * Peeks at the element at the front of the queue - O(1)
   * @returns {T} - Frontmost element
   */
  peekFront(): T {
    return this.list.peekBack()
  }
  /**
   * Peeks at the element at the back of the queue - O(1)
   * @returns {T} - Backmost element
   */
  peekBack(): T {
    return this.list.peekFront()
  }

  /**
   * Deletes all elements in queue - O(1)
   */
  clear(): void {
    this.list.clear()
  }

  [Symbol.iterator](): Iterator<T> {
    return this.list[Symbol.iterator]()
  }
}

export default Queue

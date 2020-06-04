import LinkedList from '../linked-list'
import * as utils from '../../utils'

class Stack<T> implements Iterable<T> {
  private list: LinkedList<T>

  constructor(equalsFunction?: utils.EqualsFunction<T>) {
    if (equalsFunction) this.list = new LinkedList(equalsFunction)
    else this.list = new LinkedList()
  }

  /*****************************************************************************
                                  NICETIES
  *****************************************************************************/
  /**
   * Returns size of stack - O(1)
   * @returns {number}
   */
  size(): number {
    return this.list.size()
  }

  /**
   * Returns true if stack is empty, false otherwise - O(1)
   * @returns {number}
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
   * Pushes element onto the stack - O(1)
   * @param {T} element - element to push on stack
   */
  push(element: T): void {
    this.list.addBack(element)
  }

  /**
   * Pops an element off the stack - O(1)
   * @returns {T} - Element which was popped off
   */
  pop(): T | null {
    if (this.isEmpty()) return null
    return this.list.removeBack()
  }

  /*****************************************************************************
                                  ACCESSING
  *****************************************************************************/
  /**
   * Peeks at the top most element on the stack - O(1)
   * @returns {T} - Topmost element
   */
  peek(): T | null {
    if (this.isEmpty()) return null
    return this.list.peekBack()
  }

  /*****************************************************************************
                                  SEARCHING
  *****************************************************************************/
  /**
   * Checks if value is in stack - O(n)
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

export default Stack

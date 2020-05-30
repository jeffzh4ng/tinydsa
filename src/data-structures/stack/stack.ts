import LinkedList from '../linked-list'

class Stack<T> implements Iterable<T> {
  private list: LinkedList<T>

  constructor() {
    this.list = new LinkedList()
  }

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
   * Pushes element onto the stack - O(1)
   * @param {T} val - Val to push on stack
   */
  push(val: T): void {
    this.list.addLast(val)
  }

  /**
   * Pops an element off the stack - O(1)
   * @returns {T} - Element which was popped off
   */
  pop(): T {
    return this.list.removeLast()
  }

  /**
   * Peeks at the top most element on the stack - O(1)
   * @returns {T} - Top most element
   */
  peek(): T {
    return this.list.peekLast()
  }

  [Symbol.iterator](): Iterator<T> {
    return this.list[Symbol.iterator]()
  }
}

export default Stack

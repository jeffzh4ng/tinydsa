import LinkedListNode from './linked-list-node'
import * as utils from '../utils'
import {
  EMPTY_ERROR,
  OUT_OF_BOUNDS_ERROR,
  VALUE_DOES_NOT_EXIST_ERROR,
} from '../utils'

interface List<T> {
  head: LinkedListNode<T>
  tail: LinkedListNode<T>
  size: number
}

class LinkedList<T> implements Iterable<T> {
  private list: List<T> | undefined
  private equalsF: utils.EqualsFunction<T> = utils.defaultEquals

  /**
   * Creates a LinkedList - O(1)
   * @param equalsFunction equal function for for non-primitive values.
   */
  constructor(equalsFunction?: utils.EqualsFunction<T>) {
    this.list = undefined

    if (equalsFunction) this.equalsF = equalsFunction
  }

  /*****************************************************************************
                                  NICETIES
  *****************************************************************************/
  /**
   * Returns size - O(1)
   * @return {number}
   */
  size(): number {
    if (this.list) return this.list.size

    return 0
  }
  /**
   * Returns true if inked list is empty, false otherwise - O(1)
   * @return {number}
   */
  isEmpty(): boolean {
    return !this.list
  }

  /*****************************************************************************
                                  INSERTION
  *****************************************************************************/
  /**
   * Adds node to the head of the linked list - O(1)
   * @param {T} val - value to add to list
   * @return {void}
   */
  addFront(val: T): void {
    const newNode = new LinkedListNode(val)

    if (this.list) {
      // link old head backwards
      this.list.head.prev = newNode

      // link new head forwards
      newNode.next = this.list.head

      this.list.head = newNode
      this.list.size += 1
    } else {
      this.list = {
        head: newNode,
        tail: newNode,
        size: 1,
      }
    }
  }
  /**
   * Adds node to the tail of the linked list - O(1)
   * @param {T} - value to add to list
   * @return {void}
   */
  addBack(val: T): void {
    const newNode = new LinkedListNode(val)

    if (this.list) {
      // link old tail forwards
      this.list.tail.next = newNode

      // link new tail backwards
      newNode.prev = this.list.tail

      this.list.tail = newNode
      this.list.size += 1
    } else {
      this.list = {
        head: newNode,
        tail: newNode,
        size: 1,
      }
    }
  }
  /**
   * Adds a node at specified index - O(n)
   * @param {number} i - index
   * @param {T} val - value to add to list
   * @return {void}
   * @throws {OUT_OF_BOUNDS_ERROR}
   */
  addAt(i: number, val: T): void {
    if (i === 0) {
      this.addFront(val)
      return
    }

    if (i === this.size()) {
      this.addBack(val)
      return
    }

    if (i < 0 || i >= this.size() || !this.list) {
      throw new Error(OUT_OF_BOUNDS_ERROR)
    }

    let cur = this.list.head
    // traverse to index
    for (let j = 0; j < i - 1; j++) {
      cur = cur.next!
    }

    const newNode = new LinkedListNode(val)

    // link next node
    cur.next!.prev = newNode
    newNode.next = cur.next

    // link prev node
    newNode.prev = cur
    cur.next = newNode

    this.list.size += 1
  }

  /*****************************************************************************
                                  ACCESSING
  *****************************************************************************/
  /**
   * Gets the value of head - O(1)
   * @returns {T} value of head
   * @throws {EMPTY_ERROR}
   */
  peekFront(): T {
    if (!this.list) throw new Error(EMPTY_ERROR)
    return this.list.head.val
  }
  /**
   * Gets the value of tail - O(1)
   * @returns {T} value of tail
   * @throws {EMPTY_ERROR}
   */
  peekBack(): T {
    if (!this.list) throw new Error(EMPTY_ERROR)
    return this.list.tail.val
  }
  /**
   * Gets the element at index i - O(n)
   * @param {number} i - index of element
   * @returns {T} value of element at index i
   * @throws {OUT_OF_BOUNDS_ERROR}
   */
  get(i: number): T {
    if (i < 0 || i >= this.size() || !this.list) {
      throw new Error(OUT_OF_BOUNDS_ERROR)
    }

    let j = 0
    let cur = this.list.head
    while (j < i) {
      cur = cur.next!
      j++
    }

    return cur.val
  }

  /*****************************************************************************
                                  SEARCHING
  *****************************************************************************/
  /**
   * Removes the first occurrence of the specified item in the linked list.
   * @param {T} value - value to search for
   * @return {number} the index of the first occurence of the element, and -1
   * if the element does not exist.
   */
  indexOf(value: T): number {
    // list is empty
    if (!this.list) return -1

    let i = 0
    let cur = this.list.head

    while (!this.equalsF(cur.val, value)) {
      // cur.next === null means we reached end of list without finding element
      if (!cur.next) return -1

      cur = cur.next
      i += 1
    }

    return i
  }
  /**
   * Checks if value is in linked list.
   * @param {T} value  - value to search for
   * @returns {boolean}
   */
  contains(value: T): boolean {
    const index = this.indexOf(value)

    return index !== -1
  }

  /*****************************************************************************
                                  DELETION
  *****************************************************************************/
  /**
   * Removes head - O(1)
   * @return {T} - value of removed head
   * @throws {EMPTY_ERROR}
   */
  removeFront(): T {
    if (!this.list) throw new Error(EMPTY_ERROR)

    // extract val of head so we can return it later
    const val = this.list.head.val

    if (this.list.head.next) {
      // newHead.prev = null
      this.list.head.next.prev = null

      // move head pointer forwards
      this.list.head = this.list.head.next

      this.list.size -= 1
    } else {
      // list is size 1, clear the list
      this.list = undefined
    }

    return val
  }
  /**
   * Removes tail - O(1)
   * @return {T} - value of removed head
   * @throws {EMPTY_ERROR}
   */
  removeBack(): T {
    if (!this.list) throw new Error(EMPTY_ERROR)

    // extract the val of tail so we can return it later
    const val = this.list.tail.val

    if (this.list.tail.prev) {
      // newTail.next = null
      this.list.tail.prev.next = null

      // move tail pointer backwards
      this.list.tail = this.list.tail.prev

      this.list.size -= 1
    } else {
      this.list = undefined
    }

    return val
  }
  /**
   * Removes first occurence of node with specified value. Returns true if
   * removal was successful, and false otherwise. - O(n)
   * @param {T} val - value to remove
   * @returns {T} - value of removed node
   * @throws {VALUE_DOES_NOT_EXIST_ERROR}
   */
  remove(val: T): T {
    const index = this.indexOf(val) // O(n)
    if (index === -1) throw new Error(VALUE_DOES_NOT_EXIST_ERROR)

    return this.removeAt(index) // O(n)
  }
  /**
   * Removes node at specified index- O(n)
   * @param {number} i - index to remove
   * @return {T} - value of removed node
   * @throws {EMPTY_ERROR, OUT_OF_BOUNDS_ERROR}
   */
  removeAt(i: number): T {
    if (!this.list) throw new Error(EMPTY_ERROR)

    if (i === 0) {
      return this.removeFront()
    } else if (i === this.size() - 1) {
      return this.removeBack()
    }

    if (i < 0 || i >= this.list.size) {
      throw new Error(OUT_OF_BOUNDS_ERROR)
    }

    let j = 0
    let cur = this.list.head

    // traverse to node to be deleted
    while (j < i) {
      cur = cur.next!
      j += 1
    }

    // delete node
    cur.prev!.next = cur.next
    cur.next!.prev = cur.prev

    this.list.size -= 1

    return cur.val
  }
  /**
   * Deletes all nodes - O(1)
   */
  clear(): void {
    this.list = undefined
  }

  /*****************************************************************************
                                  HELPERS
  *****************************************************************************/
  /**
   * Appends values from an array to list - O(k)
   */
  fromArray(A: T[]): LinkedList<T> {
    for (const a of A) {
      this.addBack(a)
    }

    return this
  }
  *[Symbol.iterator](): Iterator<T> {
    if (!this.list) return

    let cur: LinkedListNode<T> | null

    for (cur = this.list.head; cur != null; cur = cur.next) {
      yield cur.val
    }
  }
}

export default LinkedList

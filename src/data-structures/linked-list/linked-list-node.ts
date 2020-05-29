class LinkedListNode<T> {
  val: T
  next: LinkedListNode<T> | null
  prev: LinkedListNode<T> | null

  constructor(val: T) {
    this.val = val
    this.next = null
    this.prev = null
  }
}

export default LinkedListNode

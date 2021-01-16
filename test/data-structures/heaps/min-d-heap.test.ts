import MinDHeap from '../../../src/data-structures/priority-queues/min-d-heap'

describe('MinDHeap', () => {
  let heap: MinDHeap<number>

  beforeEach(() => {
    heap = new MinDHeap(3)
  })

  describe('INSPECTION', () => {
    it('is empty', () => {
      expect(heap.size()).toBe(0)
      expect(heap.isEmpty()).toBe(true)
    })
  })

  describe('Insertion', () => {
    it('adds elements', () => {
      heap.add(8)
      expect(heap.size()).toBe(1)

      heap.add(3)
      expect(heap.size()).toBe(2)

      heap.add(10)
      expect(heap.size()).toBe(3)
    })
  })

  describe('Accessing', () => {
    it('mantains heap invariant', () => {
      heap.add(8)
      expect(heap.peek()).toBe(8)

      heap.add(3)
      expect(heap.peek()).toBe(3)

      heap.add(10)
      expect(heap.peek()).toBe(3)
    })

    it('returns null when empty heap is peeked', () => {
      expect(heap.peek()).toBe(null)
    })
  })

  describe('Searching', () => {
    it('checks if heap contains element', () => {
      heap.add(8)
      expect(heap.contains(8)).toBe(true)
      expect(heap.contains(3)).toBe(false)
    })
  })

  describe('Deletion', () => {
    it('polls elements', () => {
      heap.add(8)
      heap.add(3)
      heap.add(10)

      expect(heap.size()).toBe(3)

      heap.poll()
      expect(heap.size()).toBe(2)

      heap.poll()
      expect(heap.size()).toBe(1)

      heap.poll()
      expect(heap.size()).toBe(0)
    })

    it('returns null when empty heap is polled', () => {
      expect(heap.poll()).toBe(null)
    })

    it('removes a specified element', () => {
      heap.add(8)
      heap.add(3)
      heap.add(10)

      expect(heap.contains(8)).toBe(true)
      expect(heap.remove(8)).toBe(true)
      expect(heap.contains(8)).toBe(false)
    })

    it('returns false when element does not exist', () => {
      expect(heap.remove(8)).toBe(false)
    })

    it('clears the heap', () => {
      heap.add(8)
      heap.add(3)
      heap.add(10)

      heap.clear()

      expect(heap.isEmpty()).toBe(true)
    })
  })

  it('Works extensively', () => {
    heap.add(8)
    heap.add(3)
    heap.add(10)

    expect(heap.peek()).toBe(3)
    expect(heap.poll()).toBe(3)
    expect(heap.peek()).toBe(8)

    heap.add(2)
    heap.add(-5)
    heap.add(20)
    heap.add(9)

    expect(heap.peek()).toBe(-5)
    expect(heap.poll()).toBe(-5)
    expect(heap.poll()).toBe(2)
    expect(heap.poll()).toBe(8)
    expect(heap.poll()).toBe(9)
    expect(heap.poll()).toBe(10)
    expect(heap.poll()).toBe(20)
  })
})

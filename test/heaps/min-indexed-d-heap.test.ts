import MinIndexedDHeap from '../../src/data-structures/priority-queues/min-indexed-d-heap'

describe('MinIndexedDHeap', () => {
  let heap: MinIndexedDHeap<number>

  beforeEach(() => {
    heap = new MinIndexedDHeap(3)
  })

  describe('Niceties', () => {
    it('is empty', () => {
      expect(heap.size()).toBe(0)
      expect(heap.isEmpty()).toBe(true)
      expect(heap.peek()).toBe(null)
      expect(heap.poll()).toBe(null)
    })
  })

  describe('Heap invariant', () => {
    it('mantains heap invariant', () => {
      const nums = [6, 2, 5, 0, 3, 4, 1, 7, 8]
      for (let i = 0; i < nums.length; i++) {
        heap.add(i, nums[i])
      }

      for (let i = 0; i < nums.length; i++) {
        expect(heap.poll()).toBe(i)
      }
    })
  })

  describe('Insertion', () => {
    it('add()', () => {
      heap.add(1, 8)
      expect(heap.size()).toBe(1)

      heap.add(2, 3)
      expect(heap.size()).toBe(2)

      heap.add(3, 10)
      expect(heap.size()).toBe(3)
    })

    it('returns false when adding a key that already exists', () => {
      heap.add(1, 8)
      expect(heap.add(1, 2)).toBe(false)
    })
  })

  describe('Accessing', () => {
    it('peek()', () => {
      heap.add(1, 8)
      expect(heap.peek()).toBe(8)
    })

    it('valueOf()', () => {
      heap.add(1, 8)
      expect(heap.valueOf(1)).toBe(8)
    })
  })

  describe('Updating', () => {
    it('updateKey()', () => {
      heap.add(1, 8)
      expect(heap.valueOf(1)).toBe(8)
      heap.updateKey(1, 7)
      expect(heap.valueOf(1)).toBe(7)
    })

    it('increaseKey()', () => {
      heap.add(1, 8)
      expect(heap.valueOf(1)).toBe(8)

      heap.increaseKey(1, 10)
      expect(heap.valueOf(1)).toBe(10)
    })

    it('returns false when increaseKey() on key that does not exist', () => {
      expect(heap.increaseKey(1, 10)).toBe(false)
    })

    it('decreaseKey()', () => {
      heap.add(1, 8)
      expect(heap.valueOf(1)).toBe(8)

      heap.decreaseKey(1, 5)
      expect(heap.valueOf(1)).toBe(5)
    })

    it('prevents bad increases and decreases', () => {
      heap.add(1, 8)

      heap.increaseKey(1, 0)
      expect(heap.valueOf(1)).toBe(8)

      heap.decreaseKey(1, 10)
      expect(heap.valueOf(1)).toBe(8)
    })
  })

  describe('Searching', () => {
    it('contains()', () => {
      heap.add(1, 8)
      expect(heap.contains(1)).toBe(true)

      expect(heap.contains(2)).toBe(false)
    })
  })

  describe('Deletion', () => {
    it('polls elements', () => {
      heap.add(1, 8)
      heap.add(2, 3)
      heap.add(3, 10)

      expect(heap.size()).toBe(3)

      heap.poll()
      expect(heap.size()).toBe(2)

      heap.poll()
      expect(heap.size()).toBe(1)

      heap.poll()
      expect(heap.size()).toBe(0)
    })

    it('returns null when poll() is called on an empty heap', () => {
      expect(heap.poll()).toBe(null)
    })

    it('removes a specific key', () => {
      heap.add(1, 8)
      heap.add(2, 3)
      heap.add(3, 10)

      expect(heap.contains(1)).toBe(true)
      expect(heap.deleteKey(1)).toBe(8)
      expect(heap.contains(1)).toBe(false)
    })

    it('returns null when deleteKey() is called with a key that DNE', () => {
      expect(heap.deleteKey(8)).toBe(null)
    })

    it('clears the heap', () => {
      heap.add(1, 8)
      heap.add(2, 3)
      heap.add(3, 10)

      heap.clear()

      expect(heap.isEmpty()).toBe(true)
    })
  })
})

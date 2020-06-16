import MinFibonacciHeap from '../../src/data-structures/priority-queues/mergeable-heaps/min-fibonacci-heap'

describe('MinFibonacciHeap', () => {
  let heap: MinFibonacciHeap<number>

  beforeEach(() => {
    heap = new MinFibonacciHeap(Number.MIN_SAFE_INTEGER)
  })

  describe('Empty heap', () => {
    it('is empty', () => {
      expect(heap.size).toBe(0)
      expect(heap.isEmpty()).toBe(true)
    })

    it('dequeue() returns null', () => {
      expect(heap.dequeue()).toBe(null)
    })

    it('peek() returns null', () => {
      expect(heap.peek()).toBe(null)
    })
  })

  describe('Insertion and deletion', () => {
    it('inserts numbers properly', () => {
      heap.enqueue(8)
      expect(heap.size).toBe(1)

      heap.enqueue(26)
      expect(heap.size).toBe(2)

      heap.enqueue(72)
      expect(heap.size).toBe(3)

      heap.enqueue(42)
    })

    it('deletes a specific node', () => {
      const node = heap.enqueue(8)
      heap.enqueue(3)
      heap.deleteNode(node)

      expect(heap.size).toBe(1)
      expect(heap.head).toBeTruthy()
      expect(heap.head!.value).toBe(3)
    })

    it('deletes numbers properly', () => {
      heap.enqueue(8)
      heap.enqueue(26)
      heap.enqueue(72)

      expect(heap.size).toBe(3)

      heap.dequeue()
      expect(heap.size).toBe(2)

      heap.dequeue()
      expect(heap.size).toBe(1)

      heap.dequeue()
      expect(heap.size).toBe(0)
    })
  })

  it('maintains the heap invariant', () => {
    const values = [8, 32, 72, 26, 16, 48, 5, 11, 17, 93, 500, 603, 401, 325, -321]

    for (const v of values) {
      heap.enqueue(v)
    }

    const sortedValues = [...values].sort((a, b) => a - b)

    for (const v of sortedValues) {
      const node = heap.dequeue()
      if (!node) throw new Error()
      expect(node.value).toBe(v)
    }
  })

  describe('Reading', () => {
    it('peeks', () => {
      heap.enqueue(-4)
      heap.enqueue(-5)
      heap.enqueue(-6)
      heap.enqueue(-7)
      heap.enqueue(-8)
      heap.enqueue(-9)
      heap.enqueue(-10)

      expect(heap.peek()!.value).toBe(-10)
    })
  })

  describe('Updating', () => {
    it('unions properly', () => {
      const heapA = new MinFibonacciHeap(Number.MIN_SAFE_INTEGER)
      const heapB = new MinFibonacciHeap(Number.MIN_SAFE_INTEGER)

      const valuesA = [8, 32, 72, 26, 16, 48, 5, 11]
      const valuesB = [17, 93, 500, 603, 401, 325, -321]

      for (const a of valuesA) {
        heapA.enqueue(a)
      }

      for (const b of valuesB) {
        heapB.enqueue(b)
      }

      const unionedHeap = heapA.union(heapB)
      expect(unionedHeap.size).toBe(heapA.size + heapB.size)

      const sortedValues = [...valuesA, ...valuesB].sort((a, b) => a - b)

      for (const v of sortedValues) {
        const node = unionedHeap.dequeue()
        if (!node) throw new Error()
        expect(node.value).toBe(v)
      }
    })

    it('unions with empty heaps', () => {
      const heapA = new MinFibonacciHeap(Number.MIN_SAFE_INTEGER)
      const heapB = new MinFibonacciHeap(Number.MIN_SAFE_INTEGER)

      const valuesA = [8, 32, 72, 26, 16, 48, 5, 11]

      for (const a of valuesA) {
        heapA.enqueue(a)
      }

      const unionedHeap = heapA.union(heapB)
      expect(unionedHeap.size).toBe(heapA.size + heapB.size)

      const sortedValues = [...valuesA].sort((a, b) => a - b)

      for (const v of sortedValues) {
        const node = unionedHeap.dequeue()
        if (!node) throw new Error()
        expect(node.value).toBe(v)
      }
    })

    it('decreases keys properly', () => {
      const values = [8, 32, 72, 26, 16, 48, 5, 11]
      const nodes = []

      for (const v of values) {
        nodes.push(heap.enqueue(v))
      }

      const dequedNode = heap.dequeue()

      const newValues = [
        values[0] - 1,
        values[1] - 1,
        values[2] - 1,
        values[3] - 1,
        values[4] - 1,
        values[5] - 1,
        values[6] - 1,
        values[7] - 1,
      ]

      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].value === dequedNode!.value) continue

        heap.decreaseKey(nodes[i], newValues[i])
      }

      const sortedValues = [...newValues.slice(6, 1)].sort((a, b) => a - b)

      for (const v of sortedValues) {
        const node = heap.dequeue()
        if (!node) throw new Error()
        expect(node.value).toBe(v)
      }
    })
  })
})

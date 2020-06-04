import { Deque } from '../../src/data-structures/queue'

describe('Deque', () => {
  let deque: Deque<number>

  beforeEach(() => {
    deque = new Deque()
  })

  describe('empty deque', () => {
    it('returns null when pop() is called on empty stack', () => {
      expect(deque.popFront()).toBe(null)
      expect(deque.popBack()).toBe(null)
    })

    it('returns null when peek() is called on empty stack', () => {
      expect(deque.peekFront()).toBe(null)
      expect(deque.peekBack()).toBe(null)
    })
  })

  it('is empty', () => {
    expect(deque.isEmpty()).toBe(true)
  })

  describe('enqueues', () => {
    it('pushes front', () => {
      deque.pushFront(1)
      expect(deque.size()).toBe(1)

      deque.pushFront(2)
      expect(deque.size()).toBe(2)

      deque.pushFront(3)
      expect(deque.size()).toBe(3)
    })

    it('pushes back', () => {
      deque.pushBack(1)
      expect(deque.size()).toBe(1)

      deque.pushBack(2)
      expect(deque.size()).toBe(2)

      deque.pushBack(3)
      expect(deque.size()).toBe(3)
    })
  })

  describe('dequeues', () => {
    it('pops front', () => {
      deque.pushBack(1)
      deque.pushBack(2)
      deque.pushBack(3)

      const val1 = deque.popFront()
      expect(val1).toBe(1)
      expect(deque.size()).toBe(2)

      const val2 = deque.popFront()
      expect(val2).toBe(2)
      expect(deque.size()).toBe(1)

      const val3 = deque.popFront()
      expect(val3).toBe(3)
      expect(deque.size()).toBe(0)
    })

    it('pops back', () => {
      deque.pushBack(1)
      deque.pushBack(2)
      deque.pushBack(3)

      const val1 = deque.popBack()
      expect(val1).toBe(3)
      expect(deque.size()).toBe(2)

      const val2 = deque.popBack()
      expect(val2).toBe(2)
      expect(deque.size()).toBe(1)

      const val3 = deque.popBack()
      expect(val3).toBe(1)
      expect(deque.size()).toBe(0)
    })
  })

  it('finds out if list contains element', () => {
    expect(deque.contains(1)).toBe(false)
    deque.pushBack(1)
    deque.pushBack(2)
    deque.pushBack(3)

    expect(deque.contains(1)).toBe(true)
    expect(deque.contains(3)).toBe(true)
    expect(deque.contains(8)).toBe(false)
  })

  it('peeks', () => {
    deque.pushBack(1)
    expect(deque.peekFront()).toBe(1)
    expect(deque.peekBack()).toBe(1)

    deque.pushBack(2)
    expect(deque.peekFront()).toBe(1)
    expect(deque.peekBack()).toBe(2)
  })

  it('clears the list', () => {
    deque.pushBack(1)
    deque.pushBack(2)
    deque.pushBack(3)
    deque.pushBack(4)
    deque.clear()
    expect(deque.isEmpty()).toBe(true)

    deque.pushBack(1)
    deque.clear()
    expect(deque.isEmpty()).toBe(true)

    deque.clear()
    expect(deque.isEmpty()).toBe(true)
  })

  it('is iterable', () => {
    const nums = [1, 2, 3]

    for (const n of nums) {
      deque.pushBack(n)
    }

    let i = 0
    for (const n of deque) {
      expect(n).toBe(nums[i])
      i += 1
    }
  })
})

describe('Queue - complex object', () => {
  class Hero {
    heroId: number
    hunger: number
    health: number

    constructor(id: number) {
      this.heroId = id
      this.hunger = 100
      this.health = 100
    }
  }

  const sameHeroF = (a: Hero, b: Hero) => a.heroId === b.heroId

  let queue: Deque<Hero>

  beforeAll(() => {
    const knight = new Hero(123)
    const archer = new Hero(456)
    const mage = new Hero(789)

    queue = new Deque(sameHeroF)

    queue.pushBack(knight)
    queue.pushBack(archer)
    queue.pushBack(mage)
  })

  it('checks if queue contains hero', () => {
    const knight = new Hero(123)
    const mage = new Hero(789)

    expect(queue.contains(knight)).toBe(true)
    expect(queue.contains(mage)).toBe(true)
    expect(queue.contains(new Hero(246))).toBe(false)
  })
})

import LinkedList from '../../src/data-structures/linked-list'

describe('Linked List - simple number', () => {
  let list: LinkedList<number>

  beforeEach(() => {
    list = new LinkedList()
  })

  it('is empty', () => {
    expect(list.isEmpty()).toBe(true)
  })

  describe('empty lists', () => {
    it('retruns null on empty lists', () => {
      expect(list.peekFront()).toBe(null)
      expect(list.peekBack()).toBe(null)
      expect(list.removeFront()).toBe(null)
      expect(list.removeBack()).toBe(null)
      expect(list.remove(3)).toBe(null)
      expect(list.removeAt(3)).toBe(null)
      expect(list.removeAt(-1)).toBe(null)
      expect(list.get(1)).toBe(null)
    })
  })

  describe('adding', () => {
    it('adds to head of list', () => {
      list.addFront(8)
      expect(list.size()).toBe(1)

      list.addFront(3)
      expect(list.size()).toBe(2)
    })

    it('adds to tail of list', () => {
      list.addBack(8)
      expect(list.size()).toBe(1)

      list.addBack(3)
      expect(list.size()).toBe(2)
    })

    it('adds at specific index', () => {
      list.addAt(0, 1)
      expect(list.size()).toBe(1)

      list.addAt(1, 2)
      expect(list.size()).toBe(2)

      list.addAt(1, 3)
      expect(list.size()).toBe(3)

      list.addAt(2, 4)
      expect(list.size()).toBe(4)

      list.addAt(1, 5)
      expect(list.size()).toBe(5)
    })

    it('returns false when adding at index out of bounds', () => {
      list.addAt(0, 1)
      expect(list.addAt(3, 2)).toBe(false)
    })
  })

  describe('finding', () => {
    it('gets nodes', () => {
      list.addBack(1)
      list.addBack(2)
      list.addBack(3)

      expect(list.get(0)).toBe(1)
      expect(list.get(1)).toBe(2)
      expect(list.get(2)).toBe(3)
    })

    it('gets index of nodes', () => {
      expect(list.indexOf(1)).toBe(-1)

      list.addBack(1)
      list.addBack(2)
      list.addBack(3)

      expect(list.indexOf(1)).toBe(0)
      expect(list.indexOf(2)).toBe(1)
      expect(list.indexOf(3)).toBe(2)
      expect(list.indexOf(4)).toBe(-1)
    })

    it('finds out if list contains node', () => {
      expect(list.contains(1)).toBe(false)
      list.addBack(1)
      list.addBack(2)
      list.addBack(3)

      expect(list.contains(1)).toBe(true)
      expect(list.contains(3)).toBe(true)
      expect(list.contains(8)).toBe(false)
    })

    it('peeks head', () => {
      list.addFront(1)
      expect(list.peekFront()).toBe(1)

      list.addFront(2)
      expect(list.peekFront()).toBe(2)
    })

    it('peeks tail', () => {
      list.addBack(1)
      expect(list.peekBack()).toBe(1)

      list.addBack(2)
      expect(list.peekBack()).toBe(2)
    })
  })

  describe('removing', () => {
    it('removes from head', () => {
      list.addBack(8)
      list.addBack(3)

      list.removeFront()
      expect(list.size()).toBe(1)
      expect(list.peekFront()).toBe(3)

      list.removeFront()
      expect(list.size()).toBe(0)
    })

    it('removes from tail', () => {
      list.addBack(8)
      list.addBack(3)

      list.removeBack()
      expect(list.size()).toBe(1)
      expect(list.peekFront()).toBe(8)

      list.removeBack()
      expect(list.size()).toBe(0)
    })

    it('removes at specific index', () => {
      list.addBack(1)
      list.addBack(2)
      list.addBack(3)
      list.addBack(4)
      list.addBack(5)
      list.addBack(6)

      // 1-2-3-4-5-6

      const val = list.removeAt(0)
      expect(val).toBe(1)
      expect(list.size()).toBe(5)
      // 2-3-4-5-6

      const val2 = list.removeAt(4)
      expect(val2).toBe(6)
      expect(list.size()).toBe(4)
      // 2-3-4-5

      const val3 = list.removeAt(1)
      expect(val3).toBe(3)
      expect(list.size()).toBe(3)
      // 2-4-5

      const val4 = list.removeAt(1)
      expect(val4).toBe(4)
      expect(list.size()).toBe(2)
      // 2-5

      const val5 = list.removeAt(1)
      expect(val5).toBe(5)
      expect(list.size()).toBe(1)
      // 2

      const val6 = list.removeAt(0)
      expect(val6).toBe(2)
      expect(list.size()).toBe(0)
    })

    it('removes specific value', () => {
      list.addBack(1)
      list.addBack(2)
      list.addBack(3)

      const val1 = list.remove(1)
      expect(val1).toBe(1)
      expect(list.size()).toBe(2)

      const val2 = list.remove(2)
      expect(val2).toBe(2)
      expect(list.size()).toBe(1)

      const val3 = list.remove(3)
      expect(val3).toBe(3)
      expect(list.size()).toBe(0)
    })

    it('clears the list', () => {
      list.addBack(1)
      list.addBack(2)
      list.addBack(3)
      list.addBack(4)
      list.clear()
      expect(list.isEmpty()).toBe(true)

      list.addBack(1)
      list.clear()
      expect(list.isEmpty()).toBe(true)

      list.clear()
      expect(list.isEmpty()).toBe(true)
    })
  })

  describe('helpers', () => {
    it('creates list from array', () => {
      const array = [1, 2, 3]
      list.fromArray(array)
      expect(Array.from(list)).toEqual([1, 2, 3])
    })
  })

  describe('iterator', () => {
    it('is iterable', () => {
      const array = [1, 2, 3]
      list.fromArray(array)

      let i = 0
      for (const n of list) {
        expect(n).toBe(array[i])
        i += 1
      }
    })

    it('does not iterate over an empty list', () => {
      let count = 0
      for (const n of list) {
        count += 1
      }

      expect(count).toBe(0)
    })
  })
})

describe('Linked list - complex object', () => {
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

  let list: LinkedList<Hero>

  beforeAll(() => {
    const knight = new Hero(123)
    const archer = new Hero(456)
    const mage = new Hero(789)

    list = new LinkedList(sameHeroF)

    list.addBack(knight)
    list.addBack(archer)
    list.addBack(mage)
  })

  it('gets the index of a Hero', () => {
    const knight = new Hero(123)
    const mage = new Hero(789)

    expect(list.indexOf(knight)).toBe(0)
    expect(list.indexOf(mage)).toBe(2)
  })

  it('checks if list contains hero', () => {
    const knight = new Hero(123)
    const mage = new Hero(789)

    expect(list.contains(knight)).toBe(true)
    expect(list.contains(mage)).toBe(true)
    expect(list.contains(new Hero(246))).toBe(false)
  })
})

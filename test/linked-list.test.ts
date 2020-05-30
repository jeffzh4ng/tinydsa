import LinkedList from '../src/data-structures/linked-list'
import {
  EMPTY_LIST_ERROR,
  OUT_OF_BOUNDS_ERROR,
  VALUE_DOES_NOT_EXIST_ERROR,
} from '../src/data-structures/utils'

describe('Linked List - simple number', () => {
  let list: LinkedList<number>

  beforeEach(() => {
    list = new LinkedList()
  })

  it('is empty', () => {
    expect(list.isEmpty()).toBe(true)
  })

  describe('throwing', () => {
    it('throws when peekFirst() is called on an empty list', () => {
      expect(() => {
        list.peekFirst()
      }).toThrow(EMPTY_LIST_ERROR)
    })

    it('throws when peekLast() is called on an empty list', () => {
      expect(() => {
        list.peekLast()
      }).toThrow(EMPTY_LIST_ERROR)
    })

    it('throws when removeFirst() is called on an empty list', () => {
      expect(() => {
        list.removeFirst()
      }).toThrow(EMPTY_LIST_ERROR)
    })

    it('throws when removeFirst() is called on an empty list', () => {
      expect(() => {
        list.removeLast()
      }).toThrow(EMPTY_LIST_ERROR)
    })

    it('throws when removeAt() is called on an empty list', () => {
      expect(() => {
        list.removeAt(0)
      }).toThrow(EMPTY_LIST_ERROR)

      list.addLast(1)
      expect(() => {
        list.removeAt(2)
      }).toThrow(OUT_OF_BOUNDS_ERROR)
    })

    it('throws when remove() is called on an empty list', () => {
      expect(() => {
        list.remove(1)
      }).toThrow(VALUE_DOES_NOT_EXIST_ERROR)
    })

    it('throws when get() is called on an empty list', () => {
      expect(() => {
        list.get(0)
      }).toThrow(OUT_OF_BOUNDS_ERROR)

      expect(() => {
        list.get(-1)
      }).toThrow(OUT_OF_BOUNDS_ERROR)

      list.addLast(1)

      expect(() => {
        list.get(2)
      }).toThrow(OUT_OF_BOUNDS_ERROR)
    })
  })

  describe('adding', () => {
    it('adds to head of list', () => {
      list.addFirst(8)
      expect(list.size()).toBe(1)

      list.addFirst(3)
      expect(list.size()).toBe(2)
    })

    it('adds to tail of list', () => {
      list.addLast(8)
      expect(list.size()).toBe(1)

      list.addLast(3)
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

    it('throws when adding at index out of bounds', () => {
      list.addAt(0, 1)
      expect(() => {
        list.addAt(3, 2)
      }).toThrow(OUT_OF_BOUNDS_ERROR)
    })
  })

  describe('finding', () => {
    it('gets nodes', () => {
      list.addLast(1)
      list.addLast(2)
      list.addLast(3)

      expect(list.get(0)).toBe(1)
      expect(list.get(1)).toBe(2)
      expect(list.get(2)).toBe(3)
    })

    it('gets index of nodes', () => {
      expect(list.indexOf(1)).toBe(-1)

      list.addLast(1)
      list.addLast(2)
      list.addLast(3)

      expect(list.indexOf(1)).toBe(0)
      expect(list.indexOf(2)).toBe(1)
      expect(list.indexOf(3)).toBe(2)
      expect(list.indexOf(4)).toBe(-1)
    })

    it('finds out if list contains node', () => {
      expect(list.contains(1)).toBe(false)
      list.addLast(1)
      list.addLast(2)
      list.addLast(3)

      expect(list.contains(1)).toBe(true)
      expect(list.contains(3)).toBe(true)
      expect(list.contains(8)).toBe(false)
    })

    it('peeks head', () => {
      list.addFirst(1)
      expect(list.peekFirst()).toBe(1)

      list.addFirst(2)
      expect(list.peekFirst()).toBe(2)
    })

    it('peeks tail', () => {
      list.addLast(1)
      expect(list.peekLast()).toBe(1)

      list.addLast(2)
      expect(list.peekLast()).toBe(2)
    })
  })

  describe('removing', () => {
    it('removes from head', () => {
      list.addLast(8)
      list.addLast(3)

      list.removeFirst()
      expect(list.size()).toBe(1)
      expect(list.peekFirst()).toBe(3)

      list.removeFirst()
      expect(list.size()).toBe(0)
    })

    it('removes from tail', () => {
      list.addLast(8)
      list.addLast(3)

      list.removeLast()
      expect(list.size()).toBe(1)
      expect(list.peekFirst()).toBe(8)

      list.removeLast()
      expect(list.size()).toBe(0)
    })

    it('removes at specific index', () => {
      list.addLast(1)
      list.addLast(2)
      list.addLast(3)
      list.addLast(4)
      list.addLast(5)
      list.addLast(6)

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
      list.addLast(1)
      list.addLast(2)
      list.addLast(3)

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
      list.addLast(1)
      list.addLast(2)
      list.addLast(3)
      list.addLast(4)
      list.clear()
      expect(list.isEmpty()).toBe(true)

      list.addLast(1)
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

    list = new LinkedList()
    list.addLast(knight)
    list.addLast(archer)
    list.addLast(mage)
  })

  it('gets the index of a Hero', () => {
    const knight = new Hero(123)
    const mage = new Hero(789)

    expect(list.indexOf(knight, sameHeroF)).toBe(0)
    expect(list.indexOf(mage, sameHeroF)).toBe(2)
  })

  it('checks if list contains hero', () => {
    const knight = new Hero(123)
    const mage = new Hero(789)

    expect(list.contains(knight, sameHeroF)).toBe(true)
    expect(list.contains(mage, sameHeroF)).toBe(true)
    expect(list.contains(new Hero(246), sameHeroF)).toBe(false)
  })
})

import Stack from '../src/data-structures/stack'
import { EMPTY_ERROR } from '../src/data-structures/utils'

describe('Stack', () => {
  let stack: Stack<number>

  beforeEach(() => {
    stack = new Stack()
  })

  describe('throwing', () => {
    it('throws when pop() is called on empty stack', () => {
      expect(() => {
        stack.pop()
      }).toThrow(EMPTY_ERROR)
    })

    it('throws when peek() is called on empty stack', () => {
      expect(() => {
        stack.peek()
      }).toThrow(EMPTY_ERROR)
    })
  })

  it('is empty', () => {
    expect(stack.isEmpty()).toBe(true)
  })

  it('pushes', () => {
    stack.push(1)
    expect(stack.size()).toBe(1)

    stack.push(2)
    expect(stack.size()).toBe(2)

    stack.push(3)
    expect(stack.size()).toBe(3)
  })

  it('finds out if list contains element', () => {
    expect(stack.contains(1)).toBe(false)
    stack.push(1)
    stack.push(2)
    stack.push(3)

    expect(stack.contains(1)).toBe(true)
    expect(stack.contains(3)).toBe(true)
    expect(stack.contains(8)).toBe(false)
  })

  it('pops', () => {
    stack.push(1)
    stack.push(2)
    stack.push(3)

    stack.pop()
    expect(stack.size()).toBe(2)

    stack.pop()
    expect(stack.size()).toBe(1)

    stack.pop()
    expect(stack.size()).toBe(0)
  })

  it('peeks', () => {
    stack.push(1)
    expect(stack.peek()).toBe(1)

    stack.push(2)
    expect(stack.peek()).toBe(2)
  })

  it('clears the stack', () => {
    stack.push(1)
    stack.push(2)
    stack.push(3)
    stack.push(4)
    stack.clear()
    expect(stack.isEmpty()).toBe(true)

    stack.push(1)
    stack.clear()
    expect(stack.isEmpty()).toBe(true)

    stack.clear()
    expect(stack.isEmpty()).toBe(true)
  })

  it('is iterable', () => {
    const nums = [1, 2, 3]

    for (const n of nums) {
      stack.push(n)
    }

    let i = 0
    for (const n of stack) {
      expect(n).toBe(nums[i])
      i += 1
    }
  })
})

describe('Stack - complex object', () => {
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

  let stack: Stack<Hero>

  beforeAll(() => {
    const knight = new Hero(123)
    const archer = new Hero(456)
    const mage = new Hero(789)

    stack = new Stack(sameHeroF)

    stack.push(knight)
    stack.push(archer)
    stack.push(mage)
  })

  it('checks if stack contains hero', () => {
    const knight = new Hero(123)
    const mage = new Hero(789)

    expect(stack.contains(knight)).toBe(true)
    expect(stack.contains(mage)).toBe(true)
    expect(stack.contains(new Hero(246))).toBe(false)
  })
})

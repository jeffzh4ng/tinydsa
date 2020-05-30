import Stack from '../src/data-structures/stack'
import { EMPTY_LIST_ERROR } from '../src/data-structures/utils'

describe('Stack', () => {
  let stack: Stack<number>

  beforeEach(() => {
    stack = new Stack()
  })

  describe('throwing', () => {
    it('throws when pop() is called on empty stack', () => {
      expect(() => {
        stack.pop()
      }).toThrow(EMPTY_LIST_ERROR)
    })

    it('throws when peek() is called on empty stack', () => {
      expect(() => {
        stack.peek()
      }).toThrow(EMPTY_LIST_ERROR)
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

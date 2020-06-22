import HashTableOpenAddressingBase from './hash-table-open-addressing-base'
import { Hashable } from './entry'

class HashTableQuadraticProbing<K extends Hashable, V> extends HashTableOpenAddressingBase<K, V> {
  constructor(capacity: number, loadFactor: number) {
    super(capacity, loadFactor)
  }

  setupProbing(key: K): void {}

  probe(x: number): number {
    // Quadratic probing function (x^2+x)/2
    return (x * x * x) >> 2
  }

  increaseCapacity(): void {
    this.capacity = this.nextPowerOfTwo(this.capacity)
  }

  adjustCapacity(): void {
    const pow2 = this.highestOneBit(this.capacity)
    if (this.capacity === pow2) return
    this.increaseCapacity()
  }

  private nextPowerOfTwo(n: number) {
    return this.highestOneBit(n) << 1
  }

  private highestOneBit(n: number) {
    if (n == 0) return 0
    let depth = 0
    let exponent = 16

    while (exponent > 0) {
      const shifted = n >> exponent
      if (shifted > 0) {
        depth += exponent
        if (shifted == 1) return depth + 1
        n >>= exponent
      }
      exponent /= 2
    }

    return depth + 1
  }
}

export default HashTableQuadraticProbing

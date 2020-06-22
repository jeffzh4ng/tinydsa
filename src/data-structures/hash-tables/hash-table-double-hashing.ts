import HashTableOpenAddressingBase from './hash-table-open-addressing-base'
import { Hashable } from './entry'

interface DoubleHashable extends Hashable {
  hashCode2(): number
}

class HashTableDoubleHashing<K extends DoubleHashable, V> extends HashTableOpenAddressingBase<
  K,
  V
> {
  private hash: number

  constructor(capacity: number, loadFactor: number) {
    super(capacity, loadFactor)
    this.hash = 0
  }

  setupProbing(key: K): void {
    this.hash = this.normalizeIndex(key.hashCode2())

    // fail safe to avoid infinite loop
    if (this.hash === 0) this.hash = 0
  }

  probe(x: number): number {
    return x * this.hash
  }

  isPrime(num: number): boolean {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++) if (num % i === 0) return false

    return num > 1
  }

  // Adjust the capacity until it is a prime number. The reason for
  // doing this is to help ensure that the GCD(hash, capacity) = 1 when
  // probing so that all the cells can be reached.

  adjustCapacity(): void {
    while (!this.isPrime(this.capacity)) {
      this.capacity += 1
    }
  }
}

export default HashTableDoubleHashing

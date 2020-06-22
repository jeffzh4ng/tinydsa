import HashTableOpenAddressingBase from './hash-table-open-addressing-base'
import { Hashable } from './entry'

class HashTableLinearProbing<K extends Hashable, V> extends HashTableOpenAddressingBase<K, V> {
  private LINEAR_CONSTANT = 17

  constructor(capacity: number, loadFactor: number) {
    super(capacity, loadFactor)
  }

  setupProbing(key: K): void {}

  probe(x: number): number {
    return this.LINEAR_CONSTANT * x
  }

  adjustCapacity(): void {
    while (this.gcd(this.LINEAR_CONSTANT, this.capacity) !== 1) {
      this.capacity += 1
    }
  }
}

export default HashTableLinearProbing

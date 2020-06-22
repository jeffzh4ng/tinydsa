import { Hashable } from './entry'

// Code is based off William Fiset's implementation
abstract class HashTableOpenAddressingBase<K extends Hashable, V> {
  private DEFAULT_CAPACITY = 7

  // Special marker token used to indicate the deletion of a key-value pair
  protected TOMBSTONE: K = new Object() as K

  protected keyList: Array<K>
  protected valueList: Array<V | null>

  protected capacity: number
  protected maxLoadFactor: number
  protected threshold: number

  protected modificationCount: number
  protected usedBuckets: number // counts total number of used buckets (including tombstones)
  protected keyCount: number // number of unique keys in hash table

  constructor(capacity: number, maxLoadFactor: number) {
    if (capacity < 0) throw new Error('Illegal capacity')
    if (maxLoadFactor <= 0) throw new Error('Illegal maxLoadFactor')

    this.capacity = Math.max(this.DEFAULT_CAPACITY, capacity)
    this.maxLoadFactor = maxLoadFactor
    this.adjustCapacity()

    this.threshold = Math.trunc(this.capacity * this.maxLoadFactor)
    this.modificationCount = 0

    this.usedBuckets = 0
    this.keyCount = 0

    this.keyList = new Array<K>(this.capacity)
    this.valueList = new Array<V>(this.capacity)
  }

  /*****************************************************************************
                                        ABSTRACT
  *****************************************************************************/
  // These three methods are used to dictate how the probing is to actually
  // occur for whatever open addressing scheme you are implementing.

  abstract setupProbing(key: K): void

  // Adjusts the capacity of the hash table after it's been made larger.
  // This is important to be able to override because the size of the hashtable
  // controls the functionality of the probing function.
  abstract adjustCapacity(): void

  abstract probe(x: number): number

  /*****************************************************************************
                                            INSPECTION
  *****************************************************************************/
  /**
   * Returns the size of the hash table - O(1)
   * @return {number}
   */
  size(): number {
    return this.keyCount
  }

  /**
   * Returns true if the hash table is empty, and false otherwise - O(1)
   * @return {number}
   */
  isEmpty(): boolean {
    return this.size() === 0
  }

  /**
   * Returns capacity of the table - O(1)
   * @return {number}
   */
  getCapacity(): number {
    return this.capacity
  }

  /**
   * Clears the hash table - O(1)
   * @return {void}
   */
  clear(): void {
    this.keyList.length = 0
    this.valueList.length = 0

    this.usedBuckets = 0
    this.keyCount = 0
    this.modificationCount += 1
  }

  /**
   * Returns true if the hash table contains the key, and false otherwise
   * @param {K} key
   * @return {boolean}
   */
  containsKey(key: K): boolean {
    return this.get(key) !== null
  }

  /**
   * Returns a list of the hash table's keys - O(n)
   * @return {Array<K>}
   */
  keys(): Array<K> {
    const keys: Array<K> = []

    for (const key of this.keyList) {
      if (key && key !== this.TOMBSTONE) keys.push(key)
    }

    return keys
  }

  /**
   * Returns a list of the hash table's values - O(n)
   * @return {Array<K>}
   */
  values(): Array<V> {
    const values: Array<V> = []

    for (let i = 0; i < this.keyList.length; i++) {
      if (this.keyList[i] && this.keyList[i] !== this.TOMBSTONE) values.push(values[i])
    }

    return values
  }

  /*****************************************************************************
                                              MAIN
   ****************************************************************************/
  /**
   * Returns value associated with key, and null if the key does not exist - O(1) amortized
   * @param {K} key
   * @return {V | null}
   */
  get(key: K): V | null {
    let output: V | null = null

    this.setupProbing(key)

    const offset = this.normalizeIndex(key.hashCode())

    for (let i = offset, j = -1, x = 1; ; i = this.normalizeIndex(offset + this.probe(x++))) {
      // Ignore deleted cells, but record where the first index
      // of a deleted cell is found to perform lazy relocation later.
      if (this.keyList[i] === this.TOMBSTONE) {
        if (j === -1) j = i
      } else if (this.keyList[i] !== null) {
        // we found a match
        if (this.keyList[i] === key) {
          // If j != -1 this means we previously encountered a deleted cell.
          // We can perform an optimization by swapping the entries in cells
          // i and j so that the next time we search for this key it will be
          // found faster. This is called lazy deletion/relocation.

          if (j !== -1) {
            // send the key value pair to index j
            this.keyList[j] = this.keyList[i]
            this.valueList[j] = this.valueList[i]

            // delete key value pair at index i
            this.keyList[i] = this.TOMBSTONE
            this.valueList[i] = null
            output = this.valueList[j]
            break
          } else {
            output = this.valueList[i]
          }
        }
      }
    }

    return output
  }

  /**
   * Adds the [K, V] pair to the hash table - O(1) amortized
   * @param {K} key
   * @param {V} value
   * @returns {V | null}
   */
  set(key: K, value: V | null): V | null {
    let output: V | null = null

    if (this.usedBuckets >= this.threshold) this.resizeTable()

    this.setupProbing(key)

    const offset = this.normalizeIndex(key.hashCode())

    // start at the original hash value and probe until we find our key or null
    for (let i = offset, j = -1, x = 1; ; i = this.normalizeIndex(offset + this.probe(x++))) {
      // if the current slow was previously deleted
      if (this.keyList[i] === this.TOMBSTONE) {
        if (j === -1) j = i
      } else if (this.keyList[i] !== null) {
        // the key we're trying to insert already exists in the hash table, so update with the new
        // value
        if (this.keyList[i] === key) {
          const oldValue = this.valueList[i]

          if (j === -1) {
            this.valueList[i] = value
          } else {
            this.keyList[i] = this.TOMBSTONE
            this.valueList[i] = null

            this.keyList[j] = key
            this.valueList[j] = value
          }

          this.modificationCount += 1
          output = oldValue
          break
        }

        // current slot is empty so an insertion can occur
      } else {
        if (j === -1) {
          this.usedBuckets += 1
          this.keyCount += 1

          this.keyList[i] = key
          this.valueList[i] = value

          // previously seen bucket. Instead of inserting the new element at i where the null element
          // is insert it where the deleted token was found.
        } else {
          this.keyCount += 1
          this.keyList[j] = key
          this.valueList[j] = value
        }

        this.modificationCount += 1
        output = null
        break
      }
    }

    return output
  }

  /**
   * Deletes the entry with key K - O(1) amortized
   * @param {K} key
   * @returns {V | null}
   */
  delete(key: K): V | null {
    let output: V | null = null

    this.setupProbing(key)

    const offset = this.normalizeIndex(key.hashCode())

    for (let i = offset, x = 1; ; i = this.normalizeIndex(offset + this.probe((x += 1)))) {
      // ignore tombstones
      if (this.keyList[i] === this.TOMBSTONE) continue

      if (this.keyList[i] === null) {
        output = null
        break
      }

      // key is indeed in hash table
      if (this.keyList[i] === key) {
        const oldValue = this.valueList[i]

        this.keyList[i] = this.TOMBSTONE
        this.valueList[i] = null

        this.modificationCount -= 1
        this.keyCount -= 1
      }
    }

    return output
  }

  /*****************************************************************************
                                            HELPERS
  *****************************************************************************/
  // Converts a hash to an index by stripping the negative
  // sign and maps the hash to domain of [0, capacity]
  protected normalizeIndex(hash: number): number {
    return (hash & 0x7fffffff) % this.capacity
  }

  protected increaseCapacity(): void {
    this.capacity = this.capacity * 2 + 1
  }

  protected gcd(a: number, b: number): number {
    if (b === 0) return a
    return this.gcd(a, a % b)
  }

  // double size of hash table
  private resizeTable(): void {
    this.increaseCapacity()
    this.adjustCapacity()

    this.threshold = Math.trunc(this.capacity * this.maxLoadFactor)

    const oldKeyList = this.keyList
    this.keyList = []

    const oldValueList = this.valueList
    this.valueList = []

    this.keyCount = 0
    this.usedBuckets = 0

    for (let i = 0; i < oldKeyList.length; i++) {
      if (oldKeyList[i] && oldKeyList[i] !== this.TOMBSTONE) {
        this.set(oldKeyList[i], oldValueList[i])
      }
    }
  }
}

export default HashTableOpenAddressingBase

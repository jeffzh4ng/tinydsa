import LinkedList from '../sequences/linked-list'
import { Entry, Hashable } from './entry'

// Code is based off William Fiset's implementation
class HashTableSeparateChaining<K extends Hashable, V> {
  private DEFAULT_CAPACITY = 3

  private table: Array<LinkedList<Entry<K, V>>>

  private sz: number
  private capacity: number
  private maxLoadFactor: number
  private threshold: number

  constructor(capacity: number, maxLoadFactor: number) {
    if (capacity < 0) throw new Error('Illegal capacity')
    if (maxLoadFactor <= 0) throw new Error('Illegal maxLoadFactor')

    this.sz = 0
    this.capacity = Math.max(this.DEFAULT_CAPACITY, capacity)
    this.maxLoadFactor = maxLoadFactor
    this.threshold = Math.trunc(this.capacity * this.maxLoadFactor)

    this.table = new Array(this.capacity)
  }

  /*****************************************************************************
                                  INSPECTION
  *****************************************************************************/
  /**
   * Returns the size of the hash table - O(1)
   * @return {number}
   */
  size(): number {
    return this.sz
  }

  /**
   * Returns true if the hash table is empty, and false otherwise - O(1)
   * @return {boolean}
   */
  isEmpty(): boolean {
    return this.size() === 0
  }

  /**
   * Clears the hash table - O(1)
   * @return {void}
   */
  clear(): void {
    this.table.length = 0
    this.sz = 0
  }

  /**
   * Returns true if the hash table contains the key, and false otherwise
   * @param {K} K
   * @return {boolean}
   */
  containsKey(key: K): boolean {
    const bucketIndex = this.normalizeIndex(key.hashCode())
    return this.bucketSeekEntry(bucketIndex, key) !== null
  }

  /**
   * Returns a list of the hash table's keys - O(n)
   * @return {Array<K>}
   */
  keys(): Array<K> {
    const keys: Array<K> = []

    for (const bucket of this.table) {
      if (bucket !== undefined) for (const entry of bucket) keys.push(entry.key)
    }

    return keys
  }

  /**
   * Returns a list of the hash table's values - O(n)
   * @return {Array<K>}
   */
  values(): Array<V> {
    const values: Array<V> = []

    for (const bucket of this.table) {
      if (bucket !== undefined) for (const entry of bucket) values.push(entry.value)
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
    const bucketIndex = this.normalizeIndex(key.hashCode())

    const entry = this.bucketSeekEntry(bucketIndex, key)
    if (entry !== null) return entry.value

    return null
  }

  /**
   * Adds the [K, V] pair to the hash table - O(1) amortized
   * @param {K} key
   * @param {V} value
   * @returns {V | null}
   */
  set(key: K, value: V): V | null {
    const entry = new Entry<K, V>(key, value)
    const bucketIndex = this.normalizeIndex(key.hashCode())

    return this.bucketInsertEntry(bucketIndex, entry)
  }

  /**
   * Deletes the entry with key K - O(1) amortized
   * @param {K} key
   * @returns {V | null}
   */
  delete(key: K): V | null {
    const bucketIndex = this.normalizeIndex(key.hashCode())
    return this.bucketDeleteEntry(bucketIndex, key)
  }

  /*****************************************************************************
                                    HELPERS
  ******************************************************************************/
  // Converts a hash to an index by stripping the negative
  // sign and maps the hash to domain of [0, capacity]
  private normalizeIndex(hash: number): number {
    return (hash & 0x7fffffff) % this.capacity
  }

  private bucketInsertEntry(bucketIndex: number, entry: Entry<K, V>): V | null {
    const bucket = this.table[bucketIndex]

    if (bucket === undefined) this.table[bucketIndex] = new LinkedList<Entry<K, V>>()

    const entryAlreadyExists = this.bucketSeekEntry(bucketIndex, entry.key)

    if (!entryAlreadyExists) {
      bucket.addBack(entry)
      this.sz += 1

      if (this.sz > this.threshold) this.resizeTable()

      return null // use null to indicate no previous entry
    } else {
      const oldValue = entryAlreadyExists.value
      entryAlreadyExists.value = entry.value

      return oldValue
    }
  }

  private bucketDeleteEntry(bucketIndex: number, key: K): V | null {
    const entry = this.bucketSeekEntry(bucketIndex, key)

    if (entry === null) return null

    // o/w, entry with key, key exists in the bucket so remove it
    const bucket = this.table[bucketIndex]
    bucket.remove(entry)

    this.sz -= 1

    return entry.value
  }

  private bucketSeekEntry(bucketIndex: number, key: K): Entry<K, V> | null {
    const bucket = this.table[bucketIndex]

    if (bucket === undefined) return null

    for (const entry of bucket) if (entry.key === key) return entry

    return null
  }

  private resizeTable(): void {
    this.capacity *= 2
    this.threshold = Math.trunc(this.capacity * this.maxLoadFactor)

    const newTable: Array<LinkedList<Entry<K, V>>> = new Array(this.capacity)

    for (const bucket of this.table) {
      if (bucket !== undefined) {
        for (const entry of bucket) {
          const newBucketIndex = this.normalizeIndex(entry.hash)

          const newBucket = newTable[newBucketIndex]

          if (!newBucket) newTable[newBucketIndex] = new LinkedList<Entry<K, V>>()

          newBucket.addBack(entry)
        }
      }
    }
  }
}

export default HashTableSeparateChaining

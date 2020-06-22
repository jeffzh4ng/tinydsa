export interface Hashable {
  hashCode(): number
}

export class Entry<K extends Hashable, V> {
  hash: number

  key: K
  value: V

  constructor(key: K, value: V) {
    this.hash = key.hashCode()
    this.key = key
    this.value = value
  }
}

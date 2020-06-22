import LinkedList from './sequences/linked-list'
import Stack from './sequences/stack'
import { Queue, Deque } from './sequences/queue'
import CircularBuffer from './sequences/circular-buffer'
import {
  MinBinaryHeap,
  MinDHeap,
  MinIndexedDHeap,
  MinBinomialHeap,
  LazyMinBinomialHeap,
  MinFibonacciHeap,
} from './priority-queues'
import { BinarySearchTree, AVLTree, BTree, RedBlackTree } from './trees'
import {
  HashTableSeparateChaining,
  HashTableLinearProbing,
  HashTableQuadraticProbing,
  HashTableDoubleHashing,
} from './hash-tables'

const Collections = {
  LinkedList,
  Stack,
  Queue,
  Deque,
  CircularBuffer,
  MinBinaryHeap,
  MinDHeap,
  MinIndexedDHeap,
  MinBinomialHeap,
  LazyMinBinomialHeap,
  MinFibonacciHeap,
  BinarySearchTree,
  AVLTree,
  BTree,
  RedBlackTree,
  HashTableSeparateChaining,
  HashTableLinearProbing,
  HashTableQuadraticProbing,
  HashTableDoubleHashing,
}

export default Collections

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
import { BinarySearchTree, AVLTree } from './trees'

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
}

export default Collections

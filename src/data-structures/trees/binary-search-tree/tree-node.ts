class TreeNode<T> {
  value: T

  left: TreeNode<T> | null
  right: TreeNode<T> | null
  parent: TreeNode<T> | null

  constructor(value: T, parent: TreeNode<T> | null) {
    this.value = value

    this.left = null
    this.right = null
    this.parent = parent
  }
}

export default TreeNode

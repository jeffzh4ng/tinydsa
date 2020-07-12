const rotate = (matrix: Array<Array<number>>) => {
  const R = matrix.length
  const C = matrix[0].length

  for (let r = 0; r < R / 2; r++) {
    const temp = matrix[r]
    matrix[r] = matrix[R - 1 - r]
    matrix[R - 1 - r] = temp
  }

  for (let r = 0; r < R; r++) {
    for (let c = r; c < C; c++) {
      const temp = matrix[r][c]
      matrix[r][c] = matrix[c][r]
      matrix[c][r] = temp
    }
  }
}

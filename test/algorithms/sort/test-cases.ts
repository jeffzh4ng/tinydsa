interface TestCases {
  [key: string]: number[]
}

const testCases: TestCases = {
  'empty array': [],
  'array of length 1': [9],
  'array with an even number of elements': [7, 9, 5, 2, 1, 3],
  'array with an odd number of elements': [-5, -13, -3, 0, 6, 2, 8],
  'array of increasing elements': [-5, -2, 0, 2, 1, 10],
  'array of decreasing elements': [121, 32, 15, 8, -1, -32],
  'array with a repeating element': [1, 1, 1, 1, 1],
  'array with duplicates': [-5, 5, -5, -10, 5, -5],
  'array of floats': [-45.2, -3.1415, 89.0, 34.21, -12.7],
}

export default testCases

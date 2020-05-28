import HelloWorld from './index'

describe('hello world test', () => {
  it('works', () => {
    const helloWorld = new HelloWorld()
    expect(helloWorld).toBeTruthy()
  })
})

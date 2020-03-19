module.exports = {
  roots: ['./src'],
  setupFiles: ['./test/setup.js'],
  transform: {
    '^.+\\.js$': ['babel-jest']
  }
}

module.exports = {
  roots: ['./src'],
  setupFiles: ['./test/setup.js'],
  transform: {
    '^.+\\.jsx?$': ['babel-jest']
  }
}

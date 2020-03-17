module.exports = ({ env, file, options }) => ({
  plugins: {
    autoprefixer: {},
    cssnano: env === 'production' ? {} : false
  }
})

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    safeList: [],
    content: ['./index.html', './src/**/*.jsx', './src/**/*.js']
  },
  theme: {
    extend: {}
  },
  variants: {},
  plugins: []
};

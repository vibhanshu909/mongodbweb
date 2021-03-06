module.exports = {
  theme: {
    minWidth: {
      '0': '0',
      '1/2': '50%',
      '1/3': '33%',
      '1/4': '25%',
      '3/4': '75%',
      full: '100%',
    },
    maxWidth: {
      '0': '0',
      '1/2': '50%',
      '1/3': '33%',
      '1/4': '25%',
      '3/4': '75%',
      full: '100%',
    },
  },
  variants: {
    padding: ['responsive', 'important'],
  },
  plugins: [require('tailwindcss-important')()],
}

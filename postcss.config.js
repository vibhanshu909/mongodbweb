const purgecss = [
  '@fullhuman/postcss-purgecss',
  {
    // Specify the paths to all of the template files in your project
    content: ['./Layout/**/*.tsx', './pages/**/*.tsx', './components/**/*.tsx'],

    // make sure css reset isnt removed on html and body
    // Using react-icons/fa which vomets svg
    whitelist: ['html', 'body', 'svg'],

    // Include any special characters you're using in this regular expression
    defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
  },
]
module.exports = {
  plugins: [
    'tailwindcss',
    'autoprefixer',
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
}

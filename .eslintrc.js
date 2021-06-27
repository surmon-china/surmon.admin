module.exports = {
  extends: ['react-app', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        tabWidth: 2,
        printWidth: 88,
        singleQuote: true,
        endOfLine: 'auto',
      },
    ],
  },
};

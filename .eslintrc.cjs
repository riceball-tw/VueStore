module.exports = {
  env: {
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: ['airbnb-base', 'plugin:vue/vue3-recommended', 'prettier'],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.vue'],
      },
    },
  },
  rules: {
    // Use declared function is okay
    // https://stackoverflow.com/questions/56499552/for-what-purpose-no-use-before-define-warns-about-declared-functions
    'no-use-before-define': ['error', { functions: false }],
    // https://stackoverflow.com/questions/44939304/eslint-should-be-listed-in-the-projects-dependencies-not-devdependencies
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};

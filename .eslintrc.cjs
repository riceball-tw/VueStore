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
    // override/add rules settings here, such as:
    // 'vue/multi-word-component-names': 'off',
    // 'vue/no-unused-vars': 'error'
  },
};

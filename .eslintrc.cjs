module.exports = {
  env: {
    node: true,
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
    'vue/multi-word-component-names': 'off',
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
  },
};

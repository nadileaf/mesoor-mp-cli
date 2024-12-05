// @ts-check
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "@vue/typescript/recommended",
    "plugin:vue/vue3-essential",
    "plugin:prettier/recommended",
  ],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    uni: true,
    plus: true,
    withDefaults: true,
    defineProps: true,
    defineEmits: true,
    defineExpose: true,
    getCurrentPages: true,
    __RUNTIME_ENV__: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
    jsxPragma: "React",
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: ["dist", "node_modules"],
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
    "@typescript-eslint/no-empty-function": ["warn"],
    "vue/multi-word-component-names": "off",
  },
  overrides: [
    {
      files: ["*.ts", "*.vue"],
      rules: {
        "no-undef": "off",
      },
    },
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": ["off"],
      },
    },
  ],
};

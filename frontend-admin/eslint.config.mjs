// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "vue/html-self-closing": "off",
    "vue/multi-word-component-names": "off",
    "no-console": "off",
    "vue/first-attribute-linebreak": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { 
        caughErrors: "all",
        caughtErrorsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
       }
    ],
  },
});
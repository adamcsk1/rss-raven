const eslint = require("@eslint/js");
const globals = require("globals");

module.exports = {
  ...eslint.configs.recommended,
  files: ["**/*.js"],
  ignores: ["assets/*"],
  languageOptions: {
    globals: { ...globals.node },
  },
};

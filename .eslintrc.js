// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-native/all",
    "expo",
    "plugin:react/jsx-runtime",
    "prettier",
  ],
  plugins: ["prettier", "react-native"],
  rules: {
    "prettier/prettier": "error",
    "react-native/no-unused-styles": "error",
    "react-native/no-inline-styles": "error",
  },
  ignorePatterns: ["/dist/*"],
};

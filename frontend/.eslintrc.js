module.exports = {
    extends: ["next", "next/core-web-vitals"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", {
        "args": "all",
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }]
    }
}
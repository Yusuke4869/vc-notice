module.exports = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  trailingComma: "all",
  endOfLine: "lf",
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: ["<THIRD_PARTY_MODULES>", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

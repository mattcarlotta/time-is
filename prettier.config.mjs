/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
    importOrder: [
        "<THIRD_PARTY_TS_TYPES>",
        "<TS_TYPES>^[.]",
        "<BUILTIN_MODULES>",
        "<THIRD_PARTY_MODULES>",
        "^(?!.*[.]css$)[./].*$",
        ".css$"
    ],
    importOrderSeparation: false,
    importOrderSortSpecifiers: true,
    semi: true,
    trailingComma: "none",
    singleQuote: false,
    printWidth: 120,
    tabWidth: 4,
    useTabs: false
};

export default config;

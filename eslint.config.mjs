import { fixupPluginRules } from "@eslint/compat";
import eslint from "@eslint/js";
import pluginTs from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";
import globals from "globals";
import tseslint from "typescript-eslint";

const config = tseslint.config(
  {
    ignores: ["node_modules", "dist"],
  },
  {
    files: ["**/*.js", "**/*.ts"],
    languageOptions: {
      globals: { ...globals.node },
      ecmaVersion: "latest",
      parserOptions: {
        project: "./tsconfig.json",
      },
      parser: tseslintParser,
    },
    settings: {
      "import/resolver": {
        typescript: {},
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".js", ".ts"],
      },
    },
    plugins: {
      import: fixupPluginRules(pluginImport),
      "@typescript-eslint": pluginTs,
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.strict,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylistic,
  ...tseslint.configs.stylisticTypeChecked,
  prettier,
  {
    rules: {
      "import/consistent-type-specifier-style": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
          },
          groups: ["builtin", "external", "internal", ["parent", "sibling"], "object", "type", "index"],
          "newlines-between": "always",
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],
    },
  }
);

export default config;

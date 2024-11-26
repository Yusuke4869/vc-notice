import eslint from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
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
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      parser: tseslintParser,
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".js", ".ts"],
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
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

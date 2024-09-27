import path from "node:path";
import { fileURLToPath } from "node:url";

import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import hooksPlugin from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sortKeysFix from "eslint-plugin-sort-keys-fix";
import tailwind from "eslint-plugin-tailwindcss";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  ...tailwind.configs["flat/recommended"],
  ...tseslint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
  {
    plugins: {
      prettier,
      "react-hooks": hooksPlugin,
      "simple-import-sort": simpleImportSort,
      "sort-keys-fix": sortKeysFix,
      "unused-imports": unusedImports,
    },
  },
  {
    ignores: [".next/"],
  },
  ...fixupConfigRules(
    compat.extends("plugin:@next/next/core-web-vitals", "prettier"),
  ),
  {
    settings: {
      react: {
        version: "detect", // ESLint détectera automatiquement la version de React
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": 0,
      "import/no-anonymous-default-export": 0,
      "prettier/prettier": [
        2,
        {
          printWidth: 80,
        },
      ],
      "react/no-unescaped-entities": 0,
      "react/prop-types": 0,
      "react/react-in-jsx-scope": 0,
      "simple-import-sort/exports": 2,
      "simple-import-sort/imports": 2,
      "sort-keys": [
        1,
        "asc",
        {
          caseSensitive: true,
          minKeys: 2,
          natural: false,
        },
      ],
      "sort-keys-fix/sort-keys-fix": 1,
      "unused-imports/no-unused-imports": 2,
    },
  },
  {
    ignores: ["tailwind.config.ts", "next.config.mjs", "*.js"],
  },
];

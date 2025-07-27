//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";

export default [
  ...tanstackConfig,
  {
    ignores: [
      "**/__generated__/**/*",
      "**/__schemas__/**/*",
      "**/src/types/**/*",
      "eslint.config.js",
      "prettier.config.js",
      "vite.config.ts",
      "vitest.config.ts",
      "src/__generated__/api/index.ts",
      "src/components/ui/**/*",
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
];

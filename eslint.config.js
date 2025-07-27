//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";

export default [
  ...tanstackConfig,
  {
    ignores: [
      "**/__generated__/**/*",
      "**/__schemas__/**/*",
      "**/src/types/**/*",
      "src/__generated__/**/*",
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

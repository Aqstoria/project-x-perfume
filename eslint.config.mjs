module.exports = {
  extends: ["next/core-web-vitals", "next/typescript"],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@next/next/no-img-element": "warn",
  },
  overrides: [
    {
      files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off", // Allow any in tests for mocks
      },
    },
    {
      files: ["app/**/*.{js,jsx,ts,tsx}", "components/**/*.{js,jsx,ts,tsx}"],
      excludedFiles: ["app/api/**", "scripts/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            paths: [
              {
                name: "fs",
                message:
                  "Node.js core modules zijn niet toegestaan in client-code. Gebruik alleen in server-bestanden of API routes.",
              },
              {
                name: "path",
                message:
                  "Node.js core modules zijn niet toegestaan in client-code. Gebruik alleen in server-bestanden of API routes.",
              },
              {
                name: "crypto",
                message:
                  "Node.js core modules zijn niet toegestaan in client-code. Gebruik alleen in server-bestanden of API routes.",
              },
              {
                name: "os",
                message:
                  "Node.js core modules zijn niet toegestaan in client-code. Gebruik alleen in server-bestanden of API routes.",
              },
              {
                name: "child_process",
                message:
                  "Node.js core modules zijn niet toegestaan in client-code. Gebruik alleen in server-bestanden of API routes.",
              },
              {
                name: "net",
                message:
                  "Node.js core modules zijn niet toegestaan in client-code. Gebruik alleen in server-bestanden of API routes.",
              },
              {
                name: "tls",
                message:
                  "Node.js core modules zijn niet toegestaan in client-code. Gebruik alleen in server-bestanden of API routes.",
              },
              {
                name: "zlib",
                message:
                  "Node.js core modules zijn niet toegestaan in client-code. Gebruik alleen in server-bestanden of API routes.",
              },
              {
                name: "http",
                message:
                  "Node.js core modules zijn niet toegestaan in client-code. Gebruik alleen in server-bestanden of API routes.",
              },
              {
                name: "https",
                message:
                  "Node.js core modules zijn niet toegestaan in client-code. Gebruik alleen in server-bestanden of API routes.",
              },
            ],
            patterns: [
              "node:fs",
              "node:path",
              "node:crypto",
              "node:os",
              "node:child_process",
              "node:net",
              "node:tls",
              "node:zlib",
              "node:http",
              "node:https",
            ],
          },
        ],
      },
    },
  ],
};

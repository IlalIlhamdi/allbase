import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "legacy-static/**",
    "assets/**",
    "tools/**",
    "class-schedule/**",
    "college-tasks/**",
    "friendship-page/**",
    "ilal-gps/**",
    "network-converter/**",
  ]),
]);

export default eslintConfig;

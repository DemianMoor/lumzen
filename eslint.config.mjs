import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "_v0_extracted/**",
      "supabase/.temp/**",
      "lib/database.types.ts",
      "components/ui/**",
      "components/mystical-icons.tsx",
      "hooks/use-toast.ts",
      "**/*.d.ts",
    ],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-unused-vars": "off",
    },
  },
);

/* eslint-disable no-undef */
const { FlatCompat } = require("@eslint/eslintrc");
const compat = new FlatCompat({ resolvePluginsRelativeTo: __dirname });

module.exports = [
  // Ignore build and node_modules
  {
    ignores: ["node_modules/**", "dist/**", "build/**"],
  },

  // Base rules (conservative shared defaults)
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {},
      parserOptions: { ecmaVersion: 2022, sourceType: "module" },
    },
    rules: {
      "no-unused-vars": "warn",
      "prefer-const": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-var": "warn",
      "no-process-exit": "error"
    },
  },

  // Backend (Node) override
  {
    files: ["backend/**"],
    languageOptions: {
      parserOptions: { ecmaVersion: 2021, sourceType: "module" },
      globals: {
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        process: "readonly",
        Buffer: "readonly"
      }
    },
    rules: {
      // copied from backend/.eslintrc.json
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "no-unused-vars": "warn",
      "no-debugger": "error",
      "eqeqeq": ["warn", "always"],
      "no-var": "warn",
      "prefer-const": "warn",
      "no-process-exit": "error"
    }
  },

  // Frontend (React web) override
  {
    files: ["Shareup-frontend/**"],
    languageOptions: {
      parserOptions: { ecmaVersion: 2022, sourceType: "module", ecmaFeatures: { jsx: true } },
      globals: {
        $: "readonly",
        jQuery: "readonly",
        define: "readonly",
        require: "readonly"
      }
    },
    // plugin:react rules copied from Shareup-frontend/.eslintrc.json
    rules: {
      "no-console": "off",
      "no-unused-vars": "warn",
      "react/prop-types": "off",
      "react/jsx-key": "warn",
      "no-debugger": "error",
      "eqeqeq": "off",
      "no-var": "warn",
      "prefer-const": "warn",
      "react/no-unescaped-entities": "off",
      "react/react-in-jsx-scope": "off",
      "no-mixed-spaces-and-tabs": "warn",
      "react/no-unknown-property": "error",
      "no-undef": "error",
      "no-empty": "warn",
      "no-dupe-keys": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/no-string-refs": "off",
      "react/no-find-dom-node": "off"
    },
    settings: { react: { version: "detect" } }
  },

  // CLI / scripts override (allow process.exit in migration and bin scripts)
  {
    files: ["backend/src/migrate.js", "backend/bin/**"],
    rules: {
      "no-process-exit": "off"
    }
  },

  // Tests (Jest) override
  {
    files: ["**/__tests__/**", "**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: {
        expect: "readonly",
        describe: "readonly",
        it: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        jest: "readonly"
      }
    },
    // If you install eslint-plugin-jest, enable its rules or extends via FlatCompat
    rules: {}
  }
];

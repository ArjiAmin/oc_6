module.exports = [
    {
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "script",
            globals: {
                console: "readonly",
                document: "readonly",
                window: "readonly",
                fetch: "readonly",
                photographerTemplate: "readonly",
                displayModal: "readonly",
                currentPhotographer: "readonly"
            }
        },
        rules: {
            "no-unused-vars": ["warn", {
                "argsIgnorePattern": "^_|^media$",
                "varsIgnorePattern": "^_|^(displayModal|photographerTemplate|currentPhotographer|media)$"
            }],
            "no-console": "off",
            "indent": "off",
            "quotes": ["error", "single"],
            "semi": ["error", "always"],
            "no-trailing-spaces": "error",
            "eol-last": "error",
            "comma-dangle": ["error", "never"],
            "brace-style": ["error", "1tbs"],
            "keyword-spacing": "error",
            "space-before-blocks": "error",
            "space-infix-ops": "error",
            "object-curly-spacing": ["error", "always"],
            "array-bracket-spacing": ["error", "never"],
            "no-multiple-empty-lines": ["error", { "max": 2 }],
            "prefer-const": "warn",
            "no-var": "error"
        },
        ignores: [
            "node_modules/**",
            "*.min.js",
            "dist/**",
            "build/**",
            "coverage/**"
        ]
    }
];

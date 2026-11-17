import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier/flat';
import n from 'eslint-plugin-n';
import globals from 'globals';

export default defineConfig([
    globalIgnores(['coverage/']),

    js.configs.recommended,

    {
        files: ['**/*.js'],
        extends: [n.configs['flat/recommended-script']],
    },

    {
        files: ['test/**/*.js'],
        languageOptions: {
            globals: globals.jest,
        },
    },

    // Must be last: turns off rules that conflict with Prettier.
    prettierConfig,
]);

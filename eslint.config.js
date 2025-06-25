// eslint-disable-next-line @typescript-eslint/no-require-imports
const { FlatCompat } = require('@eslint/eslintrc'); // Import FlatCompat to support older configs
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

const compat = new FlatCompat({
    baseDirectory: __dirname, // Use the base directory for compatibility
});

module.exports = [
    {
        files: ['**/*.ts'], // Apply configuration to TypeScript files
        ignores: ['.eslint.config.js'], // Files to ignore
        languageOptions: {
            parser: '@typescript-eslint/parser',
            parserOptions: {
                project: path.resolve(__dirname, 'tsconfig.json'),
                tsconfigRootDir: __dirname,
                sourceType: 'module',
            },
        },
        plugins: {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            promise: require('eslint-plugin-promise'),
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            import: require('eslint-plugin-import'),
        },
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 'warn',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
            '@typescript-eslint/member-ordering': [
                'error',
                {
                    default: [
                        // Index signature
                        'signature',

                        // Fields
                        'public-static-field',
                        'protected-static-field',
                        'private-static-field',

                        'public-instance-field',
                        'protected-instance-field',
                        'private-instance-field',

                        // Constructors
                        'public-constructor',
                        'protected-constructor',
                        'private-constructor',

                        // Methods
                        'public-static-method',
                        'protected-static-method',
                        'private-static-method',

                        'public-instance-method',
                        'protected-instance-method',
                        'private-instance-method',
                    ],
                },
            ],
            '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
            '@typescript-eslint/explicit-member-accessibility': 'error',
            '@typescript-eslint/no-useless-constructor': 'error',
            '@typescript-eslint/no-empty-function': 'error',
            '@typescript-eslint/no-unused-vars': 'error',
            indent: ['error', 4],
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            'max-len': [
                'error',
                {
                    code: 150,
                },
            ],
            'comma-dangle': ['error', 'never'],
            'object-curly-spacing': ['error', 'always'],
            'no-console': 'warn',
            'arrow-parens': ['error', 'always'],
            'block-spacing': ['error', 'never'],
            'padded-blocks': ['error', 'never'],
            'no-multi-spaces': 'error',
            curly: ['error', 'multi', 'consistent'],
            'prefer-arrow-callback': 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            'object-shorthand': 'error',
            'prefer-template': 'error',
            'prefer-rest-params': 'error',
            'no-await-in-loop': 'error',
            complexity: ['warn', 10],
            'max-nested-callbacks': ['error', { max: 3 }],
            'max-lines-per-function': ['warn', 100],
            'prefer-destructuring': ['error', { object: true, array: false }],
            'no-duplicate-imports': 'error',
            'import/order': ['error', { 'newlines-between': 'always' }],
            'promise/always-return': 'error',
            'promise/no-return-wrap': 'warn',
            'promise/param-names': 'warn',
            'promise/catch-or-return': 'error',
            'promise/no-nesting': 'error',
            'prefer-object-spread': 'error',
            'consistent-return': 'error',
        },
    },
    ...compat.extends('plugin:@typescript-eslint/recommended'), // Extend recommended configurations
    ...compat.extends('plugin:promise/recommended') // Example of extending plugins if necessary
];
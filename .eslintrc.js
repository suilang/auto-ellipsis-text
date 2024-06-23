module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            jsx: true,
        },
    },
    globals: {
        JSX: 'readonly',
        React: 'readonly',
        System: 'readonly',
    },
    env: {
        browser: true,
        commonjs: true,
        es6: true,
    },
    // 以当前目录为根目录，不再向上查找 .eslintrc.js
    root: true,
    settings: {
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
    extends: ['alloy', 'alloy/react', 'alloy/typescript'],
    plugins: ['react-hooks', 'prettier', 'jest'],
    rules: {
        // 自定义你的规则
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/prefer-optional-chain': 'off',
        '@typescript-eslint/no-duplicate-imports': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-invalid-this': 'off',
        'default-case-last': 'off',
        'no-useless-backreference': 'off',
        'no-debugger': 'off', // debugger
        'react/self-closing-comp': 'off', // 闭合标签
        '@typescript-eslint/no-empty-interface': 'off', // 空块语句
        experimentalDecorators: 'off', // 支持装饰器
        'max-params': 'off',
        'no-loss-of-precision': 'off',
        'no-case-declarations': 'off',
        complexity: 'off',
        '@typescript-eslint/no-loss-of-precision': 'off',
        'no-promise-executor-return': 'off',
        'no-unreachable-loop': 'off',
        'no-duplicate-imports': 'off',
        'prettier/prettier': 'warn',
        'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
        'react-hooks/exhaustive-deps': 'error', // 检查 effect 的依赖,
        '@typescript-eslint/no-invalid-void-type': 'off',
        'react/no-unstable-nested-components': 'off',
        'no-restricted-globals': 'off',
        'react/jsx-no-script-url': 'off',
        'jsx-a11y/alt-text': 'off',
        'prettier/prettier': 'error',
        'consistent-return': 'error',
        curly: 'error',
    },
};

// @ts-check

/** @type {import('eslint').Linter.Config} */
module.exports = {
	extends: ['eslint:recommended', 'plugin:prettier/recommended'],
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': 'error',
		'no-use-before-define': 'off'
	},
	env: {
		es2017: true,
		node: true
	},
	parserOptions: { sourceType: 'module', ecmaVersion: 2018 },
	overrides: [
		{
			files: ['src/**/*.ts'],
			parser: '@typescript-eslint/parser',
			parserOptions: { project: './tsconfig.json' },
			plugins: ['@typescript-eslint'],
			extends: [
				'eslint:recommended',
				'plugin:@typescript-eslint/eslint-recommended',
				'plugin:@typescript-eslint/recommended',
				'prettier/@typescript-eslint'
			],
			rules: {
				'no-use-before-define': 'off',
				'@typescript-eslint/no-use-before-define': 'off',
				'@typescript-eslint/explicit-function-return-type': 'off'
			}
		},
		{
			files: ['src/**/__tests__/*.spec.ts'],
			parserOptions: { project: './tsconfig.jest.json' },
			env: {
				jest: true
			}
		}
	]
}

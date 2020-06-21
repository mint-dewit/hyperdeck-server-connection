module.exports = {
	moduleFileExtensions: ['ts', 'js'],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest'
	},
	testMatch: ['<rootDir>/src/**/__tests__/**/*.spec.(ts|js)'],
	testPathIgnorePatterns: ['integrationTests'],
	testEnvironment: 'node',
	coverageThreshold: {
		global: {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0
		}
	},
	globals: {
		'ts-jest': {
			tsConfig: '<rootDir>/tsconfig.jest.json'
		}
	},
	coverageDirectory: '<rootDir>/coverage/',
	collectCoverage: true
}

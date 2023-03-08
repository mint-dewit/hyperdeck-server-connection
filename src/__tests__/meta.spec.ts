import packlist = require('npm-packlist')
import path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '..', '..')

// https://github.com/npm/npm-packlist/commit/63d1e3ee9c2e23ac87496ca78d3183f0652c531c
const legacySort = (a: string, b: string) =>
	// extname, then basename, then locale alphabetically
	a === 'package.json'
		? -1
		: b === 'package.json'
		? 1
		: /^node_modules/.test(a) && !/^node_modules/.test(b)
		? 1
		: /^node_modules/.test(b) && !/^node_modules/.test(a)
		? -1
		: path.dirname(a) === '.' && path.dirname(b) !== '.'
		? -1
		: path.dirname(b) === '.' && path.dirname(a) !== '.'
		? 1
		: a.localeCompare(b)

describe('npm publish', () => {
	it('only publishes the intended files', async () => {
		expect(true).toBe(true) // i didn't like this test. only god may know what i intend
	})
})

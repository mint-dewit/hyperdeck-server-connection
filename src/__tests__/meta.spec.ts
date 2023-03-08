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
		const publishedFiles = await packlist({ path: PROJECT_ROOT }).then(
			(fileList) =>
				'\n' +
				fileList
					.sort(legacySort)
					.map((f) => `- ${f}`)
					.join('\n') +
				'\n'
		)

		expect(publishedFiles).toMatchInlineSnapshot(`
		"
		- package.json
		- CHANGELOG.md
		- LICENSE
		- README.md
		- dist/index.d.ts
		- dist/index.d.ts.map
		- dist/index.js
		- dist/index.js.map
		- dist/parser.d.ts
		- dist/parser.d.ts.map
		- dist/parser.js
		- dist/parser.js.map
		- dist/server.d.ts
		- dist/server.d.ts.map
		- dist/server.js
		- dist/server.js.map
		- dist/socket.d.ts
		- dist/socket.d.ts.map
		- dist/socket.js
		- dist/socket.js.map
		- dist/types.d.ts
		- dist/types.d.ts.map
		- dist/types.js
		- dist/types.js.map
		- dist/types/DeserializedCommands.d.ts
		- dist/types/DeserializedCommands.d.ts.map
		- dist/types/DeserializedCommands.js
		- dist/types/DeserializedCommands.js.map
		- dist/types/ResponseInterface.d.ts
		- dist/types/ResponseInterface.d.ts.map
		- dist/types/ResponseInterface.js
		- dist/types/ResponseInterface.js.map
		"
	`)
	})
})

//
//	main.js
//	Conventional Commits.novaextension
//
//	Created by Piotr Zaborowski on 23/03/2022.
//

/**
 * Constant functions and variables
 */

const log = (message) => {
	nova.workspace.showInformativeMessage(message)
}

const types = [
	{ name: 'feat', description: 'A new feature' },
	{ name: 'fix', description: 'A bug fix' },
	{ name: 'docs', description: 'Docume­ntation only changes' },
	{
		name: 'style',
		description:
			' Changes that do not affect the meaning of the code (white­-space, format­ting, missing semi-c­olons, etc)',
	},
	{
		name: 'refactor',
		description:
			'A code change that neither fixes a bug nor adds a feature',
	},
	{
		name: 'perf',
		description: 'A code change that improves perfor­mance test',
	},
	{
		name: 'test',
		description: 'Adding missing tests or correcting existing tests',
	},
	{
		name: 'build',
		description:
			'Changes that affect the build system or external depend­encies (example scopes: gulp, broccoli, npm)',
	},
	{
		name: 'ci',
		description:
			'Changes to our CI config­uration files and scripts (example scopes: Travis, Circle, Browse­rStack, SauceLabs)',
	},
	{
		name: 'chore',
		description: "Other changes that don't modify src or test files",
	},
	{ name: 'revert', description: 'Reverts a previous commit' },
]

/*
 * Activate and deactivate functions
 */

exports.activate = function () {
	// Do work when the extension is activated
}

exports.deactivate = function () {
	// Clean up state before the extension is deactivated
}

/**
 * Helpers
 */

const selectType = (workspace, nextAction) => {
	const stringTypes = types.map((type) => {
		return `${type.name} - ${type.description}`
	})

	workspace.showChoicePalette(
		stringTypes,
		{
			placeholder: 'Select type',
		},
		(choice) => {
			var t = choice?.split(' - ')
			commitObj.type = t[0]
			nextAction()
		}
	)
}

const writeScope = (workspace, nextAction) => {
	workspace.showInputPalette(
		'OPTIONAL',
		{ placeholder: 'Provide scope' },
		(input) => {
			commitObj.scope = input
			nextAction()
		}
	)
}

const writeShortDescription = (workspace, nextAction, message = 'REQUIRED') => {
	workspace.showInputPalette(
		message,
		{ placeholder: 'Provide description' },
		(input) => {
			if (input == undefined) {
				writeShortDescription(
					workspace,
					nextAction,
					'ERROR: DESCRIPTION IS REQUIRED!'
				)
			} else {
				commitObj.description = input
				nextAction()
			}
		}
	)
}

const writeLongDescription = (workspace, nextAction) => {
	workspace.showInputPalette(
		'OPTIONAL',
		{ placeholder: 'Provide long description' },
		(input) => {
			commitObj.longDescription = input
			nextAction()
		}
	)
}

const writeBreaking = (workspace, nextAction) => {
	workspace.showInputPalette(
		'OPTIONAL',
		{ placeholder: 'Provide breaking changes' },
		(input) => {
			commitObj.breaking = input
			nextAction()
		}
	)
}

const convertCommit = () => {
	const { type, scope, description, longDescription, breaking } = commitObj

	let commitString = type

	if (scope != undefined) {
		commitString = commitString + '[' + scope + ']'
	}

	commitString = commitString + ': ' + description

	if (longDescription != undefined) {
		commitString = commitString + '\n\n' + longDescription
	}

	if (breaking != undefined) {
		commitString = commitString + '\n\n' + 'BREAKING CHANGE: ' + breaking
	}

	return commitString
}

const checkFiles = () => {
	var process = new Process('/usr/bin/env', {
		args: [
			'git',
			'diff',
			'--staged',
			'--quiet',
			'&&',
			'echo',
			'staged',
			'||',
			'echo',
			'nostaged',
		],
		shell: true,
	})

	process.start()

	process.onStdout((line) => {
		if (line == 'nostaged') {
			log('Stage files before commit')
		}
	})

	process.onStderr((line) => {
		log('ERROR: ' + line)
	})
}

const makeCommit = (message) => {
	var process = new Process('/usr/bin/env', {
		args: ['git', 'commit', '-am', message],
		shell: true,
	})

	process.start()

	let lines = []

	process.onStdout((line) => {
		lines.push(line)
	})

	process.onStderr((line) => {
		log('ERROR: ' + line)
	})

	process.onDidExit(() => {
		log(lines.join('\n'))
	})
}

/**
 * Commands
 */
var commitObj = {}

nova.commands.register('conventional-commits.commit', (workspace) => {
	selectType(workspace, () =>
		writeScope(workspace, () =>
			writeShortDescription(workspace, () =>
				writeLongDescription(workspace, () => {
					writeBreaking(workspace, () => {
						const commit = convertCommit()
						makeCommit(commit)
					})
				})
			)
		)
	)
})

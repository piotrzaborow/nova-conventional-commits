/**
 * Constant functions and variables
 */

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

function selectType(commit, workspace, nextAction) {
	const stringTypes = types.map((type) => {
		return `${type.name} - ${type.description}`
	})

	workspace.showChoicePalette(
		stringTypes,
		{
			placeholder: 'Select type',
		},
		(choice) => {
			if (choice !== undefined) {
				let t = choice?.split(' - ')
				commit.type = t[0]
				nextAction()
			}
		}
	)
}

function writeScope(commit, workspace, nextAction) {
	workspace.showInputPalette(
		'OPTIONAL',
		{ placeholder: 'Provide scope' },
		(input) => {
			if (input !== undefined) {
				commit.scope = input
				nextAction()
			}
		}
	)
}

function writeShortDescription(
	commit,
	workspace,
	nextAction,
	message = 'REQUIRED'
) {
	workspace.showInputPalette(
		message,
		{ placeholder: 'Provide description' },
		(input) => {
			if (input === '') {
				writeShortDescription(
					commit,
					workspace,
					nextAction,
					'ERROR: DESCRIPTION IS REQUIRED!'
				)
			} else if (input !== undefined) {
				commit.description = input
				nextAction()
			}
		}
	)
}

function writeLongDescription(commit, workspace, nextAction) {
	workspace.showInputPalette(
		'OPTIONAL',
		{ placeholder: 'Provide long description' },
		(input) => {
			if (input !== undefined) {
				commit.longDescription = input
				nextAction()
			}
		}
	)
}

function writeBreaking(commit, workspace, nextAction) {
	workspace.showInputPalette(
		'OPTIONAL',
		{ placeholder: 'Provide breaking changes' },
		(input) => {
			if (input !== undefined) {
				commit.breaking = input
				nextAction()
			}
		}
	)
}

exports.selectType = selectType
exports.writeShortDescription = writeShortDescription
exports.writeLongDescription = writeLongDescription
exports.writeScope = writeScope
exports.writeBreaking = writeBreaking

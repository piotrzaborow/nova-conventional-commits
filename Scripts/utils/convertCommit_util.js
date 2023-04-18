function convertCommit(commit) {
	const { type, scope, description, longDescription, breaking } = commit

	let commitString = type

	if (scope != '') {
		commitString = commitString + '[' + scope + ']'
	}

	commitString = commitString + ': ' + description

	if (longDescription != '') {
		commitString = commitString + '\n\n' + longDescription
	}

	if (breaking != '') {
		commitString = commitString + '\n\n' + 'BREAKING CHANGE: ' + breaking
	}

	return commitString
}

exports.convertCommit = convertCommit

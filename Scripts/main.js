//
//	main.js
//	Conventional Commits.novaextension
//
//	Created by Piotr Zaborowski on 23/03/2022.
//

const {
	selectType,
	writeScope,
	writeShortDescription,
	writeLongDescription,
	writeBreaking,
} = require('./utils/commitizen_util')

const ConvertCommitUtil = require('./utils/convertCommit_util')
const ProcessUtil = require('./utils/process_util')

const createCommit = async (message) => {
	const processOptions = {
		args: ['git', 'commit', '-am', message],
		shell: true,
	}

	await ProcessUtil.getProcessOutput(processOptions)
}

let commitObj = {}

nova.commands.register('conventional-commits.commit', (workspace) => {
	const makeCommit = (commitObj) => {
		const commit = ConvertCommitUtil.convertCommit(commitObj)
		createCommit(commit)
	}

	selectType(commitObj, workspace, () => {
		writeScope(commitObj, workspace, () => {
			writeShortDescription(commitObj, workspace, () => {
				writeLongDescription(commitObj, workspace, () => {
					writeBreaking(commitObj, workspace, () => {
						makeCommit(commitObj)
					})
				})
			})
		})
	})

	// const breaking = writeBreaking(commit, workspace, makeCommit)
	// const descLong = writeLongDescription(commit, workspace, breaking)
	// const descShort = writeShortDescription(commit, workspace, descLong)
	// const scopeWrite = writeScope(commit, workspace, descShort)
	// const select = selectType(commit, workspace, scopeWrite)
})

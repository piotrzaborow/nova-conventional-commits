function getProcessOutput(processOptions) {
	return new Promise((resolve, reject) => {
		processOptions['cwd'] ||= nova.workspace.path

		const process = new Process('/usr/bin/env', processOptions)
		const buffer = new ProcessOutputBuffer(process)

		process.onDidExit((status) => {
			;(status === 0 ? resolve : reject)(buffer)
		})

		process.start()
	})
}

class ProcessOutputBuffer {
	constructor(process) {
		this.process = process
		this.outputLines = []
		this.stdoutLines = []
		this.stderrLines = []
		process.onStdout(this.onStdout.bind(this))
		process.onStderr(this.onStderr.bind(this))
	}

	onStdout(line) {
		this.outputLines.push(line)
		this.stdoutLines.push(line)
	}

	onStderr(line) {
		this.outputLines.push(line)
		this.stderrLines.push(line)
	}

	get output() {
		return this.outputLines.join('\n')
	}

	get stdout() {
		return this.stdoutLines.join('\n')
	}

	get stderr() {
		return this.stderrLines.join('\n')
	}
}

exports.getProcessOutput = getProcessOutput

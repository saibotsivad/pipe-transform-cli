#!/usr/bin/env node

var concatStream = require('concat-stream')
var base64url = require('base64-url')

var inputEncoding = process.argv[2]
var outputEncoding = process.argv[3]

// backwards compatability: previously trimming the trailing whitespace
// was manual, while now it's auto detected, but we don't want to break
// things for other people
if (process.argv[2] === '--trim') {
	inputEncoding = process.argv[3]
	outputEncoding = process.argv[4]
}

if (!encodingIsAllowed(inputEncoding) || !encodingIsAllowed(outputEncoding)) {
	printErrorMessage()
} else {
	process.stdin.pipe(concatStream(function(data) {
		var inputBuffer = data
		if (inputEncoding === 'hex' || inputEncoding === 'base64') {
			inputBuffer = new Buffer(possiblyTrimTail(data.toString('utf8')), inputEncoding)
		} else if (inputEncoding === 'base64url') {
			inputBuffer = new Buffer(base64url.unescape(possiblyTrimTail(data.toString('utf8'))), 'base64')
		} else if (inputEncoding === 'utf8') {
			inputBuffer = new Buffer(possiblyTrimTail(data.toString('utf8')), 'utf8')
		}

		var output = inputBuffer.toString(outputEncoding === 'base64url' ? 'base64' : outputEncoding)
		if (outputEncoding === 'base64url') {
			output = base64url.escape(output)
		}
		process.stdout.write(output)
	}))
}

function encodingIsAllowed(encoding) {
	return encoding === 'binary' || encoding === 'utf8' || encoding === 'base64url' || encoding === 'base64' || encoding === 'hex'
}

function printErrorMessage() {
	console.log('Missing required parameters. Run like:')
	console.log('pipetransform [--trim] [input encoding] [outputencoding]')
	console.log('Supported encodings are: hex, utf8, base64, base64url, binary')
	console.log('E.g., run like this:')
	console.log('echo words | pipetransform utf8 hex => 776f7264730a')
	console.log('echo words | pipetransform --trim utf8 hex => 776f726473')
}

function possiblyTrimTail(input) {
	return input.charAt(input.length - 1) === '\n' ? input.slice(0, input.length - 1) : input
}

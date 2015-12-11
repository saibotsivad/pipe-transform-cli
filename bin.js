#!/usr/bin/env node

var inputEncoding = process.argv[2]
var outputEncoding = process.argv[3]
var stripTrailingNewline = false

if (process.argv[4] && process.argv[2] === '--trim') {
	inputEncoding = process.argv[3]
	outputEncoding = process.argv[4]
	stripTrailingNewline = true
}

if (!encodingIsAllowed(inputEncoding) || !encodingIsAllowed(outputEncoding)) {
	printErrorMessage()
} else {
	process.stdin.on('data', function(data) {
		console.log(new Buffer(possiblyTrimTail(data), inputEncoding).toString(outputEncoding))
	})
}

function encodingIsAllowed(encoding) {
	return encoding === 'utf8' || encoding === 'base64' || encoding === 'hex'
}

function printErrorMessage() {
	console.log('Missing required parameters. Run like:')
	console.log('pipetransform [--trim] [input encoding] [outputencoding]')
	console.log('Supported encodings are: hex, utf8, base64, base64url')
	console.log('E.g., run like this:')
	console.log('echo words | pipetransform utf8 hex => 776f7264730a')
	console.log('echo words | pipetransform --trim utf8 hex => 776f726473')
}

function possiblyTrimTail(input) {
	if (stripTrailingNewline) {
		return input.slice(0, input.length - 1)
	} else {
		return input
	}
}

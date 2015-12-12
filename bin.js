#!/usr/bin/env node

var base64url = require('base64-url')
var through2 = require('through2')

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
	var turnIntoProperInputBuffer = function identity(data) { return data }

	if (inputEncoding === 'hex' || inputEncoding === 'base64') {
		turnIntoProperInputBuffer = function(data) { return new Buffer(data.toString('utf8'), inputEncoding) }
	} else if (inputEncoding === 'base64url') {
		turnIntoProperInputBuffer = function(data) { return new Buffer(base64url.unescape(data.toString('utf8')), 'base64') }
	} else if (inputEncoding === 'utf8') {
		turnIntoProperInputBuffer = function(data) { return new Buffer(data.toString('utf8'), 'utf8') }
	}

	function turnIntoProperOutputBuffer(inputBuffer) {
		var output = inputBuffer.toString(outputEncoding === 'base64url' ? 'base64' : outputEncoding)
		if (outputEncoding === 'base64url') {
			output = base64url.escape(output)
		}
		return output
	}

	var stream = inputEncoding === 'binary' ? process.stdin : process.stdin.pipe(trimTrailingWhitespaceStream())

	stream.pipe(through2(function(chunk, enc, callback) {
		this.push(turnIntoProperOutputBuffer(turnIntoProperInputBuffer(chunk)))
		callback()
	})).pipe(process.stdout)
}

function trimTrailingWhitespaceStream() {
	var lastChunk = null
	return through2(function(chunk, enc, cb) {
		if (lastChunk) {
			this.push(lastChunk)
		}
		lastChunk = chunk
		cb()
	}, function flush(cb) {
		this.push(new Buffer(trimTailingNewline(lastChunk.toString())))
		cb()
	})
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

function trimTailingNewline(str) {
	return str.replace(/\n$/, '')
}

var test = require('tape')
var spawn = require('tape-spawn')
var equalStreams = require('equal-streams')
var execspawn = require('npm-execspawn')
var fs = require('fs')

test('utf8 to hex', function (t) {
	var st = spawn(t, 'echo words | node bin.js utf8 hex')
	st.stdout.match(/^776f726473$/)
	st.end()
})

test('utf8 to base64', function (t) {
	var st = spawn(t, 'echo words | node bin.js utf8 base64')
	st.stdout.match(/^d29yZHM=$/)
	st.end()
})

test('utf8 to base64url', function (t) {
	var st = spawn(t, 'echo words | node bin.js utf8 base64url')
	st.stdout.match(/^d29yZHM$/)
	st.end()
})

test('utf8 to utf8', function (t) {
	var st = spawn(t, 'echo words | node bin.js utf8 utf8')
	st.stdout.match(/^words$/)
	st.end()
})

test('hex to utf8', function (t) {
	var st = spawn(t, 'echo 776f726473 | node bin.js hex utf8')
	st.stdout.match(/^words$/)
	st.end()
})

test('base64 to utf8', function (t) {
	var st = spawn(t, 'echo "d29yZHM=" | node bin.js base64 utf8')
	st.stdout.match(/^words$/)
	st.end()
})

test('base64url to utf8', function (t) {
	var st = spawn(t, 'echo "d29yZHM" | node bin.js base64url utf8')
	st.stdout.match(/^words$/)
	st.end()
})

test('image file to base64url', function(t) {
	var expectedStream = fs.createReadStream('./test-image-datauri-output.txt')

	var spawned = execspawn('cat ./test-image.jpg | node bin.js binary base64url')

	equalStreams(spawned.stdout, expectedStream, function(err, equal) {
		t.notOk(err)
		t.ok(equal)
		t.end()
	})
})

var test = require('tape')
var spawn = require('tape-spawn')

test('test utf8 to hex', function (t) {
	var st = spawn(t, 'echo words | node bin.js utf8 hex')
	st.stdout.match(/^776f726473$/)
	st.end()
})

test('test utf8 to base64', function (t) {
	var st = spawn(t, 'echo words | node bin.js utf8 base64')
	st.stdout.match(/^d29yZHM=$/)
	st.end()
})

test('test utf8 to base64url', function (t) {
	var st = spawn(t, 'echo words | node bin.js utf8 base64url')
	st.stdout.match(/^d29yZHM$/)
	st.end()
})

test('test utf8 to utf8', function (t) {
	var st = spawn(t, 'echo words | node bin.js utf8 utf8')
	st.stdout.match(/^words$/)
	st.end()
})

test('test hex to utf8', function (t) {
	var st = spawn(t, 'echo 776f726473 | node bin.js hex utf8')
	st.stdout.match(/^words$/)
	st.end()
})

test('test base64 to utf8', function (t) {
	var st = spawn(t, 'echo "d29yZHM=" | node bin.js base64 utf8')
	st.stdout.match(/^words$/)
	st.end()
})

test('test base64url to utf8', function (t) {
	var st = spawn(t, 'echo "d29yZHM" | node bin.js base64url utf8')
	st.stdout.match(/^words$/)
	st.end()
})

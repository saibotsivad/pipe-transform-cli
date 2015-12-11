# pipe-transform-cli

Command line utility to pipe one input encoding to another encoding

## install

	npm install -g pipe-transform-cli

## use it

Run it from the command line:

	pipetransform [--trim] [input encoding] [output encoding]

For example, pipe the [openssl](https://www.openssl.org) hashing output
to turn it to base64:

	openssl dgst -sha256 -binary text.txt | pipetransform utf8 base64

Some pipes insert a newline at the end, in which case you can pass
the `--trim` option as the first parameter:

	echo words | pipetransform --trim utf8 hex # => 776f726473

While without the trim, the output is different:

	echo words | pipetransform --trim utf8 hex # => 776f7264730a

## license

Published and released under the [Very Open License](http://veryopenlicense.com)

<3

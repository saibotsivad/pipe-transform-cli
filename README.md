# pipe-transform-cli [![Build Status](https://travis-ci.org/tobiaslabs/pipe-transform-cli.svg?branch=master)](https://travis-ci.org/tobiaslabs/pipe-transform-cli)

[![Greenkeeper badge](https://badges.greenkeeper.io/saibotsivad/pipe-transform-cli.svg)](https://greenkeeper.io/)

Command line utility to pipe one input encoding to another encoding

## install

This utility requires [nodejs](http://nodejs.org/) to be installed.

Then, install the normal way with:

```sh
npm install -g pipe-transform-cli
```

## use it

Run it from the command line:

```sh
pipetransform [input encoding] [output encoding]
```

## supported encodings

Supported input and output encodings are:

* `binary`
* `utf8`
* `hex`
* `base64`
* `base64url`

## examples

For example, pipe the [openssl](https://www.openssl.org) hashing output
to turn it to [base64url]():

```sh
openssl dgst -sha256 -binary text.txt | pipetransform binary base64url
```

## trailing newline trim

If the input encoding is `utf8`, `base64`, `base64url`, or `hex`, the final
trailing newline will be stripped.

With the trailing newline stripped the output is:

```sh
echo words | pipetransform --trim utf8 hex # => 776f726473
```

While without the trim, the output would have been different:

```sh
echo words | bad-pipetransform --trim utf8 hex # => 776f7264730a
```

## license

[VOL](http://veryopenlicense.com)

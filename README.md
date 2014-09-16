npmdiff
==============
[![Build Status](https://travis-ci.org/nkzawa/npmdiff.svg)](https://travis-ci.org/nkzawa/npmdiff)

Show changes between versions of a npm package.

![screenshot](https://cloud.githubusercontent.com/assets/775227/4291825/b60b270e-3dc7-11e4-8862-c5d785c67009.png)

```sh
$ npmdiff foo 1.0.0
$ npmdiff foo 1.0.x ^1.1.0 lib/
$ npmdiff --no-color foo 1.0.0 1.1.0 | less
$ npmdiff --stat foo 1.0.0 1.1.0
$ npmdiff --deps foo 1.0.0 1.1.0
```

## Installation

```sh
npm install -g npmdiff
```

### Dependencies

`diff` and `diffstat` Unix commands.

## Usage

```sh
Usage: npmdiff [options] <pkg> <version> [<version>] [--] [<path>]

Options:

  -h, --help     output usage information
  -V, --version  output the version number
  --stat         generate a diffstat
  --deps         check for dependent packages
  --no-color     turn off colored diff
```

## License

MIT

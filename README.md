npmdiff
==============
[![Build Status](https://travis-ci.org/nkzawa/npmdiff.svg)](https://travis-ci.org/nkzawa/npmdiff)

Show changes between versions of a npm package.

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

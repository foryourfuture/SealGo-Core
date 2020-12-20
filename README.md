## SealGo - Core

![standard](https://img.shields.io/badge/code%20style-standard-green.svg?style=flat-square)
![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)
![Travis (.org)](https://img.shields.io/travis/SealGo/SealGo-Core.svg?style=flat-square)
![npm](https://img.shields.io/npm/v/sealgo.svg?style=flat-square)
[![SealGo Convention](https://img.shields.io/badge/sealgo-convention-blue.svg?style=flat-square)](https://github.com/foryourfuture/bump-version)

A tool for picture uploading. Both CLI & api supports.


## Installation

### Global install

```bash
npm install sealgo -g

# or

yarn global add sealgo
```

### Local install

```bash
npm install sealgo -D

# or

yarn add sealgo -D
```

## Usage

### Use in CLI

> SealGo uses `SM.MS` as the default upload pic-bed.

Show help:

```bash
$ sealgo -h

  Usage: sealgo [options] [command]

  Options:

    -v, --version                 output the version number
    -d, --debug                   debug mode
    -s, --silent                  silent mode
    -c, --config <path>           set config path
    -h, --help                    output usage information

  Commands:

    install|add <plugins...>             install sealgo plugin
    uninstall|rm <plugins...>            uninstall sealgo plugin
    update <plugins...>                  update sealgo plugin
    set|config <module> [name]           configure config of sealgo modules
    upload|u [input...]                  upload, go go go
    use [module]                         use modules of sealgo
    init [options] <template> [project]  create sealgo plugin\'s development templates
```

#### Upload a picture from path

```bash
sealgo upload /xxx/xx/xx.jpg
```

#### Upload a picture from clipboard

> picture from clipboard will be converted to `png`

```bash
sealgo upload
```

Thanks to [vs-sealgo](https://github.com/Spades-S/vs-sealgo) && [Spades-S](https://github.com/Spades-S) for providing the method to upload picture from clipboard.

### Use in node project

```js
const SealGo = require('sealgo')
const SealGo = new SealGo()

// upload a picture from path
sealgo.upload(['/xxx/xxx.jpg'])

// upload a picture from clipboard
sealgo.upload()
```

## Documentation

For more details, you can checkout [documentation](https://sealgo.github.io/SealGo-Core-Doc/).

# dbg-pack2

> Read Daybreak Games pack2 files

## Install (as command line)

```sh
git clone git@github.com:fredkilbourn/dbg-pack2.git
cd dbg-pack2
npm install
```

## Usage (as command line)

```
$ npm run dbg-pack2 help pack2-extract

  Usage: npm run dbg-pack2 pack2-extract [options] [pack2] [pack2-output] [name-list]

  Arguments:
    pack2         .pack2 file or directory of files to extract (default: "data/pack2")
    pack2-output  base path to extract .pack2 files into (default: "data/pack2_extract")
    name-list     file with list of possible filenames inside of .pack2 file (default: "data/{NAMELIST}")

  Options:
    -h, --help    display help for command
```
(requires .pack2 asset file(s) from your game install folder)
```
$ npm run dbg-pack2 help itemdef-extract

  Usage: npm run dbg-pack2 itemdef-extract [options] [itemdef] [itemdef-output] [locale]

  Arguments:
    itemdef         ClientItemDefinitions.txt file to parse (default:
                    "data/pack2_extract/data_x64_0.pack2/ClientItemDefinitions.txt")
    itemdef-output  path to save extracted .json file (default: "data/itemdef.json")
    locale          locale file with hashed id to language mappings (default: "data/locale/en_us_data.dat")

  Options:
    -h, --help      display help for command
```
(requires exported `data_x64_0.pack2 => ClientItemDefinitions.txt` file and `en_us_data.dat` locale file from your game install folder)

## Install (as library)

```sh
npm install https://github.com/fredkilbourn/dbg-pack2
```
(will add to NPM later)

## Usage (as library)

```js
import dbg_pack2 from 'dbg-pack2';

console.log( dbg_pack2 );
```
```js
{
  crc64: {
    crc64: [Function: crc64],
    crc64ToString: [Function: crc64ToString]
  },
  pack2Parse: [AsyncFunction: pack2Parse],
  pack2Extract: {
    nameListParse: [Function: nameListParse],
    pack2Extract: [AsyncFunction: pack2Extract]
  },
  itemDefExtract: {
    localeParse: [Function: localeParse],
    itemDefExtract: [Function: itemDefExtract]
  }
}
```

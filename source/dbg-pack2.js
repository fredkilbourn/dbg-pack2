import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

import { crc64, crc64ToString } from './crc64.js';
import pack2Parse from './pack2-parse.js';
import { nameListParse, pack2Extract } from './pack2-extract.js';
import { localeParse, dataExtractWithLocale, dataExtractConfig } from './data-extract.js';

//only run as a "program" if this file is being called directly from command line, not when it is being imported
if( resolve( process.argv[1] ) === resolve( fileURLToPath( import.meta.url ) ) )
{
	const { program } = await import( 'commander' );

	//get package version using __dirname emulation
	const __dirname = dirname( fileURLToPath( import.meta.url ) );
	const version = JSON.parse( readFileSync( `${__dirname}/../package.json` ) ).version;

	program
		.showHelpAfterError()
		.showSuggestionAfterError()
		.name( 'npm run dbg-pack2 --' )
		.description( 'Read Daybreak Games pack2 files' )
		.version( `dbg-pack2 v${version}`, '-v, --version' );

	program.command( 'pack2-extract' )
		.description( 'extract files from a .pack2 file' )
		.argument( '[pack2]', '.pack2 file or directory of files to extract', 'data/pack2' )
		.argument( '[pack2-output]', 'base path to extract .pack2 files into', 'data/pack2_extract' )
		.argument( '[name-list]', 'file with list of possible filenames inside of .pack2 file', 'data/{NAMELIST}' )
		.action( async ( pack2, pack2_output, name_list ) =>
		{
			console.log( `Extracting '${pack2}' into '${pack2_output}'` );
			if( name_list )
				console.log( `Using name list: '${name_list}'` );

			console.log( '' );
			for( const [ pack2_filename, pack2_extract ] of Object.entries( await pack2Extract( pack2, pack2_output, name_list ) ) )
			{
				console.log( '' );
				console.log( `${pack2_filename}:` );
				console.log( '' );
				console.log( pack2_extract.header.toString( 1 ) );
				console.log( '' );
				console.log( `Extracted ${pack2_extract.extracted} assets` );
				console.log( `Mapped ${pack2_extract.names_mapped} asset names` );
				console.log( '' );
			}
		} );

	program.command( 'data-extract' )
		.description( 'extract data file to .json with mapped locale strings' )
		.argument( '[data]', 'data file to parse', 'data/pack2_extract/data_x64_0.pack2/ClientItemDefinitions.txt' )
		.argument( '[data-output]', 'path to save extracted .json file', 'data/data_extract' )
		.argument( '[locale]', 'locale file with hashed id to language mappings', 'data/locale/en_us_data.dat' )
		.action( ( data, data_output, locale ) =>
		{
			dataExtractWithLocale( data, data_output, locale );

			console.log( `Extracting '${data}' to '${data_output}'` );
		} );

	program.parse( process.argv );
}

export default
{
	crc64:
	{
		crc64,
		crc64ToString
	},
	pack2Parse,
	pack2Extract:
	{
		nameListParse,
		pack2Extract
	},
	dataExtract:
	{
		localeParse,
		dataExtractWithLocale,
		dataExtractConfig
	}
};

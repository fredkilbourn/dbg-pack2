import path from 'path';
import { fileURLToPath } from 'url';

import { crc64, crc64ToString } from './crc64.js';
import pack2Parse from './pack2-parse.js';
import { nameListParse, pack2Extract } from './pack2-extract.js';
import { localeParse, itemDefExtract } from './itemdef-extract.js';

//only run as a "program" if this file is being called directly from command line, not when it is being imported
if( path.resolve( process.argv[1] ) === path.resolve( fileURLToPath( import.meta.url ) ) )
{
	const { program } = await import( 'commander' );

	program
		.showHelpAfterError()
		.showSuggestionAfterError()
		.name( 'npm run dbg-pack2' )
		.description( 'Read Daybreak Games pack2 files' );

	program.command( 'pack2-extract' )
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

	program.command( 'itemdef-extract' )
		.argument( '[itemdef]', 'ClientItemDefinitions.txt file to parse', 'data/pack2_extract/data_x64_0.pack2/ClientItemDefinitions.txt' )
		.argument( '[itemdef-output]', 'path to save extracted .json file', 'data/itemdef.json' )
		.argument( '[locale]', 'locale file with hashed id to language mappings', 'data/locale/en_us_data.dat' )
		.action( ( itemdef, itemdef_output, locale ) =>
		{
			itemDefExtract( itemdef, itemdef_output, locale );
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
	itemDefExtract:
	{
		localeParse,
		itemDefExtract
	}
};

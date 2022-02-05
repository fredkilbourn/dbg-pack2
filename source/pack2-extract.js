const { assert, default: is } = await import( '@sindresorhus/is' );
import fs from 'fs';
import path from 'path';

import { crc64, crc64ToString } from './crc64.js';
import pack2Parse from './pack2-parse.js';

//build hash map of names based on name list file
function nameListParse( name_list_filename )
{
	assert.nonEmptyString( name_list_filename );

	return fs.readFileSync( name_list_filename, 'utf8' ).split( /\r?\n/ ).reduce( ( p, c ) =>
	{
		if( c !== '' )
			p[crc64ToString( crc64( c ) )] = c;
		return p;
	}, {} );
}

async function pack2Extract( pack2_filename_or_path, pack2_output_path_base, name_list_filename )
{
	assert.nonEmptyString( pack2_filename_or_path );
	assert.nonEmptyString( pack2_output_path_base );
	assert.any( [ is.undefined, is.string ], name_list_filename );

	//build name hash map if file provided
	const name_hash_map = name_list_filename ? nameListParse( name_list_filename ) : null;

	//build list of pack2 files from filename or path
	const pack2_files = fs.statSync( pack2_filename_or_path ).isFile() ?
		{
			[path.basename(pack2_filename_or_path)]: { path: path.normalize( path.resolve( pack2_filename_or_path ) ) }
		} :
		fs.readdirSync( pack2_filename_or_path ).reduce( ( p, c ) =>
		{
			if( path.extname( c ) === '.pack2' )
				p[c] = { path: `${path.normalize( path.resolve( pack2_filename_or_path ) )}/${c}` };
			return p;
		}, {} );

	if( Object.keys( pack2_files ).length === 0 )
		throw new Error( `No .pack2 files found at: ${pack2_filename_or_path}` )

	//resolve and normalize base output path
	pack2_output_path_base = path.normalize( path.resolve( pack2_output_path_base ) );
	for( const [ pack2_filename, extract ] of Object.entries( pack2_files ) )
	{
		//create output directory
		const pack2_output_path = `${pack2_output_path_base}/${pack2_filename}`;
		if( fs.existsSync( pack2_output_path ) === false )
			fs.mkdirSync( pack2_output_path );

		//parse pack2 and extract
		extract.header = await pack2Parse( fs.readFileSync( extract.path ), name_hash_map );
		extract.extracted = 0;
		extract.names_mapped = 0;
		for await ( const asset_header of extract.header.assetHeaderGenerator() )
		{
			//compose file name if not alredy set from name hash map
			const filename = asset_header.asset.name ??
				`${asset_header.nameHashToString()}.${( await asset_header.asset.guessFileType() )?.ext}`;

			//write asset
			fs.writeFileSync( `${pack2_output_path}/${filename}`, await asset_header.asset.toBuffer() );

			//extracted count
			extract.extracted++;

			//names mapped count
			if( asset_header.asset.name )
				extract.names_mapped++;
		}
	}

	//return extraction results
	return pack2_files;
}

export { nameListParse, pack2Extract };
export default pack2Extract;

const { assert, default: is } = await import( '@sindresorhus/is' );
import jenk from 'hash-jenkins';
import fs from 'fs';
import path from 'path';

import dataExtractConfig from '../config/default.js';

//build hash map of locale file entries
function localeParse( locale_filename )
{
	assert.nonEmptyString( locale_filename );
	
	let hash_last;
	return fs.readFileSync( locale_filename, "utf8" ).split( /\r?\n/ ).reduce( ( p, c ) =>
	{
		if( c !== '' )
		{
			const [ hash, _, text ] = c.split( '\t' );

			//only one entry means text continued from previous line
			if( _ === undefined && text === undefined )
				p[hash_last] += `\n${hash}`;
			else
			{
				hash_last = hash;
				p[hash] = text;
			}
		}
		return p;
	}, {} );
}

//TEMP LOGIC TO PRE-COMPUTE SOURCE IDS TO HASHES
/*
for( let x = 0; x < 10000000; x++ )
{
	const key = `Global.Text.${x}`;
	const hash = jenk.lookup2( key );
	console.log( { key, hash } );
	if( hash == 2042523895 )
		process.exit();
}
*/

//read item definitions and parse into formatted map
function dataExtractWithLocale( data_filename, data_extract_path, locale_filename )
{
	assert.nonEmptyString( data_filename );
	assert.nonEmptyString( data_extract_path );
	assert.nonEmptyString( locale_filename );

	//require .txt extension on data_filename
	if( data_filename.match( /\.txt$/ ) === null )
		throw new Error( 'Invalid file extension, .txt expected' );

	//get data filename base without extension
	const data_filename_base = path.basename( data_filename, '.txt' );

	//get extraction config
	const { skip: skip_headers, locale: locale_headers, filter } = dataExtractConfig[`${data_filename_base}.txt`] ?? {};

	//build locale hash map if file provided
	const locale_hash_map = localeParse( locale_filename );

	const headers = [];
	const data = fs.readFileSync( data_filename, "utf8").split( /\r?\n/ ).reduce( ( p, c, i ) =>
	{
		//skip blank lines
		if( c === '' )
			return p;

		//explode rows into columns by ^ 
		const cols = c.split( '^' );

		//for first row, define headers
		if( i === 0 )
		{
			headers.push( ... c.split( '^' ) );

			//remap #*ID => ID
			headers[0] = 'ID';
		}
		//for other rows, process data
		else
		{
			//get id and define entry object
			const id = cols[0];
			const entry = {};

			//iterate columns
			for( let c = 0; c < cols.length; c++ )
			{
				//get header and value
				const header = headers[c];
				const value = cols[c];

				//if header is in skip_headers, skip
				if( skip_headers && skip_headers.has( header ) )
					continue;

				//if we have a value, add it to entry object
				if( value )
				{
					entry[header] = value;

					//if NAME_ID or DESCRIPTION_ID, look up in locale map
					if( locale_headers && locale_headers.has( header ) )
					{
						//lookup locale
						const locale = locale_hash_map[jenk.lookup2( `Global.Text.${value}` )];

						//save mapped locale string back and strip '_ID' off header
						//default to blank string if not found
						entry[`${header.slice(0,-3)}`] = locale ?? "";

						//remove original header with '_ID'
						delete entry[header];
					}
				}
			}

			//if no filter, keep all entries
			//if a filter is defined, only keep matching entries
			if( ! filter || filter( entry ) )
				p[id] = entry;
		}
		return p;
	}, {} );

	data_extract_path = `${path.normalize( path.resolve( data_extract_path ) )}/${data_filename_base}.json`;
	fs.writeFileSync( data_extract_path, JSON.stringify( data, undefined, '\t' ) );
}

export { localeParse, dataExtractWithLocale, dataExtractConfig };
export default dataExtractWithLocale;

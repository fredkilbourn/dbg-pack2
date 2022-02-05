const { Parser } = await import( 'binary-parser' );
const { assert, default: is } = await import( '@sindresorhus/is' );
import zlib from 'zlib';
import { inspect } from 'util';
import { fileTypeFromBuffer } from 'file-type';

import { crc64ToString } from './crc64.js';

//define binary parser for pack2 file format
const pack2Parser = new Parser()
	.endianess( 'little' )
	.string( 'magic', { length: 4, assert: 'PAK\x01' } )
	.uint32( 'asset_count' )
	.uint32( 'pack_length' )
	.uint32( 'skip1', { assert: 0, formatter: skip1 => undefined } )
	.uint32( 'map_offset' )
	.uint32( 'skip2', { assert: 0, formatter: skip2 => undefined } )
	.saveOffset( 'end_of_header' )
	.seek( function() { return this.map_offset - this.end_of_header; } )
	.array( 'asset_headers',
	{
		length: "asset_count",
		type: new Parser()
			.endianess( 'little' )
			//little endian fix: reverse buffer
			.buffer( 'name_hash', { length: 8, formatter: name_hash => name_hash.reverse() } )
			.uint32( 'offset' )
			.uint32( 'skip1', { assert: 0, formatter: skip1 => undefined } )
			.uint32( 'length' )
			.uint32( 'skip2', { assert: 0, formatter: skip2 => undefined } )
			.uint32( 'compressed', { formatter: compressed => [ 0x01, 0x11 ].includes( compressed ) } )
			//little endian fix: reverse buffer
			//little endian fix, reverse buffer
			.buffer( 'crc', { length: 4, formatter: crc => crc.reverse() } )
			.saveOffset( 'end_of_asset_header' )
			.seek( function(){ return -this.end_of_asset_header + this.offset; } )
			.buffer( 'data',
			{
				//if compressed, zlib data starts after first 2 bytes of data block (magic, length)
				length: function()
				{
					if( this.compressed === true )
						return this.length + 8;
					return this.length;
				},
				formatter: function( data )
				{
					if( this.compressed === true )
						return data.subarray( 8 );
					return data;
				}
			} )
			.saveOffset( 'end_of_asset' )
			.seek( function(){ return this.end_of_asset_header - this.end_of_asset; } )
	} );

class Pack2Header
{
	magic;
	asset_count;
	pack_length;
	map_offset;
	asset_headers;

	constructor( pack2_buf, name_hash_map )
	{
		assert.buffer( pack2_buf );
		assert.any( [ is.nullOrUndefined, is.plainObject ], name_hash_map );

		const pack2 = pack2Parser.parse( pack2_buf );
		assert.plainObject( pack2 );

		this.magic = pack2.magic;
		this.asset_count = pack2.asset_count;
		this.pack_length = pack2.pack_length;
		this.map_offset = pack2.map_offset;

		this.asset_headers = Object.freeze( pack2.asset_headers.map( a =>
		{
			const asset_header = new Pack2AssetHeader( a, name_hash_map );
			return Object.freeze( asset_header );
		} ) );
	}

	async inflateAssets()
	{
		await Promise.all( this.asset_headers.map( ah => ah.asset.inflate() ) );
	}

	async *assetHeaderGenerator( inflate = true )
	{
		for( const asset_header of this.asset_headers )
		{
			if( inflate === true && asset_header.asset.compressed === true )
				await asset_header.asset.inflate();
			yield asset_header;
		}
	}

	toString( limit = Number.MAX_SAFE_INTEGER )
	{
		assert.safeInteger( limit );
		assert.any( l => l >= 0, limit );

		return inspect( this,
		{
			colors: true,
			depth: Infinity,
			maxArrayLength: limit
		} );
	}
}

class Pack2AssetHeader
{
	name_hash;
	offset;
	length;
	compressed;
	crc;
	asset;

	constructor( pack2_asset_header, name_hash_map )
	{
		assert.plainObject( pack2_asset_header );
		assert.any( [ is.nullOrUndefined, is.plainObject ], name_hash_map );

		this.name_hash = pack2_asset_header.name_hash;
		this.offset = pack2_asset_header.offset;
		this.length = pack2_asset_header.length;
		this.compressed = pack2_asset_header.compressed;
		this.crc = pack2_asset_header.crc;

		this.asset = new Pack2Asset(
			name_hash_map?.[this.nameHashToString()],
			pack2_asset_header.compressed,
			pack2_asset_header.data );
	}

	nameHashToString()
	{
		return crc64ToString( this.name_hash );
	}
}

class Pack2Asset
{
	name;
	compressed;
	data;

	constructor( name, pack2_asset_header_compressed, pack2_asset_header_data )
	{
		assert.any( [ is.undefined, is.nonEmptyString ], name )
		assert.boolean( pack2_asset_header_compressed );
		assert.buffer( pack2_asset_header_data );

		this.name = name;
		this.compressed = pack2_asset_header_compressed;
		this.data = pack2_asset_header_data;
	}

	async inflate()
	{
		if( this.compressed === true )
			return new Promise( async function( resolve )
			{
				await zlib.inflate( this.data, undefined, ( error, result ) =>
				{
					this.data = result;
					this.compressed = false;
					resolve();
				} );
			}.bind( this ) );
	}

	async guessFileType()
	{
		return await fileTypeFromBuffer( await this.toBuffer() );
	}

	async toBuffer( inflate = true )
	{
		if( inflate === true && this.compressed === true )
			await this.inflate();
		return this.data;
	}
}

async function pack2Parse( pack2_buf, name_hash_map, inflate = true )
{
	assert.buffer( pack2_buf );
	assert.any( [ is.nullOrUndefined, is.plainObject ], name_hash_map );
	assert.boolean( inflate );

	const pack2 = Object.freeze( new Pack2Header( pack2_buf, name_hash_map ) );

	if( inflate === true )
		await pack2.inflateAssets();

	return pack2;
}

export default pack2Parse;

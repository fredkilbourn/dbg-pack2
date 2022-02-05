const { assert, default: is } = await import( '@sindresorhus/is' );
import jenk from 'hash-jenkins';
import fs from 'fs';

//item definition headers we don't process
const itemdef_skip_headers = new Set(
[
	'ACTIVATABLE_ABILITY_ID',
	'CLIENT_DISPLAY_REQUIREMENT_ID',
	'CLIENT_USE_REQUIREMENT_ID',
	'CODE_FACTORY_NAME',
	'COMBAT_ONLY',
	'COMPOSITE_EFFECT_ID',
	'CONTENT_ID',
	'COST',
	'CURRENCY_TYPE',
	'DATASHEET_ID',
	'EQUIP_COUNT_MAX',
	'FLAG_ACCOUNT_SCOPE',
	'FLAG_CAN_EQUIP',
	'FLAG_CONSUME_ON_USE',
	'FLAG_QUICK_USE',
	'FLAG_REMOVE_ON_USE',
	'FLAG_SHOW_ON_WHEEL',
	'FORCE_DISABLE_PREVIEW',
	'GENDER_USAGE',
	'HUD_IMAGE_SET_ID',
	'IS_ALLOWED_AS_GUILD_DECAL',
	'ITEM_CLASS',
	'MAX_STACK_SIZE',
	'MEMBERS_ONLY',
	'MEMBER_DISCOUNT',
	'MIN_PROFILE_RANK',
	'MODEL_NAME',
	'NEXT_TRIAL_DELAY_SEC',
	'NON_MINI_GAME',
	'NO_LIVE_GAMER',
	'NO_SALE',
	'NO_TRADE',
	'OVERLAY_ADJUSTMENT',
	'OVERRIDE_CAMERA_ID',
	'PARAM1',
	'PARAM2',
	'PARAM3',
	'PASSIVE_ABILITY_ID',
	'PASSIVE_ABILITY_SET_ID',
	'PERSIST_PROFILE_SWITCH',
	'POWER_RATING',
	'PROFILE_OVERRIDE',
	'RACE_SET_ID',
	'RARITY',
	'RESOURCE_COST',
	'RESOURCE_TYPE',
	'SKILL_SET_ID',
	'SLOT',
	'SLOT_KEY_OVERRIDE',
	'SOUND_ID',
	'TINT_GROUP_ID',
	'TINT_ID',
	'TRIAL_DURATION_SEC',
	'UI_MODEL_CAMERA_ID',
	'USE_REQUIREMENT_ID',
	'WEAPON_TRAIL_EFFECT_ID',
] );

//item definition headers we look up locale with
const itemdef_locale_headers = new Set(
[
	'NAME_ID',
	'DESCRIPTION_ID'
] );

//build hash map of locale file entries
function localeParse( locale_filename )
{
	assert.nonEmptyString( locale_filename );
	
	return fs.readFileSync( locale_filename, "utf8" ).split( /\r?\n/ ).reduce( ( p, c ) =>
	{
		if( c !== '' )
		{
			const [ hash, _, text ] = c.split( '\t' );
			p[hash] = text;
		}
		return p;
	}, {} );
}

//read item definitions and parse into formatted map
function itemDefExtract( item_def_filename, item_def_extract_filename, locale_filename )
{
	assert.nonEmptyString( item_def_filename );
	assert.nonEmptyString( item_def_extract_filename );
	assert.nonEmptyString( locale_filename );

	//build locale hash map if file provided
	const locale_hash_map = localeParse( locale_filename );

	const headers = [];
	const item_def = fs.readFileSync( item_def_filename, "utf8").split( /\r?\n/ ).reduce( ( p, c, i ) =>
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
		//for other rows, process item data
		else
		{
			//get item id and define item object
			const id = cols[0];
			const item = {};

			//iterate columns
			for( let c = 0; c < cols.length; c++ )
			{
				//get header and value
				const header = headers[c];
				const value = cols[c];

				//if header is in itemdef_skip_headers, skip
				if( itemdef_skip_headers.has( header ) )
					continue;

				//if we have a value, add it to item object
				if( value )
				{
					item[header] = value;

					//if NAME_ID or DESCRIPTION_ID, look up in locale map
					if( itemdef_locale_headers.has( header ) )
					{
						//lookup locale
						const locale = locale_hash_map[jenk.lookup2( `Global.Text.${value}` )];

						//save mapped locale string back and strip '_ID' off header
						//default to blank string if not found
						item[`${header.slice(0,-3)}`] = locale ?? "";

						//remove original header with '_ID'
						delete item[header];
					}
				}
			}

			//if ITEM_TYPE is 26 (weapon), save to item map
			if( item.ITEM_TYPE === '26' )
				p[id] = item;
		}
		return p;
	}, {} );

	fs.writeFileSync( item_def_extract_filename, JSON.stringify( item_def, undefined, '\t' ) );
}

export { localeParse, itemDefExtract };
export default itemDefExtract;

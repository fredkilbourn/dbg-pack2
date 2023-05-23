/*
 * map of data file names and their extraction config
 * skip:	headers we don't process
 * locale:	headers we map to a locale string
 * filter:	function for filtering based on passed row object
 */
export default
{
	'ClientItemDefinitions.txt':
	{
		skip: new Set(
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
			'NO_GIFT',
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
			'TINT_ALIAS',
			'TINT_GROUP_ID',
			'TINT_ID',
			'TRIAL_DURATION_SEC',
			'UI_MODEL_CAMERA_ID',
			'USE_REQUIREMENT_ID',
			'WEAPON_TRAIL_EFFECT_ID'
		] ),
		locale: new Set(
		[
			'NAME_ID',
			'DESCRIPTION_ID'
		] ),
		//if ITEM_TYPE is 26 (Weapon) or 48 (Construction Module), keep it
		filter: item => item.ITEM_TYPE === '26' || item.ITEM_TYPE === '48'
	},
	'Vehicles.txt':
	{
		skip: new Set(
		[
		] ),
		locale: new Set(
		[
			'NAME_ID',
			'DESCRIPTION_ID'
		] )
	}
}

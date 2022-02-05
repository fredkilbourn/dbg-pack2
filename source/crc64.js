const { assert, default: is } = await import( '@sindresorhus/is' );

const crc64_table =
[
    0x0000000000000000n, 0x7ad870c830358979n,
    0xf5b0e190606b12f2n, 0x8f689158505e9b8bn,
    0xc038e5739841b68fn, 0xbae095bba8743ff6n,
    0x358804e3f82aa47dn, 0x4f50742bc81f2d04n,
    0xab28ecb46814fe75n, 0xd1f09c7c5821770cn,
    0x5e980d24087fec87n, 0x24407dec384a65fen,
    0x6b1009c7f05548fan, 0x11c8790fc060c183n,
    0x9ea0e857903e5a08n, 0xe478989fa00bd371n,
    0x7d08ff3b88be6f81n, 0x07d08ff3b88be6f8n,
    0x88b81eabe8d57d73n, 0xf2606e63d8e0f40an,
    0xbd301a4810ffd90en, 0xc7e86a8020ca5077n,
    0x4880fbd87094cbfcn, 0x32588b1040a14285n,
    0xd620138fe0aa91f4n, 0xacf86347d09f188dn,
    0x2390f21f80c18306n, 0x594882d7b0f40a7fn,
    0x1618f6fc78eb277bn, 0x6cc0863448deae02n,
    0xe3a8176c18803589n, 0x997067a428b5bcf0n,
    0xfa11fe77117cdf02n, 0x80c98ebf2149567bn,
    0x0fa11fe77117cdf0n, 0x75796f2f41224489n,
    0x3a291b04893d698dn, 0x40f16bccb908e0f4n,
    0xcf99fa94e9567b7fn, 0xb5418a5cd963f206n,
    0x513912c379682177n, 0x2be1620b495da80en,
    0xa489f35319033385n, 0xde51839b2936bafcn,
    0x9101f7b0e12997f8n, 0xebd98778d11c1e81n,
    0x64b116208142850an, 0x1e6966e8b1770c73n,
    0x8719014c99c2b083n, 0xfdc17184a9f739fan,
    0x72a9e0dcf9a9a271n, 0x08719014c99c2b08n,
    0x4721e43f0183060cn, 0x3df994f731b68f75n,
    0xb29105af61e814fen, 0xc849756751dd9d87n,
    0x2c31edf8f1d64ef6n, 0x56e99d30c1e3c78fn,
    0xd9810c6891bd5c04n, 0xa3597ca0a188d57dn,
    0xec09088b6997f879n, 0x96d1784359a27100n,
    0x19b9e91b09fcea8bn, 0x636199d339c963f2n,
    0xdf7adabd7a6e2d6fn, 0xa5a2aa754a5ba416n,
    0x2aca3b2d1a053f9dn, 0x50124be52a30b6e4n,
    0x1f423fcee22f9be0n, 0x659a4f06d21a1299n,
    0xeaf2de5e82448912n, 0x902aae96b271006bn,
    0x74523609127ad31an, 0x0e8a46c1224f5a63n,
    0x81e2d7997211c1e8n, 0xfb3aa75142244891n,
    0xb46ad37a8a3b6595n, 0xceb2a3b2ba0eececn,
    0x41da32eaea507767n, 0x3b024222da65fe1en,
    0xa2722586f2d042een, 0xd8aa554ec2e5cb97n,
    0x57c2c41692bb501cn, 0x2d1ab4dea28ed965n,
    0x624ac0f56a91f461n, 0x1892b03d5aa47d18n,
    0x97fa21650afae693n, 0xed2251ad3acf6fean,
    0x095ac9329ac4bc9bn, 0x7382b9faaaf135e2n,
    0xfcea28a2faafae69n, 0x8632586aca9a2710n,
    0xc9622c4102850a14n, 0xb3ba5c8932b0836dn,
    0x3cd2cdd162ee18e6n, 0x460abd1952db919fn,
    0x256b24ca6b12f26dn, 0x5fb354025b277b14n,
    0xd0dbc55a0b79e09fn, 0xaa03b5923b4c69e6n,
    0xe553c1b9f35344e2n, 0x9f8bb171c366cd9bn,
    0x10e3202993385610n, 0x6a3b50e1a30ddf69n,
    0x8e43c87e03060c18n, 0xf49bb8b633338561n,
    0x7bf329ee636d1eean, 0x012b592653589793n,
    0x4e7b2d0d9b47ba97n, 0x34a35dc5ab7233een,
    0xbbcbcc9dfb2ca865n, 0xc113bc55cb19211cn,
    0x5863dbf1e3ac9decn, 0x22bbab39d3991495n,
    0xadd33a6183c78f1en, 0xd70b4aa9b3f20667n,
    0x985b3e827bed2b63n, 0xe2834e4a4bd8a21an,
    0x6debdf121b863991n, 0x1733afda2bb3b0e8n,
    0xf34b37458bb86399n, 0x8993478dbb8deae0n,
    0x06fbd6d5ebd3716bn, 0x7c23a61ddbe6f812n,
    0x3373d23613f9d516n, 0x49aba2fe23cc5c6fn,
    0xc6c333a67392c7e4n, 0xbc1b436e43a74e9dn,
    0x95ac9329ac4bc9b5n, 0xef74e3e19c7e40ccn,
    0x601c72b9cc20db47n, 0x1ac40271fc15523en,
    0x5594765a340a7f3an, 0x2f4c0692043ff643n,
    0xa02497ca54616dc8n, 0xdafce7026454e4b1n,
    0x3e847f9dc45f37c0n, 0x445c0f55f46abeb9n,
    0xcb349e0da4342532n, 0xb1eceec59401ac4bn,
    0xfebc9aee5c1e814fn, 0x8464ea266c2b0836n,
    0x0b0c7b7e3c7593bdn, 0x71d40bb60c401ac4n,
    0xe8a46c1224f5a634n, 0x927c1cda14c02f4dn,
    0x1d148d82449eb4c6n, 0x67ccfd4a74ab3dbfn,
    0x289c8961bcb410bbn, 0x5244f9a98c8199c2n,
    0xdd2c68f1dcdf0249n, 0xa7f41839ecea8b30n,
    0x438c80a64ce15841n, 0x3954f06e7cd4d138n,
    0xb63c61362c8a4ab3n, 0xcce411fe1cbfc3can,
    0x83b465d5d4a0eecen, 0xf96c151de49567b7n,
    0x76048445b4cbfc3cn, 0x0cdcf48d84fe7545n,
    0x6fbd6d5ebd3716b7n, 0x15651d968d029fcen,
    0x9a0d8ccedd5c0445n, 0xe0d5fc06ed698d3cn,
    0xaf85882d2576a038n, 0xd55df8e515432941n,
    0x5a3569bd451db2can, 0x20ed197575283bb3n,
    0xc49581ead523e8c2n, 0xbe4df122e51661bbn,
    0x3125607ab548fa30n, 0x4bfd10b2857d7349n,
    0x04ad64994d625e4dn, 0x7e7514517d57d734n,
    0xf11d85092d094cbfn, 0x8bc5f5c11d3cc5c6n,
    0x12b5926535897936n, 0x686de2ad05bcf04fn,
    0xe70573f555e26bc4n, 0x9ddd033d65d7e2bdn,
    0xd28d7716adc8cfb9n, 0xa85507de9dfd46c0n,
    0x273d9686cda3dd4bn, 0x5de5e64efd965432n,
    0xb99d7ed15d9d8743n, 0xc3450e196da80e3an,
    0x4c2d9f413df695b1n, 0x36f5ef890dc31cc8n,
    0x79a59ba2c5dc31ccn, 0x037deb6af5e9b8b5n,
    0x8c157a32a5b7233en, 0xf6cd0afa9582aa47n,
    0x4ad64994d625e4dan, 0x300e395ce6106da3n,
    0xbf66a804b64ef628n, 0xc5bed8cc867b7f51n,
    0x8aeeace74e645255n, 0xf036dc2f7e51db2cn,
    0x7f5e4d772e0f40a7n, 0x05863dbf1e3ac9den,
    0xe1fea520be311aafn, 0x9b26d5e88e0493d6n,
    0x144e44b0de5a085dn, 0x6e963478ee6f8124n,
    0x21c640532670ac20n, 0x5b1e309b16452559n,
    0xd476a1c3461bbed2n, 0xaeaed10b762e37abn,
    0x37deb6af5e9b8b5bn, 0x4d06c6676eae0222n,
    0xc26e573f3ef099a9n, 0xb8b627f70ec510d0n,
    0xf7e653dcc6da3dd4n, 0x8d3e2314f6efb4adn,
    0x0256b24ca6b12f26n, 0x788ec2849684a65fn,
    0x9cf65a1b368f752en, 0xe62e2ad306bafc57n,
    0x6946bb8b56e467dcn, 0x139ecb4366d1eea5n,
    0x5ccebf68aecec3a1n, 0x2616cfa09efb4ad8n,
    0xa97e5ef8cea5d153n, 0xd3a62e30fe90582an,
    0xb0c7b7e3c7593bd8n, 0xca1fc72bf76cb2a1n,
    0x45775673a732292an, 0x3faf26bb9707a053n,
    0x70ff52905f188d57n, 0x0a2722586f2d042en,
    0x854fb3003f739fa5n, 0xff97c3c80f4616dcn,
    0x1bef5b57af4dc5adn, 0x61372b9f9f784cd4n,
    0xee5fbac7cf26d75fn, 0x9487ca0fff135e26n,
    0xdbd7be24370c7322n, 0xa10fceec0739fa5bn,
    0x2e675fb4576761d0n, 0x54bf2f7c6752e8a9n,
    0xcdcf48d84fe75459n, 0xb71738107fd2dd20n,
    0x387fa9482f8c46abn, 0x42a7d9801fb9cfd2n,
    0x0df7adabd7a6e2d6n, 0x772fdd63e7936bafn,
    0xf8474c3bb7cdf024n, 0x829f3cf387f8795dn,
    0x66e7a46c27f3aa2cn, 0x1c3fd4a417c62355n,
    0x935745fc4798b8den, 0xe98f353477ad31a7n,
    0xa6df411fbfb21ca3n, 0xdc0731d78f8795dan,
    0x536fa08fdfd90e51n, 0x29b7d047efec8728n
];

function crc64( input )
{
	assert.nonEmptyString( input );

	let crc64 = 0xffffffffffffffffn;

	for( const c of input.toUpperCase() )
		crc64 = crc64_table[ ( crc64 ^ BigInt( c.charCodeAt( 0 ) ) ) & 0xffn ] ^ ( crc64 >> 8n );

	return crc64 ^ 0xffffffffffffffffn;
}

function crc64ToString( crc64 )
{
	assert.any( [ is.bigint, is.buffer ], crc64 );

	if( typeof crc64 === 'bigint' )
		return `0x${crc64.toString( 16 ).padStart( 16, '0' )}`;
	else if( crc64 instanceof Buffer )
		return `0x${crc64.toString( 'hex' ).padStart( 16, '0' )}`;
	else
		throw new Error( 'Invalid crc64 type (expected BigInt|Buffer)' );
}

export { crc64, crc64ToString };

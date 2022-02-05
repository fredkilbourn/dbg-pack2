import test from 'ava';

import { crc64, crc64ToString } from '../source/crc64.js';

const crc64Verify = test.macro(
{
	title( providedTitle = '', input, expected )
	{
		return `CRC-64 Verify: ${input} => ${expected}`;
	},
	exec( t, input, expected )
	{
		t.is( crc64ToString( crc64( input ) ), expected );
	}
} );

//check known hashes
test( crc64Verify, '{NAMELIST}', '0x4137cc65bd97fd30' );
test( crc64Verify, 'Sanctuary.vnfo', '0xa91b9d0939819c61' );
test( crc64Verify, 'Sanctuary.zone', '0x4ee190db815101ee' );
test( crc64Verify, 'Sanctuary_0_0.cnk0', '0xeb97fd751eecd3b8' );
test( crc64Verify, 'Sanctuary_0_0.cnk1', '0x914f8dbd2ed95ac1' );
test( crc64Verify, 'Sanctuary_0_0.cnk2', '0x1e271ce57e87c14a' );
test( crc64Verify, 'Sanctuary_0_0.cnk3', '0x64ff6c2d4eb24833' );
test( crc64Verify, 'Sanctuary_0_0.tome', '0xd05329c24c2b9b2b' );
test( crc64Verify, 'Sanctuary_0_4.cnk0', '0x1808d9a6bb3a2b55' );
test( crc64Verify, 'Sanctuary_0_4.cnk1', '0x62d0a96e8b0fa22c' );
test( crc64Verify, 'Sanctuary_0_8.cnk0', '0x27f092810dd6b109' );
test( crc64Verify, 'Sanctuary_0_8.cnk1', '0x5d28e2493de33870' );
test( crc64Verify, 'Sanctuary_0_8.cnk2', '0xd24073116dbda3fb' );
test( crc64Verify, 'Sanctuary_0_12.cnk0', '0x7b641e320b139c8b' );
test( crc64Verify, 'Sanctuary_0_12.cnk1', '0x01bc6efa3b2615f2' );
test( crc64Verify, 'Sanctuary_4_0.cnk0', '0x0be3fd223b51c2a8' );
test( crc64Verify, 'Sanctuary_4_0.cnk1', '0x713b8dea0b644bd1' );
test( crc64Verify, 'Sanctuary_4_4.cnk0', '0xf87cd9f19e873a45' );
test( crc64Verify, 'Sanctuary_4_4.cnk1', '0x82a4a939aeb2b33c' );
test( crc64Verify, 'Sanctuary_4_8.cnk0', '0xc78492d6286ba019' );
test( crc64Verify, 'Sanctuary_4_8.cnk1', '0xbd5ce21e185e2960' );
test( crc64Verify, 'Sanctuary_4_12.cnk0', '0x068c9509d4884e1b' );
test( crc64Verify, 'Sanctuary_4_12.cnk1', '0x7c54e5c1e4bdc762' );
test( crc64Verify, 'Sanctuary_8_0.cnk0', '0x0026db880d0162f3' );
test( crc64Verify, 'Sanctuary_8_0.cnk1', '0x7afeab403d34eb8a' );
test( crc64Verify, 'Sanctuary_8_0.cnk2', '0xf5963a186d6a7001' );
test( crc64Verify, 'Sanctuary_8_4.cnk0', '0xf3b9ff5ba8d79a1e' );
test( crc64Verify, 'Sanctuary_8_4.cnk1', '0x89618f9398e21367' );
test( crc64Verify, 'Sanctuary_8_8.cnk0', '0xcc41b47c1e3b0042' );
test( crc64Verify, 'Sanctuary_8_8.cnk1', '0xb699c4b42e0e893b' );
test( crc64Verify, 'Sanctuary_8_8.cnk2', '0x39f155ec7e5012b0' );
test( crc64Verify, 'Sanctuary_8_12.cnk0', '0x80b50845b42439ab' );
test( crc64Verify, 'Sanctuary_8_12.cnk1', '0xfa6d788d8411b0d2' );
test( crc64Verify, 'Sanctuary_12_0.cnk0', '0x58bb342fd6375d4b' );
test( crc64Verify, 'Sanctuary_12_0.cnk1', '0x226344e7e602d432' );
test( crc64Verify, 'Sanctuary_12_4.cnk0', '0xab2410fc73e1a5a6' );
test( crc64Verify, 'Sanctuary_12_4.cnk1', '0xd1fc603443d42cdf' );
test( crc64Verify, 'Sanctuary_12_8.cnk0', '0x94dc5bdbc50d3ffa' );
test( crc64Verify, 'Sanctuary_12_8.cnk1', '0xee042b13f538b683' );
test( crc64Verify, 'Sanctuary_12_12.cnk0', '0x3970eb7b4e6288d7' );
test( crc64Verify, 'Sanctuary_12_12.cnk1', '0x43a89bb37e5701ae' );

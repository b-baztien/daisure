import { BanksService } from '../../modules/banks/banks.service';

export async function seedBanks(banksService: BanksService) {
  console.log('\n🔹 Seeding Banks...');

  // ตรวจสอบว่ามีข้อมูลธนาคารอยู่แล้วหรือไม่
  const existingBanks = await banksService.findAll();

  if (existingBanks.length > 0) {
    console.log('⚠️  Banks already exist - skipping');
    console.log(`   Found ${existingBanks.length} banks in database`);
    return;
  }

  // ข้อมูลธนาคารทั้งหมด
  const banksData = [
    {
      name: 'ทรูมันนี่ วอลเล็ท',
      uniqueId: 'TRUE_MONEY',
      isEnable: true,
    },
    {
      name: 'ธนาคารกรุงเทพ',
      uniqueId: 'BBL',
      isEnable: true,
    },
    {
      name: 'ธนาคารกสิกรไทย',
      uniqueId: 'KBANK',
      isEnable: true,
    },
    {
      name: 'ธนาคารกรุงไทย',
      uniqueId: 'KTB',
      isEnable: true,
    },
    {
      name: 'ธนาคารไทยพาณิชย์',
      uniqueId: 'SCB',
      isEnable: true,
    },
    {
      name: 'ธนาคารกรุงศรีอยุธยา',
      uniqueId: 'BAY',
      isEnable: true,
    },
    {
      name: 'ธนาคารซีไอเอ็มบีไทย',
      uniqueId: 'CIMBT',
      isEnable: true,
    },
    {
      name: 'ธนาคารทิสโก้',
      uniqueId: 'TISCO',
      isEnable: true,
    },
    {
      name: 'ธนาคารยูโอบี',
      uniqueId: 'UOBT',
      isEnable: true,
    },
    {
      name: 'ธนาคารสแตนดาร์ดชาร์เตอร์ด (ไทย)',
      uniqueId: 'SCBT',
      isEnable: true,
    },
    {
      name: 'ธนาคารไทยเครดิตเพื่อรายย่อย',
      uniqueId: 'TCRBANK',
      isEnable: true,
    },
    {
      name: 'ธนาคารแลนด์ แอนด์ เฮาส์',
      uniqueId: 'LH',
      isEnable: true,
    },
    {
      name: 'ธนาคารไอซีบีซี (ไทย)',
      uniqueId: 'ICBCT',
      isEnable: true,
    },
    {
      name: 'ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย',
      uniqueId: 'SMEBANK',
      isEnable: true,
    },
    {
      name: 'ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย',
      uniqueId: 'EXIM',
      isEnable: true,
    },
    {
      name: 'ธนาคารออมสิน',
      uniqueId: 'GSB',
      isEnable: true,
    },
    {
      name: 'ธนาคารอาคารสงเคราะห์',
      uniqueId: 'GHB',
      isEnable: true,
    },
    {
      name: 'ธนาคารอิสลามแห่งประเทศไทย',
      uniqueId: 'IBANK',
      isEnable: true,
    },
    {
      name: 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร',
      uniqueId: 'BAAC',
      isEnable: true,
    },
    {
      name: 'ธนาคารทหารไทยธนชาต',
      uniqueId: 'TTB',
      isEnable: true,
    },
    {
      name: 'ธนาคารเกียรตินาคิน',
      uniqueId: 'KKP',
      isEnable: true,
    },
    {
      name: 'KBIZ',
      uniqueId: 'KBIZ',
      isEnable: true,
    },
    {
      name: 'KTBBIZ',
      uniqueId: 'KTBBIZ',
      isEnable: true,
    },
    {
      name: 'SCBBIZ',
      uniqueId: 'SCBBIZ',
      isEnable: true,
    },
  ];

  // สร้างข้อมูลธนาคารทั้งหมด
  const banks = await banksService.createMany(banksData);

  console.log('✅ Banks seeded successfully!');
  console.log(`   📊 Created ${banks.length} banks`);
  console.log('   🏦 Banks available:');
  banks.slice(0, 5).forEach((bank) => {
    console.log(`      - ${bank.name} (${bank.uniqueId})`);
  });
  if (banks.length > 5) {
    console.log(`      ... and ${banks.length - 5} more`);
  }
}

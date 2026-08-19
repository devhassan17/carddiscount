import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const banksData = [
  { id: 'mcb', name: 'MCB Bank', fullName: 'MCB Bank Limited', color: '#8B1A2B', type: 'commercial', cssClass: 'mcb' },
  { id: 'faysal', name: 'Faysal Bank', fullName: 'Faysal Bank Limited', color: '#1E3A5F', type: 'commercial', cssClass: 'faysal' },
  { id: 'albaraka', name: 'Al Baraka', fullName: 'Al Baraka Bank Pakistan', color: '#C59B27', type: 'commercial', cssClass: 'albaraka' },
  { id: 'mcbislamic', name: 'MCB Islamic', fullName: 'MCB Islamic Bank Ltd', color: '#005A36', type: 'commercial', cssClass: 'mcbislamic' },
  { id: 'allied', name: 'Allied Bank', fullName: 'Allied Bank Limited', color: '#00447C', type: 'commercial', cssClass: 'allied' },
  { id: 'askari', name: 'Askari Bank', fullName: 'Askari Bank Limited', color: '#003976', type: 'commercial', cssClass: 'askari' },
  { id: 'bah', name: 'Bank AL Habib', fullName: 'Bank AL Habib Limited', color: '#004225', type: 'commercial', cssClass: 'bah' },
  { id: 'alfalah', name: 'Bank Alfalah', fullName: 'Bank Alfalah', color: '#ED1C24', type: 'commercial', cssClass: 'alfalah' },
  { id: 'bop', name: 'Bank of Punjab', fullName: 'The Bank of Punjab', color: '#1D4289', type: 'public', cssClass: 'bop' },
  { id: 'bankislami', name: 'BankIslami', fullName: 'BankIslami Pakistan', color: '#2E7D32', type: 'commercial', cssClass: 'bankislami' },
  { id: 'hbl', name: 'HBL', fullName: 'Habib Bank Limited', color: '#00833D', type: 'commercial', cssClass: 'hbl' },
  { id: 'habibmetro', name: 'Habib Metro', fullName: 'Habib Metropolitan Bank', color: '#004D40', type: 'commercial', cssClass: 'habibmetro' },
  { id: 'hblislamic', name: 'HBL Islamic', fullName: 'HBL Islamic Bank Limited', color: '#005930', type: 'commercial', cssClass: 'hblislamic' },
  { id: 'jsbank', name: 'JS Bank', fullName: 'JS Bank', color: '#F37021', type: 'commercial', cssClass: 'jsbank' },
  { id: 'meezan', name: 'Meezan Bank', fullName: 'Meezan Bank', color: '#00594C', type: 'commercial', cssClass: 'meezan' },
  { id: 'ubl', name: 'UBL', fullName: 'United Bank Limited (UBL)', color: '#E31837', type: 'commercial', cssClass: 'ubl' },
  { id: 'sadapay', name: 'SadaPay', fullName: 'SadaPay (Mastercard)', color: '#1ED760', type: 'digital', cssClass: 'sadapay' },
  { id: 'nayapay', name: 'NayaPay', fullName: 'NayaPay (Visa)', color: '#6C63FF', type: 'digital', cssClass: 'nayapay' },
  { id: 'easypaisa', name: 'Easypaisa', fullName: 'Easypaisa Bank / Wallet', color: '#4CAF50', type: 'digital', cssClass: 'easypaisa' },
  { id: 'jazzcash', name: 'JazzCash', fullName: 'JazzCash Wallet', color: '#E53935', type: 'digital', cssClass: 'jazzcash' },
  { id: 'sc', name: 'Standard Chartered', fullName: 'Standard Chartered Pakistan', color: '#0072AA', type: 'commercial', cssClass: 'sc' },
];

const categoriesData = [
  { id: 'food', name: 'Food', emoji: '🍕', placesCount: '2656 Places', dealsCount: '3744 Deals', image: '/assets/images/category_restaurants.png', color: '#FF9500', bgColor: 'rgba(255,149,0,0.12)' },
  { id: 'lifestyle', name: 'Lifestyle', emoji: '👗', placesCount: '2787 Places', dealsCount: '326 Deals', image: '/assets/images/category_fashion.png', color: '#E91E63', bgColor: 'rgba(233,30,99,0.12)' },
  { id: 'health', name: 'Health', emoji: '🏥', placesCount: '1107 Places', dealsCount: '268 Deals', image: '/assets/images/category_shopping.png', color: '#FF2D55', bgColor: 'rgba(255,45,85,0.12)' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬', placesCount: '407 Places', dealsCount: '231 Deals', image: '/assets/images/hero_banner.png', color: '#AF52DE', bgColor: 'rgba(175,82,222,0.12)' },
  { id: 'estores', name: 'e-Stores', emoji: '🛒', placesCount: '645 Places', dealsCount: '105 Deals', image: '/assets/images/category_electronics.png', color: '#007AFF', bgColor: 'rgba(0,122,255,0.12)' },
  { id: 'education', name: 'Education', emoji: '📚', placesCount: '291 Places', dealsCount: '70 Deals', image: '/assets/images/category_shopping.png', color: '#5AC8FA', bgColor: 'rgba(90,200,250,0.12)' },
  { id: 'homedecor', name: 'Home Decor', emoji: '🛋️', placesCount: '199 Places', dealsCount: '19 Deals', image: '/assets/images/category_shopping.png', color: '#8E8E93', bgColor: 'rgba(142,142,147,0.12)' },
  { id: 'services', name: 'Services', emoji: '✈️', placesCount: '1200 Places', dealsCount: '359 Deals', image: '/assets/images/hero_banner.png', color: '#34C759', bgColor: 'rgba(52,199,89,0.12)' },
  { id: 'electronics', name: 'Electronics', emoji: '📱', placesCount: '1789 Places', dealsCount: '19 Deals', image: '/assets/images/category_electronics.png', color: '#5856D6', bgColor: 'rgba(88,86,214,0.12)' },
  { id: 'selfcare', name: 'Self Care', emoji: '💈', placesCount: '568 Places', dealsCount: '148 Deals', image: '/assets/images/category_fashion.png', color: '#FF3B30', bgColor: 'rgba(255,59,48,0.12)' },
];

async function main() {
  console.log('Seeding database...');

  // Seed User
  const defaultUser = await prisma.user.upsert({
    where: { email: 'user@cardsaver.pk' },
    update: {},
    create: {
      email: 'user@cardsaver.pk',
      name: 'Ali Hassan',
      city: 'Karachi',
      cards: {
        create: [
          { bank: 'hbl', bankName: 'Habib Bank Limited', type: 'Credit Card', tier: 'Gold', last4: '8821', isDefault: true },
          { bank: 'sadapay', bankName: 'SadaPay', type: 'Debit Card', tier: 'Classic', last4: '1042', isDefault: false },
          { bank: 'meezan', bankName: 'Meezan Bank', type: 'Debit Card', tier: 'Titanium', last4: '5590', isDefault: false },
        ]
      }
    }
  });

  // Seed Banks
  for (const b of banksData) {
    await prisma.bank.upsert({
      where: { id: b.id },
      update: b,
      create: b,
    });
  }

  // Seed Categories
  for (const c of categoriesData) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: c,
      create: c,
    });
  }

  // Seed Featured Merchant (Kababjees)
  await prisma.merchant.upsert({
    where: { name: 'Kababjees' },
    update: {},
    create: {
      name: 'Kababjees',
      logo: '/assets/images/kababjees_logo.png',
      banner: '/assets/images/category_restaurants.png',
      description: 'Kababjees, A perfect place to rejoice variety of cuisines with your love ones, to soak in the relaxing Decor & desire to revisit for once is NEVER enough!',
      rating: 3.8,
      reviewCount: 113,
      branchesCount: 4,
      dealsCount: 54,
      phone: '021 111 666 111',
      socialJson: JSON.stringify({
        facebook: 'https://facebook.com/kababjees',
        instagram: 'https://instagram.com/kababjeesofficial',
        website: 'https://kababjees.com'
      }),
      menuJson: JSON.stringify([
        { name: 'Chicken Malai Boti (8 Pcs)', price: 'PKR 1,450', category: 'BBQ Special', image: '🍗' },
        { name: 'Mutton Shinwari Karahi (1 KG)', price: 'PKR 3,200', category: 'Karahi', image: '🍲' },
        { name: 'Kababjees Special Paneer Reshmi', price: 'PKR 1,250', category: 'BBQ', image: '🍢' },
        { name: 'Chicken Charcoal Handi (Full)', price: 'PKR 1,950', category: 'Handi', image: '🥘' },
        { name: 'Cheese Naan & Garlic Naan', price: 'PKR 220', category: 'Bread', image: '🫓' },
        { name: 'Kababjees Special Lava Cake', price: 'PKR 750', category: 'Desserts', image: '🍰' },
      ]),
      reviewsJson: JSON.stringify([
        { user: 'Usman Khan', rating: 5, date: '2 days ago', comment: 'Best BBQ at Do Darya Karachi! HBL 20% discount worked seamlessly.' },
        { user: 'Sara Ahmed', rating: 4, date: '1 week ago', comment: 'Great ambience and food quality. Used UBL card for discount.' }
      ]),
      branchesJson: JSON.stringify([
        { name: 'Do Darya Outlet', address: 'Beach Avenue, Phase 8, DHA, Karachi', phone: '021 111 666 111' },
        { name: 'Highway Outlet', address: 'Main Super Highway, Near Toll Plaza, Karachi', phone: '021 111 666 111' },
        { name: 'Shaheed-e-Millat', address: 'Main Shaheed-e-Millat Road, Karachi', phone: '021 34381111' }
      ])
    }
  });

  // Seed 500+ Deals
  const merchantsList = [
    { name: 'Kababjees', cat: 'food', logo: '/assets/images/kababjees_logo.png', banner: '/assets/images/category_restaurants.png' },
    { name: 'Pizza Yumm\'s', cat: 'food', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/logo_2ac48f29-83fe-4972-9995-12dbe99f2c6d-462.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/Cover_3767fd0a-c281-4365-99d1-8ed6d8f3a8ff-724.jpeg' },
    { name: 'Thaal Biryani', cat: 'food', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/thaalbiryanilogo_6054b7a9-0da7-4399-9f45-2074786d055d-229.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/thaalbiryanicover_80a9059a-e923-406b-9965-d22a34324d52-672.jpeg' },
    { name: 'Yellow Taxi Pizza Co.', cat: 'food', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/Logo_39189a7d-676a-4b0f-99ec-efacc8f35659-697.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/Cover1_b2ec4d12-a57f-401d-96be-dd3baa0c6762-948.jpeg' },
    { name: 'Kids Care', cat: 'lifestyle', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/1bafb12c-6abd-4eab-8dea-400639897613-423.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/cc2507a4-1b38-4148-a210-2cb1703c3140-297.jpeg' },
    { name: 'WB by Hemani', cat: 'lifestyle', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/logocopy1_cd808aff-70eb-49c3-9969-186db54f4a91-594.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/Cover1_ec9c5d00-2072-49e2-8877-f2d5664f4c3d-455.jpeg' },
    { name: 'ECS', cat: 'lifestyle', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/logo2Recovered_b5ef5e99-c511-4293-9767-603f90faf559-581.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/kohasaacover_84e4c739-2d24-4294-a80c-0b9074f21055-939.jpeg' },
    { name: 'ARY Jewellers', cat: 'lifestyle', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/logo2_fd32e8a7-3a22-471b-9c32-8658d4c6321d-781.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/sss_6326dd78-d3d9-4fc3-87b5-93a254a963f9-722.jpeg' },
    { name: 'UpTown Eatery', cat: 'food', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/LogoRecovered_9cbd27ae-c1ab-4304-8883-2f2e269917fc-770.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/Cover2_5df84b2a-67f9-41dd-a63c-56d7d1cbd2a9-206.jpeg' },
    { name: 'MIO DIO', cat: 'food', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/mio_c0beb613-19af-4a1d-b3d8-e5ae715df057-760.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/pizzacover_8fb607aa-aa5b-435b-9d70-6540ce8b9378-338.jpeg' },
  ];

  const bankIds = ['hbl', 'ubl', 'meezan', 'mcb', 'alfalah', 'sadapay', 'nayapay', 'faysal', 'allied', 'askari'];
  const citiesList = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar', 'Multan'];

  await prisma.deal.deleteMany({});

  let count = 0;
  for (let i = 0; i < 50; i++) {
    for (const m of merchantsList) {
      count++;
      const bankIndex = count % bankIds.length;
      const cityIndex = count % citiesList.length;
      const discountVal = 15 + (count % 5) * 5;

      const bankObj = banksData.find(b => b.id === bankIds[bankIndex]);

      await prisma.deal.create({
        data: {
          id: `deal_500_${count}`,
          merchant: m.name,
          category: m.cat,
          discount: discountVal,
          discountType: count % 6 === 0 ? 'bogo' : 'percent',
          description: `${discountVal}% off total bill at ${m.name} using ${bankObj?.fullName || 'Bank Card'}`,
          banksJson: JSON.stringify([bankIds[bankIndex], bankIds[(bankIndex + 1) % bankIds.length]]),
          cardTypesJson: JSON.stringify(['Credit Card', 'Debit Card']),
          tiersJson: JSON.stringify(['Classic', 'Gold', 'Platinum', 'Signature']),
          citiesJson: JSON.stringify([citiesList[cityIndex]]),
          logo: m.logo,
          banner: m.banner,
          validFrom: '2026-08-01',
          validTo: '2026-12-31',
          termsJson: JSON.stringify(['Present valid debit/credit card at billing', 'Source: Peekaboo Guru Partner Network']),
          featured: count % 3 === 0,
          trending: count % 2 === 0,
          merchantColor: '#007AFF',
          merchantInitial: m.name[0],
        }
      });
    }
  }

  // Seed sample Group
  await prisma.group.create({
    data: {
      name: 'Family Diners',
      icon: '👨‍👩‍👧‍👦',
      color: 'rgba(0, 122, 255, 0.12)',
      members: {
        create: [
          {
            userId: defaultUser.id,
            userName: defaultUser.name,
            cardsJson: JSON.stringify([
              { bank: 'hbl', bankName: 'HBL', type: 'Credit Card', tier: 'Gold' },
              { bank: 'sadapay', bankName: 'SadaPay', type: 'Debit Card', tier: 'Classic' }
            ])
          }
        ]
      }
    }
  });

  // Seed sample Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: defaultUser.id,
        title: '🔥 New Kababjees 20% Discount!',
        message: 'Get 20% off at Kababjees using your HBL Gold card!',
        type: 'deal',
        link: '/merchant/Kababjees'
      },
      {
        userId: defaultUser.id,
        title: '💳 SadaPay Card Active',
        message: 'Your SadaPay card is connected to CardSaver.',
        type: 'card',
        link: '/wallet'
      }
    ]
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

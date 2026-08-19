export const fallbackBanks = [
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

export const fallbackCategories = [
  { id: 'food', name: 'Food', emoji: '🍕', placesCount: '2656 Places', dealsCount: '3744 Deals', image: '/assets/images/category_restaurants.png', color: '#FF9500', bgColor: 'rgba(255,149,0,0.12)' },
  { id: 'lifestyle', name: 'Lifestyle', emoji: '👗', placesCount: '2787 Places', dealsCount: '326 Deals', image: '/assets/images/category_fashion.png', color: '#E91E63', bgColor: 'rgba(233,30,99,0.12)' },
  { id: 'health', name: 'Health & Labs', emoji: '🏥', placesCount: '1107 Places', dealsCount: '268 Deals', image: '/assets/images/category_shopping.png', color: '#FF2D55', bgColor: 'rgba(255,45,85,0.12)' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬', placesCount: '407 Places', dealsCount: '231 Deals', image: '/assets/images/hero_banner.png', color: '#AF52DE', bgColor: 'rgba(175,82,222,0.12)' },
  { id: 'estores', name: 'e-Stores', emoji: '🛒', placesCount: '645 Places', dealsCount: '105 Deals', image: '/assets/images/category_electronics.png', color: '#007AFF', bgColor: 'rgba(0,122,255,0.12)' },
  { id: 'education', name: 'Education', emoji: '📚', placesCount: '291 Places', dealsCount: '70 Deals', image: '/assets/images/category_shopping.png', color: '#5AC8FA', bgColor: 'rgba(90,200,250,0.12)' },
  { id: 'homedecor', name: 'Home Decor', emoji: '🛋️', placesCount: '199 Places', dealsCount: '19 Deals', image: '/assets/images/category_shopping.png', color: '#8E8E93', bgColor: 'rgba(142,142,147,0.12)' },
  { id: 'services', name: 'Services', emoji: '✈️', placesCount: '1200 Places', dealsCount: '359 Deals', image: '/assets/images/hero_banner.png', color: '#34C759', bgColor: 'rgba(52,199,89,0.12)' },
  { id: 'electronics', name: 'Electronics', emoji: '📱', placesCount: '1789 Places', dealsCount: '19 Deals', image: '/assets/images/category_electronics.png', color: '#5856D6', bgColor: 'rgba(88,86,214,0.12)' },
  { id: 'selfcare', name: 'Self Care', emoji: '💈', placesCount: '568 Places', dealsCount: '148 Deals', image: '/assets/images/category_fashion.png', color: '#FF3B30', bgColor: 'rgba(255,59,48,0.12)' },
];

const rawMerchants = [
  { name: 'Kababjees BBQ & Handi', cat: 'food', logo: '/assets/images/kababjees_logo.png', banner: '/assets/images/category_restaurants.png' },
  { name: 'Burger Lab', cat: 'food', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/Logo2_b8245447-eb21-40c8-a532-21e2539b1c8a-543.gif', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/Cover_4eaef810-9c5e-4a3d-a425-7c49209687eb-734.jpeg' },
  { name: 'Chughtai Diagnostic Lab', cat: 'health', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/DVAGO2_96628ca8-715b-46e1-aa3a-4aac1522fe51-36.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/Cover_c0718f36-1dbe-47c8-8072-c21fba8a6e3f-692.jpeg' },
  { name: 'Aga Khan Hospital & Labs', cat: 'health', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/DVAGO2_96628ca8-715b-46e1-aa3a-4aac1522fe51-36.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/Cover_c0718f36-1dbe-47c8-8072-c21fba8a6e3f-692.jpeg' },
  { name: 'DVAGO Pharmacy', cat: 'health', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/DVAGO2_96628ca8-715b-46e1-aa3a-4aac1522fe51-36.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/Cover_c0718f36-1dbe-47c8-8072-c21fba8a6e3f-692.jpeg' },
  { name: 'Pizza Yumm\'s', cat: 'food', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/logo_2ac48f29-83fe-4972-9995-12dbe99f2c6d-462.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/Cover_3767fd0a-c281-4365-99d1-8ed6d8f3a8ff-724.jpeg' },
  { name: 'Thaal Biryani', cat: 'food', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/thaalbiryanilogo_6054b7a9-0da7-4399-9f45-2074786d055d-229.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/thaalbiryanicover_80a9059a-e923-406b-9965-d22a34324d52-672.jpeg' },
  { name: 'Yellow Taxi Pizza Co.', cat: 'food', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/Logo_39189a7d-676a-4b0f-99ec-efacc8f35659-697.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/Cover1_b2ec4d12-a57f-401d-96be-dd3baa0c6762-948.jpeg' },
  { name: 'WB by Hemani', cat: 'lifestyle', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/logocopy1_cd808aff-70eb-49c3-9969-186db54f4a91-594.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/Cover1_ec9c5d00-2072-49e2-8877-f2d5664f4c3d-455.jpeg' },
  { name: 'ECS Footwear', cat: 'lifestyle', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/logo2Recovered_b5ef5e99-c511-4293-9767-603f90faf559-581.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/kohasaacover_84e4c739-2d24-4294-a80c-0b9074f21055-939.jpeg' },
  { name: 'ARY Jewellers', cat: 'lifestyle', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/logo2_fd32e8a7-3a22-471b-9c32-8658d4c6321d-781.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/sss_6326dd78-d3d9-4fc3-87b5-93a254a963f9-722.jpeg' },
  { name: 'Hardee\'s', cat: 'food', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/Logo_af7d96f9-bd6a-4cee-bb85-1d8911deca30-796.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/Coverhardees_a5c48d13-5450-4fb7-980d-d3a6d98f5611-505.jpeg' },
  { name: 'Coffee Planet', cat: 'food', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/CoffeePlanet_bbfdd2d4-e87d-4c62-a4e0-89294ce65a70-17.gif', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/cover_39a1ec98-72f7-4b30-9011-4b249c70cf03-799.jpeg' },
  { name: 'Stylo Shoes', cat: 'lifestyle', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/logocopy3_7ebdaa97-984d-4945-870f-f9b85251827c-580.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/foodcoverRecovered_b546db37-afa4-4637-b60f-145e80f51790-869.jpeg' },
  { name: 'Master MoltyFoam', cat: 'homedecor', logo: 'https://d2liqplnt17rh6.cloudfront.net/logoImages/a8f514ce-683d-4b93-86c7-ccd62e57fbbd-551.jpeg', banner: 'https://d2liqplnt17rh6.cloudfront.net/coverImages/26190612-f3bb-4317-9211-6d7878dabc1a-993.jpeg' },
];

const bankIds = ['hbl', 'ubl', 'meezan', 'mcb', 'alfalah', 'sadapay', 'nayapay', 'faysal', 'allied', 'askari', 'jsbank', 'sc', 'bop', 'bankislami', 'habibmetro'];
const citiesList = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar', 'Multan', 'Quetta', 'Sialkot', 'Hyderabad'];

// Generate 120+ structured active deals
export const fallbackDeals: any[] = [];

let counter = 0;
for (let i = 0; i < 8; i++) {
  for (const m of rawMerchants) {
    counter++;
    const bIndex = counter % bankIds.length;
    const cIndex = counter % citiesList.length;
    const discountVal = 15 + (counter % 7) * 5;

    fallbackDeals.push({
      id: `fb_deal_${counter}`,
      merchant: m.name,
      category: m.cat,
      discount: discountVal,
      discountType: counter % 5 === 0 ? 'bogo' : 'percent',
      description: `${discountVal}% OFF total bill & test packages at ${m.name} using ${bankIds[bIndex].toUpperCase()} Card`,
      banksJson: JSON.stringify([bankIds[bIndex], bankIds[(bIndex + 1) % bankIds.length]]),
      cardTypesJson: JSON.stringify(['Credit Card', 'Debit Card']),
      tiersJson: JSON.stringify(['Classic', 'Gold', 'Platinum']),
      citiesJson: JSON.stringify([citiesList[cIndex]]),
      logo: m.logo,
      banner: m.banner,
      validFrom: '2026-08-01',
      validTo: '2026-12-31',
      termsJson: JSON.stringify(['Present valid bank card at billing', 'Verified by Peekaboo Guru Partner Network']),
      featured: counter % 4 === 0,
      trending: counter % 3 === 0,
      merchantColor: '#007AFF',
      merchantInitial: m.name[0],
    });
  }
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding EquiFind database...')

  // Clean existing data
  await prisma.report.deleteMany()
  await prisma.providerClaim.deleteMany()
  await prisma.favourite.deleteMany()
  await prisma.review.deleteMany()
  await prisma.service.deleteMany()
  await prisma.providerPhoto.deleteMany()
  await prisma.provider.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // ──────────────────────────────────────────────
  // Parent Categories
  // ──────────────────────────────────────────────
  const horseCare = await prisma.category.create({
    data: {
      name: 'Horse Care',
      slug: 'horse-care',
      description: 'Essential healthcare and wellbeing services for your horse',
      icon: 'heart-pulse',
      sortOrder: 1,
    },
  })

  const trainingRiding = await prisma.category.create({
    data: {
      name: 'Training & Riding',
      slug: 'training-riding',
      description: 'Professional riding instruction and horse training services',
      icon: 'graduation-cap',
      sortOrder: 2,
    },
  })

  const yardsFacilities = await prisma.category.create({
    data: {
      name: 'Yards & Facilities',
      slug: 'yards-facilities',
      description: 'Livery yards, arenas, and equestrian facilities',
      icon: 'warehouse',
      sortOrder: 3,
    },
  })

  const servicesShopping = await prisma.category.create({
    data: {
      name: 'Horse Services & Shopping',
      slug: 'horse-services-shopping',
      description: 'Transport, tack, saddlery, and feed supplies',
      icon: 'shopping-bag',
      sortOrder: 4,
    },
  })

  // ──────────────────────────────────────────────
  // Subcategories
  // ──────────────────────────────────────────────
  const subcategories = await Promise.all([
    // Horse Care
    prisma.category.create({ data: { name: 'Farriers', slug: 'farriers', parentCategoryId: horseCare.id, icon: 'anvil', sortOrder: 1 } }),
    prisma.category.create({ data: { name: 'Equine Vets', slug: 'equine-vets', parentCategoryId: horseCare.id, icon: 'stethoscope', sortOrder: 2 } }),
    prisma.category.create({ data: { name: 'Equine Physiotherapists', slug: 'equine-physiotherapists', parentCategoryId: horseCare.id, icon: 'hand', sortOrder: 3 } }),
    prisma.category.create({ data: { name: 'Equine Chiropractors', slug: 'equine-chiropractors', parentCategoryId: horseCare.id, icon: 'bone', sortOrder: 4 } }),
    prisma.category.create({ data: { name: 'Equine Dentists', slug: 'equine-dentists', parentCategoryId: horseCare.id, icon: 'tooth', sortOrder: 5 } }),
    prisma.category.create({ data: { name: 'Equine Nutritionists', slug: 'equine-nutritionists', parentCategoryId: horseCare.id, icon: 'apple', sortOrder: 6 } }),

    // Training & Riding
    prisma.category.create({ data: { name: 'Riding Instructors', slug: 'riding-instructors', parentCategoryId: trainingRiding.id, icon: 'user', sortOrder: 1 } }),
    prisma.category.create({ data: { name: 'Dressage Trainers', slug: 'dressage-trainers', parentCategoryId: trainingRiding.id, icon: 'award', sortOrder: 2 } }),
    prisma.category.create({ data: { name: 'Show Jumping Trainers', slug: 'show-jumping-trainers', parentCategoryId: trainingRiding.id, icon: 'trending-up', sortOrder: 3 } }),
    prisma.category.create({ data: { name: 'Eventing Trainers', slug: 'eventing-trainers', parentCategoryId: trainingRiding.id, icon: 'flag', sortOrder: 4 } }),
    prisma.category.create({ data: { name: 'Behaviourists', slug: 'behaviourists', parentCategoryId: trainingRiding.id, icon: 'brain', sortOrder: 5 } }),

    // Yards & Facilities
    prisma.category.create({ data: { name: 'Livery Yards (Full)', slug: 'livery-yards-full', parentCategoryId: yardsFacilities.id, icon: 'home', sortOrder: 1 } }),
    prisma.category.create({ data: { name: 'Livery Yards (Part)', slug: 'livery-yards-part', parentCategoryId: yardsFacilities.id, icon: 'home', sortOrder: 2 } }),
    prisma.category.create({ data: { name: 'Livery Yards (DIY)', slug: 'livery-yards-diy', parentCategoryId: yardsFacilities.id, icon: 'home', sortOrder: 3 } }),
    prisma.category.create({ data: { name: 'Livery Yards (Grass)', slug: 'livery-yards-grass', parentCategoryId: yardsFacilities.id, icon: 'leaf', sortOrder: 4 } }),
    prisma.category.create({ data: { name: 'Arena Hire', slug: 'arena-hire', parentCategoryId: yardsFacilities.id, icon: 'square', sortOrder: 5 } }),
    prisma.category.create({ data: { name: 'Indoor Schools', slug: 'indoor-schools', parentCategoryId: yardsFacilities.id, icon: 'building', sortOrder: 6 } }),
    prisma.category.create({ data: { name: 'Cross-Country Facilities', slug: 'cross-country-facilities', parentCategoryId: yardsFacilities.id, icon: 'mountain', sortOrder: 7 } }),

    // Horse Services & Shopping
    prisma.category.create({ data: { name: 'Horse Transport', slug: 'horse-transport', parentCategoryId: servicesShopping.id, icon: 'truck', sortOrder: 1 } }),
    prisma.category.create({ data: { name: 'Tack Shops', slug: 'tack-shops', parentCategoryId: servicesShopping.id, icon: 'shopping-cart', sortOrder: 2 } }),
    prisma.category.create({ data: { name: 'Saddlers', slug: 'saddlers', parentCategoryId: servicesShopping.id, icon: 'briefcase', sortOrder: 3 } }),
    prisma.category.create({ data: { name: 'Saddle Fitters', slug: 'saddle-fitters', parentCategoryId: servicesShopping.id, icon: 'ruler', sortOrder: 4 } }),
    prisma.category.create({ data: { name: 'Feed Shops', slug: 'feed-shops', parentCategoryId: servicesShopping.id, icon: 'package', sortOrder: 5 } }),
  ])

  // Build a lookup by slug
  const catBySlug: Record<string, string> = {}
  for (const sc of subcategories) {
    catBySlug[sc.slug] = sc.id
  }

  // ──────────────────────────────────────────────
  // Demo Users
  // ──────────────────────────────────────────────
  const userEmma = await prisma.user.create({
    data: {
      name: 'Emma Richardson',
      email: 'emma.richardson@demo.equifind.co.uk',
      postcode: 'GU1 1AA',
      town: 'Guildford',
      latitude: 51.2362,
      longitude: -0.5704,
      accountType: 'rider',
    },
  })

  const userTom = await prisma.user.create({
    data: {
      name: 'Tom Hargreaves',
      email: 'tom.hargreaves@demo.equifind.co.uk',
      postcode: 'TN1 1AA',
      town: 'Tunbridge Wells',
      latitude: 51.1322,
      longitude: 0.2634,
      accountType: 'rider',
    },
  })

  const demoUsers = [userEmma, userTom]

  // ──────────────────────────────────────────────
  // Provider definitions
  // ──────────────────────────────────────────────
  interface ProviderDef {
    slug: string
    businessName: string
    categorySlug: string
    description: string
    phone: string
    email: string
    website: string
    address: string
    postcode: string
    town: string
    latitude: number
    longitude: number
    serviceRadius: number
    areasCovered: string
    priceRange: string
    verificationStatus: string
    specialisations?: string
    qualifications?: string
    services: { name: string; description?: string; priceFrom?: number; priceTo?: number }[]
    reviews: { rating: number; text: string }[]
  }

  const providerDefs: ProviderDef[] = [
    // ── Horse Care ──────────────────────────────
    {
      slug: 'james-cooper-farriery',
      businessName: 'James Cooper Farriery',
      categorySlug: 'farriers',
      description: 'Experienced registered farrier covering Surrey, Sussex and Hampshire. Specialising in corrective and remedial shoeing with over 15 years of experience. Fully insured and BFBA registered.',
      phone: '07700 900123',
      email: 'james@cooperfarriery.co.uk',
      website: 'https://www.cooperfarriery.co.uk',
      address: '12 Forge Lane',
      postcode: 'RH4 1AA',
      town: 'Dorking',
      latitude: 51.2325,
      longitude: -0.3312,
      serviceRadius: 30,
      areasCovered: 'Surrey, West Sussex, Hampshire',
      priceRange: '$$',
      verificationStatus: 'verified',
      qualifications: 'DipWCF, BFBA Registered',
      specialisations: 'Remedial shoeing, Barefoot trimming',
      services: [
        { name: 'Full set of shoes', description: 'Four new shoes fitted', priceFrom: 95, priceTo: 120 },
        { name: 'Front shoes only', priceFrom: 55, priceTo: 70 },
        { name: 'Barefoot trim', priceFrom: 35, priceTo: 45 },
        { name: 'Remedial shoeing', description: 'Corrective work for lameness issues', priceFrom: 120, priceTo: 180 },
      ],
      reviews: [
        { rating: 5, text: 'James has been shoeing my horses for years. Always on time, patient with tricky horses, and does a brilliant job every time.' },
        { rating: 5, text: 'Excellent farrier. My mare had ongoing hoof problems and James sorted her out beautifully. Highly recommend.' },
        { rating: 4, text: 'Good reliable farrier. Sometimes hard to get an appointment quickly but well worth the wait.' },
      ],
    },
    {
      slug: 'thames-valley-equine-vets',
      businessName: 'Thames Valley Equine Vets',
      categorySlug: 'equine-vets',
      description: 'Full-service equine veterinary practice with state-of-the-art facilities. 24/7 emergency cover available. Our team of six vets covers Berkshire, Oxfordshire and surrounding areas.',
      phone: '01234 567890',
      email: 'info@thamesvalleyequinevets.co.uk',
      website: 'https://www.thamesvalleyequinevets.co.uk',
      address: '45 High Street',
      postcode: 'RG1 2AA',
      town: 'Reading',
      latitude: 51.4543,
      longitude: -0.9781,
      serviceRadius: 40,
      areasCovered: 'Berkshire, Oxfordshire, North Hampshire',
      priceRange: '$$$',
      verificationStatus: 'verified',
      qualifications: 'RCVS Registered Practice',
      specialisations: 'Lameness, Pre-purchase examinations, Diagnostic imaging',
      services: [
        { name: 'Routine visit', description: 'Standard call-out and consultation', priceFrom: 65, priceTo: 85 },
        { name: 'Vaccination', priceFrom: 45, priceTo: 55 },
        { name: 'Pre-purchase examination (2-stage)', priceFrom: 200, priceTo: 250 },
        { name: 'Pre-purchase examination (5-stage)', priceFrom: 450, priceTo: 550 },
        { name: 'Dental examination & rasp', priceFrom: 80, priceTo: 120 },
      ],
      reviews: [
        { rating: 5, text: 'Absolutely fantastic practice. Their emergency response was incredible when my horse colicked at 2am. Cannot fault them.' },
        { rating: 4, text: 'Very professional and thorough. The vettings they do are comprehensive. Pricey but you get what you pay for.' },
        { rating: 5, text: 'Been with TVEV for three years now. The whole team is lovely and really knows their stuff.' },
        { rating: 4, text: 'Great vet practice. Only minor criticism is the admin team can be slow returning calls, but the vets themselves are excellent.' },
      ],
    },
    {
      slug: 'sarah-mitchell-equine-physiotherapy',
      businessName: 'Sarah Mitchell Equine Physiotherapy',
      categorySlug: 'equine-physiotherapists',
      description: 'Chartered physiotherapist specialising in equine rehabilitation and performance. RAMP registered with a particular interest in dressage horses and post-surgical recovery.',
      phone: '07700 900456',
      email: 'sarah@mitchellequinephysio.co.uk',
      website: 'https://www.mitchellequinephysio.co.uk',
      address: '8 Oak Close',
      postcode: 'KT22 8AA',
      town: 'Leatherhead',
      latitude: 51.2960,
      longitude: -0.3290,
      serviceRadius: 25,
      areasCovered: 'Surrey, South London, West Kent',
      priceRange: '$$',
      verificationStatus: 'verified',
      qualifications: 'BSc Physiotherapy, PGDip Veterinary Physiotherapy, RAMP registered',
      specialisations: 'Dressage horses, Post-surgical rehabilitation, Back problems',
      services: [
        { name: 'Initial assessment', description: 'Full musculoskeletal assessment', priceFrom: 75, priceTo: 90 },
        { name: 'Follow-up treatment', priceFrom: 55, priceTo: 65 },
        { name: 'Rehabilitation programme', description: 'Bespoke rehab plan with exercises', priceFrom: 90, priceTo: 110 },
      ],
      reviews: [
        { rating: 5, text: 'Sarah completely transformed my horse. After months of poor performance she found the issue and within weeks he was back to his best.' },
        { rating: 5, text: 'Incredibly knowledgeable and gentle with the horses. My mare actually fell asleep during treatment!' },
        { rating: 4, text: 'Very thorough assessment and clear explanation of findings. Good follow-up rehab plan too.' },
      ],
    },
    {
      slug: 'david-wright-equine-chiropractic',
      businessName: 'David Wright Equine Chiropractic',
      categorySlug: 'equine-chiropractors',
      description: 'McTimoney-trained equine chiropractor with 10 years of experience. Working closely with vets and other therapists to ensure the best outcome for your horse.',
      phone: '07700 900789',
      email: 'david@wrightequinechiro.co.uk',
      website: 'https://www.wrightequinechiro.co.uk',
      address: '3 Mill Road',
      postcode: 'OX10 8AA',
      town: 'Wallingford',
      latitude: 51.5992,
      longitude: -1.1243,
      serviceRadius: 35,
      areasCovered: 'Oxfordshire, Berkshire, Buckinghamshire',
      priceRange: '$$',
      verificationStatus: 'verified',
      qualifications: 'BSc McTimoney Chiropractic, AMCA Registered',
      services: [
        { name: 'Initial consultation & treatment', priceFrom: 70, priceTo: 85 },
        { name: 'Follow-up treatment', priceFrom: 50, priceTo: 60 },
        { name: 'Rider & horse assessment', description: 'Combined assessment of horse and rider biomechanics', priceFrom: 95, priceTo: 120 },
      ],
      reviews: [
        { rating: 5, text: 'David is magic. My horse was stiff and resistant and after one session was moving beautifully.' },
        { rating: 4, text: 'Very professional, explains everything clearly and always works with vet referral. Good results.' },
      ],
    },
    {
      slug: 'kent-equine-dental-services',
      businessName: 'Kent Equine Dental Services',
      categorySlug: 'equine-dentists',
      description: 'BAEDT qualified equine dental technician providing routine and advanced dental care throughout Kent and East Sussex. Power and hand tools available.',
      phone: '07700 900321',
      email: 'info@kentequinedental.co.uk',
      website: 'https://www.kentequinedental.co.uk',
      address: '27 Canterbury Road',
      postcode: 'ME14 5AA',
      town: 'Maidstone',
      latitude: 51.2724,
      longitude: 0.5218,
      serviceRadius: 30,
      areasCovered: 'Kent, East Sussex',
      priceRange: '$$',
      verificationStatus: 'pending',
      qualifications: 'BAEDT Qualified, BEVA approved',
      services: [
        { name: 'Routine dental check & rasp', priceFrom: 55, priceTo: 75 },
        { name: 'Wolf tooth removal', priceFrom: 80, priceTo: 120 },
        { name: 'Dental chart & report', priceFrom: 30, priceTo: 40 },
      ],
      reviews: [
        { rating: 4, text: 'Thorough and gentle. My young horse was nervous but they handled him really well.' },
        { rating: 5, text: 'Brilliant service. Very professional and gave great advice on aftercare.' },
        { rating: 4, text: 'Good dentist, fair prices. Books up quickly though so plan ahead.' },
      ],
    },
    {
      slug: 'equine-balance-nutrition',
      businessName: 'Equine Balance Nutrition',
      categorySlug: 'equine-nutritionists',
      description: 'Independent equine nutritionist offering bespoke feeding plans. Specialising in metabolic conditions, weight management and performance nutrition. Not affiliated with any feed brand.',
      phone: '07700 900654',
      email: 'helen@equinebalance.co.uk',
      website: 'https://www.equinebalance.co.uk',
      address: '14 The Green',
      postcode: 'AL5 2AA',
      town: 'Harpenden',
      latitude: 51.8153,
      longitude: -0.3560,
      serviceRadius: 40,
      areasCovered: 'Hertfordshire, Bedfordshire, Buckinghamshire, North London',
      priceRange: '$$',
      verificationStatus: 'verified',
      qualifications: 'BSc Equine Science, PGCert Equine Nutrition',
      specialisations: 'Laminitis, EMS, PPID, Weight management',
      services: [
        { name: 'Full dietary consultation', description: 'On-yard visit, body condition scoring, hay analysis review, bespoke diet plan', priceFrom: 85, priceTo: 110 },
        { name: 'Remote diet review', description: 'Phone/video consultation with written diet plan', priceFrom: 45, priceTo: 55 },
        { name: 'Hay & forage analysis', priceFrom: 25, priceTo: 35 },
      ],
      reviews: [
        { rating: 5, text: 'Helen completely changed my horse\'s diet and the difference is remarkable. He has so much more energy and his coat is gleaming.' },
        { rating: 5, text: 'Invaluable help with my laminitic pony. Finally someone who gave clear, science-based advice.' },
      ],
    },

    // ── Training & Riding ────────────────────
    {
      slug: 'claire-edwards-riding-school',
      businessName: 'Claire Edwards Riding School',
      categorySlug: 'riding-instructors',
      description: 'BHS approved riding school offering lessons for all ages and abilities. From lead-rein beginners to advanced riders preparing for competitions. Beautiful facilities in the Surrey Hills.',
      phone: '01372 123456',
      email: 'lessons@claireedwards.co.uk',
      website: 'https://www.claireedwards.co.uk',
      address: 'Hillside Farm, Box Hill Road',
      postcode: 'KT20 7AA',
      town: 'Tadworth',
      latitude: 51.2897,
      longitude: -0.2371,
      serviceRadius: 15,
      areasCovered: 'Surrey',
      priceRange: '$$',
      verificationStatus: 'verified',
      qualifications: 'BHS Accredited, BHSI qualified instructors',
      services: [
        { name: 'Private lesson (30 min)', priceFrom: 35, priceTo: 45 },
        { name: 'Private lesson (60 min)', priceFrom: 55, priceTo: 70 },
        { name: 'Group lesson (60 min)', priceFrom: 30, priceTo: 40 },
        { name: 'Lunge lesson (30 min)', description: 'Seat and position work on the lunge', priceFrom: 40, priceTo: 50 },
      ],
      reviews: [
        { rating: 5, text: 'My daughter has been learning here for two years and the progress is amazing. Patient, safety-conscious instructors.' },
        { rating: 4, text: 'Lovely school horses and great facilities. Good for nervous beginners.' },
        { rating: 5, text: 'Best riding school in Surrey. Claire and her team are brilliant with both children and adults.' },
      ],
    },
    {
      slug: 'olivia-grant-dressage',
      businessName: 'Olivia Grant Dressage',
      categorySlug: 'dressage-trainers',
      description: 'International Grand Prix dressage rider offering training for horse and rider combinations from Prelim to Grand Prix. Clinic days and individual lessons available at your yard or mine.',
      phone: '07700 900234',
      email: 'olivia@oliviagrantdressage.co.uk',
      website: 'https://www.oliviagrantdressage.co.uk',
      address: 'Manor Farm Equestrian',
      postcode: 'GU5 0AA',
      town: 'Bramley',
      latitude: 51.1877,
      longitude: -0.5623,
      serviceRadius: 30,
      areasCovered: 'Surrey, Hampshire, West Sussex',
      priceRange: '$$$',
      verificationStatus: 'verified',
      qualifications: 'BD List 1 Judge, UKCC Level 3',
      specialisations: 'Grand Prix dressage, Young horse development',
      services: [
        { name: 'Individual lesson (45 min)', priceFrom: 65, priceTo: 80 },
        { name: 'Clinic day (shared)', description: '4 riders, 45 min each', priceFrom: 50, priceTo: 60 },
        { name: 'Horse training (per session)', priceFrom: 45, priceTo: 55 },
      ],
      reviews: [
        { rating: 5, text: 'Olivia is an incredible trainer. She has a real gift for explaining complex movements in a way that clicks.' },
        { rating: 5, text: 'My horse and I have improved beyond recognition since training with Olivia. She spots things nobody else does.' },
        { rating: 4, text: 'Excellent dressage trainer with a lovely manner. Her clinic days are great value.' },
      ],
    },
    {
      slug: 'mark-reynolds-show-jumping',
      businessName: 'Mark Reynolds Show Jumping',
      categorySlug: 'show-jumping-trainers',
      description: 'Former international show jumper now coaching riders from grass roots to British Showjumping level. Grid work, course building, and competition preparation.',
      phone: '07700 900567',
      email: 'mark@reynoldssj.co.uk',
      website: 'https://www.reynoldssj.co.uk',
      address: 'Woodlands Equestrian Centre',
      postcode: 'TN8 5AA',
      town: 'Edenbridge',
      latitude: 51.1925,
      longitude: 0.0653,
      serviceRadius: 25,
      areasCovered: 'Kent, Surrey, East Sussex',
      priceRange: '$$',
      verificationStatus: 'verified',
      qualifications: 'UKCC Level 3, BS Accredited Coach',
      services: [
        { name: 'Individual jumping lesson', priceFrom: 50, priceTo: 65 },
        { name: 'Group jumping session (max 4)', priceFrom: 35, priceTo: 45 },
        { name: 'Competition warm-up coaching', priceFrom: 40, priceTo: 50 },
      ],
      reviews: [
        { rating: 5, text: 'Mark really builds your confidence over fences. My horse and I are now jumping clear rounds at 1m!' },
        { rating: 4, text: 'Great coach, very technical approach. Helped us sort out our distances.' },
        { rating: 5, text: 'Fantastic trainer. He really understands the horse\'s perspective too, not just the rider.' },
      ],
    },
    {
      slug: 'kate-burnett-eventing',
      businessName: 'Kate Burnett Eventing',
      categorySlug: 'eventing-trainers',
      description: 'BE accredited eventing coach specialising in preparing combinations for one-day events and horse trials. Cross-country schooling days run monthly at multiple venues.',
      phone: '07700 900890',
      email: 'kate@burnetteventing.co.uk',
      website: 'https://www.burnetteventing.co.uk',
      address: '5 Farm Close',
      postcode: 'RH7 6AA',
      town: 'Lingfield',
      latitude: 51.1744,
      longitude: -0.0109,
      serviceRadius: 25,
      areasCovered: 'Surrey, Kent, Sussex',
      priceRange: '$$',
      verificationStatus: 'pending',
      qualifications: 'BE Accredited Coach, UKCC Level 2',
      services: [
        { name: 'Flatwork/jumping lesson', priceFrom: 45, priceTo: 60 },
        { name: 'Cross-country schooling (group)', description: 'Max 6 riders, 90 minutes', priceFrom: 55, priceTo: 70 },
        { name: 'Competition preparation package', description: '3 lessons plus competition day coaching', priceFrom: 150, priceTo: 200 },
      ],
      reviews: [
        { rating: 5, text: 'Kate got us from intro level to BE90 in one season. Her cross-country days are the best around.' },
        { rating: 4, text: 'Really supportive coach who builds rider confidence. Great with nervous riders.' },
      ],
    },
    {
      slug: 'anna-hartley-equine-behaviour',
      businessName: 'Anna Hartley Equine Behaviour',
      categorySlug: 'behaviourists',
      description: 'Certified equine behaviourist helping owners understand and resolve behavioural issues. From loading problems to separation anxiety and aggression. Science-based, reward-focused approach.',
      phone: '07700 900111',
      email: 'anna@hartleyequinebehaviour.co.uk',
      website: 'https://www.hartleyequinebehaviour.co.uk',
      address: '22 Church Lane',
      postcode: 'HP5 1AA',
      town: 'Chesham',
      latitude: 51.7052,
      longitude: -0.6111,
      serviceRadius: 35,
      areasCovered: 'Buckinghamshire, Hertfordshire, Oxfordshire, Berkshire',
      priceRange: '$$',
      verificationStatus: 'verified',
      qualifications: 'MSc Equine Behaviour, ABTC Registered',
      specialisations: 'Loading, Separation anxiety, Ridden behaviour issues',
      services: [
        { name: 'Behaviour consultation', description: 'On-yard visit, full assessment and written report', priceFrom: 95, priceTo: 130 },
        { name: 'Follow-up session', priceFrom: 60, priceTo: 75 },
        { name: 'Phone/video consultation', priceFrom: 40, priceTo: 50 },
      ],
      reviews: [
        { rating: 5, text: 'Anna saved us. Our horse was impossible to load and after two sessions he walks straight on. She is incredible.' },
        { rating: 5, text: 'Really patient, kind, science-based approach. No gadgets, just understanding. My horse is like a different animal.' },
        { rating: 4, text: 'Very knowledgeable and professional. The written report was extremely thorough and helpful.' },
      ],
    },

    // ── Yards & Facilities ──────────────────
    {
      slug: 'greenfield-livery-yard',
      businessName: 'Greenfield Livery Yard',
      categorySlug: 'livery-yards-full',
      description: 'Purpose-built livery yard set in 40 acres of Surrey countryside. Full, part and DIY livery available. 60x20 floodlit arena, horse walker, wash bay, and direct hacking onto bridleways.',
      phone: '01483 234567',
      email: 'info@greenfieldlivery.co.uk',
      website: 'https://www.greenfieldlivery.co.uk',
      address: 'Greenfield Farm, Cranleigh Road',
      postcode: 'GU6 7AA',
      town: 'Cranleigh',
      latitude: 51.1410,
      longitude: -0.4840,
      serviceRadius: 0,
      areasCovered: 'Cranleigh, Guildford, Horsham',
      priceRange: '$$$',
      verificationStatus: 'verified',
      services: [
        { name: 'Full livery', description: 'Including hay, feed, mucking out, turnout, bring-in', priceFrom: 750, priceTo: 900 },
        { name: 'Part livery', description: 'Mucking out and turnout weekdays, DIY weekends', priceFrom: 500, priceTo: 600 },
        { name: 'DIY livery', description: 'Stable, field, and arena use', priceFrom: 300, priceTo: 400 },
      ],
      reviews: [
        { rating: 5, text: 'Best yard I have ever been at. Immaculate facilities, friendly liveries, and the owner genuinely cares about the horses.' },
        { rating: 4, text: 'Lovely yard with great facilities. Arena surface is superb. Only negative is it can get busy at weekends.' },
        { rating: 5, text: 'My horse has never looked better since moving to Greenfield. Full livery is excellent value for what you get.' },
      ],
    },
    {
      slug: 'willow-farm-diy-livery',
      businessName: 'Willow Farm DIY Livery',
      categorySlug: 'livery-yards-diy',
      description: 'Relaxed, friendly DIY yard with 20 stables set in 15 acres. Post-and-rail fencing, all-weather arena, and lovely hacking across farmland. Supportive, community-feel yard.',
      phone: '01732 345678',
      email: 'willowfarm@email.co.uk',
      website: 'https://www.willowfarmlivery.co.uk',
      address: 'Willow Farm, Plaxtol Road',
      postcode: 'TN15 0AA',
      town: 'Sevenoaks',
      latitude: 51.2769,
      longitude: 0.1871,
      serviceRadius: 0,
      areasCovered: 'Sevenoaks, Tonbridge',
      priceRange: '$',
      verificationStatus: 'verified',
      services: [
        { name: 'DIY livery', description: 'Stable, field, arena, and tack room', priceFrom: 220, priceTo: 280 },
        { name: 'Grass livery', description: 'Field shelter and water', priceFrom: 100, priceTo: 150 },
      ],
      reviews: [
        { rating: 5, text: 'Wonderful little yard. Everyone helps each other out and the horses are so happy. Lovely hacking too.' },
        { rating: 4, text: 'Great value DIY yard. Facilities are basic but well maintained. Friendly group of liveries.' },
        { rating: 5, text: 'My horse has been here two years and I would not move him. The fields are excellent and turnout is flexible.' },
      ],
    },
    {
      slug: 'highdown-arena-hire',
      businessName: 'Highdown Arena Hire',
      categorySlug: 'arena-hire',
      description: 'Two all-weather arenas available for hire: 60x20 dressage arena and 40x60 show jumping arena with a full set of BS jumps. Floodlit until 9pm. Easy access with good parking for lorries.',
      phone: '01903 456789',
      email: 'bookings@highdownarena.co.uk',
      website: 'https://www.highdownarena.co.uk',
      address: 'Highdown Farm',
      postcode: 'BN13 8AA',
      town: 'Worthing',
      latitude: 50.8429,
      longitude: -0.4088,
      serviceRadius: 0,
      areasCovered: 'West Sussex',
      priceRange: '$',
      verificationStatus: 'pending',
      services: [
        { name: 'Arena hire (per hour)', priceFrom: 15, priceTo: 20 },
        { name: 'Arena hire with jumps', priceFrom: 20, priceTo: 25 },
        { name: 'Floodlight supplement', priceFrom: 5, priceTo: 5 },
      ],
      reviews: [
        { rating: 4, text: 'Good surfaces and well-maintained jumps. Easy to book online. Reasonably priced.' },
        { rating: 4, text: 'Convenient location and decent arenas. Parking is good for larger lorries too.' },
      ],
    },
    {
      slug: 'chestnut-cross-country-course',
      businessName: 'Chestnut Cross-Country Course',
      categorySlug: 'cross-country-facilities',
      description: 'Purpose-built cross-country course with fences from Intro to Intermediate level set across 80 acres of rolling Sussex countryside. Water complex, ditches, banks, and combinations.',
      phone: '01444 567890',
      email: 'info@chestnutxc.co.uk',
      website: 'https://www.chestnutxc.co.uk',
      address: 'Chestnut Farm, Ardingly Road',
      postcode: 'RH17 6AA',
      town: 'Haywards Heath',
      latitude: 51.0036,
      longitude: -0.0959,
      serviceRadius: 0,
      areasCovered: 'West Sussex, East Sussex, Surrey',
      priceRange: '$$',
      verificationStatus: 'verified',
      services: [
        { name: 'Individual schooling (2 hours)', priceFrom: 30, priceTo: 40 },
        { name: 'Group schooling day', description: 'Coached session with max 8 riders', priceFrom: 55, priceTo: 70 },
      ],
      reviews: [
        { rating: 5, text: 'Fantastic course with brilliant variety. The water complex is excellent and fences are beautifully built.' },
        { rating: 5, text: 'Best cross-country schooling in the area. Well maintained and great range of fences for all levels.' },
        { rating: 4, text: 'Lovely course. Good variety of questions and well-flagged routes. Car park gets muddy in winter.' },
      ],
    },

    // ── Horse Services & Shopping ────────────
    {
      slug: 'south-east-horse-transport',
      businessName: 'South East Horse Transport',
      categorySlug: 'horse-transport',
      description: 'Professional horse transport covering the South East. Modern, well-maintained lorries and trailers. Fully insured with experienced handlers. Single horse moves to full team transport.',
      phone: '07700 900999',
      email: 'bookings@sehorsetransport.co.uk',
      website: 'https://www.sehorsetransport.co.uk',
      address: '1 Industrial Estate',
      postcode: 'CR3 0AA',
      town: 'Caterham',
      latitude: 51.2810,
      longitude: -0.0790,
      serviceRadius: 50,
      areasCovered: 'Surrey, Kent, Sussex, Hampshire, London, Berkshire',
      priceRange: '$$',
      verificationStatus: 'verified',
      qualifications: 'DEFRA approved, Operator licence held',
      services: [
        { name: 'Local transport (up to 30 miles)', priceFrom: 80, priceTo: 120 },
        { name: 'Regional transport (30-80 miles)', priceFrom: 150, priceTo: 250 },
        { name: 'Long distance (80+ miles)', description: 'Price per mile after first 80', priceFrom: 250, priceTo: 400 },
        { name: 'Competition transport', description: 'Wait and return service', priceFrom: 150, priceTo: 300 },
      ],
      reviews: [
        { rating: 5, text: 'Moved my horse 200 miles and he arrived calm and relaxed. The driver was fantastic and kept me updated throughout.' },
        { rating: 5, text: 'Used them multiple times for competition transport. Always punctual, professional and my horse loves their lorry.' },
        { rating: 4, text: 'Good service and fair prices. Booking is easy and they are flexible with times.' },
      ],
    },
    {
      slug: 'county-saddlery',
      businessName: 'County Saddlery & Tack Shop',
      categorySlug: 'tack-shops',
      description: 'Family-run tack shop stocking everything for horse and rider. From everyday essentials to premium brands. Friendly, knowledgeable staff who can help you find exactly what you need.',
      phone: '01892 678901',
      email: 'shop@countysaddlery.co.uk',
      website: 'https://www.countysaddlery.co.uk',
      address: '33 High Street',
      postcode: 'TN2 5AA',
      town: 'Tunbridge Wells',
      latitude: 51.1322,
      longitude: 0.2634,
      serviceRadius: 0,
      areasCovered: 'Kent, East Sussex',
      priceRange: '$$',
      verificationStatus: 'verified',
      services: [
        { name: 'Saddle fitting consultation (in-store)', priceFrom: 0, priceTo: 0 },
        { name: 'Bridle fitting', priceFrom: 0, priceTo: 0 },
        { name: 'Rug measuring', priceFrom: 0, priceTo: 0 },
      ],
      reviews: [
        { rating: 5, text: 'Love this shop! The staff are so helpful and they stock brilliant brands. Always my first stop for anything horse-related.' },
        { rating: 4, text: 'Great range and very knowledgeable staff. Prices are fair and they often have good offers on.' },
        { rating: 5, text: 'Best tack shop around. They went above and beyond to help me find the right bridle for my horse.' },
      ],
    },
    {
      slug: 'elizabeth-hay-master-saddler',
      businessName: 'Elizabeth Hay Master Saddler',
      categorySlug: 'saddlers',
      description: 'Master saddler and qualified saddle fitter with 20 years of experience. Specialising in made-to-measure saddles and remedial fitting. Working with all major brands.',
      phone: '07700 900222',
      email: 'elizabeth@haymasterSaddler.co.uk',
      website: 'https://www.haymastersaddler.co.uk',
      address: '7 Stable Yard',
      postcode: 'GU27 1AA',
      town: 'Haslemere',
      latitude: 51.0896,
      longitude: -0.7128,
      serviceRadius: 30,
      areasCovered: 'Surrey, Hampshire, West Sussex',
      priceRange: '$$$',
      verificationStatus: 'verified',
      qualifications: 'Society of Master Saddlers Qualified, SMS Registered',
      specialisations: 'Bespoke saddles, Remedial fitting, Wide/cob fitting',
      services: [
        { name: 'Saddle fitting consultation', priceFrom: 45, priceTo: 60 },
        { name: 'Reflocking', priceFrom: 120, priceTo: 180 },
        { name: 'Saddle adjustment', priceFrom: 65, priceTo: 90 },
        { name: 'Bespoke saddle (commission)', description: 'Made-to-measure saddle', priceFrom: 2500, priceTo: 4500 },
      ],
      reviews: [
        { rating: 5, text: 'Elizabeth is worth every penny. She fitted my difficult-to-fit cob perfectly and the difference in his movement was immediate.' },
        { rating: 5, text: 'The best saddle fitter I have ever used. Thorough, knowledgeable and truly passionate about getting it right.' },
        { rating: 4, text: 'Excellent service and very professional. She takes real time over each fitting. Booking well in advance recommended.' },
      ],
    },
    {
      slug: 'rachel-ford-saddle-fitting',
      businessName: 'Rachel Ford Saddle Fitting',
      categorySlug: 'saddle-fitters',
      description: 'Independent saddle fitter covering Kent and Sussex. Society of Master Saddlers qualified. Offering unbiased advice across all brands to find the best solution for horse and rider.',
      phone: '07700 900333',
      email: 'rachel@fordsaddlefitting.co.uk',
      website: 'https://www.fordsaddlefitting.co.uk',
      address: '11 Meadow Way',
      postcode: 'TN12 6AA',
      town: 'Paddock Wood',
      latitude: 51.1820,
      longitude: 0.3921,
      serviceRadius: 25,
      areasCovered: 'Kent, East Sussex',
      priceRange: '$$',
      verificationStatus: 'unverified',
      qualifications: 'SMS Qualified Saddle Fitter',
      services: [
        { name: 'Saddle fit check', description: 'Assessment of current saddle fit', priceFrom: 35, priceTo: 45 },
        { name: 'New saddle fitting', description: 'Full assessment plus trial saddles', priceFrom: 50, priceTo: 65 },
        { name: 'Reflocking', priceFrom: 100, priceTo: 150 },
      ],
      reviews: [
        { rating: 4, text: 'Rachel was very honest about what would and would not work. Did not try to upsell me. Good service.' },
        { rating: 5, text: 'Finally found a saddle fitter who listens. Rachel spent ages getting it right and the result is perfect.' },
      ],
    },
    {
      slug: 'heritage-feed-supplies',
      businessName: 'Heritage Feed Supplies',
      categorySlug: 'feed-shops',
      description: 'Independent feed merchant supplying all major brands plus locally sourced hay, haylage, straw and bedding. Free delivery within 15 miles on orders over 50 pounds. Friendly advice from experienced staff.',
      phone: '01306 789012',
      email: 'orders@heritagefeed.co.uk',
      website: 'https://www.heritagefeed.co.uk',
      address: '9 Station Road',
      postcode: 'RH5 4AA',
      town: 'Capel',
      latitude: 51.1662,
      longitude: -0.3188,
      serviceRadius: 15,
      areasCovered: 'Surrey, West Sussex',
      priceRange: '$',
      verificationStatus: 'verified',
      services: [
        { name: 'Free delivery (orders over £50)', description: 'Within 15 mile radius', priceFrom: 0, priceTo: 0 },
        { name: 'Hay per bale', priceFrom: 5, priceTo: 8 },
        { name: 'Shavings per bale', priceFrom: 8, priceTo: 12 },
      ],
      reviews: [
        { rating: 5, text: 'Brilliant local feed shop. Great prices, lovely staff, and free delivery is a huge bonus.' },
        { rating: 5, text: 'Always have what I need and the hay quality is consistently excellent. Would not go anywhere else.' },
        { rating: 4, text: 'Good range of feeds and supplements. Staff are helpful and can give good advice on feeding.' },
      ],
    },
  ]

  // ──────────────────────────────────────────────
  // Create providers, services, and reviews
  // ──────────────────────────────────────────────
  console.log(`Creating ${providerDefs.length} providers...`)

  for (const def of providerDefs) {
    const provider = await prisma.provider.create({
      data: {
        slug: def.slug,
        businessName: def.businessName,
        categoryId: catBySlug[def.categorySlug],
        description: def.description,
        phone: def.phone,
        email: def.email,
        website: def.website,
        address: def.address,
        postcode: def.postcode,
        town: def.town,
        latitude: def.latitude,
        longitude: def.longitude,
        serviceRadius: def.serviceRadius,
        areasCovered: def.areasCovered,
        priceRange: def.priceRange,
        verificationStatus: def.verificationStatus,
        isDemo: true,
        acceptingNewClients: true,
        specialisations: def.specialisations ?? null,
        qualifications: def.qualifications ?? null,
      },
    })

    // Create services
    for (const svc of def.services) {
      await prisma.service.create({
        data: {
          providerId: provider.id,
          categoryId: catBySlug[def.categorySlug],
          serviceName: svc.name,
          description: svc.description ?? null,
          priceFrom: svc.priceFrom ?? null,
          priceTo: svc.priceTo ?? null,
        },
      })
    }

    // Create reviews, alternating between demo users
    for (let i = 0; i < def.reviews.length; i++) {
      const rev = def.reviews[i]
      const reviewUser = demoUsers[i % demoUsers.length]
      // Spread reviews across the last 12 months
      const daysAgo = Math.floor(Math.random() * 365)
      const createdAt = new Date()
      createdAt.setDate(createdAt.getDate() - daysAgo)

      await prisma.review.create({
        data: {
          providerId: provider.id,
          userId: reviewUser.id,
          rating: rev.rating,
          reviewText: rev.text,
          status: 'approved',
          isDemo: true,
          createdAt,
        },
      })
    }

    console.log(`  Created: ${def.businessName}`)
  }

  console.log('\nSeeding complete!')
  console.log(`  Categories: 4 parents + ${subcategories.length} subcategories`)
  console.log(`  Providers: ${providerDefs.length}`)
  console.log(`  Users: ${demoUsers.length}`)
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

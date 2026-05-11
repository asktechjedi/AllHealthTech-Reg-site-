import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data in dependency order
  await prisma.agendaItem.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.speaker.deleteMany();
  await prisma.event.deleteMany();

  // Create event
  const event = await prisma.event.create({
    data: {
      name: 'AllHealthTech 2025 Conference',
      date: new Date('2025-10-15T09:00:00+05:30'),
      endDate: new Date('2025-10-17T18:00:00+05:30'),
      location: 'Mumbai, India',
      venue: 'Bombay Exhibition Centre',
      description:
        'AllHealthTech 2025 is India\'s premier health technology conference, bringing together innovators, clinicians, investors, and policymakers to shape the future of healthcare. Three days of keynotes, workshops, and networking across AI diagnostics, digital therapeutics, medtech, and health data.',
      bannerUrl: 'https://placehold.co/1920x600?text=AllHealthTech+2025',
    },
  });

  console.log(`Created event: ${event.name} (${event.id})`);

  // Create ticket types (prices in paise)
  const [generalTicket, vipTicket, studentTicket] = await Promise.all([
    prisma.ticketType.create({
      data: {
        eventId: event.id,
        name: 'General',
        price: 299900,
        currency: 'INR',
        description: 'Full conference access for professionals',
        features: [
          'Access to all keynote sessions',
          'Access to all breakout tracks',
          'Conference kit & badge',
          'Lunch & refreshments (all 3 days)',
          'Networking reception on Day 1',
          'Access to exhibitor hall',
          'Digital session recordings (post-event)',
        ],
        capacity: 800,
        isActive: true,
      },
    }),
    prisma.ticketType.create({
      data: {
        eventId: event.id,
        name: 'VIP',
        price: 799900,
        currency: 'INR',
        description: 'Premium experience with exclusive access and perks',
        features: [
          'Everything in General',
          'Priority front-row seating at keynotes',
          'Exclusive VIP networking dinner (Day 2)',
          'Private speaker meet-and-greet sessions',
          'VIP lounge access throughout the event',
          'Printed conference proceedings',
          'One-year AllHealthTech community membership',
          'Certificate of participation',
        ],
        capacity: 100,
        isActive: true,
      },
    }),
    prisma.ticketType.create({
      data: {
        eventId: event.id,
        name: 'Student',
        price: 99900,
        currency: 'INR',
        description: 'Discounted access for full-time students (valid ID required)',
        features: [
          'Access to all keynote sessions',
          'Access to workshop tracks',
          'Conference kit & badge',
          'Lunch & refreshments (all 3 days)',
          'Student networking meetup',
          'Digital session recordings (post-event)',
          'Career fair access',
        ],
        capacity: 200,
        isActive: true,
      },
    }),
  ]);

  console.log('Created ticket types: General, VIP, Student');

  // Create speakers
  const speakerData = [
    {
      eventId: event.id,
      name: 'Dr. Priya Nair',
      title: 'Chief Medical Officer',
      organization: 'Apollo Hospitals Digital Health',
      biography:
        'Dr. Priya Nair is a pioneer in clinical AI adoption with over 18 years of experience in internal medicine and digital health strategy. She leads Apollo\'s AI-driven diagnostics programme and has published extensively on responsible AI in clinical settings.',
      photoUrl: 'https://placehold.co/400x400?text=Dr.+Priya+Nair',
      isFeatured: true,
      displayOrder: 1,
    },
    {
      eventId: event.id,
      name: 'Arjun Mehta',
      title: 'Co-Founder & CEO',
      organization: 'CureLink Health Technologies',
      biography:
        'Arjun Mehta co-founded CureLink, a Series B health-tech startup building AI-powered chronic disease management platforms. Previously a product leader at Practo, he is a vocal advocate for interoperability standards and the Ayushman Bharat Digital Mission.',
      photoUrl: 'https://placehold.co/400x400?text=Arjun+Mehta',
      isFeatured: true,
      displayOrder: 2,
    },
    {
      eventId: event.id,
      name: 'Dr. Sunita Rao',
      title: 'Director, Health Informatics',
      organization: 'Indian Institute of Technology Bombay',
      biography:
        'Dr. Sunita Rao heads the Health Informatics Lab at IIT Bombay, where her team develops federated learning frameworks for privacy-preserving medical data analysis. She holds a PhD in Biomedical Engineering from Johns Hopkins University.',
      photoUrl: 'https://placehold.co/400x400?text=Dr.+Sunita+Rao',
      isFeatured: true,
      displayOrder: 3,
    },
    {
      eventId: event.id,
      name: 'Vikram Desai',
      title: 'Partner, Healthcare Investments',
      organization: 'Sequoia Capital India',
      biography:
        'Vikram Desai leads healthcare and life sciences investments at Sequoia Capital India. He has backed over 20 health-tech companies including Pristyn Care, Niramai, and Tricog Health, and advises founders on scaling from product-market fit to national rollout.',
      photoUrl: 'https://placehold.co/400x400?text=Vikram+Desai',
      isFeatured: false,
      displayOrder: 4,
    },
    {
      eventId: event.id,
      name: 'Dr. Meera Krishnan',
      title: 'Head of Regulatory Affairs',
      organization: 'Central Drugs Standard Control Organisation (CDSCO)',
      biography:
        'Dr. Meera Krishnan oversees the regulatory framework for Software as a Medical Device (SaMD) at CDSCO. She has been instrumental in drafting India\'s first guidelines for AI/ML-based medical devices and represents India at ISO TC 215 working groups.',
      photoUrl: 'https://placehold.co/400x400?text=Dr.+Meera+Krishnan',
      isFeatured: false,
      displayOrder: 5,
    },
    {
      eventId: event.id,
      name: 'Rahul Sharma',
      title: 'VP Engineering',
      organization: 'Niramai Health Analytix',
      biography:
        'Rahul Sharma leads the engineering team at Niramai, building thermography-based AI solutions for early breast cancer screening. With a background in computer vision and embedded systems, he champions low-cost medtech innovation for Tier 2 and Tier 3 cities.',
      photoUrl: 'https://placehold.co/400x400?text=Rahul+Sharma',
      isFeatured: false,
      displayOrder: 6,
    },
  ];

  const speakers = await Promise.all(
    speakerData.map((s) => prisma.speaker.create({ data: s }))
  );

  console.log(`Created ${speakers.length} speakers`);

  const [drPriya, arjun, drSunita, vikram, drMeera, rahul] = speakers;

  // Create agenda items — 8 items across 2 tracks
  const agendaItems = [
    {
      eventId: event.id,
      title: 'Opening Keynote: The Next Decade of Health Technology in India',
      description:
        'A visionary address on how AI, genomics, and digital infrastructure will transform Indian healthcare by 2035, with a focus on equitable access and rural reach.',
      startTime: new Date('2025-10-15T09:30:00+05:30'),
      endTime: new Date('2025-10-15T10:30:00+05:30'),
      track: 'Main Stage',
      location: 'Hall A',
      speakerId: drPriya.id,
      displayOrder: 1,
    },
    {
      eventId: event.id,
      title: 'Panel: Scaling Digital Health Startups — From Pilot to Pan-India',
      description:
        'Founders and investors discuss the challenges of scaling health-tech products beyond metro cities, navigating regulatory hurdles, and building trust with clinicians.',
      startTime: new Date('2025-10-15T11:00:00+05:30'),
      endTime: new Date('2025-10-15T12:00:00+05:30'),
      track: 'Main Stage',
      location: 'Hall A',
      speakerId: arjun.id,
      displayOrder: 2,
    },
    {
      eventId: event.id,
      title: 'Workshop: Building Privacy-Preserving ML Models for Clinical Data',
      description:
        'Hands-on session covering federated learning, differential privacy, and synthetic data generation techniques applicable to hospital EHR datasets.',
      startTime: new Date('2025-10-15T11:00:00+05:30'),
      endTime: new Date('2025-10-15T13:00:00+05:30'),
      track: 'Workshop',
      location: 'Workshop Room 1',
      speakerId: drSunita.id,
      displayOrder: 3,
    },
    {
      eventId: event.id,
      title: 'Keynote: Investing in Health-Tech — What VCs Look for in 2025',
      description:
        'An investor\'s perspective on the metrics, team profiles, and market dynamics that attract venture capital to health-tech companies in the current funding climate.',
      startTime: new Date('2025-10-15T14:00:00+05:30'),
      endTime: new Date('2025-10-15T15:00:00+05:30'),
      track: 'Main Stage',
      location: 'Hall A',
      speakerId: vikram.id,
      displayOrder: 4,
    },
    {
      eventId: event.id,
      title: 'Workshop: Navigating SaMD Regulations — A Practical Guide for Founders',
      description:
        'An interactive workshop walking through CDSCO\'s SaMD classification framework, pre-submission meetings, clinical evaluation requirements, and post-market surveillance obligations.',
      startTime: new Date('2025-10-16T10:00:00+05:30'),
      endTime: new Date('2025-10-16T12:00:00+05:30'),
      track: 'Workshop',
      location: 'Workshop Room 2',
      speakerId: drMeera.id,
      displayOrder: 5,
    },
    {
      eventId: event.id,
      title: 'Talk: AI Diagnostics at the Last Mile — Lessons from the Field',
      description:
        'Real-world case studies on deploying AI diagnostic tools in community health centres and primary care settings, including model drift, connectivity challenges, and clinician training.',
      startTime: new Date('2025-10-16T13:00:00+05:30'),
      endTime: new Date('2025-10-16T14:00:00+05:30'),
      track: 'Main Stage',
      location: 'Hall A',
      speakerId: rahul.id,
      displayOrder: 6,
    },
    {
      eventId: event.id,
      title: 'Workshop: Designing Patient-Centric Digital Therapeutics',
      description:
        'A design-thinking workshop exploring UX research methods, behaviour change frameworks, and clinical validation approaches for digital therapeutic products targeting chronic conditions.',
      startTime: new Date('2025-10-16T14:30:00+05:30'),
      endTime: new Date('2025-10-16T16:30:00+05:30'),
      track: 'Workshop',
      location: 'Workshop Room 1',
      speakerId: arjun.id,
      displayOrder: 7,
    },
    {
      eventId: event.id,
      title: 'Closing Keynote: Responsible AI in Healthcare — Ethics, Accountability, and Trust',
      description:
        'A thought-provoking closing address on the ethical imperatives of deploying AI in clinical environments, covering bias auditing, explainability standards, and the evolving regulatory landscape.',
      startTime: new Date('2025-10-17T16:00:00+05:30'),
      endTime: new Date('2025-10-17T17:00:00+05:30'),
      track: 'Main Stage',
      location: 'Hall A',
      speakerId: drPriya.id,
      displayOrder: 8,
    },
  ];

  await Promise.all(
    agendaItems.map((item) => prisma.agendaItem.create({ data: item }))
  );

  console.log(`Created ${agendaItems.length} agenda items`);
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

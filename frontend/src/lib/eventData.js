import drUmaPhoto from '../assets/AHT-Speaker-PIC/dr-uma.webp'
import shivaniPhoto from '../assets/AHT-Speaker-PIC/shivani-kulkarni.webp'
import ujjvalaPhoto from '../assets/AHT-Speaker-PIC/ujjvala-ballal.webp'
import snehaPhoto from '../assets/AHT-Speaker-PIC/sneha-bhonsle.webp'
import drBhaskarPhoto from '../assets/AHT-Speaker-PIC/dr-bhaskar.webp'

const speakerRecords = [
  {
    id: 'speaker-shivani-kulkarni',
    name: 'Shivani Kulkarni',
    title: 'Vice President',
    organization: 'PrimeVP',
    tagline: 'Early Stage Tech VC — Fintech, Marketplaces & Consumer',
    biography:
      'Shivani Kulkarni is a venture capital investor focused on early-stage technology companies across Fintech, Marketplaces, and Consumer segments. As Vice President at PrimeVP, she has built a portfolio spanning financial infrastructure, embedded finance, and D2C brands. Prior to PrimeVP, she led venture investments at Flipkart where she backed companies including Finbox, Hyperface, GOAT Brand Labs, and Ninjacart. She started her career in Investment Banking at Avendus Capital. Shivani holds an MBA in Finance from XLRI Jamshedpur (Director\'s Merit List) and a Gold Medal in Electronics & Communication Engineering from PES University.',
    photoUrl: shivaniPhoto,
    linkedinUrl: 'https://www.linkedin.com/in/kulkarnishivani/',
    twitterUrl: '',
    isFeatured: true,
    displayOrder: 1,
    expertise: ['Venture Capital', 'Fintech', 'Marketplaces', 'Consumer Tech', 'Early Stage Investing'],
    highlights: [
      { label: 'Current', value: 'Vice President, PrimeVP' },
      { label: 'Previously', value: 'Venture Investments, Flipkart' },
      { label: 'Portfolio', value: 'Finbox · Hyperface · GOAT Brand Labs · Ninjacart' },
      { label: 'Also Investing In', value: 'Elchemy · Navadhan Capital · Metafin' },
    ],
    education: [
      {
        degree: 'MBA, Finance',
        institution: 'XLRI Jamshedpur',
        year: '2018',
        achievement: "Director's Merit List",
      },
      {
        degree: 'B.E., Electronics & Communication Engineering',
        institution: 'PES University, Bangalore',
        year: '2016',
        achievement: 'Gold Medallist',
      },
    ],
    awards: [
      "Director's Merit List — XLRI Jamshedpur, 2017",
      'Gold Medal — PES University, 2016',
    ],
  },
  {
    id: 'speaker-dr-uma-nambiar',
    name: 'Dr. Uma Nambiar',
    title: 'CEO, IISc Medical School Foundation',
    organization: 'IISc Medical School Foundation',
    tagline: 'Neurosurgeon · Healthcare Administrator · Digital Health Pioneer',
    biography:
      'Dr. Uma Nambiar is a trained neurosurgeon and healthcare administrator with over forty years in the healthcare industry. An alumna of Armed Forces Medical College Pune, Sree Chitra Tirunal Institute Trivandrum, and Faculty of Management Studies Delhi, she has also trained at Beth Israel Hospital New York and Necker Enfant Malades Paris. She has worked across India and Africa as a Surgical Neuro-oncologist and in CXO roles at leading corporate hospitals. Dr. Nambiar has commissioned greenfield hospitals and re-engineered brownfield hospitals across multiple geographies, served as Special Technical Advisor to the Ministry of Health in Djibouti, and as a Digital Health consultant to a private hospital group in Botswana. She is an Independent Board Director for Hemas Hospital Group, Sri Lanka and IIHMR Bangalore, and an Honorary Professor at Jawaharlal Nehru Centre for Advanced Scientific Research.',
    photoUrl: drUmaPhoto,
    linkedinUrl: '',
    twitterUrl: '',
    isFeatured: true,
    displayOrder: 2,
    expertise: ['Neurosurgery', 'Digital Health', 'Healthcare Administration', 'Telemedicine', 'Hospital Commissioning'],
    highlights: [
      { label: 'Current', value: 'CEO, IISc Medical School Foundation' },
      { label: 'Co-Founder', value: 'DHIA — Digital Health India Association' },
      { label: 'Board Director', value: 'Hemas Hospital Group, Sri Lanka' },
      { label: 'Board Director', value: 'IIHMR, Bangalore' },
      { label: 'VP', value: 'Telemedicine Society of India' },
    ],
    education: [
      { degree: 'MBBS', institution: 'Armed Forces Medical College, Pune', year: '1982', achievement: '' },
      { degree: 'M.S. (General Surgery)', institution: 'Armed Forces Medical College, Pune', year: '1990', achievement: '' },
      { degree: 'M.Ch. (Neurosurgery)', institution: 'Sree Chitra Tirunal Institute, Trivandrum', year: '1993', achievement: '' },
      { degree: 'MBA, Healthcare Administration', institution: 'Faculty of Management Studies, Delhi University', year: '2005', achievement: '' },
      { degree: 'Visiting Fellowship — Vascular Neurosurgery', institution: 'Mayo Clinic, Minnesota', year: '1997', achievement: '' },
      { degree: 'Visiting Fellowship — Pediatric Neurosurgery', institution: 'Beth Israel Hospital, New York', year: '1998', achievement: '' },
    ],
    awards: [
      'Excellence in Digital Health Award — UAE Healthcare Leaders\' Summit, 2024',
      'Global Healthcare Digital Women Leadership of the Year — World Health Congress, 2021',
      'Top 50 Strategists in Healthcare to Follow — Medgate Today, 2021',
      'CXO Health Excellence Award — 7th CXO Digital Innovation Health Summit, 2022',
      'Winner, Commonwealth Digital Health Award in Nursing Informatics, 2017',
      'Innovator in Healthcare — Women Leadership and Innovation Award, 2013',
      'Country Development Marketplace Award — World Bank, 2004',
    ],
  },
  {
    id: 'speaker-ujjvala-ballal-shetty',
    name: 'Ujjvala Ballal Shetty',
    title: 'CEO',
    organization: 'Aveksha Hospitals',
    tagline: 'Healthcare Entrepreneur · Lawyer · Advocate for Accessible Care',
    biography:
      'Ujjvala Ballal Shetty is an entrepreneur, lawyer, and committed advocate for accessible healthcare. As CEO of Aveksha Multi-Specialty Hospitals — a growing hospital group in North Bangalore — she is dedicated to delivering world-class healthcare at an affordable cost. Aveksha currently operates a flagship 125-bed branch at MS Palya, serving the community for over 13 years, with a new branch in Yelahanka launching in July 2026. Ujjvala began her career with Inclusive Planet, a startup that successfully changed Indian copyright law to improve literary access for the visually impaired, before practising with a senior litigation lawyer in Bangalore and transitioning into healthcare leadership. She also co-hosts an ongoing online series on Medico-Legal Issues for doctors, alongside Dr. RK Mani and Dr. Shashi Kumar of Cloud Physician.',
    photoUrl: ujjvalaPhoto,
    photoPosition: 'center 18%',
    linkedinUrl: '',
    twitterUrl: '',
    isFeatured: true,
    displayOrder: 3,
    expertise: ['Healthcare Leadership', 'Hospital Operations', 'Medico-Legal', 'Entrepreneurship', 'Accessible Healthcare'],
    highlights: [
      { label: 'Current', value: 'CEO, Aveksha Multi-Specialty Hospitals' },
      { label: 'Hospitals', value: 'MS Palya (125 beds, 13+ yrs) · Yelahanka (launching Jul 2026)' },
      { label: 'Background', value: 'Law · Inclusive Planet · Litigation Practice' },
      { label: 'Series', value: 'Co-host, Medico-Legal Issues for Doctors' },
    ],
    education: [
      {
        degree: 'LLB (Law)',
        institution: 'ULC, Bangalore',
        year: '',
        achievement: 'Vice President, AIESEC India',
      },
    ],
    awards: [],
  },
  {
    id: 'speaker-sneha-bhonsle',
    name: 'Sneha Bhonsle',
    title: 'Founder',
    organization: 'Benevolent Legal',
    tagline: 'Healthcare and life sciences lawyer',
    biography:
      'Sneha Bhonsle is the Founder of Benevolent Legal and a healthcare and life sciences lawyer specializing in medical law, healthcare regulation, digital health, and data protection. She advises hospitals, healthcare professionals, and healthtech startups on regulatory, compliance, and medico-legal matters. With experience spanning healthcare, technology, and law, including a stint as Legal & Compliance Consultant at CARPL.ai, Sneha brings valuable insights into the evolving legal landscape of healthcare innovation.',
    photoUrl: snehaPhoto,
    photoPosition: 'center top',
    linkedinUrl: '',
    twitterUrl: '',
    isFeatured: true,
    displayOrder: 4,
    expertise: ['Medical Law', 'Healthcare Regulation', 'Digital Health', 'Data Protection', 'Medico-Legal'],
    highlights: [
      { label: 'Current', value: 'Founder, Benevolent Legal' },
      { label: 'Previously', value: 'Legal & Compliance Consultant, CARPL.ai' },
      { label: 'Specialisation', value: 'Medical Law · Healthcare Regulation · Digital Health · Data Protection' },
    ],
    education: [],
    awards: [],
  },
  {
    id: 'speaker-dr-bhaskar-rajakumar',
    name: 'Dr Bhaskar Rajakumar',
    title: 'CEO, Centre of Excellence in Health Tech and Med Tech',
    organization: 'Govt of Karnataka',
    tagline: 'Evangelising med tech and health innovations, supporting AI driven solutions for Public Health, One Health and Climate Change.',
    biography:
      'A physician by academia, specialised in radiology with masters in business administration. With ~ 20 years across clinical, non-clinical and administrative fields, Dr Bhaskar\'s expertise spans across public health, healthcare administration, insurance, medical affairs, regulatory and pharmacovigilance, medical education, public policy, disaster management and healthcare innovation.\nHe is currently the CEO of Centre of Excellence in Health Tech and Med Tech, Govt of Karnataka and also serves as advisory for Bangalore Bio Innovation Centre, GoK and AI & Robotics Technology Park (ARTPARK), IISc. His present focus is on evangelising med tech and health innovations, supporting AI driven solutions for Public Health, One Health and Climate Change.\nHe is also Adjunct faculty at Rajiv Gandhi University of Medical Sciences, Karnataka and Post Graduate Institute of Medical Education and Research at Chandigarh, teaching healthcare informatics and related subjects.\nPrior to this he was working as the OSD to the Chief Commissioner, BBMP and was heading the Covid 19 Central War Room at BBMP.\nHis earlier startup \'Mediknit\' was focused on integration of future technologies in healthcare education, and worked with more than 1 million healthcare professionals across India, APAC, and USA. His work on healthcare and innovations have received multiple accolades and recognitions across the globe.\nHe has volunteered across the globe - including during the major disasters such as Tsunami in Tamil Nadu, Earth Quake in Nepal, Bomb blasts in Brussels etc.,\nPart of passion he is an avid runner with multiple marathons completed across the country and practices theatre.',
    photoUrl: drBhaskarPhoto,
    linkedinUrl: 'https://www.linkedin.com/in/drbhaskar/',
    twitterUrl: '',
    isFeatured: true,
    displayOrder: 5,
    expertise: ['MedTech', 'HealthTech', 'Public Health', 'AI in Healthcare', 'Healthcare Innovation', 'Digital Health'],
    highlights: [
      { label: 'Current', value: 'CEO, Centre of Excellence in Health Tech and Med Tech, GoK' },
      { label: 'Advisory', value: 'Bangalore Bio Innovation Centre · ARTPARK, IISc' },
      { label: 'Faculty', value: 'RGUHS Karnataka · PGIMER Chandigarh' },
      { label: 'Founder', value: 'Mediknit — 1M+ healthcare professionals across India, APAC & USA' },
    ],
    education: [
      { degree: 'MBBS (Radiology specialisation)', institution: '', year: '', achievement: '' },
      { degree: 'MBA', institution: '', year: '', achievement: '' },
    ],
    awards: [
      'Top 100 Healthcare Leaders — Global Listing, 2018',
      'Top 50 Smart Health Leaders — Global, 2018',
      'Namma Bengaluru Healthcare Professional of the Year, 2021',
      'Deccan Herald Covid Warrior Award, 2022',
      'Covid Warrior Award — St Joseph\'s University, 2022',
      'Speaker at multiple national and international conferences',
    ],
  },
]

const agendaRecords = [
  {
    id: 'session-registration',
    displayOrder: 1,
    title: 'Registration & Welcome Tea',
    startTime: '2026-07-27T09:45:00+05:30',
    endTime: '2026-07-27T10:30:00+05:30',
    track: null,
    type: 'break',
    description: '',
    speakerId: null,
    speakers: [],
  },
  {
    id: 'session-opening',
    displayOrder: 2,
    title: 'Opening — Introduction to Event & Event Flow',
    startTime: '2026-07-27T11:00:00+05:30',
    endTime: '2026-07-27T11:20:00+05:30',
    track: null,
    type: 'emcee',
    description: '',
    speakerId: null,
    speakers: [],
  },
  {
    id: 'session-keynote-1',
    displayOrder: 3,
    title: 'Keynote 1',
    startTime: '2026-07-27T11:20:00+05:30',
    endTime: '2026-07-27T11:40:00+05:30',
    track: 'Keynote',
    type: 'keynote',
    description: '',
    speakerId: null,
    speakers: [{ name: 'Dairo' }],
  },
  {
    id: 'session-keynote-2',
    displayOrder: 4,
    title: 'Keynote 2',
    startTime: '2026-07-27T11:45:00+05:30',
    endTime: '2026-07-27T11:55:00+05:30',
    track: 'Keynote',
    type: 'keynote',
    description: '',
    speakerId: 'speaker-dr-uma-nambiar',
    speakers: [],
  },
  {
    id: 'session-panel-1',
    displayOrder: 5,
    title: 'Panel 1 — Hospital & HealthTech',
    startTime: '2026-07-27T12:00:00+05:30',
    endTime: '2026-07-27T12:30:00+05:30',
    track: 'Panel',
    type: 'panel',
    description: '',
    speakerId: null,
    speakers: [
      { name: 'Dr. Ujjwala' },
      { name: 'Dr. Karamveer S Chhabra' },
      { name: 'Dr. Amit Raaj' },
    ],
  },
  {
    id: 'session-fireside',
    displayOrder: 6,
    title: 'Fireside Chat',
    startTime: '2026-07-27T12:35:00+05:30',
    endTime: '2026-07-27T12:50:00+05:30',
    track: 'Fireside',
    type: 'fireside',
    description: '',
    speakerId: null,
    speakers: [{ name: 'Dr. Bhaskar Charak' }],
  },
  {
    id: 'session-sponsor-1',
    displayOrder: 7,
    title: 'Sponsor Note 1',
    startTime: '2026-07-27T13:00:00+05:30',
    endTime: '2026-07-27T13:20:00+05:30',
    track: null,
    type: 'sponsor',
    description: '',
    speakerId: null,
    speakers: [{ name: 'Sanket Shah' }],
  },
  {
    id: 'session-lunch',
    displayOrder: 8,
    title: 'Lunch',
    startTime: '2026-07-27T13:20:00+05:30',
    endTime: '2026-07-27T13:45:00+05:30',
    track: null,
    type: 'break',
    description: '',
    speakerId: null,
    speakers: [],
  },
  {
    id: 'session-panel-2',
    displayOrder: 9,
    title: 'Panel 2 — The HealthTech Founder',
    startTime: '2026-07-27T13:40:00+05:30',
    endTime: '2026-07-27T14:00:00+05:30',
    track: 'Panel',
    type: 'panel',
    description: '',
    speakerId: null,
    speakers: [
      { name: 'Hosa Health' },
      { name: 'Rimidio' },
      { name: 'Prodoc' },
    ],
  },
  {
    id: 'session-pitch',
    displayOrder: 10,
    title: 'The 3-Minute Pitch — Live Engagement',
    startTime: '2026-07-27T14:00:00+05:30',
    endTime: '2026-07-27T15:00:00+05:30',
    track: 'Interactive',
    type: 'interactive',
    description: '',
    speakerId: null,
    speakers: [],
  },
  {
    id: 'session-panel-3',
    displayOrder: 11,
    title: 'Panel 3 — The VC: AI & Agents in Healthcare',
    startTime: '2026-07-27T15:00:00+05:30',
    endTime: '2026-07-27T15:30:00+05:30',
    track: 'Panel',
    type: 'panel',
    description: '',
    speakerId: null,
    speakers: [
      { name: 'Ashima', organization: 'Sorin' },
      { name: 'Anirudh', organization: 'Xceed' },
      { name: 'Shivani Kulkarni', organization: 'PrimeVP', speakerId: 'speaker-shivani-kulkarni' },
    ],
  },
  {
    id: 'session-hi-tea',
    displayOrder: 12,
    title: 'Hi-Tea',
    startTime: '2026-07-27T15:30:00+05:30',
    endTime: '2026-07-27T15:45:00+05:30',
    track: null,
    type: 'break',
    description: '',
    speakerId: null,
    speakers: [],
  },
  {
    id: 'session-panel-4',
    displayOrder: 13,
    title: 'Panel 4 — Regulation, Consent & the Law',
    startTime: '2026-07-27T15:50:00+05:30',
    endTime: '2026-07-27T16:10:00+05:30',
    track: 'Panel',
    type: 'panel',
    description: '',
    speakerId: null,
    speakers: [
      { name: 'Sneha Bhonsle', speakerId: 'speaker-sneha-bhonsle' },
    ],
  },
  {
    id: 'session-sponsor-2',
    displayOrder: 14,
    title: 'Sponsor Note 2',
    startTime: '2026-07-27T16:12:00+05:30',
    endTime: '2026-07-27T16:30:00+05:30',
    track: null,
    type: 'sponsor',
    description: '',
    speakerId: null,
    speakers: [],
  },
  {
    id: 'session-panel-5',
    displayOrder: 15,
    title: 'Panel 5 — AI in Healthcare Marketing',
    startTime: '2026-07-27T16:35:00+05:30',
    endTime: '2026-07-27T16:50:00+05:30',
    track: 'Panel',
    type: 'panel',
    description: '',
    speakerId: null,
    speakers: [
      { name: 'Samir Karpe' },
      { name: 'Kriti Yadav' },
      { name: 'Rahul Jain' },
    ],
  },
  {
    id: 'session-sponsor-3',
    displayOrder: 16,
    title: 'Sponsor Note 3',
    startTime: '2026-07-27T17:00:00+05:30',
    endTime: '2026-07-27T17:20:00+05:30',
    track: null,
    type: 'sponsor',
    description: '',
    speakerId: null,
    speakers: [],
  },
  {
    id: 'session-networking',
    displayOrder: 17,
    title: 'Networking & Booth',
    startTime: '2026-07-27T17:30:00+05:30',
    endTime: '2026-07-27T18:10:00+05:30',
    track: null,
    type: 'networking',
    description: '',
    speakerId: null,
    speakers: [],
  },
  {
    id: 'session-gala',
    displayOrder: 18,
    title: 'Gala & Standup',
    startTime: '2026-07-27T18:30:00+05:30',
    endTime: '2026-07-27T21:30:00+05:30',
    track: null,
    type: 'gala',
    description: '',
    speakerId: null,
    speakers: [],
  },
]

function sortByDisplayOrder(items) {
  return items.slice().sort((a, b) => a.displayOrder - b.displayOrder)
}

function buildSpeakerMap(speakers) {
  return new Map(speakers.map((speaker) => [speaker.id, speaker]))
}

function attachSpeakersToAgenda(agendaItems, speakerMap) {
  return sortByDisplayOrder(agendaItems).map((item) => ({
    ...item,
    speaker: item.speakerId ? speakerMap.get(item.speakerId) ?? null : null,
    speakers: (item.speakers || []).map((s) => {
      if (!s.speakerId) return s
      const record = speakerMap.get(s.speakerId)
      return record ? { ...s, photoUrl: record.photoUrl, title: record.title } : s
    }),
  }))
}

function attachSessionsToSpeakers(speakers, agendaItems) {
  const sessionsBySpeakerId = new Map()
  for (const item of agendaItems) {
    const addSession = (id) => {
      if (!sessionsBySpeakerId.has(id)) sessionsBySpeakerId.set(id, [])
      const list = sessionsBySpeakerId.get(id)
      if (!list.some((i) => i.id === item.id)) list.push(item)
    }
    if (item.speakerId) addSession(item.speakerId)
    for (const s of item.speakers ?? []) {
      if (s.speakerId) addSession(s.speakerId)
    }
  }
  return sortByDisplayOrder(speakers).map((speaker) => ({
    ...speaker,
    sessions: sessionsBySpeakerId.get(speaker.id) ?? [],
  }))
}

export function getEventData() {
  const speakers = sortByDisplayOrder(speakerRecords)
  const speakerMap = buildSpeakerMap(speakers)
  const agendaItems = attachSpeakersToAgenda(agendaRecords, speakerMap)

  return {
    speakers: attachSessionsToSpeakers(speakers, agendaItems),
    agendaItems,
  }
}

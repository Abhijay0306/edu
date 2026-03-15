import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Countries ────────────────────────────────────────────────────────────
  const germany = await prisma.country.upsert({
    where: { code: 'DE' },
    update: {
      visaProcess:
        'Student Visa (National Visa D) requires: (1) University admission letter, (2) Blocked account (Sperrkonto) with €11,208, (3) Valid health insurance, (4) APS certificate (for students from China, India, Vietnam), (5) Language proficiency proof. Apply at German embassy 3–4 months before start date. Processing takes 4–12 weeks.',
    },
    create: {
      name: 'Germany',
      code: 'DE',
      visaProcess:
        'Student Visa (National Visa D) requires: (1) University admission letter, (2) Blocked account (Sperrkonto) with €11,208, (3) Valid health insurance, (4) APS certificate (for students from China, India, Vietnam), (5) Language proficiency proof. Apply at German embassy 3–4 months before start date. Processing takes 4–12 weeks.',
    },
  });

  const usa = await prisma.country.upsert({
    where: { code: 'US' },
    update: {},
    create: {
      name: 'United States',
      code: 'US',
      visaProcess:
        'F-1 Student Visa: (1) Receive I-20 from SEVP-certified school, (2) Pay SEVIS fee ($350), (3) Complete DS-160 form, (4) Attend visa interview at US embassy, (5) Provide proof of funds. Processing: 2–8 weeks.',
    },
  });

  const uk = await prisma.country.upsert({
    where: { code: 'UK' },
    update: {},
    create: {
      name: 'United Kingdom',
      code: 'UK',
      visaProcess:
        'Student Visa (formerly Tier 4): (1) CAS from licensed university, (2) Proof of English (IELTS 6.0+), (3) Proof of funds (£1,334/month for 9 months in London), (4) Biometric enrolment. Apply via UK Visas and Immigration portal.',
    },
  });

  const canada = await prisma.country.upsert({
    where: { code: 'CA' },
    update: {},
    create: {
      name: 'Canada',
      code: 'CA',
      visaProcess:
        'Study Permit: (1) Letter of Acceptance from DLI, (2) Proof of funds ($10,000 CAD/year), (3) Biometrics, (4) Medical exam if required. Apply online. Processing: 4–12 weeks.',
    },
  });

  const australia = await prisma.country.upsert({
    where: { code: 'AU' },
    update: {},
    create: {
      name: 'Australia',
      code: 'AU',
      visaProcess:
        'Subclass 500 Student Visa: (1) Enrol in CRICOS-registered course, (2) Purchase OSHC health cover, (3) Provide proof of funds, (4) Meet English & character requirements. Apply online via ImmiAccount.',
    },
  });

  // ─── German Universities ────────────────────────────────────────────────
  interface UniversityInput {
    name: string;
    description: string;
    website: string;
    ranking: number;
    programs: Array<{
      title: string;
      level: string;
      field: string;
      tuitionFee: number;
      currency: string;
      durationYears: number;
      language: string;
      minGpa: number;
      minEnglish: number | null;
      extraReqs: string | null;
    }>;
  }

  const germanUniversities: UniversityInput[] = [
    {
      name: 'Technical University of Munich (TUM)',
      description:
        'Germany\'s top-ranked technical university and one of Europe\'s leading research institutions. Known for engineering, natural sciences, and computer science. QS World Rank: #37.',
      website: 'https://www.tum.de/en',
      ranking: 37,
      programs: [
        {
          title: 'MSc Informatics',
          level: 'Masters',
          field: 'Computer Science',
          tuitionFee: 1500,
          currency: 'EUR',
          durationYears: 2,
          language: 'English',
          minGpa: 3.3,
          minEnglish: 6.5,
          extraReqs:
            'Strong mathematical background required. TOEFL 88 or IELTS 6.5. Application deadline: May 31 (winter) / Nov 30 (summer). APS certificate required for Indian students.',
        },
        {
          title: 'MSc Electrical Engineering',
          level: 'Masters',
          field: 'Engineering',
          tuitionFee: 1500,
          currency: 'EUR',
          durationYears: 2,
          language: 'English',
          minGpa: 3.3,
          minEnglish: 6.5,
          extraReqs:
            'BSc in Electrical Engineering or related field. IELTS 6.5 or TOEFL 88. Motivation letter and CV required.',
        },
        {
          title: 'MSc Management',
          level: 'Masters',
          field: 'Business',
          tuitionFee: 1500,
          currency: 'EUR',
          durationYears: 2,
          language: 'English',
          minGpa: 3.5,
          minEnglish: 7.0,
          extraReqs:
            'GMAT/GRE required (preferred 700+ GMAT). 2+ years work experience preferred. IELTS 7.0 or TOEFL 100.',
        },
      ],
    },
    {
      name: 'Ludwig Maximilian University of Munich (LMU)',
      description:
        'One of Germany\'s oldest universities (founded 1472) and a member of the Elite Network of Bavaria. Renowned for humanities, natural sciences, and medicine. QS World Rank: #63.',
      website: 'https://www.en.uni-muenchen.de',
      ranking: 63,
      programs: [
        {
          title: 'MSc Physics',
          level: 'Masters',
          field: 'Natural Sciences',
          tuitionFee: 1800,
          currency: 'EUR',
          durationYears: 2,
          language: 'English',
          minGpa: 3.5,
          minEnglish: 6.5,
          extraReqs:
            'BSc in Physics or closely related field. Research experience preferred. IELTS 6.5. Classes taught in English/German mix.',
        },
        {
          title: 'MSc Data Science',
          level: 'Masters',
          field: 'Computer Science',
          tuitionFee: 1800,
          currency: 'EUR',
          durationYears: 2,
          language: 'English',
          minGpa: 3.3,
          minEnglish: 6.5,
          extraReqs:
            'Strong statistics, programming (Python/R) background. IELTS 6.5 or TOEFL 88. Portfolio of data projects advantageous.',
        },
      ],
    },
    {
      name: 'RWTH Aachen University',
      description:
        'Germany\'s largest technical university and consistently ranked among Europe\'s top engineering schools. Strong industry connections with companies like Ford, Ericsson, and BASF. QS World Rank: #106.',
      website: 'https://www.rwth-aachen.de/go/id/a/?lidx=1',
      ranking: 106,
      programs: [
        {
          title: 'MSc Mechanical Engineering',
          level: 'Masters',
          field: 'Engineering',
          tuitionFee: 1800,
          currency: 'EUR',
          durationYears: 2,
          language: 'English',
          minGpa: 3.0,
          minEnglish: 6.0,
          extraReqs:
            'BSc in Mechanical Engineering or equivalent. Good German is a plus as some modules may be in German. IELTS 6.0 or TOEFL 80.',
        },
        {
          title: 'MSc Computer Science',
          level: 'Masters',
          field: 'Computer Science',
          tuitionFee: 1800,
          currency: 'EUR',
          durationYears: 2,
          language: 'English',
          minGpa: 3.0,
          minEnglish: 6.0,
          extraReqs:
            'Strong programming skills required. IELTS 6.0 or TOEFL 80. Submission of bachelor\'s transcript and motivation letter.',
        },
      ],
    },
    {
      name: 'Heidelberg University',
      description:
        'Germany\'s oldest university (founded 1386) and one of Europe\'s most prestigious. Strong in life sciences, humanities, and law. 3 Nobel laureates affiliated. QS World Rank: #87.',
      website: 'https://www.uni-heidelberg.de/en',
      ranking: 87,
      programs: [
        {
          title: 'MSc Molecular Biosciences',
          level: 'Masters',
          field: 'Life Sciences',
          tuitionFee: 1500,
          currency: 'EUR',
          durationYears: 2,
          language: 'English',
          minGpa: 3.5,
          minEnglish: 7.0,
          extraReqs:
            'BSc in Biology, Biochemistry, or related. IELTS 7.0 or TOEFL 100. Research proposal may be required. Fully English-taught program.',
        },
      ],
    },
    {
      name: 'TU Berlin (Technische Universität Berlin)',
      description:
        'One of Germany\'s largest technical universities, located in the vibrant capital city. Known for engineering, architecture, economics, and CS. Strong startup ecosystem nearby. QS World Rank: #154.',
      website: 'https://www.tu.berlin/en',
      ranking: 154,
      programs: [
        {
          title: 'MSc Computer Engineering',
          level: 'Masters',
          field: 'Engineering',
          tuitionFee: 1500,
          currency: 'EUR',
          durationYears: 2,
          language: 'English',
          minGpa: 3.0,
          minEnglish: 6.5,
          extraReqs:
            'BSc in Computer Engineering, CS, or equivalent. IELTS 6.5 or TOEFL 92. Significant programming coursework required.',
        },
        {
          title: 'MSc Information Systems Management',
          level: 'Masters',
          field: 'Business',
          tuitionFee: 1500,
          currency: 'EUR',
          durationYears: 2,
          language: 'English',
          minGpa: 3.0,
          minEnglish: 6.5,
          extraReqs:
            'Background in Business/IS preferred. IELTS 6.5 or TOEFL 92. Covers data analytics, ERP, IT management.',
        },
      ],
    },
    {
      name: 'Karlsruhe Institute of Technology (KIT)',
      description:
        'Formed by merger of University of Karlsruhe and Forschungszentrum Karlsruhe. Top institution for natural sciences and engineering. Excellent research output and industry ties. QS World Rank: #119.',
      website: 'https://www.kit.edu/english',
      ranking: 119,
      programs: [
        {
          title: 'MSc Robotics and Autonomous Systems',
          level: 'Masters',
          field: 'Engineering',
          tuitionFee: 1500,
          currency: 'EUR',
          durationYears: 2,
          language: 'English',
          minGpa: 3.3,
          minEnglish: 6.5,
          extraReqs:
            'BSc in Computer Science, Electrical Engineering, or Mechatronics. IELTS 6.5 or TOEFL 88. Strong background in mathematics and programming.',
        },
        {
          title: 'MSc Electrical Engineering and Information Technology',
          level: 'Masters',
          field: 'Engineering',
          tuitionFee: 1500,
          currency: 'EUR',
          durationYears: 2,
          language: 'English',
          minGpa: 3.0,
          minEnglish: 6.0,
          extraReqs:
            'BSc in Electrical Engineering or related. IELTS 6.0 or TOEFL 80. Labs and seminars may require basic German.',
        },
      ],
    },
  ];

  for (const u of germanUniversities) {
    const { programs, ...uniData } = u;
    // Delete existing programs for this uni to avoid duplication
    const existingUni = await prisma.university.findFirst({
      where: { name: u.name, countryId: germany.id },
    });
    if (existingUni) {
      await prisma.university.update({
        where: { id: existingUni.id },
        data: { description: uniData.description, website: uniData.website, ranking: uniData.ranking },
      });
      // skip re-adding programs
      continue;
    }
    const uni = await prisma.university.create({
      data: { ...uniData, countryId: germany.id },
    });
    for (const p of programs) {
      const { minGpa, minEnglish, extraReqs, ...progData } = p;
      await prisma.program.create({
        data: {
          ...progData,
          universityId: uni.id,
          requirements: { create: { minGpa, minEnglish, extraReqs } },
        },
      });
    }
  }

  // ─── Other top universities (skip if already exist) ──────────────────────
  interface OtherUniInput {
    name: string;
    country: typeof usa | typeof uk | typeof canada | typeof australia;
    description: string;
    website: string;
    ranking: number;
    programs: Array<{
      title: string;
      level: string;
      field: string;
      tuitionFee: number;
      durationYears: number;
      minGpa: number;
      minEnglish: number;
      extraReqs: string | null;
    }>;
  }

  const otherUniversities: OtherUniInput[] = [
    {
      name: 'Massachusetts Institute of Technology',
      country: usa,
      description: 'World\'s #1 ranked university for engineering and technology. Located in Cambridge, MA. Known for innovation and research excellence.',
      website: 'https://mit.edu',
      ranking: 1,
      programs: [
        { title: 'MS Computer Science', level: 'Masters', field: 'Computer Science', tuitionFee: 57986, durationYears: 2, minGpa: 3.9, minEnglish: 7.5, extraReqs: 'GRE required. Research statement essential.' },
        { title: 'BS Electrical Engineering', level: 'Undergraduate', field: 'Engineering', tuitionFee: 57986, durationYears: 4, minGpa: 3.8, minEnglish: 7.0, extraReqs: null },
      ],
    },
    {
      name: 'Stanford University',
      country: usa,
      description: 'Leading private research university in Silicon Valley. Top programs in AI, entrepreneurship, and engineering.',
      website: 'https://stanford.edu',
      ranking: 5,
      programs: [
        { title: 'MS Artificial Intelligence', level: 'Masters', field: 'Computer Science', tuitionFee: 62484, durationYears: 2, minGpa: 3.8, minEnglish: 7.5, extraReqs: 'Research experience preferred.' },
      ],
    },
    {
      name: 'University of Oxford',
      country: uk,
      description: 'Oldest English-language university, founded c. 1096. Globally prestigious across all disciplines.',
      website: 'https://ox.ac.uk',
      ranking: 3,
      programs: [
        { title: 'MSc Computer Science', level: 'Masters', field: 'Computer Science', tuitionFee: 38400, durationYears: 1, minGpa: 3.7, minEnglish: 7.5, extraReqs: null },
        { title: 'MSc Software and Systems Security', level: 'Masters', field: 'Computer Science', tuitionFee: 38400, durationYears: 1, minGpa: 3.7, minEnglish: 7.5, extraReqs: null },
      ],
    },
    {
      name: 'University of Toronto',
      country: canada,
      description: 'Canada\'s top research university. Offers diverse programs with strong international community.',
      website: 'https://utoronto.ca',
      ranking: 21,
      programs: [
        { title: 'MEng Electrical & Computer Engineering', level: 'Masters', field: 'Engineering', tuitionFee: 32000, durationYears: 1, minGpa: 3.3, minEnglish: 7.0, extraReqs: null },
        { title: 'BSc Computer Science', level: 'Undergraduate', field: 'Computer Science', tuitionFee: 46000, durationYears: 4, minGpa: 3.0, minEnglish: 6.5, extraReqs: null },
      ],
    },
    {
      name: 'University of Melbourne',
      country: australia,
      description: 'Australia\'s leading research university. Strong in arts, sciences, and professional disciplines.',
      website: 'https://unimelb.edu.au',
      ranking: 33,
      programs: [
        { title: 'Master of Data Science', level: 'Masters', field: 'Computer Science', tuitionFee: 51000, durationYears: 2, minGpa: 3.0, minEnglish: 7.0, extraReqs: null },
      ],
    },
  ];

  for (const u of otherUniversities) {
    const { programs, country, ...uniData } = u;
    const existing = await prisma.university.findFirst({
      where: { name: u.name, countryId: country.id },
    });
    if (existing) {
      await prisma.university.update({ where: { id: existing.id }, data: { description: uniData.description, ranking: uniData.ranking } });
      continue;
    }
    const uni = await prisma.university.create({ data: { ...uniData, countryId: country.id } });
    for (const p of programs) {
      const { minGpa, minEnglish, extraReqs, ...progData } = p;
      await prisma.program.create({
        data: {
          ...progData,
          universityId: uni.id,
          requirements: { create: { minGpa, minEnglish, extraReqs } },
        },
      });
    }
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

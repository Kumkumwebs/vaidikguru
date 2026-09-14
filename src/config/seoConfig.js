/**
 * seoConfig.js - Centralized SEO data for every page on VaidikGuru
 * Import the relevant config in each page component and pass to useSEO()
 */

export const SEO = {

  // -- HOME ------------------------------------------------------------------
  home: {
    title: 'Online Puja Booking, Chadhava & Expert Astrology Services',
    description:
      'VaidikGuru offers authentic online Puja booking, sacred Chadhava at ancient temples, and personalized Vedic Astrology consultations. Experience true spirituality from home.',
    keywords:
      'online puja booking, vedic astrology, temple chadhava, puja service india, VaidikGuru',
    canonical: '/',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'VaidikGuru',
      url: 'https://vaidikguru.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://vaidikguru.com/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
  },

  // -- PUJA ------------------------------------------------------------------
  puja: {
    title: 'Book Online Puja Services - Authentic Vedic Rituals',
    description:
      'Book online puja services performed by experienced Vedic priests. Choose from Satyanarayan Puja, Navgraha Puja, Shanti Puja, Griha Pravesh and 50+ rituals.',
    keywords:
      'online puja booking, satyanarayan puja, navgraha puja, shanti puja, griha pravesh puja, vedic puja service',
    canonical: '/puja',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Religious Ritual / Puja',
      provider: {
        '@type': 'ReligiousOrganization',
        name: 'VaidikGuru',
        url: 'https://vaidikguru.com',
      },
      name: 'Online Puja Booking',
      description:
        'Authentic Vedic pujas performed by experienced priests for auspicious occasions.',
      url: 'https://vaidikguru.com/puja',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
      },
    },
  },

  // -- CHADHAVA --------------------------------------------------------------
  chadhava: {
    title: 'Online Chadhava - Sacred Temple Offerings at Kashi & More',
    description:
      "Offer sacred Chadhava at India's most powerful temples without visiting in person. VaidikGuru arranges Prasad and offerings at Kashi Vishwanath, Shirdi, Tirupati, and more.",
    keywords:
      'online chadhava, temple offeringe, kashi vishwanath chadhava, shirdi offering, prasad delivery, temple prasad online',
    canonical: '/chadhava',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Temple Chadhava / Sacred Offerings',
      provider: {
        '@type': 'ReligiousOrganization',
        name: 'VaidikGuru',
        url: 'https://vaidikguru.com',
      },
      name: 'Online Chadhava Service',
      description:
        'We arrange sacred temple offerings (Chadhava) on your behalf at top Hindu temples across India.',
      url: 'https://vaidikguru.com/chadhava',
    },
  },

  // -- ASTROLOGER CONSULTATION -----------------------------------------------
  astrology: {
    title: 'Talk to Astrologer Online - Vedic & Kundli Consultation',
    description:
      'Consult expert Vedic astrologers online for life guidance. Get personalized Kundli analysis, career, marriage, and health predictions from certified Jyotish experts.',
    keywords:
      'talk to astrologer online, vedic astrology consultation, kundli analysis, jyotish expert, online astrology, kundli matching, career astrology',
    canonical: '/astrologer',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Astrology Consultation',
      provider: {
        '@type': 'ReligiousOrganization',
        name: 'VaidikGuru',
        url: 'https://vaidikguru.com',
      },
      name: 'Online Astrologer Consultation',
      description:
        'Connect with certified Vedic astrologers for personalized Kundli, marriage, and life guidance.',
      url: 'https://vaidikguru.com/astrologer',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
      },
    },
  },

  // -- LIVE ASTROLOGERS ------------------------------------------------------
  liveAstrologers: {
    title: 'Live Astrologers - Watch Live Stream & Consult Online',
    description:
      'Watch live Vedic astrologers stream in real-time. Ask questions, get quick live guidance and consult top certified astrologers online.',
    keywords: 'live astrologer, live astrology stream, talk to astrologer live, online jyotish live',
    canonical: '/live-astrologer',
  },

  // -- DARSHAN ---------------------------------------------------------------
  darshan: {
    title: 'Online Temple Darshan - Live Aarti & Virtual Darshan',
    description:
      'Experience divine blessings with live temple Darshan and Aarti streaming. Book virtual darshan at Kashi Vishwanath, Vaishno Devi, Tirupati, and top Hindu temples.',
    keywords:
      'online darshan, virtual temple darshan, live aarti, kashi vishwanath darshan, vaishno devi darshan, tirupati online darshan',
    canonical: '/darshan',
  },

  // -- HOROSCOPE -------------------------------------------------------------
  horoscope: {
    title: 'Free Daily Horoscope & Kundli - Vedic Rashifal',
    description:
      'Get your free daily, weekly, and yearly horoscope. Generate personalized Kundli (birth chart) and Rashifal based on Vedic astrology principles.',
    keywords:
      'daily horoscope, free kundli, rashifal, vedic horoscope, birth chart online, kundli matching free, daily panchang',
    canonical: '/horoscope',
  },

  // -- PANCHANG --------------------------------------------------------------
  panchang: {
    title: 'Daily Panchang - Tithi, Nakshatra, Muhurat & Rahu Kaal',
    description:
      "Check today's Hindu Panchang with Tithi, Nakshatra, Yoga, Karana, Shubh Muhurat, Rahu Kaal, and Choghadiya for any city in India.",
    keywords:
      'daily panchang, today panchang, shubh muhurat, rahu kaal, tithi nakshatra, hindu calendar',
    canonical: '/panchang',
  },

  // -- ASTROLOGY TOOLS & CALCULATORS -----------------------------------------
  astrologyTools: {
    title: 'Free Astrology Tools & Vedic Calculators',
    description: 'Explore free Vedic astrology calculators including Mangal Dosh, Nakshatra Finder, Love Calculator, Numerology, and Rashi finders.',
    keywords: 'astrology tools, vedic calculators, free astrology calculator, kundli tools',
    canonical: '/astrology_calculator_hub',
  },
  mangalDosh: {
    title: 'Mangal Dosh Calculator - Check Manglik Dosh Online',
    description: 'Calculate Mangal Dosh in your birth chart instantly. Get detailed Manglik Dosh analysis and remedies from Vedic Astrology.',
    keywords: 'mangal dosh calculator, manglik dosh check, manglik remedies, online kundli dosh',
    canonical: '/mangal_dosh_calculator',
  },
  loveCalculator: {
    title: 'Love & Horoscope Compatibility Calculator',
    description: 'Check love compatibility based on zodiac signs and Vedic astrology parameters. Free online love matching tool.',
    keywords: 'love calculator, zodiac compatibility, love matching astrology, relationship calculator',
    canonical: '/love_calculator',
  },
  nakshatraFinder: {
    title: 'Nakshatra Finder - Find Your Birth Star Online',
    description: 'Calculate your Janma Nakshatra (birth star) based on date, time, and place of birth.',
    keywords: 'nakshatra finder, birth star calculator, janma nakshatra, vedic nakshatra',
    canonical: '/nakshatra_finder',
  },
  janmRashiFinder: {
    title: 'Janm Rashi Finder - Find Your Moon Sign Online',
    description: 'Discover your authentic Vedic Moon Sign (Janm Rashi) easily with birth details.',
    keywords: 'janm rashi finder, moon sign calculator, rashi calculator, birth rashi',
    canonical: '/janm_rashi_finder',
  },
  mobileNumerology: {
    title: 'Mobile Number Numerology Calculator',
    description: 'Analyze the energy and luck of your mobile phone number using Chaldean & Vedic numerology principles.',
    keywords: 'mobile number numerology, lucky phone number calculator, numerology calculator',
    canonical: '/mobile_numerology_calculator',
  },
  destinyNumber: {
    title: 'Destiny Number Calculator - Life Path Numerology',
    description: 'Calculate your Destiny Number (Bhagyank) and unlock key insights about your life journey.',
    keywords: 'destiny number calculator, bhagyank calculator, life path number, numerology',
    canonical: '/destiny_number_calculator',
  },
  friendshipCalculator: {
    title: 'Friendship Compatibility Calculator',
    description: 'Test friendship compatibility between two people using zodiac astrological analysis.',
    keywords: 'friendship calculator, friend compatibility, zodiac friendship matching',
    canonical: '/friendship_calculator',
  },

  // -- ABOUT & CONTACT -------------------------------------------------------
  about: {
    title: "About VaidikGuru - India's Trusted Spiritual Platform",
    description:
      "Learn about VaidikGuru's mission to make authentic Hindu spiritual services accessible to everyone. We connect devotees with verified priests and astrologers.",
    keywords: 'about vaidikguru, online spiritual platform india, vedic services online',
    canonical: '/about_us',
  },
  contact: {
    title: 'Contact VaidikGuru - Support & Customer Care',
    description:
      "Reach out to VaidikGuru for help booking pujas, chadhava, darshan, or astrology consultations. We're here to guide your spiritual journey.",
    keywords: 'contact vaidikguru, vaidikguru support, book puja help',
    canonical: '/contact_us',
  },

  // -- USER DASHBOARD & UTILITIES --------------------------------------------
  orders: {
    title: 'My Orders & Transaction History',
    description: 'View your booked Pujas, Chadhava, Call/Chat history and transaction details on VaidikGuru.',
    canonical: '/orders',
  },
  profile: {
    title: 'My Account & Profile Settings',
    description: 'Manage your personal profile, saved Kundli details, and account settings on VaidikGuru.',
    canonical: '/profile',
  },
  blog: {
    title: 'Spiritual Blog - Vedic Astrology, Puja & Ritual Insights',
    description: 'Read insightful articles on Vedic rituals, astrology remedies, temple histories, and Panchang updates.',
    canonical: '/blog',
  },
  careers: {
    title: 'Careers at VaidikGuru - Join Our Team',
    description: "Explore career opportunities at VaidikGuru and help us build India's leading spiritual platform.",
    canonical: '/careers',
  },
  terms: {
    title: 'Terms & Conditions',
    description: 'Terms and conditions governing the use of VaidikGuru services and website.',
    canonical: '/terms_of_use',
  },
  privacy: {
    title: 'Privacy Policy',
    description: "Read VaidikGuru's privacy policy regarding data protection and user privacy.",
    canonical: '/privacy_policy',
  },
  help: {
    title: 'Help Center & FAQs',
    description: 'Find answers to frequently asked questions about booking pujas, consultations, and refunds.',
    canonical: '/help',
  },
  security: {
    title: 'Security & Privacy Assurance',
    description: 'Learn about VaidikGuru security standards, payment safety, and data confidentiality.',
    canonical: '/security',
  },
  cancellation: {
    title: 'Cancellation & Refund Policy',
    description: "Read VaidikGuru's clear policy regarding booking cancellations and refunds.",
    canonical: '/cancellation_refund_policy',
  },
  cancellationAndRefund: {
    title: 'Cancellation & Refund Policy',
    description: "Read VaidikGuru's clear policy regarding booking cancellations and refunds.",
    canonical: '/cancellation_refund_policy',
  },
  astrologerRegistration: {
    title: 'Astrologer Registration - Join VaidikGuru as an Expert',
    description: 'Register as a certified Vedic astrologer on VaidikGuru. Expand your reach and guide thousands of devotees online.',
    canonical: '/astrologer_registration',
  },
  pujaLive: {
    title: 'Live Puja Streaming & Virtual Darshan',
    description: 'Watch your booked puja live stream, send blessings, and participate in sacred rituals in real-time.',
  },
};

export default SEO;
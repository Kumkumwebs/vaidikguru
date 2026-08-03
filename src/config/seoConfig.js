/**
 * seoConfig.js — Centralized SEO data for every page on DivinIQ
 * Import the relevant config in each page component and pass to useSEO()
 */

export const SEO = {

    // ── HOME ──────────────────────────────────────────────────────────────────
    home: {
      title: 'Online Puja Booking, Chadhava & Expert Astrology Services',
      description:
        'DivinIQ offers authentic online Puja booking, sacred Chadhava at ancient temples, and personalized Vedic Astrology consultations. Experience true spirituality from home.',
      keywords:
        'online puja booking, vedic astrology, temple chadhava, puja service india, DivinIQ',
      canonical: '/',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'DivinIQ',
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
  
    // ── PUJA ──────────────────────────────────────────────────────────────────
    puja: {
      title: 'Book Online Puja Services – Authentic Vedic Rituals',
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
          name: 'DivinIQ',
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
  
    // ── CHADHAVA ──────────────────────────────────────────────────────────────
    chadhava: {
      title: 'Online Chadhava – Sacred Temple Offerings at Kashi & More',
      description:
        "Offer sacred Chadhava at India's most powerful temples without visiting in person. DivinIQ arranges Prasad and offerings at Kashi Vishwanath, Shirdi, Tirupati, and more.",
      keywords:
        'online chadhava, temple offering, kashi vishwanath chadhava, shirdi offering, prasad delivery, temple prasad online',
      canonical: '/chadhava',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Temple Chadhava / Sacred Offerings',
        provider: {
          '@type': 'ReligiousOrganization',
          name: 'DivinIQ',
          url: 'https://vaidikguru.com',
        },
        name: 'Online Chadhava Service',
        description:
          'We arrange sacred temple offerings (Chadhava) on your behalf at top Hindu temples across India.',
        url: 'https://vaidikguru.com/chadhava',
      },
    },
  
    // ── ASTROLOGER CONSULTATION ───────────────────────────────────────────────
    astrology: {
      title: 'Talk to Astrologer Online – Vedic & Kundli Consultation',
      description:
        'Consult expert Vedic astrologers online for life guidance. Get personalized Kundli analysis, career, marriage, and health predictions from certified Jyotish experts.',
      keywords:
        'talk to astrologer online, vedic astrology consultation, kundli analysis, jyotish expert, online astrology, kundli matching, career astrology',
      canonical: '/astrology',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Astrology Consultation',
        provider: {
          '@type': 'ReligiousOrganization',
          name: 'DivinIQ',
          url: 'https://vaidikguru.com',
        },
        name: 'Online Astrologer Consultation',
        description:
          'Connect with certified Vedic astrologers for personalized Kundli, marriage, and life guidance.',
        url: 'https://vaidikguru.com/astrology',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
        },
      },
    },
  
    // ── DARSHAN ───────────────────────────────────────────────────────────────
    darshan: {
      title: 'Online Temple Darshan – Live Aarti & Virtual Darshan',
      description:
        'Experience divine blessings with live temple Darshan and Aarti streaming. Book virtual darshan at Kashi Vishwanath, Vaishno Devi, Tirupati, and top Hindu temples.',
      keywords:
        'online darshan, virtual temple darshan, live aarti, kashi vishwanath darshan, vaishno devi darshan, tirupati online darshan',
      canonical: '/darshan',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Virtual Temple Darshan',
        provider: {
          '@type': 'ReligiousOrganization',
          name: 'DivinIQ',
          url: 'https://vaidikguru.com',
        },
        name: 'Online Temple Darshan',
        description:
          'Book live and virtual temple darshan from top Hindu temples across India.',
        url: 'https://vaidikguru.com/darshan',
      },
    },
  
    // ── HOROSCOPE ─────────────────────────────────────────────────────────────
    horoscope: {
      title: 'Free Daily Horoscope & Kundli – Vedic Rashifal 2025',
      description:
        'Get your free daily, weekly, and yearly horoscope. Generate personalized Kundli (birth chart) and Rashifal based on Vedic astrology principles.',
      keywords:
        'daily horoscope, free kundli, rashifal 2025, vedic horoscope, birth chart online, kundli matching free, daily panchang',
      canonical: '/horoscope',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Free Vedic Horoscope & Kundli',
        url: 'https://vaidikguru.com/horoscope',
        description:
          'Daily, weekly, and yearly Vedic horoscope with free Kundli generation.',
        provider: {
          '@type': 'ReligiousOrganization',
          name: 'DivinIQ',
        },
      },
    },
  
    // ── PANCHANG ──────────────────────────────────────────────────────────────
    panchang: {
      title: 'Daily Panchang – Tithi, Nakshatra, Muhurat & Rahu Kaal',
      description:
        "Check today's Hindu Panchang with Tithi, Nakshatra, Yoga, Karana, Shubh Muhurat, Rahu Kaal, and Choghadiya for any city in India.",
      keywords:
        'daily panchang, today panchang, shubh muhurat, rahu kaal, tithi nakshatra, hindu calendar 2025',
      canonical: '/panchang',
    },
  
    // ── ABOUT ─────────────────────────────────────────────────────────────────
    about: {
      title: "About DivinIQ – India's Trusted Spiritual Services Platform",
      description:
        "Learn about DivinIQ's mission to make authentic Hindu spiritual services accessible to everyone. We connect devotees with verified priests and astrologers.",
      keywords: 'about diviniq, online spiritual platform india, vedic services online',
      canonical: '/about',
    },
  
    // ── CONTACT ───────────────────────────────────────────────────────────────
    contact: {
      title: 'Contact DivinIQ – Get Support for Puja & Astrology Services',
      description:
        "Reach out to DivinIQ for help booking pujas, chadhava, darshan, or astrology consultations. We're here to guide your spiritual journey.",
      keywords: 'contact diviniq, diviniq support, book puja help',
      canonical: '/contact',
    },
  };
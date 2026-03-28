/**
 * Estate Agent Brochure Style Research
 * Compiled March 2026 from brand guidelines, web research, and visual analysis.
 *
 * Each agent profile contains verified brand data where available,
 * supplemented with visual analysis from live websites and published materials.
 */

export interface AgentBrochureStyle {
  name: string;
  brandColors: {
    primary: string;
    secondary: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  typography: {
    style: "serif" | "sans-serif" | "mixed";
    headingFont: string;
    bodyFont: string;
    fallbackHeading: string;
    fallbackBody: string;
  };
  layout: {
    approach: string;
    imageWeight: "heavy" | "balanced" | "light";
    density: "minimal" | "moderate" | "dense";
  };
  distinctiveElements: string[];
  aesthetic: string;
  templateCategory: "traditional-luxury" | "modern-minimal" | "editorial" | "corporate-premium" | "boutique-artisan" | "heritage-classic";
}

export const estateAgentStyles: AgentBrochureStyle[] = [
  // ─────────────────────────────────────────────
  // 1. KNIGHT FRANK
  // ─────────────────────────────────────────────
  {
    name: "Knight Frank",
    brandColors: {
      primary: "#D50032",    // KF Red (Pantone 199 C) — RGB 213, 0, 50
      secondary: "#064F50",  // KF Green (Pantone 7476 C) — RGB 6, 79, 80
      accent: "#000000",
      background: "#FFFFFF",
      text: "#000000",
    },
    typography: {
      style: "mixed",
      headingFont: "Domaine Display",    // residential
      bodyFont: "Suisse Int'l",          // primary sans-serif
      fallbackHeading: "Times New Roman",
      fallbackBody: "Arial",
      // Also uses Romain Headline for commercial/corporate
    },
    layout: {
      approach: "Confident and structured. Large hero images with red accent details. Title case headings. Red full stops used sparingly as a signature mark. Clear grid with generous margins scaled to page size.",
      imageWeight: "heavy",
      density: "minimal",
    },
    distinctiveElements: [
      "Red full stop after tagline and key phrases (max 3 per page)",
      "Staff names always highlighted in red",
      "Knight Frank name highlighted in red within body copy",
      "Tagline: 'Connecting people & property, perfectly.'",
      "Logo always in red; white or black only when red won't work",
      "No solid red backgrounds or front covers",
      "Residential uses Domaine Display serif; commercial uses Romain Headline",
    ],
    aesthetic: "Confident, polished, institutional",
    templateCategory: "corporate-premium",
  },

  // ─────────────────────────────────────────────
  // 2. SAVILLS
  // ─────────────────────────────────────────────
  {
    name: "Savills",
    brandColors: {
      primary: "#CE171E",    // Savills Red
      secondary: "#FFE850",  // Savills Yellow accent
      accent: "#000000",
      background: "#FFFFFF",
      text: "#1A1A1A",
    },
    typography: {
      style: "sans-serif",
      headingFont: "Savills Custom Sans",  // bold sans-serif wordmark style
      bodyFont: "Savills Custom Sans",
      fallbackHeading: "Helvetica Neue",
      fallbackBody: "Helvetica",
    },
    layout: {
      approach: "Bold colour-blocking with red and yellow. Clean, corporate layouts with strong grid structures. Photography-led with minimal decorative elements. High visual consistency across all 200+ offices worldwide.",
      imageWeight: "heavy",
      density: "moderate",
    },
    distinctiveElements: [
      "Bold red and yellow colour blocking, not gradients",
      "Strong sans-serif wordmark logo as centrepiece",
      "Straightforward, no-frills visual presentation",
      "Global consistency across all markets",
      "Data-driven market reports with infographic elements",
    ],
    aesthetic: "Bold, corporate, authoritative",
    templateCategory: "corporate-premium",
  },

  // ─────────────────────────────────────────────
  // 3. STRUTT & PARKER
  // ─────────────────────────────────────────────
  {
    name: "Strutt & Parker",
    brandColors: {
      primary: "#2D5F2D",    // Heritage green (approx from brand materials)
      secondary: "#1A3A1A",  // Darker green
      accent: "#FFFFFF",
      background: "#FFFFFF",
      text: "#2C2C2C",
    },
    typography: {
      style: "sans-serif",
      headingFont: "Strutt Custom Sans",
      bodyFont: "Clean sans-serif",
      fallbackHeading: "Helvetica Neue",
      fallbackBody: "Arial",
    },
    layout: {
      approach: "Contemporary take on classic British themes. Photography dominates with clean white backgrounds. Rural and urban properties get differentiated treatment. Minimalist navigation with 'Property is personal' messaging. BNP Paribas parent brand appears subtly.",
      imageWeight: "heavy",
      density: "minimal",
    },
    distinctiveElements: [
      "Heritage brand since 1885 with countryside and rural expertise",
      "Juxtaposition of rural and urban visual themes",
      "Contemporary design with classic British nods",
      "Green brand colour reflects land and farming roots",
      "BNP Paribas co-branding in footer/secondary position",
      "Personal, human-centred copy style",
    ],
    aesthetic: "British heritage, contemporary country",
    templateCategory: "heritage-classic",
  },

  // ─────────────────────────────────────────────
  // 4. HAMPTONS
  // ─────────────────────────────────────────────
  {
    name: "Hamptons",
    brandColors: {
      primary: "#1B2A4A",    // Deep rich blue
      secondary: "#FF6B5A",  // Electric coral accent
      accent: "#FF6B5A",
      background: "#FFFFFF",
      text: "#1B2A4A",
    },
    typography: {
      style: "serif",
      headingFont: "Stencilled Serif",   // custom stencil serif for logotype
      bodyFont: "Contemporary sans-serif",
      fallbackHeading: "Georgia",
      fallbackBody: "Helvetica Neue",
      // Calligraphic 'h' in logo adds humanity
    },
    layout: {
      approach: "Warm, multi-layered identity that blends heritage reassurance with contemporary playfulness. Photography focuses on homes and relationships rather than just properties. 'The Home Experts' strapline in electric coral beneath the logotype.",
      imageWeight: "heavy",
      density: "moderate",
    },
    distinctiveElements: [
      "Stencilled serif logotype with calligraphic 'h' icon",
      "Electric coral accent colour against deep blue",
      "'Rooted Progressive' brand position: heritage meets mould-breaking",
      "Photography shows people and home life, not just empty rooms",
      "Playful, cheekily warm tone of voice",
      "150+ years of heritage visually referenced",
    ],
    aesthetic: "Warm, progressive, distinguished",
    templateCategory: "heritage-classic",
  },

  // ─────────────────────────────────────────────
  // 5. FOXTONS
  // ─────────────────────────────────────────────
  {
    name: "Foxtons",
    brandColors: {
      primary: "#017163",    // Foxtons Cyan/Teal
      secondary: "#FFF000",  // Foxtons Gold/Yellow
      accent: "#FFF000",
      background: "#FFFFFF",
      text: "#1A1A1A",
    },
    typography: {
      style: "sans-serif",
      headingFont: "Foxtons Custom Sans",  // clean, modern sans-serif
      bodyFont: "Foxtons Custom Sans",
      fallbackHeading: "Helvetica",
      fallbackBody: "Arial",
    },
    layout: {
      approach: "High-energy, modern London-focused design. Teal and gold create strong visual identity. Rectangular badge logo format. Clean layouts optimised for digital-first presentation. Young professional target audience.",
      imageWeight: "balanced",
      density: "moderate",
    },
    distinctiveElements: [
      "Distinctive teal green and gold colour pairing",
      "Roundel 'F' logo since 1991",
      "Digital-first approach with video and interactive elements",
      "Bold, energetic brand voice targeting young London professionals",
      "Strong colour consistency across all touchpoints",
      "Rectangular badge logo format",
    ],
    aesthetic: "Energetic, modern, urban",
    templateCategory: "modern-minimal",
  },

  // ─────────────────────────────────────────────
  // 6. WINKWORTH
  // ─────────────────────────────────────────────
  {
    name: "Winkworth",
    brandColors: {
      primary: "#1C1C39",    // Dark navy
      secondary: "#C18948",  // Gold accent
      accent: "#C18948",
      background: "#FBF7F3", // Warm off-white/cream
      text: "#1C1C39",
    },
    typography: {
      style: "sans-serif",
      headingFont: "FS Albert",
      bodyFont: "FS Albert",
      fallbackHeading: "Helvetica Neue",
      fallbackBody: "Arial",
    },
    layout: {
      approach: "Premium, sophisticated navy-and-gold palette on warm cream backgrounds. Modular grid layouts. Distinctive use of commissioned illustration for advertising campaigns. 'See Things Differently' brand promise drives creative direction.",
      imageWeight: "balanced",
      density: "minimal",
    },
    distinctiveElements: [
      "Commissioned illustrations by renowned artists (Noma Bar, Olimpia Zagnoli, Anna Parini)",
      "'See Things Differently' campaign with trompe l'oeil visual concepts",
      "Navy and gold colour scheme on warm cream",
      "Illustration-led advertising, unusual for estate agents",
      "Heritage since 1835 subtly referenced",
      "Gradient overlays and smooth micro-interactions on digital",
    ],
    aesthetic: "Sophisticated, illustrative, intellectual",
    templateCategory: "boutique-artisan",
  },

  // ─────────────────────────────────────────────
  // 7. JACKSON-STOPS
  // ─────────────────────────────────────────────
  {
    name: "Jackson-Stops",
    brandColors: {
      primary: "#8B1A1A",    // Deep burgundy/crimson (from brand materials)
      secondary: "#2C2C2C",  // Charcoal
      accent: "#C8A96E",     // Gold accent
      background: "#FFFFFF",
      text: "#2C2C2C",
    },
    typography: {
      style: "serif",
      headingFont: "Traditional Serif",
      bodyFont: "Clean sans-serif",
      fallbackHeading: "Georgia",
      fallbackBody: "Arial",
    },
    layout: {
      approach: "Heritage-led design with the iconic fox-and-axe crest symbol. Traditional property brochure formats with strict brand guidelines. Country house and rural estate specialty reflected in earthy, warm aesthetics.",
      imageWeight: "heavy",
      density: "moderate",
    },
    distinctiveElements: [
      "Fox holding an axe crest/seal icon (designed by Chris Mitchell)",
      "Icon works as both a family seal and modern logo",
      "Trading since 1910, heritage woven into every touchpoint",
      "Country estate and rural property photography style",
      "Strict brand guidelines across all branches",
      "Recently simplified name from 'Jackson-Stops & Staff'",
    ],
    aesthetic: "Traditional, heraldic, countryside",
    templateCategory: "heritage-classic",
  },

  // ─────────────────────────────────────────────
  // 8. CHESTERTONS
  // ─────────────────────────────────────────────
  {
    name: "Chestertons",
    brandColors: {
      primary: "#6B207D",    // Vibrant purple
      secondary: "#FFFFFF",
      accent: "#3D1252",     // Darker purple for depth
      background: "#FFFFFF",
      text: "#2C2C2C",
    },
    typography: {
      style: "sans-serif",
      headingFont: "Modern sans-serif",
      bodyFont: "Clean sans-serif",
      fallbackHeading: "Helvetica Neue",
      fallbackBody: "Arial",
    },
    layout: {
      approach: "Bold purple branding sets them apart from typical estate agent colour schemes. 'Open London' brand proposition. Logo cleverly references an open door through the O and N letterforms. Different branch colours create local identity within the purple family.",
      imageWeight: "balanced",
      density: "moderate",
    },
    distinctiveElements: [
      "Distinctive purple brand colour, rare in estate agency",
      "Logo hides an 'open door' in the O-N letterforms",
      "'Open London' brand proposition designed by Leahy Brand Design",
      "Branch-specific colour variations within the purple palette",
      "Founded 1805, one of the oldest London agents",
      "International presence with consistent purple identity",
    ],
    aesthetic: "Bold, contemporary, distinctive",
    templateCategory: "corporate-premium",
  },

  // ─────────────────────────────────────────────
  // 9. JOHN D WOOD & CO.
  // ─────────────────────────────────────────────
  {
    name: "John D Wood & Co.",
    brandColors: {
      primary: "#1B5E3B",    // Traditional dark green
      secondary: "#FFFFFF",
      accent: "#C8A96E",     // Gold
      background: "#FFFFFF",
      text: "#1A1A1A",
    },
    typography: {
      style: "serif",
      headingFont: "Traditional Serif",
      bodyFont: "Clean serif or sans-serif",
      fallbackHeading: "Georgia",
      fallbackBody: "Times New Roman",
    },
    layout: {
      approach: "Traditional, refined design reflecting 150+ years of heritage. Recently modernised boards with reversed logo colours and clearer typography on white backgrounds. High-end London suburbs and Home Counties focus. Classical property photography with plenty of white space.",
      imageWeight: "heavy",
      density: "minimal",
    },
    distinctiveElements: [
      "Dark green brand colour evoking English countryside tradition",
      "Established 1872, heritage is central to the brand story",
      "Recently refreshed signage: reversed colours, white backgrounds, clearer type",
      "Focus on London's premier residential areas and Home Counties",
      "Part of the Countrywide group but maintains distinct identity",
      "Traditional property photography, generous white space",
    ],
    aesthetic: "Traditional, refined, English",
    templateCategory: "heritage-classic",
  },

  // ─────────────────────────────────────────────
  // 10. MARSH & PARSONS
  // ─────────────────────────────────────────────
  {
    name: "Marsh & Parsons",
    brandColors: {
      primary: "#1A2744",    // Dark navy/charcoal
      secondary: "#333333",  // Dark grey
      accent: "#E8E8E8",     // Light grey
      background: "#FFFFFF",
      text: "#333333",
    },
    typography: {
      style: "sans-serif",
      headingFont: "Futura PT",
      bodyFont: "Futura PT",
      fallbackHeading: "Helvetica",
      fallbackBody: "Helvetica",
    },
    layout: {
      approach: "Minimalist, contemporary design built on grayscale neutral tones. Futura PT throughout creates a clean, geometric feel. Rounded pill-style buttons. Subtle opacity transitions and backdrop blur effects. Local knowledge positioning drives content.",
      imageWeight: "balanced",
      density: "minimal",
    },
    distinctiveElements: [
      "Futura PT as primary typeface, giving a geometric modernist feel",
      "Grayscale-dominant palette, very restrained use of colour",
      "Rounded pill-style CTA buttons (100px border-radius)",
      "'Matching People with Property' campaign with playful humour",
      "160+ years heritage, but brand feels distinctly modern",
      "Local knowledge positioning with London street names and postcodes",
      "Subtle blur effects and smooth transitions in digital",
    ],
    aesthetic: "Minimalist, geometric, understated",
    templateCategory: "modern-minimal",
  },

  // ─────────────────────────────────────────────
  // 11. DEXTERS
  // ─────────────────────────────────────────────
  {
    name: "Dexters",
    brandColors: {
      primary: "#003366",    // Dexters blue (approx)
      secondary: "#DD3333",  // Red accent (from magazine design)
      accent: "#DD3333",
      background: "#FFFFFF",
      text: "#242424",
    },
    typography: {
      style: "sans-serif",
      headingFont: "Roboto",
      bodyFont: "Open Sans",
      fallbackHeading: "Helvetica Neue",
      fallbackBody: "Arial",
    },
    layout: {
      approach: "Corporate blue identity with a customer magazine editorial approach. Clean professional layouts with strong visual hierarchy. Editorial design strategy across marketing collateral. High-contrast layouts with substantial white space.",
      imageWeight: "balanced",
      density: "moderate",
    },
    distinctiveElements: [
      "Customer lifestyle magazine as key marketing piece",
      "Editorial design sensibility applied to property marketing",
      "Blue corporate livery on white, creating clean contrast",
      "London's largest independent agent with 80+ offices",
      "Consistent design applied across multiple acquired brands",
      "Dynamic video walls in office environments",
    ],
    aesthetic: "Corporate, editorial, professional",
    templateCategory: "editorial",
  },

  // ─────────────────────────────────────────────
  // 12. BEAUCHAMP ESTATES
  // ─────────────────────────────────────────────
  {
    name: "Beauchamp Estates",
    brandColors: {
      primary: "#000000",    // Black
      secondary: "#C8A96E",  // Gold
      accent: "#C8A96E",
      background: "#FFFFFF",
      text: "#1A1A1A",
    },
    typography: {
      style: "sans-serif",
      headingFont: "Clean luxury sans-serif",
      bodyFont: "Light-weight sans-serif",
      fallbackHeading: "Helvetica Neue Light",
      fallbackBody: "Helvetica Neue",
    },
    layout: {
      approach: "Ultra-minimal luxury. Black and gold palette on white. Extreme use of negative space reflecting ultra-prime market position. Property imagery is the focal point, everything else recedes. Sparse decorative elements; form follows function. Quiet confidence over showiness.",
      imageWeight: "heavy",
      density: "minimal",
    },
    distinctiveElements: [
      "Ultra-prime market: properties from GBP 5m to GBP 100m+",
      "Black and gold colour scheme signalling the very top of the market",
      "Maximum whitespace, minimum text",
      "Founded 1979 in Mayfair, Curzon Street HQ",
      "Discretion and privacy as core brand values",
      "Photography-centric with gallery-like presentation",
      "'Experts in the world's most exceptional properties'",
    ],
    aesthetic: "Ultra-minimal, exclusive, discreet",
    templateCategory: "modern-minimal",
  },

  // ─────────────────────────────────────────────
  // 13. SOTHEBY'S INTERNATIONAL REALTY
  // ─────────────────────────────────────────────
  {
    name: "Sotheby's International Realty",
    brandColors: {
      primary: "#002349",    // SIR Navy Blue (Pantone 289)
      secondary: "#917035",  // SIR Gold
      accent: "#917035",
      background: "#F6F1F1", // Warm off-white/cream
      text: "#002349",
    },
    typography: {
      style: "mixed",
      headingFont: "Mercury Display",   // serif display for headings
      bodyFont: "Benton Sans",          // sans-serif for body
      fallbackHeading: "Georgia",
      fallbackBody: "Helvetica Neue",
    },
    layout: {
      approach: "Auction house heritage applied to real estate. Navy and gold palette on warm cream. Generous section padding (96px). Decorative uppercase labels above serif headings. Art and lifestyle imagery alongside property photography. Editorial quality throughout.",
      imageWeight: "heavy",
      density: "minimal",
    },
    distinctiveElements: [
      "Auction house heritage from Sotheby's brand",
      "Mercury Display serif for headings, Benton Sans for body",
      "Navy (#002349) and gold (#917035) signature palette",
      "Warm cream backgrounds (#F6F1F1) not stark white",
      "Decorative uppercase labels as section markers",
      "Gold used for link underlines and key accents",
      "Art, beauty and provenance as brand pillars",
      "Lifestyle and editorial content alongside listings",
    ],
    aesthetic: "Auction-house elegance, timeless luxury",
    templateCategory: "traditional-luxury",
  },

  // ─────────────────────────────────────────────
  // 14. CHRISTIE'S REAL ESTATE
  // ─────────────────────────────────────────────
  {
    name: "Christie's Real Estate",
    brandColors: {
      primary: "#1A1A2E",    // Deep navy/midnight
      secondary: "#5F5DE4",  // Lavender/purple accent
      accent: "#C8A96E",     // Gold
      background: "#F5F5FF", // Very light lavender-white
      text: "#1A1A2E",
    },
    typography: {
      style: "serif",
      headingFont: "Traditional serif (Christie's heritage)",
      bodyFont: "Inter",
      fallbackHeading: "Times New Roman",
      fallbackBody: "Helvetica Neue",
    },
    layout: {
      approach: "Auction house pedigree with art world sensibility. Asymmetric layouts spanning 1-3 columns. Artwork reproductions alongside property photography. Statistics and data presented with elegant visual dividers. Lavender-white backgrounds create a distinctive, softer luxury feel.",
      imageWeight: "heavy",
      density: "minimal",
    },
    distinctiveElements: [
      "'Art. Beauty. Provenance.' as brand pillars",
      "Auction house heritage connects properties with art world",
      "Lavender-purple accent colour, unusual in real estate",
      "Asymmetric grid layouts, art gallery-inspired",
      "Artwork and fine art reproductions in property marketing",
      "Elegant data visualisations with accent lines",
      "Inter font for modern body text readability",
    ],
    aesthetic: "Artistic, refined, gallery-like",
    templateCategory: "editorial",
  },

  // ─────────────────────────────────────────────
  // 15. THE MODERN HOUSE
  // ─────────────────────────────────────────────
  {
    name: "The Modern House",
    brandColors: {
      primary: "#796D63",    // Warm brown-grey
      secondary: "#BBA67A",  // Warm sand/ochre
      accent: "#6F6459",     // Earth tone
      background: "#FAF8F5", // Warm white
      text: "#2C2C2C",
    },
    typography: {
      style: "mixed",
      headingFont: "Söhne",           // Klim Type Foundry sans-serif
      bodyFont: "Adobe Caslon",        // Classic serif for editorial
      fallbackHeading: "Helvetica Neue",
      fallbackBody: "Georgia",
    },
    layout: {
      approach: "Design-led architecture magazine aesthetic. Earthy, material-driven colour palette. Söhne sans-serif for sophisticated headings, Adobe Caslon serif for editorial body text. Flexible brand system where initials TMH form sub-brand identities. Spacious, architectural layouts reflecting the properties listed.",
      imageWeight: "heavy",
      density: "minimal",
    },
    distinctiveElements: [
      "Söhne typeface (Klim) as primary, Adobe Caslon as editorial serif",
      "Earthy palette reflecting building materials: wood, stone, concrete",
      "Design-led and architecturally focused property selection",
      "Flexible TMH monogram system for sub-brands (Magazine, Times, Talk)",
      "Architectural photography style emphasising light, space, materials",
      "Identity by StudioSmall, respected design consultancy",
      "Warm whites and earthy neutrals, never stark or cold",
    ],
    aesthetic: "Architectural, earthy, editorial",
    templateCategory: "editorial",
  },

  // ─────────────────────────────────────────────
  // 16. THE HOUSE PARTNERSHIP
  // ─────────────────────────────────────────────
  {
    name: "The House Partnership",
    brandColors: {
      primary: "#204CE5",    // Vibrant blue
      secondary: "#112337",  // Dark navy
      accent: "#204CE5",
      background: "#F5F5F5", // Light grey
      text: "#112337",
    },
    typography: {
      style: "sans-serif",
      headingFont: "Modern geometric sans-serif",
      bodyFont: "Clean sans-serif",
      fallbackHeading: "Helvetica Neue",
      fallbackBody: "Arial",
    },
    layout: {
      approach: "Digital-forward, contemporary design. Vibrant blue accent on clean whites and light greys. Full-width hero sections with property photography. Card-based layouts for locations. Carousel sliders for property browsing. No high-street offices, so brand lives entirely online.",
      imageWeight: "heavy",
      density: "moderate",
    },
    distinctiveElements: [
      "No physical offices: brand exists entirely through digital and personal service",
      "'Moving estate agency on' as positioning statement",
      "Vibrant blue accent colour, modern and trustworthy",
      "Emphasis on photography and video over text",
      "250+ years combined team experience despite modern approach",
      "Award-winning web experience as primary brand touchpoint",
      "Regional coverage tiles: London, Surrey, Sussex, Kent, Hampshire, Berks",
    ],
    aesthetic: "Digital-first, contemporary, vibrant",
    templateCategory: "modern-minimal",
  },

  // ─────────────────────────────────────────────
  // 17. ASTON CHASE
  // ─────────────────────────────────────────────
  {
    name: "Aston Chase",
    brandColors: {
      primary: "#000000",    // Black
      secondary: "#CD2653",  // Deep rose/burgundy accent
      accent: "#CD2653",
      background: "#DCD7CA", // Warm cream/beige
      text: "#6D6D6D",
    },
    typography: {
      style: "mixed",
      headingFont: "Large-scale serif",   // up to 42px
      bodyFont: "Modern sans-serif",      // 18-21px baseline
      fallbackHeading: "Georgia",
      fallbackBody: "Helvetica Neue",
    },
    layout: {
      approach: "Gallery-like presentation for distinguished properties. Large serif headlines with generous whitespace. Warm cream/beige backgrounds create an inviting, tactile feel. Minimal navigation without visual clutter. Properties presented as curated artworks rather than listings.",
      imageWeight: "heavy",
      density: "minimal",
    },
    distinctiveElements: [
      "Gallery-like, curated property presentation",
      "Deep rose/burgundy accent, warm and distinctive",
      "Warm cream backgrounds rather than pure white",
      "Large serif headlines (42px) creating visual drama",
      "Independent since 1985, North West London specialist",
      "Aston Chase Living: lettings positioned as a lifestyle brand",
      "Elegant negative space around property imagery",
    ],
    aesthetic: "Curated, gallery-like, warm",
    templateCategory: "boutique-artisan",
  },

  // ─────────────────────────────────────────────
  // 18. GLENTREE ESTATES
  // ─────────────────────────────────────────────
  {
    name: "Glentree Estates",
    brandColors: {
      primary: "#1A2744",    // Dark navy/charcoal
      secondary: "#C8A96E",  // Gold/warm tone
      accent: "#C8A96E",
      background: "#FFFFFF",
      text: "#2C2C2C",
    },
    typography: {
      style: "sans-serif",
      headingFont: "Bold sans-serif",
      bodyFont: "Clean sans-serif",
      fallbackHeading: "Helvetica Neue",
      fallbackBody: "Arial",
    },
    layout: {
      approach: "Upmarket sophistication with navy and gold palette. High-quality photography dominates. Carousel sliders for luxury home showcasing. Organised property cards with consistent formatting. Professional corporate branding throughout.",
      imageWeight: "heavy",
      density: "moderate",
    },
    distinctiveElements: [
      "Longest established independent agent in North West London",
      "Hampstead, Highgate and Hampstead Garden Suburb specialists",
      "Navy and gold colour scheme conveying prestige",
      "Dynamic carousel presentations of luxury homes",
      "Corporate but approachable positioning",
      "Strong local area expertise in ultra-prime NW London",
    ],
    aesthetic: "Prestigious, polished, established",
    templateCategory: "traditional-luxury",
  },

  // ─────────────────────────────────────────────
  // 19. ROKSTONE (UK SOTHEBY'S INTERNATIONAL REALTY)
  // ─────────────────────────────────────────────
  {
    name: "Rokstone",
    brandColors: {
      primary: "#002349",    // SIR Navy (inherits from Sotheby's)
      secondary: "#917035",  // SIR Gold
      accent: "#917035",
      background: "#FAFAFA", // Near-white
      text: "#1A1A1A",
    },
    typography: {
      style: "mixed",
      headingFont: "Mercury Display",
      bodyFont: "Benton Sans",
      fallbackHeading: "Georgia",
      fallbackBody: "Helvetica",
    },
    layout: {
      approach: "Inherits Sotheby's International Realty visual system. Clean grid-based layout with generous whitespace. Large hero property photography with minimal text overlays. Organised navigation: Buy, Rent, New Homes, Locations, Lifestyles. Contemporary luxury that prioritises imagery over decoration.",
      imageWeight: "heavy",
      density: "minimal",
    },
    distinctiveElements: [
      "Operates under UK Sotheby's International Realty brand",
      "Founded by Becky Fatemi in 2011",
      "GBP 6.4bn+ in brokered sales",
      "Mayfair, Fitzrovia, Marylebone focus",
      "'Global Reach, Local Expertise' positioning",
      "'Majestic homes, timeless design' tagline",
      "Properties from GBP 500k to GBP 100m",
      "Luxury concierge service as differentiator",
    ],
    aesthetic: "Contemporary luxury, global prestige",
    templateCategory: "traditional-luxury",
  },

  // ─────────────────────────────────────────────
  // 20. TK INTERNATIONAL
  // ─────────────────────────────────────────────
  {
    name: "TK International",
    brandColors: {
      primary: "#E85D26",    // Orange (retained from heritage)
      secondary: "#3C1A4A",  // Deep aubergine
      accent: "#E85D26",
      background: "#FFFFFF",
      text: "#2C2C2C",
    },
    typography: {
      style: "sans-serif",
      headingFont: "Clean geometric sans-serif",
      bodyFont: "Clean sans-serif",
      fallbackHeading: "Helvetica Neue",
      fallbackBody: "Arial",
    },
    layout: {
      approach: "Striking orange and aubergine pairing creates instant recognition. Geometric TK icon made from two locator arrows forming a dynamic letterform. Icon theory drives layout, messaging hierarchy and composition. Warm, welcoming brand for Hampstead's luxury market.",
      imageWeight: "balanced",
      density: "moderate",
    },
    distinctiveElements: [
      "Orange and deep aubergine colour combination, very distinctive",
      "Geometric TK icon: two locator arrows composing a 'TK' letterform",
      "Icon system drives all layout and hierarchy decisions",
      "Brand by Carabiner Partners, emphasising order and composition",
      "Hampstead specialist with deep local knowledge",
      "Warm and welcoming positioning for luxury market",
      "New brand rolled out across offices, collateral, and website simultaneously",
    ],
    aesthetic: "Warm, geometric, distinctive",
    templateCategory: "boutique-artisan",
  },
];

// ─────────────────────────────────────────────────────
// PREMIUM PROPERTY BROCHURE TRENDS 2025-2026
// ─────────────────────────────────────────────────────

export const brochureTrends2025_2026 = {
  typography: [
    "Quiet sans-serifs with Art Deco influences, stripped back for modern luxury",
    "Mixed serif/sans-serif pairings: serif for display, sans-serif for body",
    "Large, confident headline sizes with generous tracking",
    "Title case preferred over uppercase for headings",
    "Klim Type Foundry faces (Söhne, Untitled) popular among design-led agencies",
    "Custom typefaces for brand differentiation at the premium end",
  ],
  colorTrends: [
    "Navy and gold remains the dominant luxury pairing",
    "Warm, earthy neutrals replacing cold greys (cream, sand, ochre, warm brown)",
    "Muted, tonal palettes rather than high-contrast schemes",
    "Single bold accent colour on neutral base (coral on navy, gold on black)",
    "Warm whites and off-whites instead of pure #FFFFFF",
    "Deep purples and aubergines emerging as alternatives to navy",
  ],
  layoutPatterns: [
    "Asymmetric layouts inspired by editorial and gallery design",
    "Full-bleed photography with minimal text overlay",
    "Generous whitespace as a luxury signal",
    "Modular grid systems for flexibility across formats",
    "Hero imagery at least 60-70% of cover space",
    "Data and statistics presented with clean infographic styling",
    "Section dividers using subtle rules or accent colours",
  ],
  printFinishes: [
    "Uncoated paper stocks for organic, tactile luxury feel",
    "Silver and gold foil embossed logos on covers",
    "Chrome, holographic, and metallic foils for exclusive edge",
    "Soft-touch matte lamination paired with foil for contrast",
    "Blind emboss and micro-deboss textures",
    "FSC-certified and recycled stocks as standard, often called out in the brochure",
    "Spot UV on key elements (logo, property name)",
  ],
  digitalIntegration: [
    "QR codes linking to virtual tours, video walkthroughs",
    "Augmented reality to visualise furnished rooms from floor plans",
    "Digital flip brochures with embedded video",
    "Interactive floor plans with room-by-room navigation",
    "Social media integration (Instagram feeds) in digital versions",
  ],
  emergingPatterns: [
    "Sustainability messaging integrated into design, not bolted on",
    "Lifestyle editorial content alongside property details",
    "Illustration as a brand differentiator (Winkworth model)",
    "Art world crossover: properties presented as curated collections",
    "Booklet format for single luxury properties, panoramic folds for impact",
    "AI-driven personalised brochure content",
    "Drone and aerial photography as standard hero imagery",
  ],
};

// ─────────────────────────────────────────────────────
// TEMPLATE CATEGORIES FOR 30 VARIATIONS
// ─────────────────────────────────────────────────────

export const templateVariationGuide = {
  description:
    "30 distinct template variations can be built by combining the 20 agent styles with the 6 template categories. Each agent style provides colour, type, and layout DNA. The categories define structural approaches.",

  categories: {
    "traditional-luxury": {
      description: "Navy/gold/cream palette, serif headings, generous margins, foil-ready logos, warm paper textures",
      agents: ["Sotheby's International Realty", "Glentree Estates", "Rokstone"],
      suggestedVariations: [
        "SIR Classic: Navy + gold + Mercury serif, cream backgrounds, auction-house elegance",
        "Glentree Prestige: Navy + gold, bold sans headings, dynamic carousel-style layout",
        "Rokstone Global: SIR system adapted for central London, aspirational lifestyle imagery",
        "Warm Prestige: Gold accents on warm cream, serif-dominant, foil-emboss-ready cover",
        "Dark Luxury: Near-black backgrounds with gold type, dramatic full-bleed photography",
      ],
    },
    "modern-minimal": {
      description: "Clean lines, restrained colour, maximum whitespace, digital-first, sans-serif typography",
      agents: ["Foxtons", "Marsh & Parsons", "Beauchamp Estates", "The House Partnership"],
      suggestedVariations: [
        "Foxtons Urban: Teal + gold, energetic, young London market, sans-serif throughout",
        "M&P Geometric: Futura-style type, grayscale, pill buttons, ultra-minimal",
        "Beauchamp Ultra: Black + gold on white, extreme whitespace, gallery presentation",
        "Digital Forward: Vibrant blue, card layouts, no print heritage, born-digital aesthetic",
        "Monochrome Lux: Black and white only with a single metallic accent, maximum restraint",
      ],
    },
    "editorial": {
      description: "Magazine-style layouts, mixed serif/sans type, editorial photography, lifestyle content",
      agents: ["Dexters", "Christie's Real Estate", "The Modern House"],
      suggestedVariations: [
        "Dexters Magazine: Blue + red, editorial spreads, lifestyle features, Roboto/Open Sans",
        "Christie's Art: Lavender-white, asymmetric columns, artwork alongside properties, Inter body",
        "TMH Architecture: Söhne + Caslon, earthy palette, design-led, material-driven",
        "Lifestyle Editorial: Mixed columns, pull quotes, full-bleed photography, serif headlines",
        "Design Journal: Architectural photography, technical details, material palette references",
      ],
    },
    "corporate-premium": {
      description: "Strong brand colour presence, structured grids, data-confident, globally consistent",
      agents: ["Knight Frank", "Savills", "Chestertons"],
      suggestedVariations: [
        "KF Residential: Red accents, Domaine Display serif, red full stops, structured grid",
        "KF Commercial: Red + green, Romain Headline serif, Suisse Int'l body, data-rich",
        "Savills Bold: Red + yellow blocking, strong sans-serif, infographic-ready, global feel",
        "Chestertons Purple: Vibrant purple, door-icon logo, branch colour system, urban London",
        "Corporate Clean: Single bold brand colour, strict grid, data visualisation, market reports",
      ],
    },
    "boutique-artisan": {
      description: "Distinctive colour palettes, craft-quality feel, illustration or unique visual approaches, personality-driven",
      agents: ["Winkworth", "Aston Chase", "TK International"],
      suggestedVariations: [
        "Winkworth Illustrated: Navy + gold on cream, commissioned illustration, FS Albert, trompe l'oeil",
        "Aston Chase Gallery: Black + rose, warm cream, large serif headings, curated presentation",
        "TK Geometric: Orange + aubergine, locator-arrow icon system, order-driven layouts",
        "Artisan Craft: Hand-drawn elements, uncoated paper texture, earthy tones, personal touch",
        "Signature Boutique: Bold accent colour, bespoke icon, personality-forward, intimate scale",
      ],
    },
    "heritage-classic": {
      description: "Deep heritage colours, serif typography, crest/seal elements, country and traditional property focus",
      agents: ["Strutt & Parker", "Hamptons", "Jackson-Stops", "John D Wood & Co."],
      suggestedVariations: [
        "S&P Country: Heritage green, countryside photography, serif-accented, BNP Paribas subtle",
        "Hamptons Warm: Deep blue + coral, stencil serif, home-life photography, progressive heritage",
        "Jackson-Stops Estate: Burgundy + gold, fox crest seal, country house focus, traditional format",
        "JDW Classic: Dark green + gold, English serif, white backgrounds, refined simplicity",
        "Country Manor: Earthy palette, crest element, landscape photography, tactile paper finish",
      ],
    },
  },

  totalVariations: 30,
};

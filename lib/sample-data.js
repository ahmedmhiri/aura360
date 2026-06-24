// Built-in sample content. Used to seed the database (prisma/seed.js) and as a
// read-only fallback so the site renders even before a database is configured.
// Replace the picsum.photos URLs with your own renders.

export const sampleCategories = [
  { slug: "architecture", nameEn: "Architecture", nameFr: "Architecture", order: 1 },
  { slug: "visualization", nameEn: "3D Visualization", nameFr: "Visualisation 3D", order: 2 },
  { slug: "interior", nameEn: "Interior Design", nameFr: "Design d'intérieur", order: 3 },
];

const img = (seed, w = 1600, h = 1100) =>
  `https://picsum.photos/seed/aura-${seed}/${w}/${h}`;

export const sampleProjects = [
  {
    slug: "meridian-house",
    categorySlug: "architecture",
    titleEn: "Meridian House",
    titleFr: "Maison Méridien",
    descriptionEn:
      "A private residence organised around a central courtyard, where deep overhangs and a restrained palette of concrete, oak and glass let the desert light do the work. The plan folds living spaces around shade and view, opening fully to the garden at dusk.",
    descriptionFr:
      "Une résidence privée organisée autour d'une cour centrale, où de profonds débords et une palette sobre de béton, de chêne et de verre laissent la lumière du désert opérer. Le plan replie les espaces de vie autour de l'ombre et de la vue, s'ouvrant pleinement sur le jardin au crépuscule.",
    typeEn: "Private residence",
    typeFr: "Résidence privée",
    location: "Doha, Qatar",
    year: 2025,
    coverImage: img(11),
    gallery: [img(11), img(12), img(13), img(14)],
    servicesEn: ["Architecture", "Interior Design", "3D Visualization"],
    servicesFr: ["Architecture", "Design d'intérieur", "Visualisation 3D"],
    featured: true,
    order: 1,
  },
  {
    slug: "lumen-tower",
    categorySlug: "visualization",
    titleEn: "Lumen Tower",
    titleFr: "Tour Lumen",
    descriptionEn:
      "A full visualization package for a mixed-use tower competition: photoreal exterior stills at three times of day, a fly-through animation and interactive 360° panoramas of the sky lobby. The imagery carried the scheme to a shortlist win.",
    descriptionFr:
      "Un ensemble complet de visualisation pour un concours de tour mixte : images extérieures photoréalistes à trois moments de la journée, animation en survol et panoramas 360° interactifs du hall panoramique. Les images ont mené le projet en finale.",
    typeEn: "Mixed-use tower",
    typeFr: "Tour à usage mixte",
    location: "Dubai, UAE",
    year: 2025,
    coverImage: img(21),
    coverImage360: true,
    gallery: [img(21), img(22), img(23), img(24)],
    servicesEn: ["3D Visualization", "Animation", "360° Panorama"],
    servicesFr: ["Visualisation 3D", "Animation", "Panorama 360°"],
    featured: true,
    order: 2,
  },
  {
    slug: "atelier-loft",
    categorySlug: "interior",
    titleEn: "Atelier Loft",
    titleFr: "Loft Atelier",
    descriptionEn:
      "An artist's loft reworked into a live-work interior. Raw plaster, blackened steel and a single long oak table anchor the open volume, while concealed storage keeps the space quiet and uncluttered.",
    descriptionFr:
      "Le loft d'un artiste retravaillé en intérieur mixte habitat-travail. Plâtre brut, acier noirci et une longue table en chêne ancrent le volume ouvert, tandis que des rangements dissimulés gardent l'espace calme et épuré.",
    typeEn: "Residential interior",
    typeFr: "Intérieur résidentiel",
    location: "Tunis, Tunisia",
    year: 2024,
    coverImage: img(31),
    gallery: [img(31), img(32), img(33), img(34)],
    servicesEn: ["Interior Design", "3D Visualization"],
    servicesFr: ["Design d'intérieur", "Visualisation 3D"],
    featured: true,
    order: 3,
  },
  {
    slug: "coastal-pavilion",
    categorySlug: "architecture",
    titleEn: "Coastal Pavilion",
    titleFr: "Pavillon Côtier",
    descriptionEn:
      "A small cultural pavilion on a rocky shoreline. A folded concrete roof shelters a single flexible hall that opens to the sea, framing the horizon as the only ornament the building needs.",
    descriptionFr:
      "Un petit pavillon culturel sur un littoral rocheux. Une toiture en béton plissé abrite une salle flexible unique ouverte sur la mer, encadrant l'horizon comme seul ornement nécessaire au bâtiment.",
    typeEn: "Cultural pavilion",
    typeFr: "Pavillon culturel",
    location: "Sousse, Tunisia",
    year: 2024,
    coverImage: img(41),
    gallery: [img(41), img(42), img(43), img(44)],
    servicesEn: ["Architecture", "3D Visualization"],
    servicesFr: ["Architecture", "Visualisation 3D"],
    featured: true,
    order: 4,
  },
  {
    slug: "garden-courtyard",
    categorySlug: "visualization",
    titleEn: "Garden Courtyard",
    titleFr: "Cour Jardin",
    descriptionEn:
      "Interior and landscape visualization for a boutique hotel courtyard. Soft morning light, layered planting and warm stone were rendered to communicate atmosphere to investors before construction began.",
    descriptionFr:
      "Visualisation d'intérieur et de paysage pour la cour d'un hôtel de charme. Lumière douce du matin, végétation en strates et pierre chaude ont été rendues pour transmettre l'atmosphère aux investisseurs avant le chantier.",
    typeEn: "Hospitality",
    typeFr: "Hôtellerie",
    location: "Marrakech, Morocco",
    year: 2023,
    coverImage: img(51),
    gallery: [img(51), img(52), img(53), img(54)],
    servicesEn: ["3D Visualization", "Landscape"],
    servicesFr: ["Visualisation 3D", "Paysage"],
    featured: true,
    order: 5,
  },
  {
    slug: "monochrome-apartment",
    categorySlug: "interior",
    titleEn: "Monochrome Apartment",
    titleFr: "Appartement Monochrome",
    descriptionEn:
      "A compact city apartment composed almost entirely in greys and off-whites. Texture replaces colour: brushed plaster, linen, pale oak and a single charcoal kitchen volume give the rooms their depth.",
    descriptionFr:
      "Un appartement urbain compact composé presque entièrement de gris et de blancs cassés. La texture remplace la couleur : plâtre brossé, lin, chêne clair et un unique volume de cuisine anthracite donnent leur profondeur aux pièces.",
    typeEn: "Residential interior",
    typeFr: "Intérieur résidentiel",
    location: "Paris, France",
    year: 2023,
    coverImage: img(61),
    gallery: [img(61), img(62), img(63), img(64)],
    servicesEn: ["Interior Design"],
    servicesFr: ["Design d'intérieur"],
    featured: false,
    order: 6,
  },
];

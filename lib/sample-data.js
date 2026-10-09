// Built-in categories. Used to seed the database (prisma/seed.js) and as a
// read-only fallback so the site renders even before a database is configured.
// Projects are only ever real ones, added through the admin.

export const sampleCategories = [
  { slug: "architecture", nameEn: "Architecture", nameFr: "Architecture", order: 1 },
  { slug: "visualization", nameEn: "3D Visualization", nameFr: "Visualisation 3D", order: 2 },
  { slug: "interior", nameEn: "Interior Design", nameFr: "Design d'intérieur", order: 3 },
];

export const sampleProjects = [];

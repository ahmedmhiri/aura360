// Seed the database with the studio's starter content.
// Run: npm run db:seed   (requires DATABASE_URL + `prisma migrate dev`)

const { PrismaClient } = require("@prisma/client");

// sample-data.js uses ESM `export`; load its values without a bundler.
const path = require("path");
const fs = require("fs");

function loadSampleData() {
  const file = path.join(__dirname, "..", "lib", "sample-data.js");
  let src = fs.readFileSync(file, "utf8");
  // Strip ESM export keywords so we can eval in CommonJS.
  src = src.replace(/export const/g, "const");
  const sandbox = { module: { exports: {} } };
  const fn = new Function(
    "module",
    `${src}\nmodule.exports = { sampleCategories, sampleProjects };`
  );
  fn(sandbox.module);
  return sandbox.module.exports;
}

const prisma = new PrismaClient();

async function main() {
  const { sampleCategories, sampleProjects } = loadSampleData();

  console.log("Seeding categories…");
  const categoryBySlug = {};
  for (const c of sampleCategories) {
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { nameEn: c.nameEn, nameFr: c.nameFr, order: c.order },
      create: { slug: c.slug, nameEn: c.nameEn, nameFr: c.nameFr, order: c.order },
    });
    categoryBySlug[c.slug] = category.id;
  }

  console.log("Seeding projects…");
  for (const p of sampleProjects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        titleEn: p.titleEn,
        titleFr: p.titleFr,
        descriptionEn: p.descriptionEn,
        descriptionFr: p.descriptionFr,
        typeEn: p.typeEn,
        typeFr: p.typeFr,
        location: p.location,
        year: p.year,
        coverImage: p.coverImage,
        gallery: p.gallery,
        servicesEn: p.servicesEn,
        servicesFr: p.servicesFr,
        featured: p.featured,
        order: p.order,
        categoryId: categoryBySlug[p.categorySlug],
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

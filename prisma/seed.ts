import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create content types
  const flagContentType = await prisma.contentType.upsert({
    where: { name: "flag" },
    update: {},
    create: {
      name: "flag",
      description: "Country flags for recognition games",
      isActive: true,
    },
  });

  const capitalContentType = await prisma.contentType.upsert({
    where: { name: "capital" },
    update: {},
    create: {
      name: "capital",
      description: "Capital cities for geography games",
      isActive: false, // Will be enabled later
    },
  });

  console.log("✅ Content types created");

  // Create sample countries with flags
  const countries = [
    {
      name: "United States",
      code: "US",
      continent: "North America",
      region: "Northern America",
      population: BigInt(331900000),
      areaKm2: 9833517.0,
      capital: "Washington, D.C.",
      languages: ["en"],
      currencies: ["USD"],
      metadata: {
        demonym: "American",
        iso3: "USA",
        callingCode: "+1",
      },
    },
    {
      name: "United Kingdom",
      code: "GB",
      continent: "Europe",
      region: "Northern Europe",
      population: BigInt(67800000),
      areaKm2: 243610.0,
      capital: "London",
      languages: ["en"],
      currencies: ["GBP"],
      metadata: {
        demonym: "British",
        iso3: "GBR",
        callingCode: "+44",
      },
    },
    {
      name: "France",
      code: "FR",
      continent: "Europe",
      region: "Western Europe",
      population: BigInt(67400000),
      areaKm2: 551695.0,
      capital: "Paris",
      languages: ["fr"],
      currencies: ["EUR"],
      metadata: {
        demonym: "French",
        iso3: "FRA",
        callingCode: "+33",
      },
    },
    {
      name: "Germany",
      code: "DE",
      continent: "Europe",
      region: "Western Europe",
      population: BigInt(83200000),
      areaKm2: 357022.0,
      capital: "Berlin",
      languages: ["de"],
      currencies: ["EUR"],
      metadata: {
        demonym: "German",
        iso3: "DEU",
        callingCode: "+49",
      },
    },
    {
      name: "Japan",
      code: "JP",
      continent: "Asia",
      region: "Eastern Asia",
      population: BigInt(125800000),
      areaKm2: 377975.0,
      capital: "Tokyo",
      languages: ["ja"],
      currencies: ["JPY"],
      metadata: {
        demonym: "Japanese",
        iso3: "JPN",
        callingCode: "+81",
      },
    },
  ];

  for (const countryData of countries) {
    const country = await prisma.country.upsert({
      where: { code: countryData.code },
      update: {},
      create: countryData,
    });

    // Create flag content item for each country
    await prisma.contentItem.upsert({
      where: {
        countryId_contentTypeId: {
          countryId: country.id,
          contentTypeId: flagContentType.id,
        },
      },
      update: {},
      create: {
        countryId: country.id,
        contentTypeId: flagContentType.id,
        title: `Flag of ${country.name}`,
        description: `Official flag of ${country.name}`,
        primaryUrl: `/flags/${country.code.toLowerCase()}.svg`, // We'll add actual flag images later
        thumbnailUrl: `/flags/thumbs/${country.code.toLowerCase()}.svg`,
        difficulty: Math.floor(Math.random() * 3) + 2, // Random difficulty 2-4 for now
        tags: [country.continent.toLowerCase().replace(" ", "-"), "flag"],
        properties: {
          colors: [], // Will be populated with actual flag colors later
          yearAdopted: null,
          designer: null,
        },
      },
    });
  }

  console.log("✅ Sample countries and flags created");

  // Create sample achievements
  const achievements = [
    {
      key: "first_win",
      name: "First Victory",
      description: "Win your first game",
      category: "learning",
      criteria: { type: "game_wins", target: 1 },
      rewardType: "badge",
      rewardValue: { points: 10 },
    },
    {
      key: "flag_master_europe",
      name: "European Master",
      description: "Master all European flags",
      category: "learning",
      criteria: { type: "continent_mastery", continent: "Europe" },
      rewardType: "badge",
      rewardValue: { points: 100, title: "European Flag Master" },
    },
    {
      key: "speed_demon",
      name: "Speed Demon",
      description: "Answer 10 flags correctly in under 30 seconds",
      category: "competitive",
      criteria: { type: "speed_challenge", flags: 10, timeLimit: 30 },
      rewardType: "badge",
      rewardValue: { points: 50 },
    },
    {
      key: "perfect_game",
      name: "Perfect Game",
      description: "Complete a game with 100% accuracy",
      category: "competitive",
      criteria: { type: "perfect_accuracy", minQuestions: 5 },
      rewardType: "badge",
      rewardValue: { points: 25 },
    },
  ];

  for (const achievementData of achievements) {
    await prisma.achievement.upsert({
      where: { key: achievementData.key },
      update: {},
      create: achievementData,
    });
  }

  console.log("✅ Sample achievements created");

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

// Middle-earth (Lord of the Rings) custom region data

export interface LotrRegion {
  id: string;
  name: string;
  flag: string; // Emoji representing the region
  description: string;
}

// LOTR regions with thematic emoji flags
export const lotrRegions: LotrRegion[] = [
  {
    id: "gondor",
    name: "Gondor",
    flag: "🏰",
    description: "The White Tree and Seven Stars",
  },
  {
    id: "rohan",
    name: "Rohan",
    flag: "🐴",
    description: "The Horse-lords of the Mark",
  },
  {
    id: "shire",
    name: "The Shire",
    flag: "🌿",
    description: "The peaceful land of the Hobbits",
  },
  {
    id: "lothlorien",
    name: "Lothlórien",
    flag: "🌳",
    description: "The Golden Wood of the Elves",
  },
  {
    id: "rivendell",
    name: "Rivendell",
    flag: "⭐",
    description: "The Last Homely House",
  },
  {
    id: "mordor",
    name: "Mordor",
    flag: "👁️",
    description: "The Dark Land of Shadow",
  },
  {
    id: "isengard",
    name: "Isengard",
    flag: "🗼",
    description: "The Tower of Orthanc",
  },
  {
    id: "erebor",
    name: "Erebor",
    flag: "⛰️",
    description: "The Lonely Mountain",
  },
  {
    id: "mirkwood",
    name: "Mirkwood",
    flag: "🕷️",
    description: "The Dark Forest",
  },
  {
    id: "minas-tirith",
    name: "Minas Tirith",
    flag: "🛡️",
    description: "The White City",
  },
];

// Generate quiz questions for LOTR regions
export interface LotrQuestion {
  id: string;
  flag: string;
  region: string;
  options: string[];
}

// Helper to generate random options for a LOTR question
export function generateLotrOptions(correctRegion: LotrRegion): string[] {
  const options = [correctRegion.name];
  const otherRegions = lotrRegions.filter((r) => r.id !== correctRegion.id);

  // Pick 3 random wrong answers
  const shuffled = [...otherRegions].sort(() => 0.5 - Math.random());
  options.push(...shuffled.slice(0, 3).map((r) => r.name));

  // Shuffle the options
  return options.sort(() => 0.5 - Math.random());
}

// Generate all LOTR questions
export function generateLotrQuestions(): LotrQuestion[] {
  return lotrRegions.map((region, index) => ({
    id: `lotr-${index}`,
    flag: region.flag,
    region: region.name,
    options: generateLotrOptions(region),
  }));
}

// Fuzzy search for LOTR regions
export function fuzzySearchLotrRegions(query: string): LotrRegion[] {
  if (!query) return lotrRegions;
  const lowerQuery = query.toLowerCase();

  return lotrRegions.filter((region) => {
    const nameMatch = fuzzyMatch(region.name.toLowerCase(), lowerQuery);
    const descMatch = fuzzyMatch(region.description.toLowerCase(), lowerQuery);
    return nameMatch || descMatch;
  });
}

// Simple fuzzy matching: check if all characters appear in order
function fuzzyMatch(text: string, query: string): boolean {
  let textIndex = 0;
  for (let i = 0; i < query.length; i++) {
    textIndex = text.indexOf(query[i], textIndex);
    if (textIndex === -1) return false;
    textIndex++;
  }
  return true;
}

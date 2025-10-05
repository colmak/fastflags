import countryFlagEmoji from "country-flag-emoji";

export interface Country {
  name: string;
  code: string; // ISO 3166-1 alpha-2 code
  emoji: string;
  region: string;
}

export interface Region {
  id: string;
  name: string;
  isCustom?: boolean;
}

// Map country codes to regions based on UN geographic regions
const regionMapping: Record<string, string> = {
  // Europe
  "AL": "europe", "AD": "europe", "AM": "europe", "AT": "europe", "AZ": "europe",
  "BY": "europe", "BE": "europe", "BA": "europe", "BG": "europe", "HR": "europe",
  "CY": "europe", "CZ": "europe", "DK": "europe", "EE": "europe", "FI": "europe",
  "FR": "europe", "GE": "europe", "DE": "europe", "GR": "europe", "HU": "europe",
  "IS": "europe", "IE": "europe", "IT": "europe", "XK": "europe", "LV": "europe",
  "LI": "europe", "LT": "europe", "LU": "europe", "MT": "europe", "MD": "europe",
  "MC": "europe", "ME": "europe", "NL": "europe", "MK": "europe", "NO": "europe",
  "PL": "europe", "PT": "europe", "RO": "europe", "RU": "europe", "SM": "europe",
  "RS": "europe", "SK": "europe", "SI": "europe", "ES": "europe", "SE": "europe",
  "CH": "europe", "TR": "europe", "UA": "europe", "GB": "europe", "VA": "europe",

  // Asia
  "AF": "asia", "BH": "asia", "BD": "asia", "BT": "asia", "BN": "asia",
  "KH": "asia", "CN": "asia", "IN": "asia", "ID": "asia", "IR": "asia",
  "IQ": "asia", "IL": "asia", "JP": "asia", "JO": "asia", "KZ": "asia",
  "KW": "asia", "KG": "asia", "LA": "asia", "LB": "asia", "MY": "asia",
  "MV": "asia", "MN": "asia", "MM": "asia", "NP": "asia", "KP": "asia",
  "OM": "asia", "PK": "asia", "PS": "asia", "PH": "asia", "QA": "asia",
  "SA": "asia", "SG": "asia", "KR": "asia", "LK": "asia", "SY": "asia",
  "TW": "asia", "TJ": "asia", "TH": "asia", "TL": "asia", "TM": "asia",
  "AE": "asia", "UZ": "asia", "VN": "asia", "YE": "asia",

  // Africa
  "DZ": "africa", "AO": "africa", "BJ": "africa", "BW": "africa", "BF": "africa",
  "BI": "africa", "CM": "africa", "CV": "africa", "CF": "africa", "TD": "africa",
  "KM": "africa", "CG": "africa", "CD": "africa", "CI": "africa", "DJ": "africa",
  "EG": "africa", "GQ": "africa", "ER": "africa", "SZ": "africa", "ET": "africa",
  "GA": "africa", "GM": "africa", "GH": "africa", "GN": "africa", "GW": "africa",
  "KE": "africa", "LS": "africa", "LR": "africa", "LY": "africa", "MG": "africa",
  "MW": "africa", "ML": "africa", "MR": "africa", "MU": "africa", "MA": "africa",
  "MZ": "africa", "NA": "africa", "NE": "africa", "NG": "africa", "RW": "africa",
  "ST": "africa", "SN": "africa", "SC": "africa", "SL": "africa", "SO": "africa",
  "ZA": "africa", "SS": "africa", "SD": "africa", "TZ": "africa", "TG": "africa",
  "TN": "africa", "UG": "africa", "ZM": "africa", "ZW": "africa",

  // North America
  "AG": "north-america", "BS": "north-america", "BB": "north-america", "BZ": "north-america",
  "CA": "north-america", "CR": "north-america", "CU": "north-america", "DM": "north-america",
  "DO": "north-america", "SV": "north-america", "GD": "north-america", "GT": "north-america",
  "HT": "north-america", "HN": "north-america", "JM": "north-america", "MX": "north-america",
  "NI": "north-america", "PA": "north-america", "KN": "north-america", "LC": "north-america",
  "VC": "north-america", "TT": "north-america", "US": "north-america",

  // South America
  "AR": "south-america", "BO": "south-america", "BR": "south-america", "CL": "south-america",
  "CO": "south-america", "EC": "south-america", "GY": "south-america", "PY": "south-america",
  "PE": "south-america", "SR": "south-america", "UY": "south-america", "VE": "south-america",

  // Oceania
  "AU": "oceania", "FJ": "oceania", "KI": "oceania", "MH": "oceania",
  "FM": "oceania", "NR": "oceania", "NZ": "oceania", "PW": "oceania",
  "PG": "oceania", "WS": "oceania", "SB": "oceania", "TO": "oceania",
  "TV": "oceania", "VU": "oceania",
};

// Get all countries from country-flag-emoji and map to our structure
export const countries: Country[] = countryFlagEmoji.list
  .map((flag) => ({
    name: flag.name,
    code: flag.code,
    emoji: flag.emoji,
    region: regionMapping[flag.code] || "other",
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

// Standard regions
export const standardRegions: Region[] = [
  { id: "all", name: "All regions" },
  { id: "europe", name: "Europe" },
  { id: "asia", name: "Asia" },
  { id: "africa", name: "Africa" },
  { id: "north-america", name: "North America" },
  { id: "south-america", name: "South America" },
  { id: "oceania", name: "Oceania" },
];

// Custom regions
export const customRegions: Region[] = [
  { id: "lotr", name: "Middle-earth", isCustom: true },
];

// All regions combined
export const allRegions: Region[] = [...standardRegions, ...customRegions];

// Helper function to get countries by region
export function getCountriesByRegion(regionId: string): Country[] {
  if (regionId === "all") return countries;
  return countries.filter((country) => country.region === regionId);
}

// Helper function to find country by name or code (fuzzy search)
export function findCountry(query: string): Country | undefined {
  const lowerQuery = query.toLowerCase().trim();
  return countries.find(
    (c) =>
      c.name.toLowerCase() === lowerQuery ||
      c.code.toLowerCase() === lowerQuery
  );
}

// Fuzzy search for countries
export function fuzzySearchCountries(query: string): Country[] {
  if (!query) return countries;
  const lowerQuery = query.toLowerCase();

  return countries.filter((country) => {
    const nameMatch = fuzzyMatch(country.name.toLowerCase(), lowerQuery);
    const codeMatch = country.code.toLowerCase().includes(lowerQuery);
    return nameMatch || codeMatch;
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

declare module "country-flag-emoji" {
  export interface CountryFlag {
    code: string;
    unicode: string;
    name: string;
    emoji: string;
  }

  const countryFlagEmoji: {
    data: Record<string, CountryFlag>;
    countryCodes: string[];
    list: CountryFlag[];
    get(code?: string): CountryFlag | CountryFlag[] | undefined;
  };

  export default countryFlagEmoji;
}

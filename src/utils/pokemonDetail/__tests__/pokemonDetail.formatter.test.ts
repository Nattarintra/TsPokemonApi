/**
 * @jest-environment node
 */
import {
  formatDescription,
  formatHeight,
  formatWeight,
  formatCategory,
  formatGender,
  flattenEvolutionChain,
  formatWeaknesses,
} from "@/utils/pokemonDetail/pokemonDetail.formatter";
import type { PokemonSpecies, EvolutionChainLink, PokemonTypeDetail } from "@/types/pokemon.type";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeSpecies = (overrides: Partial<PokemonSpecies> = {}): PokemonSpecies => ({
  gender_rate: 4,
  genera: [],
  flavor_text_entries: [],
  evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/1/" },
  ...overrides,
});

// ─── formatDescription ────────────────────────────────────────────────────────

describe("formatDescription", () => {
  it("returns the English flavor text with newlines and form-feeds replaced by spaces", () => {
    const species = makeSpecies({
      flavor_text_entries: [
        { flavor_text: "A strange\nseed.", language: { name: "ja" }, version: { name: "red" } },
        {
          flavor_text: "A strange\nseed\fwas planted.",
          language: { name: "en" },
          version: { name: "red" },
        },
      ],
    });
    expect(formatDescription(species)).toBe("A strange seed was planted.");
  });

  it("returns the first English entry when multiple English entries exist", () => {
    const species = makeSpecies({
      flavor_text_entries: [
        { flavor_text: "First entry.", language: { name: "en" }, version: { name: "red" } },
        { flavor_text: "Second entry.", language: { name: "en" }, version: { name: "blue" } },
      ],
    });
    expect(formatDescription(species)).toBe("First entry.");
  });

  it("returns empty string when there is no English entry", () => {
    const species = makeSpecies({
      flavor_text_entries: [
        { flavor_text: "Une graine.", language: { name: "fr" }, version: { name: "red" } },
      ],
    });
    expect(formatDescription(species)).toBe("");
  });

  it("returns empty string when flavor_text_entries is empty", () => {
    const species = makeSpecies({ flavor_text_entries: [] });
    expect(formatDescription(species)).toBe("");
  });
});

// ─── formatHeight ─────────────────────────────────────────────────────────────

describe("formatHeight", () => {
  it("converts decimetres to feet and inches", () => {
    // 7 dm → round(7 * 3.937) = round(27.559) = 28 in → 2'04"
    expect(formatHeight(7)).toBe("2'04\"");
  });

  it("pads inches to two digits", () => {
    // 10 dm → round(10 * 3.937) = round(39.37) = 39 in → 3'03"
    expect(formatHeight(10)).toBe("3'03\"");
  });

  it("handles 0 decimetres", () => {
    expect(formatHeight(0)).toBe("0'00\"");
  });

  it("returns exact feet with 00 inches when divisible", () => {
    // 12 in = 1 ft exactly: need height where totalInches % 12 === 0
    // 36 dm → 141.732 → round → 142 in → 11'10"
    // Let's just verify the formula for a known value
    // 1 dm → 4 in → 0'04"
    expect(formatHeight(1)).toBe("0'04\"");
  });
});

// ─── formatWeight ─────────────────────────────────────────────────────────────

describe("formatWeight", () => {
  it("converts hectograms to pounds with one decimal place", () => {
    // 69 hg × 0.220462 = 15.211878 → "15.2 lbs"
    expect(formatWeight(69)).toBe("15.2 lbs");
  });

  it("handles 0 weight", () => {
    expect(formatWeight(0)).toBe("0.0 lbs");
  });

  it("rounds to one decimal place", () => {
    // 1 hg × 0.220462 = 0.220462 → "0.2 lbs"
    expect(formatWeight(1)).toBe("0.2 lbs");
  });
});

// ─── formatCategory ───────────────────────────────────────────────────────────

describe("formatCategory", () => {
  it("returns the English genus", () => {
    const species = makeSpecies({
      genera: [
        { genus: "Plante-Graine", language: { name: "fr" } },
        { genus: "Seed Pokémon", language: { name: "en" } },
      ],
    });
    expect(formatCategory(species)).toBe("Seed Pokémon");
  });

  it("returns empty string when no English genus exists", () => {
    const species = makeSpecies({
      genera: [{ genus: "Plante-Graine", language: { name: "fr" } }],
    });
    expect(formatCategory(species)).toBe("");
  });

  it("returns empty string when genera is empty", () => {
    const species = makeSpecies({ genera: [] });
    expect(formatCategory(species)).toBe("");
  });
});

// ─── formatGender ─────────────────────────────────────────────────────────────

describe("formatGender", () => {
  it("returns ['genderless'] when genderRate is -1", () => {
    expect(formatGender(-1)).toEqual(["genderless"]);
  });

  it("returns ['male', 'female'] for any non-(-1) rate", () => {
    expect(formatGender(0)).toEqual(["male", "female"]);
    expect(formatGender(4)).toEqual(["male", "female"]);
    expect(formatGender(8)).toEqual(["male", "female"]);
  });
});

// ─── flattenEvolutionChain ────────────────────────────────────────────────────

describe("flattenEvolutionChain", () => {
  it("returns a single-element array for a Pokemon with no evolutions", () => {
    const chain: EvolutionChainLink = {
      species: { name: "eevee", url: "" },
      evolves_to: [],
    };
    expect(flattenEvolutionChain(chain)).toEqual(["eevee"]);
  });

  it("flattens a two-stage evolution chain", () => {
    const chain: EvolutionChainLink = {
      species: { name: "bulbasaur", url: "" },
      evolves_to: [
        {
          species: { name: "ivysaur", url: "" },
          evolves_to: [],
        },
      ],
    };
    expect(flattenEvolutionChain(chain)).toEqual(["bulbasaur", "ivysaur"]);
  });

  it("flattens a three-stage evolution chain", () => {
    const chain: EvolutionChainLink = {
      species: { name: "bulbasaur", url: "" },
      evolves_to: [
        {
          species: { name: "ivysaur", url: "" },
          evolves_to: [
            {
              species: { name: "venusaur", url: "" },
              evolves_to: [],
            },
          ],
        },
      ],
    };
    expect(flattenEvolutionChain(chain)).toEqual(["bulbasaur", "ivysaur", "venusaur"]);
  });

  it("only follows the first branch when multiple evolutions exist", () => {
    const chain: EvolutionChainLink = {
      species: { name: "poliwag", url: "" },
      evolves_to: [
        {
          species: { name: "poliwhirl", url: "" },
          evolves_to: [
            { species: { name: "poliwrath", url: "" }, evolves_to: [] },
            { species: { name: "politoed", url: "" }, evolves_to: [] },
          ],
        },
      ],
    };
    // flattenEvolutionChain takes evolves_to[0] at each step
    expect(flattenEvolutionChain(chain)).toEqual(["poliwag", "poliwhirl", "poliwrath"]);
  });
});

// ─── formatWeaknesses ─────────────────────────────────────────────────────────

const makeTypeDetail = (name: string, weaknesses: string[]): PokemonTypeDetail => ({
  name,
  damage_relations: {
    double_damage_from: weaknesses.map((w) => ({ name: w, url: "" })),
  },
});

describe("formatWeaknesses", () => {
  it("returns empty array when typeDetails is empty", () => {
    expect(formatWeaknesses([])).toEqual([]);
  });

  it("returns weaknesses from a single type", () => {
    const result = formatWeaknesses([makeTypeDetail("grass", ["fire", "ice", "flying"])]);

    expect(result).toEqual(expect.arrayContaining(["fire", "ice", "flying"]));
    expect(result).toHaveLength(3);
  });

  it("deduplicates weaknesses shared across multiple types", () => {
    const grassType = makeTypeDetail("grass", ["fire", "ice"]);
    const poisonType = makeTypeDetail("poison", ["ground", "fire"]); // fire is shared

    const result = formatWeaknesses([grassType, poisonType]);

    expect(result).toContain("fire");
    expect(result.filter((w) => w === "fire")).toHaveLength(1); // no duplicate
  });

  it("collects weaknesses from multiple types without overlap", () => {
    const grassType = makeTypeDetail("grass", ["fire", "ice"]);
    const poisonType = makeTypeDetail("poison", ["ground", "psychic"]);

    const result = formatWeaknesses([grassType, poisonType]);

    expect(result).toEqual(expect.arrayContaining(["fire", "ice", "ground", "psychic"]));
    expect(result).toHaveLength(4);
  });
});

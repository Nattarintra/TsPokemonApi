/**
 * @jest-environment node
 */
import { jest, describe, it, expect, beforeAll, afterEach } from "@jest/globals";
import type { PokemonListItem, PokemonListResult } from "@/types/pokemon.type";
import { env } from "@/config/env";

const mockFetchPokemonList = jest.fn<() => Promise<PokemonListItem[]>>();
const mockFetchPokemonDetails = jest.fn<(list: PokemonListItem[]) => Promise<PokemonListResult>>();

jest.unstable_mockModule("@/api/pokemon.api", () => ({
    fetchPokemonList: mockFetchPokemonList,
    fetchPokemonDetails: mockFetchPokemonDetails,
}));

// import after mock and use beforeAll
let getPokemonListData: typeof import("@/api/pokemon.service")["getPokemonListData"];
let formatPokemon: typeof import("@/api/pokemon.service")["formatPokemon"];

beforeAll(async () => {
    const module = await import("@/api/pokemon.service");
    getPokemonListData = module.getPokemonListData;
    formatPokemon = module.formatPokemon;
});
describe("Pokemon Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("formatPokemon", () => {
        it("maps raw Pokemon API response to the App's UI data format", () => {
            const rawPokemon: any = {
                id: 25,
                name: "pikachu",
                sprites: {
                    other: {
                        "official-artwork": {
                            front_default: "https://raw.githubusercontent.com/PokeAPI/img/25.png"
                        }
                    }
                },
                types: [
                    { type: { name: "electric" } }
                ]
            };

            const result = formatPokemon(rawPokemon);

            expect(result).toEqual({
                id: 25,
                name: "pikachu",
                image: "https://raw.githubusercontent.com/PokeAPI/img/25.png",
                types: ["electric"] // Flattens array internally
            });
        });
    });

    describe("getPokemonListData", () => {
        it("orchestrates fetch list, details, and formatting while injecting delays correctly", async () => {
            // 1. Setup our dummy data
            const mockList = [{ name: "pikachu", url: "https://poke.api/25" }];
            const rawPikachu: any = {
                id: 25,
                name: "pikachu",
                sprites: { other: { "official-artwork": { front_default: "img.png" } } },
                types: [{ type: { name: "electric" } }]
            };
            const mockDetails: PokemonListResult = {
                pokemons: [rawPikachu],
                failed: 0
            };



            // 2. Assign the dummy data to the mocked fetch functions
            mockFetchPokemonList.mockResolvedValue(mockList);
            mockFetchPokemonDetails.mockResolvedValue(mockDetails);

            // 3. Temporarily bypass the intentional UI delay for speed
            const originalDelay = env.delayTime;
            (env as any).delayTime = 0;

            // 4. Actually run our function
            const result = await getPokemonListData();

            // 5. Assert (Verify expectations)
            expect(mockFetchPokemonList).toHaveBeenCalledTimes(1);
            expect(mockFetchPokemonDetails).toHaveBeenCalledWith(mockList);

            // Should successfully pass mapped data back
            expect(result.failed).toBe(0);
            expect(result.pokemons).toHaveLength(1);
            expect(result.pokemons[0].name).toBe("pikachu");
            expect(result.pokemons[0].types).toEqual(["electric"]);

            // Restore delay for other tests
            (env as any).delayTime = originalDelay;
        });
    });
});

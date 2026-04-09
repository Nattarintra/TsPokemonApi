// src/theme/tokens/statColors.ts
export const statColors = {
  hp: "#FF5959",
  attack: "#F5AC78",
  defense: "#FAE078",
  "special-attack": "#9DB7F5",
  "special-defense": "#A7DB8D",
  speed: "#FA92B2",
} as const;

export type StatName = keyof typeof statColors;

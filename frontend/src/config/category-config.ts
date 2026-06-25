import type { CategoryId } from "#/types.ts";

type CategoryConfig = {
  id: CategoryId;
  label: string;
  emoji: string;
  color: string;
};

export const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    id: "katze",
    label: "Katze",
    emoji: "🐱",
    color: "#d4a8e0",
  },
  {
    id: "hund",
    label: "Hund",
    emoji: "🐶",
    color: "#a8c8e8",
  },
  {
    id: "reptil",
    label: "Reptil",
    emoji: "🐢",
    color: "#a8d4b8",
  },
  {
    id: "pflanze",
    label: "Pflanze",
    emoji: "🌿",
    color: "#c8d8a0",
  },
  {
    id: "sonstiges",
    label: "Sonstiges",
    emoji: "✨",
    color: "#f0c898",
  },
];

export function getCategoryConfig(key: CategoryId): CategoryConfig {
  const cat = CATEGORY_CONFIGS.find((c) => c.id === key);
  if (!cat) {
    throw new Error(`Invalid categoryId: '${key}'`);
  }

  return cat;
}

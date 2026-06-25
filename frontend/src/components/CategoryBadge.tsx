import { twMerge } from "tailwind-merge";

import { getCategoryConfig } from "#/config/category-config.ts";
import type { CategoryId } from "#/types.ts";

type CategoryBadgeProps = {
  category: CategoryId;
  size?: "sm" | "lg";
};

export function CategoryBadge({ category, size = "sm" }: CategoryBadgeProps) {
  const cat = getCategoryConfig(category);
  const emojiSize = size === "lg" ? 16 : 13;

  return (
    <span
      className={twMerge(
        "category-badge",
        `category-${category}`,
        size === "lg" ? "category-badge-lg" : "category-badge-sm",
      )}
    >
      <span style={{ fontSize: emojiSize }}>{cat.emoji}</span>
      {cat.label}
    </span>
  );
}

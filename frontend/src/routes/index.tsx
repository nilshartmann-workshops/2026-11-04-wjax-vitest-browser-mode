import { createFileRoute } from "@tanstack/react-router";

import HeroSection from "#/components/HeroSection.tsx";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div>
      <HeroSection />
    </div>
  );
}

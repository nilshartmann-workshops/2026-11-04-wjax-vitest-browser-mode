import { Link } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";

export default function HeroSection() {
  // Zeigen: INITIAL läuft das Log im Server-Terminal UND in der Browser-Konsole
  // (Hydration). Ab #04 (HeroSection wird RSC) nur noch im Server-Terminal.
  const now = new Date();
  console.log(
    "[LandingPage] render —",
    `${now.toLocaleTimeString("de-DE", { hour12: false })}.${String(now.getMilliseconds()).padStart(3, "0")}`,
  );

  return (
    <>
      <FloatingAnimals />

      <div className="hero hero-main">
        <div className="hero-blobs">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />
        </div>

        <FloatingBalloons />

        <div className="hero-content">
          <div className="hero-emoji">🏠</div>
          <h1 className="hero-title">
            Dein Tier.
            <br />
            <em>Dein Urlaub.</em>
            <br />
            <span className="hero-strike">Dein</span>{" "}
            <span className="hero-relax">Kein Stress.</span>
          </h1>

          <p className="hero-description">
            Finde liebevolle Betreuung für Tier & Pflanze — oder biete selbst
            Hilfe an.
          </p>

          <div className="hero-actions">
            <Link to="/posts" search={{}} className="btn-hero-primary">
              Alle Gesuche ansehen →
            </Link>
            <Link to="/posts/new" className="btn-hero-secondary">
              Gesuch einstellen
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-about">
        <div className="hero-blobs">
          <div className="hero-blob hero-blob-a1" />
          <div className="hero-blob hero-blob-a2" />
        </div>
        <div className="hero-content-about">
          <div className="hero-emoji-about">🏠</div>
          <h1 className="hero-title-about">
            Urlaub ohne Seiteneffekte —<br />
            <em>endlich.</em>
          </h1>
          <p className="hero-description-about">
            hütly verbindet Tierbesitzer mit hilfsbereiten Menschen aus der
            Nachbarschaft. Kostenlos, unkompliziert, und mit überraschend vielen
            TypeScript-Fans. Die einzige Spannung bleibt{" "}
            <code className="hero-code">{"<Suspense>"}</code> — und die löst
            sich dank TanStack Start ganz von allein auf.
          </p>
        </div>
      </div>

      <TechSection />
    </>
  );
}

type BalloonProps = {
  label: string;
  bg: string;
  color: string;
  cls: string;
  left: string;
};

function Balloon({ label, bg, color, cls, left }: BalloonProps) {
  return (
    <div
      className={twMerge("floating-balloon", cls)}
      style={
        {
          "--balloon-color": bg,
          background: bg,
          color,
          left,
          boxShadow: `inset -3px -4px 8px rgba(0,0,0,0.08), 0 4px 16px ${bg}aa`,
        } as React.CSSProperties
      }
    >
      {label}
    </div>
  );
}

function FloatingBalloons() {
  return (
    <>
      <Balloon
        label="Kein useEffect!"
        bg="#a8d4b8"
        color="#2a6645"
        cls="balloon-rise-0"
        left="10%"
      />
      <Balloon
        label="Mit TanStack! 🚀"
        bg="#a8c8e8"
        color="#2a5f8a"
        cls="balloon-rise-1"
        left="48%"
      />
      <Balloon
        label="100% SSR-ready"
        bg="#f0c898"
        color="#8a5020"
        cls="balloon-rise-2"
        left="76%"
      />
    </>
  );
}

type FloatingAnimalProps = {
  emoji: string;
  cls: string;
  left: string;
};

function FloatingAnimal({ emoji, cls, left }: FloatingAnimalProps) {
  return (
    <div className={twMerge("floating-animal", cls)} style={{ left }}>
      {emoji}
    </div>
  );
}

function FloatingAnimals() {
  return (
    <>
      <FloatingAnimal emoji="🐾" cls="animal-rise-0" left="6%" />
      <FloatingAnimal emoji="🐢" cls="animal-rise-1" left="20%" />
      <FloatingAnimal emoji="🐱" cls="animal-rise-2" left="58%" />
      <FloatingAnimal emoji="🐠" cls="animal-rise-3" left="75%" />
      <FloatingAnimal emoji="🌿" cls="animal-rise-4" left="88%" />
    </>
  );
}

type TechCardProps = {
  emoji: string;
  name: string;
  text: string;
};

function TechCard({ emoji, name, text }: TechCardProps) {
  return (
    <div className="about-tech-card">
      <div className="about-tech-card-emoji">{emoji}</div>
      <div className="about-tech-card-name">{name}</div>
      <p className="about-tech-card-text">{text}</p>
    </div>
  );
}

function TechSection() {
  return (
    <div className="about-tech-section">
      <div className="page-wrapper-lg">
        <h2 className="about-tech-section-title">Unter der Haube</h2>
        <p className="about-tech-section-sub">
          Für die Nerds unter den Tierbesitzern.
        </p>
        <div className="about-tech-grid">
          <TechCard
            emoji="⚛️"
            name="React 19"
            text="Jedes Tier verdient einen frischen Re-render. Concurrent Mode sorgt dafür, dass selbst deine Schildkröte nicht wartet."
          />
          <TechCard
            emoji="🔄"
            name="TanStack Query"
            text="Deine Katze cached ihre Zuneigung nicht. TanStack Query cached dafür alles andere — stale-while-revalidate inklusive."
          />
          <TechCard
            emoji="📘"
            name="TypeScript"
            text="Strenger als ein Papagei beim Vokabeltraining. Aber dafür beschwert sich der Compiler, bevor dein Hamster es tut."
          />
          <TechCard
            emoji="🚀"
            name="TanStack Start"
            text="SSR für Schildkröten: Damit der erste Paint fertig ist, bevor dein Tier überhaupt merkt, dass du weg bist."
          />
          <TechCard
            emoji="🦮"
            name="Zod"
            text="Validiert Formulardaten gnadenloser als ein Hund sein Leckerli kontrolliert. Falsches Schema? Ein klares no."
          />
        </div>
      </div>
    </div>
  );
}

export type Category = "katze" | "hund" | "reptil" | "pflanze" | "sonstiges";

export interface Post {
  id: string;
  title: string;
  author: string;
  description: string;
  animal: string;
  timeframe: string;
  location: string;
  category: Category;
  interested: number;
  createdAt: string;
}

export interface Offer {
  id: string;
  postId: string;
  author: string;
  text: string;
  createdAt: string;
}

let postIdCounter = 11;
let offerIdCounter = 7;

export function nextPostId(): string {
  return `r${postIdCounter++}`;
}

export function nextOfferId(): string {
  return `o${offerIdCounter++}`;
}

export const posts: Post[] = [
  {
    id: "r1",
    title: "Wer kümmert sich um meine Landschildkröten?",
    author: "hilde_offline",
    description:
      "Zwei sehr entspannte Landschildkröten suchen liebevolle Urlaubsbetreuung.\n\n**Emilia** und **Franz** sind seit 8 Jahren bei mir und kennen ihre Routine in- und auswendig. Kein Drama, kein Fluchtversuch.\n\nWas du mitbringen solltest:\n\n- Geduld beim Salatschneiden (Bio bitte, sie schmecken den Unterschied)\n- Bereitschaft, täglich das Freigehege zu kontrollieren\n- Keine Angst vor Reptilien\n\nEine ausführliche Pflegeanleitung liegt **ausgedruckt neben dem Gehege** -- alles Wichtige Schritt für Schritt erklärt.",
    animal: "2 Landschildkröten",
    timeframe: "3 Wochen im Juli",
    location: "Hamburg-Altona",
    category: "reptil",
    interested: 42,
    createdAt: "2026-06-10T10:00:00Z",
  },
  {
    id: "r2",
    title: "Katze Gandalf braucht tägliche Audienz",
    author: "tolkien_ts",
    description:
      "Gandalf ist ein 7-jähriger Kater mit **sehr klaren Vorstellungen**. Er erwartet täglich Gesellschaft, Futter pünktlich um 8 und 18 Uhr, und absolut keine Veränderungen seiner Routine.\n\nWas bedeutet das konkret?\n\n- Futternapf immer links vom Wassernapf\n- Kissen auf dem Sofa bleibt wo es ist\n- Kein Besuch unter der Woche\n\nErfahrung mit eigenwilligen Katzen ist ein **großes Plus**.",
    animal: "1 Katze, sehr eigenwillig",
    timeframe: "10 Tage im August",
    location: "Berlin-Mitte",
    category: "katze",
    interested: 35,
    createdAt: "2026-04-12T14:30:00Z",
  },
  {
    id: "r3",
    title: "Hund ignoriert console.log, braucht Gassi",
    author: "felix.node",
    description:
      "Bello ist ein **fröhlicher Labrador**, der zweimal täglich Gassi braucht und am liebsten durch den Park tobt.\n\nSein Tagesablauf:\n\n- Morgens: große Runde im Park (mindestens 45 Minuten)\n- Mittags: kurze Pipi-Runde um den Block\n- Abends: noch mal ausgiebig toben\n\nBello ist **kinderlieb** und kommt mit anderen Hunden bestens zurecht. Leckerlis sind im Schrank, aber bitte **nicht überfüttern** -- er bettelt sehr überzeugend.",
    animal: "Labrador, 3 Jahre",
    timeframe: "jedes Wochenende im Mai",
    location: "München-Schwabing",
    category: "hund",
    interested: 28,
    createdAt: "2026-04-14T09:15:00Z",
  },
  {
    id: "r4",
    title: "Axolotl-Pärchen sucht erfahrene Urlaubsbetreuung",
    author: "aqua.dev",
    description:
      "Zwei Axolotl (bitte nicht erschrecken, **die sehen einfach so aus**) suchen erfahrene Urlaubsbetreuung.\n\nWas zu tun ist:\n\n- Täglich Wassertemperatur prüfen (max. **20 Grad C**, sonst wird es kritisch)\n- Alle zwei Tage füttern (Pellets in der Dose neben dem Becken)\n- Einmal pro Woche Teilwasserwechsel\n\nWichtig: **niemals anfassen** und keine plötzlichen Erschütterungen am Aquarium. Aquarium-Erfahrung ist sehr hilfreich.",
    animal: "2 Axolotl (bitte nicht erschrecken)",
    timeframe: "2 Wochen im Juni",
    location: "Hamburg-Eimsbüttel",
    category: "reptil",
    interested: 22,
    createdAt: "2026-04-15T11:00:00Z",
  },
  {
    id: "r5",
    title: "3 Hühner suchen temporären DevOps",
    author: "farm.tsx",
    description:
      "Drei Hühner suchen einen temporären DevOps für ihren Stall. Die Crew:\n\n- **Henrietta** -- die Chefin, pickt zuerst\n- **Helga** -- entspannt, legt am zuverlässigsten\n- **HTML** -- jung, chaotisch, braucht manchmal eine Extra-Einladung in den Stall\n\nTägliche Aufgaben:\n\n- Morgens Stall öffnen, Futter und frisches Wasser\n- Eier einsammeln (meist **2 bis 3 pro Tag**)\n- Abends Stall sicher verschließen (Fuchs!)\n\nKein Vorwissen nötig, die drei sind **sehr gutmütig**.",
    animal: "3 Hühner, legen täglich",
    timeframe: "1 Woche Pfingsten",
    location: "Bremen",
    category: "sonstiges",
    interested: 17,
    createdAt: "2026-05-21T08:00:00Z",
  },
  {
    id: "r6",
    title: "Kaktus muss einmal im Monat gegossen werden",
    author: "lazy_gardener",
    description:
      "Ein **sehr genügsamer Kaktus** sucht jemanden, der ihn nicht komplett vergisst.\n\nDie gute Nachricht: Der Pflegeaufwand ist **minimal**.\n\n- **Einmal im Monat** gießen, ein kleines Glas Wasser reicht\n- Heller Standort, gerne am Fenster\n- Auf keinen Fall überwässern -- das ist die einzige echte Gefahr\n\nWer also wenig Zeit hat, aber trotzdem helfen möchte: **Das ist dein Gesuch.** Schiefgehen kann hier fast nichts.",
    animal: "1 Kaktus, sehr genügsam",
    timeframe: "ganzer Sommer",
    location: "Köln-Ehrenfeld",
    category: "pflanze",
    interested: 12,
    createdAt: "2026-05-19T16:45:00Z",
  },
  {
    id: "r7",
    title: "Bartagame Thorin isst nur Bio-Salat",
    author: "thorin_dev",
    description:
      "Thorin ist eine 4-jährige Bartagame mit **gehobenen Ansprüchen**. Er frisst ausschließlich Bio-Salat und inspiziert jede Portion misstrauisch.\n\nTerrarien-Eckdaten:\n\n- Warmzone: **38-42 Grad C** (UV-Strahler, Zeitschaltuhr bereits eingestellt)\n- Kühlzone: 26-28 Grad C\n- Licht: 12 h täglich, keine Ausnahmen\n\nFütterung:\n\n- Morgens: Rucola, Feldsalat, gelegentlich Löwenzahn\n- 3x pro Woche: Insekten (Schachtel im Kühlschrank, bitte nicht erschrecken)\n\nAlles Weitere erkläre ich beim **kurzen Einführungstermin** vor Ort.",
    animal: "Bartagame, 4 Jahre",
    timeframe: "5 Tage im September",
    location: "Frankfurt",
    category: "reptil",
    interested: 8,
    createdAt: "2026-04-18T12:00:00Z",
  },
  {
    id: "r8",
    title: "Zwei Katzen, eine davon senior developer",
    author: "sara.jsx",
    description:
      "Zwei Katzen, zwei Temperamente -- beide brauchen Betreuung mit Fingerspitzengefühl.\n\n- **Mimi (14)** ist die ruhige Senior-Katze. Schläft viel, mag ihre Ruhe, braucht **Medikamente** (Tablette morgens ins Futter)\n- **Pixel (2)** ist das chaotische Junior-Mitglied. Spielt gern, klettert überall hoch, will **viel Beschäftigung**\n\nWichtig:\n\n- Getrennte Futternäpfe, sonst frisst Pixel auch Mimis Portion\n- Tägliche Streicheleinheiten für beide\n- Katzenklo zweimal täglich kontrollieren\n\nDie beiden beaufsichtigen sich gegenseitig -- meistens jedenfalls.",
    animal: "Mimi (14) und Pixel (2)",
    timeframe: "2 Wochen im Juli",
    location: "Hamburg-Barmbek",
    category: "katze",
    interested: 5,
    createdAt: "2026-05-20T10:30:00Z",
  },
  {
    id: "r9",
    title: "Zimmerpflanzen-WG sucht Urlaubspfleger",
    author: "plant_parent",
    description:
      "12 Zimmerpflanzen suchen jemanden mit **grünem Daumen**, oder zumindest gutem Willen.\n\nDie WG besteht aus:\n\n- **Monstera Deliciosa** \"Hildegard\": wöchentlich, mag Kalk nicht\n- **Ficus Lyrata** \"Konrad\": alle 10 Tage, **kein Zugluft!**\n- 2x Orchidee: nur Tauchen, nie eingießen\n- 8 weitere (vollständige Liste + Gießplan liegt auf dem Küchentisch)\n\nEine ausführliche Einführung gibt es vorab. Es liegt auch ein **schriftlicher Gießkalender** bereit, der genau festhält, wann welche Pflanze dran ist.",
    animal: "12 Zimmerpflanzen (Liste vorhanden)",
    timeframe: "3 Wochen August",
    location: "Berlin-Prenzlauer Berg",
    category: "pflanze",
    interested: 3,
    createdAt: "2026-05-18T15:00:00Z",
  },
  {
    id: "r10",
    title: "Goldfisch Nemo findet sich selbst nicht",
    author: "nemo.js",
    description:
      "Nemo ist ein **philosophischer Goldfisch** mit existenziellen Fragen. Er braucht nicht viel, aber das Wenige zuverlässig.\n\nWas Nemo braucht:\n\n- **Einmal täglich** eine kleine Prise Futter (nicht mehr, er kennt kein Maß)\n- Einmal pro Woche etwas Wasser tauschen\n- Gelegentlich jemanden, der **über sein Dasein nachdenkt**\n\nNemo stellt keine hohen Ansprüche -- nur die Frage nach dem Sinn von allem. Beantworten musst du sie nicht, **zuhören reicht**.",
    animal: "1 Goldfisch, philosophisch",
    timeframe: "verlängertes Wochenende",
    location: "Düsseldorf",
    category: "sonstiges",
    interested: 1,
    createdAt: "2026-04-21T13:00:00Z",
  },
];

export const offers: Offer[] = [
  {
    id: "o1",
    postId: "r1",
    author: "reptil_fan_93",
    text: "Habe selbst zwei Bartagamen und kenne mich mit Reptilien aus. Gerne!",
    createdAt: "2026-04-10T11:30:00Z",
  },
  {
    id: "o2",
    postId: "r1",
    author: "schildi_lover",
    text: "Kann täglich vorbeikommen, wohne zwei Straßen weiter.",
    createdAt: "2026-04-11T09:00:00Z",
  },
  {
    id: "o3",
    postId: "r2",
    author: "cat_whisperer",
    text: "Katzen liebe ich — auch eigenwillige. Melde mich!",
    createdAt: "2026-04-13T10:00:00Z",
  },
  {
    id: "o4",
    postId: "r5",
    author: "farmgirl_77",
    text: "Hühner kein Problem, habe auf einem Bauernhof groß gelernt.",
    createdAt: "2026-04-16T14:00:00Z",
  },
  {
    id: "o5",
    postId: "r6",
    author: "green_thumb",
    text: "Pflanzen sind meine Spezialität, Kaktus erst recht.",
    createdAt: "2026-04-18T11:00:00Z",
  },
  {
    id: "o6",
    postId: "r10",
    author: "philosophy_fan",
    text: "Habe Erfahrung mit Goldfischen und existenziellen Krisen.",
    createdAt: "2026-04-22T08:30:00Z",
  },
];

type CategoryKeywords = { category: string; keywords: string[] };

const KEYWORD_MAP: CategoryKeywords[] = [
  { category: "Mobile Mechanic", keywords: ["alternator", "alternador", "battery", "bateria", "engine", "motor", "car wont start", "no enciende", "brakes", "frenos", "oil change", "cambio de aceite", "transmission", "transmision", "mechanic", "mecanico", "car repair", "reparacion de carro"] },
  { category: "Tow Service", keywords: ["tow", "grua", "towing", "stuck", "atascado", "accident", "accidente", "broke down", "se descompuso"] },
  { category: "Auto Detailing", keywords: ["detailing", "detallado", "car wash", "lavado de carro", "wax", "cera", "interior clean", "limpieza interior"] },
  { category: "Tire Service", keywords: ["tire", "llanta", "flat tire", "llanta ponchada", "wheel", "rueda", "alignment", "alineacion"] },
  { category: "Body Shop", keywords: ["body shop", "taller de hojalateria", "dent", "abolladura", "paint job car", "pintura de carro", "bumper", "defensa"] },
  { category: "Landscaping", keywords: ["landscaping", "jardineria", "lawn", "cesped", "grass", "pasto", "tree trimming", "poda de arboles", "sprinkler", "aspersor", "yard", "patio"] },
  { category: "Cleaning", keywords: ["cleaning", "limpieza", "house cleaning", "limpieza de casa", "maid", "sirvienta", "deep clean", "limpieza profunda"] },
  { category: "Painting", keywords: ["painting", "pintura", "paint house", "pintar casa", "painter", "pintor"] },
  { category: "Remodeling", keywords: ["remodeling", "remodelacion", "renovation", "renovacion", "kitchen remodel", "remodelacion de cocina", "bathroom remodel", "remodelacion de baño"] },
  { category: "Plumber", keywords: ["plumber", "plomero", "plumbing", "plomeria", "leak", "fuga", "pipe", "tuberia", "clogged", "tapado", "toilet", "inodoro", "water heater", "calentador de agua"] },
  { category: "Electrician", keywords: ["electrician", "electricista", "electrical", "electrico", "wiring", "cableado", "outlet", "contacto electrico", "breaker", "power outage", "sin luz"] },
  { category: "Pool Services", keywords: ["pool", "alberca", "piscina", "pool cleaning", "limpieza de alberca", "pool repair"] },
  { category: "Roofing", keywords: ["roof", "techo", "roofing", "techado", "roof leak", "gotera", "shingles", "tejas"] },
  { category: "Appliance Repair", keywords: ["appliance", "electrodomestico", "refrigerator", "refrigerador", "washer", "lavadora", "dryer", "secadora", "dishwasher", "lavavajillas", "stove", "estufa"] },
  { category: "Flooring", keywords: ["flooring", "piso", "floor installation", "instalacion de piso", "tile", "azulejo", "laminate", "laminado"] },
  { category: "Beauty Services", keywords: ["beauty", "belleza", "hair", "cabello", "nails", "uñas", "makeup", "maquillaje", "salon"] },
  { category: "Florist", keywords: ["florist", "florista", "flowers", "flores", "bouquet", "ramo"] },
  { category: "Construction", keywords: ["construction", "construccion", "contractor", "contratista", "addition", "ampliacion", "foundation", "cimientos"] },
];

export function matchCategory(query: string): string | null {
  const lower = query.toLowerCase().trim();
  if (!lower) return null;

  for (const entry of KEYWORD_MAP) {
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword)) {
        return entry.category;
      }
    }
  }

  return null;
}

const CATEGORY_ES: Record<string, string> = {
  "Mobile Mechanic": "Mecánico Móvil",
  "Tow Service": "Servicio de Grúa",
  "Auto Detailing": "Detallado de Autos",
  "Tire Service": "Servicio de Llantas",
  "Body Shop": "Taller de Hojalatería",
  "Landscaping": "Jardinería",
  "Cleaning": "Limpieza",
  "Painting": "Pintura",
  "Remodeling": "Remodelación",
  "Plumber": "Plomero",
  "Electrician": "Electricista",
  "Pool Services": "Servicios de Alberca",
  "Roofing": "Techado",
  "Appliance Repair": "Reparación de Electrodomésticos",
  "Flooring": "Pisos",
  "Beauty Services": "Servicios de Belleza",
  "Florist": "Florería",
  "Construction": "Construcción",
  "Artificial Turf": "Césped Artificial",
  "Others": "Otros",
};

export function getCategoryLabel(name: string, language: "en" | "es"): string {
  if (language === "es" && CATEGORY_ES[name]) {
    return CATEGORY_ES[name];
  }
  return name;
}

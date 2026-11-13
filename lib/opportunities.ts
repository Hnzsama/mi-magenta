import opportunitiesData from "@/data/opportunities.json";

export interface OpportunityLocation {
  city: string;
  province: string;
  address: string;
}

export interface OpportunityContact {
  phone: string;
  email?: string;
}

export interface Opportunity {
  id: string;
  type: "stupen" | "magang";
  company: string;
  slug: string;
  roles: string[];
  divisions: string[];
  categories: string[];
  mode: "Mandiri" | "Tim";
  location: OpportunityLocation;
  contact: OpportunityContact;
  batch: string;
  description: string;
  requirements?: string[];
  benefits?: string[];
  slots?: number;
  featured?: boolean;
}

export function getAllOpportunities(): Opportunity[] {
  return opportunitiesData as Opportunity[];
}

export function getOpportunityBySlug(slug: string): Opportunity | undefined {
  return (opportunitiesData as Opportunity[]).find((item) => item.slug === slug);
}

export function getOpportunitiesByType(type: "stupen" | "magang"): Opportunity[] {
  return (opportunitiesData as Opportunity[]).filter((item) => item.type === type);
}

export function getRelatedOpportunities(currentId: string, limit = 3): Opportunity[] {
  const current = (opportunitiesData as Opportunity[]).find((item) => item.id === currentId);
  if (!current) return (opportunitiesData as Opportunity[]).slice(0, limit);

  return (opportunitiesData as Opportunity[])
    .filter(
      (item) =>
        item.id !== currentId &&
        (item.type === current.type ||
          item.categories.some((cat) => current.categories.includes(cat)) ||
          item.divisions.some((div) => current.divisions.includes(div)))
    )
    .slice(0, limit);
}

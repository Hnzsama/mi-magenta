"use client";

import { useState, useMemo, useEffect } from "react";
import { Opportunity } from "@/lib/opportunities";
import { OpportunityCard } from "./opportunity-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MagnifyingGlass, 
  Funnel, 
  X, 
  GraduationCap, 
  Briefcase, 
  Building,
  SquaresFour,
  Check
} from "@phosphor-icons/react";

interface OpportunityListProps {
  initialItems: Opportunity[];
  defaultType?: "all" | "stupen" | "magang";
}

export function OpportunityList({ initialItems, defaultType = "all" }: OpportunityListProps) {
  const [items, setItems] = useState<Opportunity[]>(initialItems);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "stupen" | "magang">(defaultType);
  const [selectedMode, setSelectedMode] = useState<"all" | "Mandiri" | "Tim">("all");
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeFilterTab, setActiveFilterTab] = useState<"divisions" | "roles" | "categories">("divisions");

  // Load custom/imported opportunities from admin session
  useEffect(() => {
    try {
      const customRaw = localStorage.getItem("mi_admin_custom_opportunities");
      if (customRaw) {
        const customParsed = JSON.parse(customRaw);
        if (Array.isArray(customParsed) && customParsed.length > 0) {
          const mapped: Opportunity[] = customParsed.map((c: any) => ({
            id: c.id || `custom-${Date.now()}-${Math.random()}`,
            type: c.type === "stupen" ? "stupen" : "magang",
            company: c.company || "Perusahaan Rekanan",
            slug: c.slug || `${(c.company || "mitra").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${(c.role || "posisi").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            roles: Array.isArray(c.roles) ? c.roles : [c.role || "Staff Magang"],
            divisions: Array.isArray(c.divisions) ? c.divisions : [c.division || "Umum"],
            categories: Array.isArray(c.categories) && c.categories.length > 0 ? c.categories : ["Teknologi Informasi"],
            mode: c.mode === "Tim" ? "Tim" : "Mandiri",
            location: {
              city: c.city || "Surabaya",
              province: c.province || "Jawa Timur",
              address: c.address || c.city || "Alamat belum diatur",
            },
            contact: {
              phone: c.phone || "08123456789",
            },
            batch: c.batch || "Angkatan 2023 Semester Genap",
            description: c.description || `Praktik magang dan studi terpadu di ${c.company}.`,
          }));
          setItems([...mapped, ...initialItems]);
          return;
        }
      }
    } catch {
      // ignore
    }
    setItems(initialItems);
  }, [initialItems]);

  // Aggregate all unique divisions
  const allDivisions = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      item.divisions.forEach((div) => set.add(div));
    });
    return Array.from(set).sort();
  }, [items]);

  // Aggregate all unique roles
  const allRoles = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      item.roles.forEach((r) => set.add(r));
    });
    return Array.from(set).sort();
  }, [items]);

  // Aggregate all unique categories
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      item.categories.forEach((cat) => set.add(cat));
    });
    return Array.from(set).sort();
  }, [items]);

  // Toggle handlers for multi-select arrays
  const toggleDivision = (division: string) => {
    setSelectedDivisions((prev) =>
      prev.includes(division) ? prev.filter((d) => d !== division) : [...prev, division]
    );
  };

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  // Filter logic: matches any selected division/role/category if filter array is not empty
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Type filter
      if (selectedType !== "all" && item.type !== selectedType) {
        return false;
      }
      // Mode filter
      if (selectedMode !== "all" && item.mode !== selectedMode) {
        return false;
      }
      // Divisions filter (must have at least one of the selected divisions)
      if (selectedDivisions.length > 0) {
        const hasDivision = item.divisions.some((d) => selectedDivisions.includes(d));
        if (!hasDivision) return false;
      }
      // Roles filter (must have at least one of the selected roles)
      if (selectedRoles.length > 0) {
        const hasRole = item.roles.some((r) => selectedRoles.includes(r));
        if (!hasRole) return false;
      }
      // Categories filter (must have at least one of the selected categories)
      if (selectedCategories.length > 0) {
        const hasCategory = item.categories.some((c) => selectedCategories.includes(c));
        if (!hasCategory) return false;
      }
      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const inCompany = item.company.toLowerCase().includes(q);
        const inRoles = item.roles.some((r) => r.toLowerCase().includes(q));
        const inDivisions = item.divisions.some((d) => d.toLowerCase().includes(q));
        const inCategories = item.categories.some((c) => c.toLowerCase().includes(q));
        const inCity = item.location.city.toLowerCase().includes(q);
        const inProvince = item.location.province.toLowerCase().includes(q);

        if (!inCompany && !inRoles && !inDivisions && !inCategories && !inCity && !inProvince) {
          return false;
        }
      }
      return true;
    });
  }, [
    items,
    selectedType,
    selectedMode,
    selectedDivisions,
    selectedRoles,
    selectedCategories,
    search,
  ]);

  const resetFilters = () => {
    setSearch("");
    setSelectedType("all");
    setSelectedMode("all");
    setSelectedDivisions([]);
    setSelectedRoles([]);
    setSelectedCategories([]);
  };

  const hasActiveFilters =
    search !== "" ||
    selectedType !== "all" ||
    selectedMode !== "all" ||
    selectedDivisions.length > 0 ||
    selectedRoles.length > 0 ||
    selectedCategories.length > 0;

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="rounded-2xl border bg-card p-4 sm:p-6 shadow-sm space-y-4">
        {/* Search input & reset */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari perusahaan, role (Data Analyst), divisi (Web Dev), atau kota..."
              className="pl-10 h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Hapus kata kunci pencarian"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {hasActiveFilters && (
            <Button variant="outline" onClick={resetFilters} className="gap-1 h-11">
              <X size={16} /> Reset Semua Filter
            </Button>
          )}
        </div>

        {/* Quick Program Type & Mode Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t text-sm">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mr-1">
            <Funnel size={14} /> Filter Cepat:
          </span>

          {/* Type Pills */}
          <div className="inline-flex rounded-lg border p-1 bg-muted/40">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedType === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Semua Jenis
            </button>
            <button
              onClick={() => setSelectedType("stupen")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                selectedType === "stupen" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap size={14} /> Studi Independen
            </button>
            <button
              onClick={() => setSelectedType("magang")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                selectedType === "magang" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Briefcase size={14} /> Magang Industri
            </button>
          </div>

          {/* Mode Pills */}
          <div className="inline-flex rounded-lg border p-1 bg-muted/40">
            <button
              onClick={() => setSelectedMode("all")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedMode === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Semua Mode
            </button>
            <button
              onClick={() => setSelectedMode("Mandiri")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedMode === "Mandiri" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mandiri
            </button>
            <button
              onClick={() => setSelectedMode("Tim")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedMode === "Tim" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tim / Kelompok
            </button>
          </div>
        </div>

        {/* Array Filter Tabs (Divisions, Roles, Categories) */}
        <div className="pt-2 border-t space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground">Pilih Filter Spesifik:</span>
            <div className="flex gap-1.5">
              <Button
                variant={activeFilterTab === "divisions" ? "default" : "secondary"}
                size="xs"
                onClick={() => setActiveFilterTab("divisions")}
                className="gap-1 rounded-md"
              >
                Divisi / Bidang {selectedDivisions.length > 0 && `(${selectedDivisions.length})`}
              </Button>
              <Button
                variant={activeFilterTab === "roles" ? "default" : "secondary"}
                size="xs"
                onClick={() => setActiveFilterTab("roles")}
                className="gap-1 rounded-md"
              >
                Role / Posisi {selectedRoles.length > 0 && `(${selectedRoles.length})`}
              </Button>
              <Button
                variant={activeFilterTab === "categories" ? "default" : "secondary"}
                size="xs"
                onClick={() => setActiveFilterTab("categories")}
                className="gap-1 rounded-md"
              >
                Kategori {selectedCategories.length > 0 && `(${selectedCategories.length})`}
              </Button>
            </div>
          </div>

          {/* Division Pills */}
          {activeFilterTab === "divisions" && (
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-muted/30 border border-muted">
              {allDivisions.map((div) => {
                const isSelected = selectedDivisions.includes(div);
                return (
                  <Badge
                    key={div}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer text-xs select-none gap-1 py-1 px-2.5 transition-all"
                    onClick={() => toggleDivision(div)}
                  >
                    {isSelected && <Check size={12} weight="bold" />}
                    {div}
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Role Pills */}
          {activeFilterTab === "roles" && (
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-muted/30 border border-muted">
              {allRoles.map((role) => {
                const isSelected = selectedRoles.includes(role);
                return (
                  <Badge
                    key={role}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer text-xs select-none gap-1 py-1 px-2.5 transition-all"
                    onClick={() => toggleRole(role)}
                  >
                    {isSelected && <Check size={12} weight="bold" />}
                    {role}
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Category Pills */}
          {activeFilterTab === "categories" && (
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-muted/30 border border-muted">
              {allCategories.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <Badge
                    key={cat}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer text-xs select-none gap-1 py-1 px-2.5 transition-all"
                    onClick={() => toggleCategory(cat)}
                  >
                    {isSelected && <Check size={12} weight="bold" />}
                    {cat}
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Active filter badges display */}
          {(selectedDivisions.length > 0 || selectedRoles.length > 0 || selectedCategories.length > 0) && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-muted-foreground">
              <span className="font-semibold">Aktif:</span>
              {selectedDivisions.map((div) => (
                <span
                  key={div}
                  onClick={() => toggleDivision(div)}
                  className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded cursor-pointer hover:bg-primary/20"
                >
                  Divisi: {div} <X size={12} />
                </span>
              ))}
              {selectedRoles.map((r) => (
                <span
                  key={r}
                  onClick={() => toggleRole(r)}
                  className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded cursor-pointer hover:bg-primary/20"
                >
                  Role: {r} <X size={12} />
                </span>
              ))}
              {selectedCategories.map((c) => (
                <span
                  key={c}
                  onClick={() => toggleCategory(c)}
                  className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded cursor-pointer hover:bg-primary/20"
                >
                  Kategori: {c} <X size={12} />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Meta */}
      <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
        <span>
          Menampilkan <strong className="text-foreground">{filteredItems.length}</strong> lowongan terverifikasi
        </span>
      </div>

      {/* Grid of Cards */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <OpportunityCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-12 text-center space-y-3 bg-muted/10">
          <p className="text-base font-semibold text-foreground">Tidak ditemukan hasil yang cocok</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian atau reset filter untuk melihat semua peluang studi independen dan magang.
          </p>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            Reset Semua Filter
          </Button>
        </div>
      )}
    </div>
  );
}

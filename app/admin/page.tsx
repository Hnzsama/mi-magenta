"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";
import {
  LockKey,
  ShieldCheck,
  WarningCircle,
  CheckCircle,
  PlusCircle,
  SignOut,
  Trash,
  ArrowSquareOut,
  Buildings,
  GraduationCap,
  Briefcase,
  UploadSimple,
  DownloadSimple,
  FileArrowDown,
  Table,
  MagnifyingGlass,
  Check,
} from "@phosphor-icons/react";
import { FileSpreadsheet, Upload, Download, FileUp, RefreshCw, AlertCircle, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import opportunitiesData from "@/data/opportunities.json";

interface AdminSession {
  user: string;
  loggedInAt: string;
}

export interface CustomOpportunity {
  id: string;
  company: string;
  role: string;
  division: string;
  type: "magang" | "stupen";
  mode: "Mandiri" | "Tim";
  city: string;
  phone: string;
  description?: string;
  createdAt: string;
}

interface ParsedRowPreview {
  company: string;
  role: string;
  division: string;
  type: "magang" | "stupen";
  mode: "Mandiri" | "Tim";
  city: string;
  phone: string;
  description: string;
  isValid: boolean;
  errors: string[];
}

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionData, setSessionData] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"import" | "catalog" | "manual" | "export">("import");

  // Manual Form states
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [division, setDivision] = useState("");
  const [type, setType] = useState<"magang" | "stupen">("magang");
  const [mode, setMode] = useState<"Mandiri" | "Tim">("Mandiri");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [manualSuccess, setManualSuccess] = useState(false);

  // Custom opportunities state
  const [customList, setCustomList] = useState<CustomOpportunity[]>([]);

  // Import states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRowPreview[]>([]);
  const [importError, setImportError] = useState("");
  const [importSuccessMsg, setImportSuccessMsg] = useState("");
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // Catalog search & filter in admin
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogTypeFilter, setCatalogTypeFilter] = useState<"all" | "magang" | "stupen">("all");

  // Restore session & data on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem("mi_admin_session");
      if (savedSession) {
        const parsed: AdminSession = JSON.parse(savedSession);
        if (parsed && parsed.user) {
          setIsLoggedIn(true);
          setSessionData(parsed);
        }
      }

      const savedData = localStorage.getItem("mi_admin_custom_opportunities");
      if (savedData) {
        setCustomList(JSON.parse(savedData));
      }
    } catch {
      localStorage.removeItem("mi_admin_session");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "adminportalmi2026") {
      const newSession: AdminSession = {
        user: "admin",
        loggedInAt: new Date().toLocaleString("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      };
      localStorage.setItem("mi_admin_session", JSON.stringify(newSession));
      setSessionData(newSession);
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Username atau password tidak sesuai dengan konfigurasi sistem (.env)");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("mi_admin_session");
    setIsLoggedIn(false);
    setSessionData(null);
    setUsername("");
    setPassword("");
    setError("");
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: CustomOpportunity = {
      id: `manual-${Date.now()}`,
      company: company.trim(),
      role: role.trim(),
      division: division.trim(),
      type,
      mode,
      city: city.trim(),
      phone: phone.trim(),
      description: description.trim() || `Program kerja magang dan studi independen di ${company}.`,
      createdAt: new Date().toLocaleDateString("id-ID"),
    };

    const updated = [newEntry, ...customList];
    setCustomList(updated);
    localStorage.setItem("mi_admin_custom_opportunities", JSON.stringify(updated));

    setManualSuccess(true);
    setCompany("");
    setRole("");
    setDivision("");
    setCity("");
    setPhone("");
    setDescription("");

    setTimeout(() => {
      setManualSuccess(false);
    }, 4000);
  };

  const handleDeleteCustom = (id: string) => {
    const updated = customList.filter((item) => item.id !== id);
    setCustomList(updated);
    localStorage.setItem("mi_admin_custom_opportunities", JSON.stringify(updated));
  };

  // Helper to map loose column names
  const findValue = (row: Record<string, any>, possibleKeys: string[]): string => {
    const rowKeys = Object.keys(row);
    for (const pKey of possibleKeys) {
      const matched = rowKeys.find((k) =>
        k.toLowerCase().replace(/[^a-z0-9]/g, "").includes(pKey.toLowerCase().replace(/[^a-z0-9]/g, ""))
      );
      if (matched && row[matched] !== undefined && row[matched] !== null) {
        return String(row[matched]).trim();
      }
    }
    return "";
  };

  const handleFileUpload = async (file: File) => {
    setSelectedFile(file);
    setImportError("");
    setImportSuccessMsg("");
    setIsProcessingFile(true);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];

      if (!firstSheetName) {
        throw new Error("File spreadsheet tidak memiliki sheet yang dapat dibaca.");
      }

      const worksheet = workbook.Sheets[firstSheetName];
      const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (rawRows.length === 0) {
        throw new Error("Sheet kosong atau tidak memiliki baris data.");
      }

      const parsed: ParsedRowPreview[] = rawRows.map((row) => {
        const companyVal = findValue(row, ["perusahaan", "instansi", "company", "nama perusahaan", "mitra"]);
        const roleVal = findValue(row, ["posisi", "role", "jabatan", "pekerjaan", "title"]);
        const divisionVal = findValue(row, ["divisi", "bidang", "unit", "division", "departemen"]) || roleVal;
        const rawType = findValue(row, ["jenis", "tipe", "program", "type"]).toLowerCase();
        const rawMode = findValue(row, ["mode", "pelaksanaan", "metode"]).toLowerCase();
        const cityVal = findValue(row, ["kota", "lokasi", "city", "kabupaten", "daerah"]) || "Jawa Timur";
        const phoneVal = findValue(row, ["telepon", "telp", "phone", "whatsapp", "wa", "kontak"]) || "-";
        const descVal = findValue(row, ["deskripsi", "keterangan", "catatan", "description"]);

        const errors: string[] = [];
        if (!companyVal) errors.push("Nama Perusahaan wajib diisi");
        if (!roleVal) errors.push("Posisi/Role wajib diisi");

        const normalizedType: "magang" | "stupen" =
          rawType.includes("stupen") || rawType.includes("studi") || rawType.includes("independen")
            ? "stupen"
            : "magang";

        const normalizedMode: "Mandiri" | "Tim" =
          rawMode.includes("tim") || rawMode.includes("kelompok") ? "Tim" : "Mandiri";

        return {
          company: companyVal || "(Perusahaan belum diatur)",
          role: roleVal || "(Posisi belum diatur)",
          division: divisionVal || "Teknologi Informasi",
          type: normalizedType,
          mode: normalizedMode,
          city: cityVal,
          phone: phoneVal,
          description: descVal || `Program ${normalizedType === "stupen" ? "Studi Independen" : "Magang Industri"} di ${companyVal}.`,
          isValid: errors.length === 0,
          errors,
        };
      });

      setParsedRows(parsed);
    } catch (err: any) {
      setImportError(err.message || "Gagal membaca file Excel/CSV. Pastikan format file sesuai.");
      setParsedRows([]);
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleConfirmImport = () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      setImportError("Tidak ada baris data valid yang dapat diimpor.");
      return;
    }

    const newEntries: CustomOpportunity[] = validRows.map((r, idx) => ({
      id: `imported-${Date.now()}-${idx}`,
      company: r.company,
      role: r.role,
      division: r.division,
      type: r.type,
      mode: r.mode,
      city: r.city,
      phone: r.phone,
      description: r.description,
      createdAt: new Date().toLocaleDateString("id-ID"),
    }));

    const updated = [...newEntries, ...customList];
    setCustomList(updated);
    localStorage.setItem("mi_admin_custom_opportunities", JSON.stringify(updated));

    setImportSuccessMsg(`Berhasil mengimpor ${newEntries.length} data lowongan baru ke sistem!`);
    setSelectedFile(null);
    setParsedRows([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadSampleTemplate = (format: "xlsx" | "csv") => {
    const sampleData = [
      {
        "Nama Perusahaan": "PT Bank Jatim Tbk",
        "Posisi / Role": "IT Support & Networking",
        "Divisi / Bidang": "Divisi Teknologi Informasi",
        "Jenis Program": "Magang Industri",
        "Mode Pelaksanaan": "Mandiri",
        "Kota / Lokasi": "Surabaya",
        "No Telepon / WA": "081234567890",
        "Deskripsi": "Praktik kerja operasional pemeliharaan jaringan dan helpdesk IT perbankan.",
      },
      {
        "Nama Perusahaan": "PT Solusi Data Nusantara",
        "Posisi / Role": "Junior Data Engineer",
        "Divisi / Bidang": "Data Analytics",
        "Jenis Program": "Studi Independen",
        "Mode Pelaksanaan": "Tim",
        "Kota / Lokasi": "Jakarta Selatan",
        "No Telepon / WA": "085545032916",
        "Deskripsi": "Pembelajaran intensif ETL pipeline, SQL, dan visualisasi dashboard analitik.",
      },
      {
        "Nama Perusahaan": "Dinas Kominfo Provinsi Jatim",
        "Posisi / Role": "Web Developer (E-Government)",
        "Divisi / Bidang": "Aplikasi Informatika",
        "Jenis Program": "Magang Industri",
        "Mode Pelaksanaan": "Tim",
        "Kota / Lokasi": "Surabaya",
        "No Telepon / WA": "082198765432",
        "Deskripsi": "Pengembangan aplikasi layanan publik SPBE berbasis Next.js dan REST API.",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Lowongan MI");

    if (format === "xlsx") {
      XLSX.writeFile(wb, "template-rekap-magang-magenta-mi.xlsx");
    } else {
      XLSX.writeFile(wb, "template-rekap-magang-magenta-mi.csv");
    }
  };

  const exportAllData = (format: "xlsx" | "csv" | "json") => {
    const allItems = [
      ...customList.map((c) => ({
        ID: c.id,
        Sumber: "Ditambahkan Admin",
        Perusahaan: c.company,
        Posisi: c.role,
        Divisi: c.division,
        Jenis: c.type === "stupen" ? "Studi Independen" : "Magang Industri",
        Mode: c.mode,
        Kota: c.city,
        Telepon: c.phone,
        Deskripsi: c.description || "",
        Tanggal: c.createdAt,
      })),
      ...opportunitiesData.map((d: any) => ({
        ID: d.id,
        Sumber: "Katalog Bawaan",
        Perusahaan: d.company,
        Posisi: d.roles.join(", "),
        Divisi: d.divisions.join(", "),
        Jenis: d.type === "stupen" ? "Studi Independen" : "Magang Industri",
        Mode: d.mode,
        Kota: d.location.city,
        Telepon: d.contact.phone,
        Deskripsi: d.description,
        Tanggal: d.batch,
      })),
    ];

    if (format === "json") {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allItems, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `ekspor-magenta-mi-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      return;
    }

    const ws = XLSX.utils.json_to_sheet(allItems);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Katalog MAGENTA MI");

    if (format === "xlsx") {
      XLSX.writeFile(wb, `ekspor-katalog-magenta-mi-${Date.now()}.xlsx`);
    } else {
      XLSX.writeFile(wb, `ekspor-katalog-magenta-mi-${Date.now()}.csv`);
    }
  };

  // Combine opportunities for admin catalog preview
  const combinedCatalog = [
    ...customList.map((c) => ({
      id: c.id,
      company: c.company,
      role: c.role,
      division: c.division,
      type: c.type,
      mode: c.mode,
      city: c.city,
      phone: c.phone,
      isCustom: true,
    })),
    ...opportunitiesData.map((d: any) => ({
      id: d.id,
      company: d.company,
      role: d.roles[0] || "Staff",
      division: d.divisions[0] || "Umum",
      type: d.type as "magang" | "stupen",
      mode: d.mode as "Mandiri" | "Tim",
      city: d.location.city,
      phone: d.contact.phone,
      isCustom: false,
    })),
  ];

  const filteredCatalog = combinedCatalog.filter((item) => {
    if (catalogTypeFilter !== "all" && item.type !== catalogTypeFilter) return false;
    if (catalogSearch.trim()) {
      const q = catalogSearch.toLowerCase();
      return (
        item.company.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        item.division.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-24 bg-muted/20 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground text-sm">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="font-medium">Memeriksa sesi login admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-muted/20">
      <div className={`container mx-auto px-4 sm:px-6 ${isLoggedIn ? "max-w-6xl" : "max-w-xl"}`}>
        {!isLoggedIn ? (
          /* LOGIN CARD */
          <Card className="shadow-xl border-border/80">
            <CardHeader className="text-center space-y-2 pb-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
                <LockKey size={30} weight="bold" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight">Portal Admin &amp; Pengelola MI</CardTitle>
              <CardDescription className="text-xs sm:text-sm max-w-sm mx-auto">
                Kelola rekapitulasi mitra magang, tambah data, serta import spreadsheet Excel atau CSV mahasiswa prodi Manajemen Informatika.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-lg border border-destructive/20 flex items-center gap-2">
                    <WarningCircle size={16} weight="bold" className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Username Admin</label>
                  <Input
                    type="text"
                    placeholder="Masukkan username (admin)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Password</label>
                  <Input
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Kredensial sesuai <code>.env.local</code>. Sesi akan otomatis tersimpan di peramban ini.
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-3 pt-2">
                <Button type="submit" className="w-full h-10 font-semibold shadow-xs">
                  Masuk ke Dashboard Admin
                </Button>
                <div className="text-center">
                  <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    &larr; Kembali ke Beranda Portal Publik
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        ) : (
          /* LOGGED IN DASHBOARD */
          <div className="space-y-6">
            {/* Top Navigation & Session Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 sm:p-5 rounded-2xl border shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[var(--mi-cyan)] to-[var(--mi-blue)] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck size={26} weight="bold" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base sm:text-lg font-black tracking-tight text-foreground">
                      Dashboard Manajemen Lowongan &amp; Kemitraan
                    </h1>
                    <Badge variant="outline" className="text-emerald-600 bg-emerald-50/80 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/60 dark:border-emerald-800 text-[10px] py-0 px-1.5 font-bold">
                      Sesi Aktif
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pengguna: <strong className="text-foreground">{sessionData?.user || "admin"}</strong>
                    {sessionData?.loggedInAt ? ` • Masuk sejak ${sessionData.loggedInAt}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs rounded-lg"
                  nativeButton={false}
                  render={
                    <Link href="/" target="_blank">
                      <Eye size={15} /> Lihat Portal Mahasiswa <ArrowSquareOut size={13} className="opacity-70" />
                    </Link>
                  }
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
                >
                  <SignOut size={16} /> Keluar
                </Button>
              </div>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-xl border bg-card shadow-2xs space-y-1">
                <span className="text-xs text-muted-foreground font-medium">Total Lowongan Aktif</span>
                <p className="text-2xl font-black text-foreground">{combinedCatalog.length}</p>
                <p className="text-[11px] text-muted-foreground">Katalog Bawaan + Data Admin</p>
              </div>
              <div className="p-4 rounded-xl border bg-card shadow-2xs space-y-1">
                <span className="text-xs text-muted-foreground font-medium">Magang Industri</span>
                <p className="text-2xl font-black text-[var(--mi-orange)]">
                  {combinedCatalog.filter((c) => c.type === "magang").length}
                </p>
                <p className="text-[11px] text-muted-foreground">BUMN, Instansi &amp; Swasta</p>
              </div>
              <div className="p-4 rounded-xl border bg-card shadow-2xs space-y-1">
                <span className="text-xs text-muted-foreground font-medium">Studi Independen</span>
                <p className="text-2xl font-black text-[var(--mi-cyan)]">
                  {combinedCatalog.filter((c) => c.type === "stupen").length}
                </p>
                <p className="text-[11px] text-muted-foreground">Celerates, Vinix7, dll</p>
              </div>
              <div className="p-4 rounded-xl border bg-card shadow-2xs space-y-1">
                <span className="text-xs text-muted-foreground font-medium">Data Tambahan / Import</span>
                <p className="text-2xl font-black text-primary">{customList.length}</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Tersimpan di Sesi Browser</p>
              </div>
            </div>

            {/* Custom Tab Navigation */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl border bg-muted/30">
              <button
                onClick={() => setActiveTab("import")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "import"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileSpreadsheet size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>Import Excel / CSV</span>
                <span className="text-[9px] font-bold uppercase tracking-wider py-0.2 px-1.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                  Fitur Baru
                </span>
              </button>

              <button
                onClick={() => setActiveTab("catalog")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "catalog"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Table size={16} className="text-[var(--mi-blue)]" />
                <span>Katalog &amp; Kelola Data</span>
                <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                  {combinedCatalog.length}
                </Badge>
              </button>

              <button
                onClick={() => setActiveTab("manual")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "manual"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <PlusCircle size={16} className="text-primary" />
                <span>Input Manual</span>
              </button>

              <button
                onClick={() => setActiveTab("export")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "export"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Download size={16} className="text-muted-foreground" />
                <span>Ekspor Data</span>
              </button>
            </div>

            {/* TAB 1: IMPORT EXCEL / CSV */}
            {activeTab === "import" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileSpreadsheet size={22} className="text-emerald-600 dark:text-emerald-400" />
                          <span>Import Data Rekapitulasi via Spreadsheet</span>
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm mt-1">
                          Unggah file Excel (<code>.xlsx</code>, <code>.xls</code>) atau file teks <code>.csv</code>. Sistem akan otomatis memetakan kolom dan memvalidasi isinya sebelum disimpan.
                        </CardDescription>
                      </div>

                      {/* Download Template Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadSampleTemplate("xlsx")}
                          className="text-xs gap-1.5 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
                        >
                          <Download size={14} /> Template Excel (.xlsx)
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadSampleTemplate("csv")}
                          className="text-xs gap-1.5"
                        >
                          <Download size={14} /> Template CSV
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    {/* Feedback Alerts */}
                    {importSuccessMsg && (
                      <div className="p-3.5 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20 flex items-center gap-2.5">
                        <CheckCircle size={18} weight="fill" className="shrink-0" />
                        <span className="font-medium">{importSuccessMsg}</span>
                      </div>
                    )}

                    {importError && (
                      <div className="p-3.5 text-xs bg-destructive/10 text-destructive rounded-xl border border-destructive/20 flex items-center gap-2.5">
                        <AlertCircle size={18} className="shrink-0" />
                        <span className="font-medium">{importError}</span>
                      </div>
                    )}

                    {/* Drag-and-Drop / File Upload Zone */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="group cursor-pointer rounded-2xl border-2 border-dashed border-border/80 hover:border-primary/60 bg-muted/20 hover:bg-muted/40 p-8 sm:p-10 text-center transition-all duration-200"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                      />
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-105 transition-transform mb-3">
                        <FileUp size={28} />
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-foreground">
                        {selectedFile ? selectedFile.name : "Klik atau seret file Excel/CSV ke sini"}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                        Mendukung format <strong>.xlsx, .xls, .csv</strong> dari Google Sheets, Microsoft Excel, atau ekspor spreadsheet rekap mahasiswa.
                      </p>
                      {selectedFile && (
                        <p className="text-[11px] text-primary font-semibold mt-2">
                          Ukuran: {(selectedFile.size / 1024).toFixed(1)} KB • Klik untuk mengganti file
                        </p>
                      )}
                    </div>

                    {/* Processing State */}
                    {isProcessingFile && (
                      <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground">
                        <RefreshCw size={16} className="animate-spin text-primary" />
                        <span>Membaca dan memetakan struktur kolom spreadsheet...</span>
                      </div>
                    )}

                    {/* Parsed Preview Table */}
                    {parsedRows.length > 0 && (
                      <div className="space-y-4 pt-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b">
                          <div>
                            <h4 className="font-bold text-sm text-foreground">
                              Pratinjau Data ({parsedRows.length} baris terdeteksi)
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {parsedRows.filter((r) => r.isValid).length} baris valid siap diimpor ke sistem.
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedFile(null);
                                setParsedRows([]);
                                if (fileInputRef.current) fileInputRef.current.value = "";
                              }}
                              className="text-xs"
                            >
                              Batalkan
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleConfirmImport}
                              disabled={parsedRows.filter((r) => r.isValid).length === 0}
                              className="text-xs gap-1.5 shadow-xs"
                            >
                              <Check size={16} weight="bold" /> Konfirmasi &amp; Import ({parsedRows.filter((r) => r.isValid).length}) Data
                            </Button>
                          </div>
                        </div>

                        <div className="overflow-x-auto rounded-xl border bg-card">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-muted/50 text-muted-foreground font-semibold border-b">
                              <tr>
                                <th className="p-3 w-12 text-center">No</th>
                                <th className="p-3">Perusahaan</th>
                                <th className="p-3">Role / Posisi</th>
                                <th className="p-3">Divisi</th>
                                <th className="p-3">Program</th>
                                <th className="p-3">Mode</th>
                                <th className="p-3">Kota</th>
                                <th className="p-3">Telepon</th>
                                <th className="p-3 text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {parsedRows.slice(0, 15).map((row, idx) => (
                                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                  <td className="p-3 text-center text-muted-foreground">{idx + 1}</td>
                                  <td className="p-3 font-semibold text-foreground max-w-[180px] truncate">
                                    {row.company}
                                  </td>
                                  <td className="p-3 max-w-[160px] truncate">{row.role}</td>
                                  <td className="p-3 text-muted-foreground max-w-[140px] truncate">{row.division}</td>
                                  <td className="p-3">
                                    <Badge
                                      variant="outline"
                                      className={`text-[10px] py-0 px-1.5 font-medium ${
                                        row.type === "stupen"
                                          ? "text-[var(--mi-cyan)] border-[var(--mi-cyan)]/30 bg-[var(--mi-cyan)]/5"
                                          : "text-[var(--mi-orange)] border-[var(--mi-orange)]/30 bg-[var(--mi-orange)]/5"
                                      }`}
                                    >
                                      {row.type === "stupen" ? "Stupen" : "Magang"}
                                    </Badge>
                                  </td>
                                  <td className="p-3">
                                    <span className="text-[11px] text-muted-foreground">{row.mode}</span>
                                  </td>
                                  <td className="p-3 text-muted-foreground">{row.city}</td>
                                  <td className="p-3 text-muted-foreground font-mono text-[11px]">{row.phone}</td>
                                  <td className="p-3 text-center">
                                    {row.isValid ? (
                                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                                        <Check size={14} weight="bold" /> Siap
                                      </span>
                                    ) : (
                                      <span
                                        className="inline-flex items-center gap-1 text-[11px] text-destructive font-semibold"
                                        title={row.errors.join(", ")}
                                      >
                                        <AlertCircle size={14} /> Gagal
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {parsedRows.length > 15 && (
                          <p className="text-[11px] text-center text-muted-foreground">
                            Menampilkan 15 dari {parsedRows.length} baris pratinjau. Seluruh baris valid akan otomatis dimasukkan saat konfirmasi.
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* TAB 2: KATALOG & KELOLA DATA */}
            {activeTab === "catalog" && (
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Table size={20} className="text-primary" /> Katalog Seluruh Lowongan Aktif
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Total {combinedCatalog.length} lowongan terdata (gabungan katalog bawaan &amp; data hasil input/import admin).
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative w-48 sm:w-64">
                        <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Cari perusahaan/role..."
                          value={catalogSearch}
                          onChange={(e) => setCatalogSearch(e.target.value)}
                          className="pl-8 h-9 text-xs"
                        />
                      </div>
                      <select
                        aria-label="Filter Jenis"
                        value={catalogTypeFilter}
                        onChange={(e) => setCatalogTypeFilter(e.target.value as any)}
                        className="h-9 rounded-md border border-input bg-background text-foreground px-2 text-xs"
                      >
                        <option value="all">Semua Tipe</option>
                        <option value="magang">Magang Industri</option>
                        <option value="stupen">Studi Independen</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="overflow-x-auto rounded-xl border bg-card">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-muted/50 text-muted-foreground font-semibold border-b">
                        <tr>
                          <th className="p-3 w-12 text-center">No</th>
                          <th className="p-3">Perusahaan &amp; Sumber</th>
                          <th className="p-3">Role / Posisi</th>
                          <th className="p-3">Divisi</th>
                          <th className="p-3">Jenis</th>
                          <th className="p-3">Mode</th>
                          <th className="p-3">Kota</th>
                          <th className="p-3 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredCatalog.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-3 text-center text-muted-foreground">{idx + 1}</td>
                            <td className="p-3 font-semibold text-foreground max-w-[200px]">
                              <div className="truncate">{item.company}</div>
                              {item.isCustom ? (
                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.2 rounded inline-block mt-0.5">
                                  Data Admin
                                </span>
                              ) : (
                                <span className="text-[10px] text-muted-foreground">Katalog Bawaan</span>
                              )}
                            </td>
                            <td className="p-3 max-w-[160px] truncate">{item.role}</td>
                            <td className="p-3 text-muted-foreground max-w-[140px] truncate">{item.division}</td>
                            <td className="p-3">
                              <Badge
                                variant="outline"
                                className={`text-[10px] py-0 px-1.5 font-medium ${
                                  item.type === "stupen"
                                    ? "text-[var(--mi-cyan)] border-[var(--mi-cyan)]/30"
                                    : "text-[var(--mi-orange)] border-[var(--mi-orange)]/30"
                                }`}
                              >
                                {item.type === "stupen" ? "Stupen" : "Magang"}
                              </Badge>
                            </td>
                            <td className="p-3 text-muted-foreground">{item.mode}</td>
                            <td className="p-3 text-muted-foreground">{item.city}</td>
                            <td className="p-3 text-center">
                              {item.isCustom ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleDeleteCustom(item.id)}
                                  title="Hapus data custom ini"
                                >
                                  <Trash size={15} />
                                </Button>
                              ) : (
                                <span className="text-[10px] text-muted-foreground italic">Terkunci</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB 3: INPUT MANUAL */}
            {activeTab === "manual" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PlusCircle size={20} className="text-primary" /> Formulir Tambah Perusahaan / Lowongan Baru
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Isi detail instansi atau perusahaan mitra secara manual untuk ditambahkan langsung ke katalog.
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleAddManual}>
                  <CardContent className="space-y-4">
                    {manualSuccess && (
                      <div className="p-3 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-500/20 flex items-center gap-2">
                        <CheckCircle size={16} weight="fill" />
                        <span>Data berhasil disimpan ke sistem!</span>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold">Nama Tempat Magang / Perusahaan</label>
                      <Input
                        placeholder="Contoh: PT Telkom Indonesia"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold">Posisi / Role</label>
                        <Input
                          placeholder="Contoh: Web Developer"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold">Divisi / Bidang</label>
                        <Input
                          placeholder="Contoh: Divisi IT"
                          value={division}
                          onChange={(e) => setDivision(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold">Jenis Program</label>
                        <select
                          aria-label="Jenis Program"
                          className="w-full h-9 rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-xs"
                          value={type}
                          onChange={(e) => setType(e.target.value as any)}
                        >
                          <option value="magang">Magang Industri</option>
                          <option value="stupen">Studi Independen (Stupen)</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold">Mode Pelaksanaan</label>
                        <select
                          aria-label="Mode Pelaksanaan"
                          className="w-full h-9 rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-xs"
                          value={mode}
                          onChange={(e) => setMode(e.target.value as any)}
                        >
                          <option value="Mandiri">Mandiri</option>
                          <option value="Tim">Tim / Kelompok</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold">Kota / Lokasi</label>
                        <Input
                          placeholder="Contoh: Surabaya"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold">No. Telepon / WhatsApp</label>
                        <Input
                          placeholder="Contoh: 08123456789"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold">Deskripsi / Kualifikasi Singkat (Opsional)</label>
                      <Input
                        placeholder="Contoh: Praktik pengembangan website e-government di bidang layanan publik."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button type="submit" className="w-full">
                      Simpan Data Baru
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}

            {/* TAB 4: EKSPOR DATA */}
            {activeTab === "export" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Download size={20} className="text-primary" /> Ekspor &amp; Backup Data Lowongan
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Unduh seluruh data lowongan ({combinedCatalog.length} entri) dalam format pilihan Anda untuk dokumentasi atau pelaporan akademik.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                        <FileSpreadsheet size={20} />
                        <span>Microsoft Excel (.xlsx)</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Format spreadsheet standar lengkap dengan header kolom dan data terstruktur.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportAllData("xlsx")}
                        className="w-full text-xs gap-1.5"
                      >
                        <Download size={14} /> Unduh Excel (.xlsx)
                      </Button>
                    </div>

                    <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
                      <div className="flex items-center gap-2 text-[var(--mi-blue)] font-bold text-sm">
                        <DownloadSimple size={20} weight="bold" />
                        <span>Comma Separated (.csv)</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Format teks CSV universal untuk diimpor ke Google Sheets, database SQL, atau SPSS.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportAllData("csv")}
                        className="w-full text-xs gap-1.5"
                      >
                        <Download size={14} /> Unduh CSV (.csv)
                      </Button>
                    </div>

                    <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
                      <div className="flex items-center gap-2 text-[var(--mi-orange)] font-bold text-sm">
                        <FileArrowDown size={20} weight="bold" />
                        <span>Data Objek (.json)</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Format raw JSON untuk kebutuhan integrasi backend, API, atau migrasi basis data.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportAllData("json")}
                        className="w-full text-xs gap-1.5"
                      >
                        <Download size={14} /> Unduh JSON
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


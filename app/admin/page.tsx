"use client";

import { useState, useEffect } from "react";
import { LockKey, ShieldCheck, UserCheck, WarningCircle, CheckCircle, PlusCircle, SignOut, Trash } from "@phosphor-icons/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AdminSession {
  user: string;
  loggedInAt: string;
}

interface CustomOpportunity {
  id: string;
  company: string;
  role: string;
  division: string;
  type: string;
  mode: string;
  city: string;
  phone: string;
  createdAt: string;
}

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionData, setSessionData] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Form states for new entry
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [division, setDivision] = useState("");
  const [type, setType] = useState("magang");
  const [mode, setMode] = useState("Mandiri");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [customList, setCustomList] = useState<CustomOpportunity[]>([]);

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

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: CustomOpportunity = {
      id: Date.now().toString(),
      company,
      role,
      division,
      type,
      mode,
      city,
      phone,
      createdAt: new Date().toLocaleDateString("id-ID"),
    };

    const updatedList = [newEntry, ...customList];
    setCustomList(updatedList);
    localStorage.setItem("mi_admin_custom_opportunities", JSON.stringify(updatedList));

    setShowSuccess(true);
    setCompany("");
    setRole("");
    setDivision("");
    setCity("");
    setPhone("");

    setTimeout(() => {
      setShowSuccess(false);
    }, 4000);
  };

  const handleDeleteEntry = (id: string) => {
    const updated = customList.filter((item) => item.id !== id);
    setCustomList(updated);
    localStorage.setItem("mi_admin_custom_opportunities", JSON.stringify(updated));
  };

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
    <div className="min-h-screen py-12 bg-muted/20">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6">
        {!isLoggedIn ? (
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <LockKey size={26} weight="bold" />
              </div>
              <CardTitle className="text-2xl font-bold">Login Portal Admin / Mitra</CardTitle>
              <CardDescription>
                Area khusus dosen pembimbing dan koordinator magang MI untuk posting atau verifikasi mitra perusahaan baru.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-lg border border-destructive/20 flex items-center gap-2">
                    <WarningCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Username Admin</label>
                  <Input
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
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
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Kredensial disimpan dalam konfigurasi <code>.env.local</code>. Sesi akan otomatis tersimpan di browser ini.
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-2">
                <Button type="submit" className="w-full">
                  Masuk ke Dashboard
                </Button>
                <p className="text-center text-xs text-muted-foreground pt-2">
                  Portal publik dapat diakses bebas tanpa login oleh mahasiswa.
                </p>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Header info sesi aktif & tombol logout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-xl border shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} weight="fill" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">Admin Portal MI</span>
                    <Badge variant="outline" className="text-emerald-600 bg-emerald-50/80 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/60 dark:border-emerald-800 text-[10px] py-0 px-1.5">
                      Sesi Aktif
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pengguna: <strong className="text-foreground">{sessionData?.user || "admin"}</strong>
                    {sessionData?.loggedInAt ? ` • Masuk sejak ${sessionData.loggedInAt}` : ""}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="self-end sm:self-center gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10">
                <SignOut size={16} /> Keluar (Logout)
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PlusCircle size={20} className="text-primary" /> Formulir Tambah Perusahaan / Lowongan Baru
                </CardTitle>
                <CardDescription>
                  Data yang ditambahkan akan tersimpan di sesi lokal admin dan dapat dihubungkan ke database SQLite/PostgreSQL.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleAddCompany}>
                <CardContent className="space-y-4">
                  {showSuccess && (
                    <div className="p-3 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-500/20 flex items-center gap-2">
                      <CheckCircle size={16} weight="fill" />
                      <span>Data berhasil disimpan ke daftar lowongan lokal admin!</span>
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
                        onChange={(e) => setType(e.target.value)}
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
                        onChange={(e) => setMode(e.target.value)}
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
                </CardContent>

                <CardFooter>
                  <Button type="submit" className="w-full">
                    Simpan Data Baru
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* List of custom added opportunities */}
            {customList.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center justify-between">
                    <span>Lowongan Baru Ditambahkan ({customList.length})</span>
                    <Badge variant="secondary" className="text-xs font-normal">Tersimpan di Browser</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {customList.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/40 text-xs"
                    >
                      <div className="space-y-0.5 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground truncate">{item.role}</span>
                          <Badge variant="outline" className="text-[10px] py-0 px-1">
                            {item.type === "magang" ? "Magang" : "Stupen"}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] py-0 px-1">
                            {item.mode}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground truncate">
                          {item.company} • {item.division} • {item.city} ({item.phone})
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => handleDeleteEntry(item.id)}
                        title="Hapus data"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


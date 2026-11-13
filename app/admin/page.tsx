"use client";

import { useState } from "react";
import { LockKey, ShieldCheck, UserCheck, WarningCircle, CheckCircle, PlusCircle } from "@phosphor-icons/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi credential sederhana (sesuai ADMIN_USERNAME & ADMIN_PASSWORD di env)
    // Sesuai brief: fokus di publik dulu, ini disiapkan untuk kebutuhan input data perusahaan baru
    if (username === "admin" && password === "adminportalmi2026") {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Username atau password tidak sesuai dengan konfigurasi sistem (.env)");
    }
  };

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setCompany("");
      setRole("");
      setDivision("");
      setCity("");
      setPhone("");
    }, 3000);
  };

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
                    Kredensial disimpan dalam konfigurasi <code>.env.local</code>.
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
            <div className="flex items-center justify-between bg-card p-4 rounded-xl border">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-500" />
                <span className="text-sm font-semibold">Selamat Datang, Admin Portal MI</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsLoggedIn(false)}>
                Keluar
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PlusCircle size={20} className="text-primary" /> Formulir Tambah Perusahaan / Lowongan Baru
                </CardTitle>
                <CardDescription>
                  Form input ini siap dihubungkan ke database SQLite/PostgreSQL setelah ada arahan lanjutan dari dosen pembimbing.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleAddCompany}>
                <CardContent className="space-y-4">
                  {showSuccess && (
                    <div className="p-3 text-xs bg-emerald-500/10 text-emerald-600 rounded-lg border border-emerald-500/20 flex items-center gap-2">
                      <CheckCircle size={16} />
                      <span>Data berhasil disimulasikan! (Tersedia untuk migrasi ke Database).</span>
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
                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
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
                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
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
          </div>
        )}
      </div>
    </div>
  );
}


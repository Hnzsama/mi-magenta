import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ChartLineUp,
  MapPin,
  Globe
} from "@phosphor-icons/react/dist/ssr";
import { Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAllOpportunities } from "@/lib/opportunities";
import { OpportunityList } from "@/components/opportunity-list";

export default function Home() {
  const opportunities = getAllOpportunities();
  const stupenCount = opportunities.filter((o) => o.type === "stupen").length;
  const magangCount = opportunities.filter((o) => o.type === "magang").length;

  const partnerList = [
    { name: "PT Mitra Talenta Grup (Celerates)", type: "Tech Enterprise", city: "Jakarta Selatan" },
    { name: "PT PAL Indonesia", type: "BUMN Industri Pertahanan", city: "Surabaya" },
    { name: "PT Telkom Indonesia", type: "BUMN Telekomunikasi", city: "Malang" },
    { name: "PT WINGS SURYA", type: "FMCG Manufacture", city: "Gresik" },
    { name: "Diskominfo Kab. Kediri", type: "Pemerintahan Daerah", city: "Kediri" },
    { name: "Diskominfo Kab. Nganjuk", type: "Pemerintahan Daerah", city: "Nganjuk" },
    { name: "DPRD Surabaya", type: "Lembaga Legislatif", city: "Surabaya" },
    { name: "PT Vinix Seven Aurum", type: "Software House", city: "Yogyakarta" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with subtle MI logo gradient */}
      <section className="relative overflow-hidden bg-mi-gradient-subtle pt-12 pb-16 md:pt-20 md:pb-24 border-b">
        {/* Soft decorative background glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--mi-cyan)]/10 blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-[var(--mi-yellow)]/10 blur-3xl pointer-events-none" />

        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              {/* Clean Badge with Lucide Sparkles */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/90 px-4 py-1.5 text-xs font-semibold text-primary shadow-2xs backdrop-blur">
                <Globe size={15} className="text-[var(--mi-orange)] shrink-0" />
                <span>Magenta MI &bull; Magang &amp; Studi Independen Terpadu</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                Peluang Magang &amp; Studi Independen Terpadu{" "}
                <span className="text-mi-gradient">Manajemen Informatika</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Temukan mitra industri kredibel mulai dari BUMN (PT PAL, Telkom Indonesia), perusahaan teknologi (Celerates, Vinix7), FMCG (Wings Group), hingga Dinas Kominfo &amp; Pemerintahan Kota.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  size="lg"
                  className="gap-2 shadow-md bg-gradient-to-r from-[var(--mi-blue)] to-[var(--mi-cyan)] hover:opacity-95 text-white border-0"
                  nativeButton={false}
                  render={
                    <a href="#lowongan" className="inline-flex items-center gap-2">
                      Eksplor Lowongan <ArrowRight size={18} />
                    </a>
                  }
                />
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/5"
                  nativeButton={false}
                  render={
                    <Link href="/panduan">
                      Panduan Konversi &amp; Seleksi
                    </Link>
                  }
                />
              </div>

              {/* Quick stats pills */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/80">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[var(--mi-blue)]">{opportunities.length}</p>
                  <p className="text-xs text-muted-foreground">Tempat / Unit Terdata</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[var(--mi-cyan)]">{stupenCount}</p>
                  <p className="text-xs text-muted-foreground">Studi Independen</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[var(--mi-orange)]">{magangCount}</p>
                  <p className="text-xs text-muted-foreground">Magang Industri</p>
                </div>
              </div>
            </div>

            {/* Hero Visual Card / Summary Box */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border bg-card/90 backdrop-blur p-6 shadow-xl relative overflow-hidden space-y-5 bg-mi-card-glow">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl overflow-hidden border border-border/60 bg-white shadow-2xs shrink-0">
                      <Image
                        src="/favicon/apple-touch-icon.png"
                        alt="MI"
                        width={36}
                        height={36}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div>
                      <h2 className="font-semibold text-sm">Status Rekapitulasi Mahasiswa</h2>
                      <p className="text-xs text-muted-foreground">Prodi Manajemen Informatika</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-emerald-600 bg-emerald-50/80 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/60 dark:border-emerald-800">
                    Terverifikasi
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-background/80 border border-border/70 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <GraduationCap size={16} className="text-[var(--mi-cyan)]" />
                      <span>Studi Independen</span>
                    </div>
                    <p className="text-xl font-bold">{stupenCount} Unit</p>
                    <p className="text-[11px] text-muted-foreground">Celerates, Vinix7</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-background/80 border border-border/70 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Briefcase size={16} className="text-[var(--mi-orange)]" />
                      <span>Magang Industri</span>
                    </div>
                    <p className="text-xl font-bold">{magangCount} Unit</p>
                    <p className="text-[11px] text-muted-foreground">BUMN, Diskominfo, DPRD</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle size={16} weight="fill" className="text-[var(--mi-blue)] shrink-0 mt-0.5" />
                    <span>Rekap data tempat, alamat lengkap, dan nomor kontak resmi.</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle size={16} weight="fill" className="text-[var(--mi-cyan)] shrink-0 mt-0.5" />
                    <span>Dukungan pendaftaran Mandiri maupun Tim Kelompok.</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle size={16} weight="fill" className="text-[var(--mi-orange)] shrink-0 mt-0.5" />
                    <span>Kriteria kualifikasi &amp; kompetensi yang jelas.</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="secondary"
                    className="w-full text-xs"
                    nativeButton={false}
                    render={
                      <Link href="/panduan">
                        Pelajari Prosedur Pelaporan &amp; Konversi &rarr;
                      </Link>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned Clean & Modern Partners Section */}
      <section className="py-12 bg-muted/30 border-b">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Jejaring Kemitraan
            </p>
            <h2 className="text-lg font-bold text-foreground">
              Terhubung Dengan Institusi &amp; Perusahaan Rekanan Terkemuka
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {partnerList.map((p, idx) => (
              <div
                key={idx}
                className="group flex flex-col justify-between p-3.5 rounded-xl border border-border/80 bg-background/95 hover:border-primary/50 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--mi-cyan)]/10 text-[var(--mi-blue)] group-hover:bg-primary group-hover:text-white transition-colors">
                    <Building2 size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-xs text-foreground truncate group-hover:text-primary transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground truncate">{p.type}</p>
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin size={12} className="text-primary/70 shrink-0" /> {p.city}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded dark:text-emerald-400 dark:bg-emerald-950/60">
                    Mitra
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Jobs Listing Section */}
      <section id="lowongan" className="py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                <Briefcase size={14} className="text-[var(--mi-orange)]" /> Daftar Kesempatan Aktif
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Cari Posisi Magang &amp; Studi Independen
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Filter berdasarkan divisi, mode tim/mandiri, atau jenis program yang sesuai dengan peminatan Anda.
              </p>
            </div>
          </div>

          <OpportunityList initialItems={opportunities} />
        </div>
      </section>

      {/* Informational / Marketing Banner */}
      <section className="py-12 sm:py-16 bg-muted/30 border-t">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card">
              <CardContent className="pt-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-[var(--mi-blue)]/10 text-[var(--mi-blue)] flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-bold text-base">Terverifikasi Program Studi</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Semua instansi dan tempat magang yang tercantum telah melalui review dan verifikasi kurikulum prodi Manajemen Informatika.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="pt-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-[var(--mi-cyan)]/10 text-[var(--mi-cyan)] flex items-center justify-center">
                  <Building2 size={24} />
                </div>
                <h3 className="font-bold text-base">Peluang Tim &amp; Kolaboratif</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tersedia opsi penempatan secara kelompok (Tim) di institusi pemerintahan seperti Diskominfo Kediri dan PT PAL Indonesia.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="pt-6 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-[var(--mi-orange)]/10 text-[var(--mi-orange)] flex items-center justify-center">
                  <ChartLineUp size={24} />
                </div>
                <h3 className="font-bold text-base">Dukungan Karir &amp; Portofolio</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Mahasiswa mendapatkan pengalaman real project dari Data Science, Fullstack Web, hingga IT Support infrastruktur.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

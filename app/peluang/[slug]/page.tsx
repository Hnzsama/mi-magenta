import Link from "next/link";
import {
  Building,
  MapPin,
  Phone,
  EnvelopeSimple,
  Users,
  ArrowLeft,
  CheckCircle,
  WarningCircle,
  Info
} from "@phosphor-icons/react/dist/ssr";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getOpportunityBySlug, getAllOpportunities, getRelatedOpportunities } from "@/lib/opportunities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OpportunityCard } from "@/components/opportunity-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const items = getAllOpportunities();
  return items.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getOpportunityBySlug(slug);

  if (!item) {
    return {
      title: "Lowongan Tidak Ditemukan - Magenta MI",
      description: "Lowongan magang atau studi independen tidak ditemukan.",
    };
  }

  const roleText = item.roles.join(", ");
  const typeName = item.type === "stupen" ? "Studi Independen (Stupen)" : "Magang Industri";
  const title = `${roleText} di ${item.company} | ${typeName} - Magenta MI`;
  const description = `${item.description} Divisi: ${item.divisions.join(", ")}. Lokasi: ${item.location.city}, ${item.location.province}. Mode: ${item.mode}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `/peluang/${item.slug}`,
      siteName: "Magenta MI - Magang dan Studi Independen Terpadu",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getOpportunityBySlug(slug);

  if (!item) {
    notFound();
  }

  const related = getRelatedOpportunities(item.id, 3);
  const isStupen = item.type === "stupen";

  return (
    <div className="min-h-screen bg-muted/20 py-8 sm:py-12">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb / Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={
              <Link href="/#lowongan" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                <ArrowLeft size={16} /> Kembali ke Semua Peluang
              </Link>
            }
          />
        </div>

        {/* Top Header Card */}
        <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={isStupen ? "secondary" : "default"} className="text-xs">
                  {isStupen ? "Studi Independen" : "Magang Industri"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {item.mode === "Tim" ? (
                    <span className="flex items-center gap-1">
                      <Users size={12} /> Tim / Kelompok
                    </span>
                  ) : (
                    "Mandiri"
                  )}
                </Badge>
                {item.categories.map((cat) => (
                  <span key={cat} className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded">
                    {cat}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                {item.roles.join(" / ")}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5 text-foreground font-semibold">
                  <Building size={18} className="text-primary" />
                  {item.company}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={18} className="text-primary" />
                  {item.location.city}, {item.location.province}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <Button
                size="lg"
                className="gap-2 shadow"
                nativeButton={false}
                render={
                  <a
                    href={`https://wa.me/${item.contact.phone.replace(/[^0-9]/g, "")}?text=Halo%20Admin%20${encodeURIComponent(
                      item.company
                    )},%20saya%20mahasiswa%20Manajemen%20Informatika%20tertarik%20mendaftar%20posisi%20${encodeURIComponent(
                      item.roles.join(" / ")
                    )}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <Phone size={18} /> Hubungi via WhatsApp / Telp
                  </a>
                }
              />
              {item.contact.email && (
                <Button
                  variant="outline"
                  size="lg"
                  nativeButton={false}
                  render={
                    <a
                      href={`mailto:${item.contact.email}?subject=Lamaran%20Magang/Stupen%20-%20${encodeURIComponent(item.roles.join(" / "))}`}
                      className="inline-flex items-center gap-1.5"
                    >
                      <EnvelopeSimple size={18} /> Kirim Email
                    </a>
                  }
                />
              )}
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Description & Divisions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informasi Program &amp; Aktivitas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-foreground/90 leading-relaxed">
                <p>{item.description}</p>
                <div className="bg-muted/40 p-3.5 rounded-xl border space-y-2">
                  <p className="font-semibold text-xs text-foreground uppercase tracking-wider">
                    Divisi / Unit Kerja / Bidang ({item.divisions.length}):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.divisions.map((div) => (
                      <Badge key={div} variant="secondary" className="text-xs">
                        {div}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/40 p-3.5 rounded-xl border space-y-2">
                  <p className="font-semibold text-xs text-foreground uppercase tracking-wider">
                    Role / Posisi Pekerjaan ({item.roles.length}):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.roles.map((r) => (
                      <Badge key={r} variant="outline" className="text-xs bg-background">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kriteria & Persyaratan Mahasiswa */}
            {item.requirements && item.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kriteria &amp; Kualifikasi Mahasiswa</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {item.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground/90">
                        <CheckCircle size={18} weight="fill" className="text-primary shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Benefits if present */}
            {item.benefits && item.benefits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Benefit &amp; Luaran Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {item.benefits.map((ben, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground/90">
                        <CheckCircle size={18} weight="fill" className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{ben}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Meta (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Informasi Singkat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Jenis Program</span>
                  <span className="font-semibold text-foreground">
                    {isStupen ? "Studi Independen Bersertifikat" : "Magang Industri Lapangan"}
                  </span>
                </div>
                <Separator />
                <div>
                  <span className="text-xs text-muted-foreground block">Mode Pelaksanaan</span>
                  <span className="font-semibold text-foreground">
                    {item.mode === "Tim" ? "Tim / Kelompok (Dapat berkelompok)" : "Mandiri (Individu)"}
                  </span>
                </div>
                {item.slots ? (
                  <>
                    <Separator />
                    <div>
                      <span className="text-xs text-muted-foreground block">Jumlah Kuota</span>
                      <span className="font-semibold text-foreground">{item.slots} Mahasiswa</span>
                    </div>
                  </>
                ) : null}
                <Separator />
                <div>
                  <span className="text-xs text-muted-foreground block">Alamat Lengkap</span>
                  <span className="text-xs text-foreground/90 leading-relaxed block mt-0.5">
                    {item.location.address}
                  </span>
                </div>
                <Separator />
                <div>
                  <span className="text-xs text-muted-foreground block">No. Telepon Tempat</span>
                  <span className="text-xs text-foreground font-mono block mt-0.5">
                    {item.contact.phone}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-xs text-blue-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <Info size={16} /> Verifikasi Data
              </div>
              <p className="leading-relaxed">
                Data tempat, alamat, no. telepon, dan divisi bersumber langsung dari rekapitulasi resmi Manajemen Informatika.
              </p>
            </div>
          </div>
        </div>

        {/* Related Opportunities */}
        {related.length > 0 && (
          <div className="pt-8 space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Peluang Terkait Lainnya</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <OpportunityCard key={rel.id} item={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

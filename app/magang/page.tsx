import { Metadata } from "next";
import { Briefcase, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { getOpportunitiesByType } from "@/lib/opportunities";
import { OpportunityList } from "@/components/opportunity-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Magang Industri Mahasiswa - Magenta MI",
  description: "Daftar tempat magang industri terpercaya untuk mahasiswa Manajemen Informatika di BUMN PT PAL Indonesia, PT Telkom Indonesia, PT Wings Surya, Diskominfo Kab. Kediri & Nganjuk, dan DPRD Surabaya.",
  openGraph: {
    title: "Magang Industri Mahasiswa - Magenta MI",
    description: "Katalog lowongan magang industri rekapitulasi Manajemen Informatika.",
  },
};

export default function MagangPage() {
  const magangItems = getOpportunitiesByType("magang");

  return (
    <div className="min-h-screen py-10 sm:py-14">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="rounded-2xl border bg-gradient-to-r from-blue-500/10 via-background to-background p-6 sm:p-10 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1 text-xs font-semibold text-primary">
            <Briefcase size={16} /> Magang Kerja Praktik &amp; Industri
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Peluang Magang Industri Mahasiswa
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
            Praktik kerja nyata di instansi pemerintah, BUMN strategis, dan korporasi swasta. Mendukung pendaftaran perorangan (Mandiri) maupun per kelompok (Tim).
          </p>
        </div>

        <OpportunityList initialItems={magangItems} defaultType="magang" />
      </div>
    </div>
  );
}


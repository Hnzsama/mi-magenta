import { Metadata } from "next";
import { GraduationCap, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { getOpportunitiesByType } from "@/lib/opportunities";
import { OpportunityList } from "@/components/opportunity-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Studi Independen Bersertifikat (Stupen) - Magenta MI",
  description: "Daftar program Studi Independen (Stupen) bersertifikat mitra resmi prodi Manajemen Informatika seperti Celerates dan Vinix7 dalam bidang Data Analytics, Web Development, dan UI/UX.",
  openGraph: {
    title: "Studi Independen Bersertifikat (Stupen) - Magenta MI",
    description: "Katalog lowongan Studi Independen bagi mahasiswa Manajemen Informatika.",
  },
};

export default function StupenPage() {
  const stupenItems = getOpportunitiesByType("stupen");

  return (
    <div className="min-h-screen py-10 sm:py-14">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--mi-cyan)]/25 bg-gradient-to-br from-cyan-100/70 via-sky-50/50 to-background p-6 sm:p-10 shadow-sm dark:border-border dark:from-cyan-950/30 dark:via-background dark:to-background space-y-4">
          {/* Subtle decorative glow */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[var(--mi-cyan)]/20 dark:bg-[var(--mi-cyan)]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[var(--mi-blue)]/15 dark:bg-transparent blur-3xl pointer-events-none" />

          <div className="relative space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-background/90 px-3 py-1 text-xs font-semibold text-primary shadow-2xs backdrop-blur">
              <GraduationCap size={16} className="text-[var(--mi-cyan)]" /> Program Studi Independen Bersertifikat
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Peluang Studi Independen (Stupen)
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
              Program pembelajaran terstruktur di industri teknologi untuk menguasai kompetensi tingkat lanjut seperti Data Analytics &amp; Business Intelligence serta Modern Web &amp; UI/UX Design.
            </p>
          </div>
        </div>

        <OpportunityList initialItems={stupenItems} defaultType="stupen" />
      </div>
    </div>
  );
}


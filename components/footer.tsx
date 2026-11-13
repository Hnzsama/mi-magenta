import Link from "next/link";
import Image from "next/image";
import { GraduationCap, EnvelopeSimple, Phone, MapPin, Heart } from "@phosphor-icons/react/dist/ssr";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-white shadow-2xs">
                <Image
                  src="/favicon/apple-touch-icon.png"
                  alt="Logo MI"
                  width={36}
                  height={36}
                  className="object-contain w-full h-full"
                />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight">Magenta MI</span>
                <p className="text-[11px] text-muted-foreground">Magang dan Studi Independen Terpadu</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Platform resmi Magang dan Studi Independen Terpadu (Magenta MI) untuk mahasiswa Program Studi Manajemen Informatika. Menghubungkan talenta muda dengan ekosistem BUMN, dinas pemerintahan, dan industri teknologi nasional.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <span>Program Studi Manajemen Informatika</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <span>Pusat Layanan Karir &amp; Hubungan Industri</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 tracking-wide text-foreground">Program &amp; Navigasi</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/stupen" className="hover:text-primary transition-colors">
                  Studi Independen (Stupen)
                </Link>
              </li>
              <li>
                <Link href="/magang" className="hover:text-primary transition-colors">
                  Magang Industri Mahasiswa
                </Link>
              </li>
              <li>
                <Link href="/#lowongan" className="hover:text-primary transition-colors">
                  Semua Peluang Terdaftar
                </Link>
              </li>
              <li>
                <Link href="/panduan" className="hover:text-primary transition-colors">
                  Panduan Dosen Pembimbing
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors">
                  Portal Admin &amp; Mitra
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 tracking-wide text-foreground">Kategori Keahlian MI</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Web &amp; UI/UX Development</li>
              <li>Data Analytics &amp; Business Intelligence</li>
              <li>IT Support, Network &amp; Hardware</li>
              <li>Digital Marketing &amp; Sales Operations</li>
              <li>Sistem Informasi Pemerintahan (SPBE)</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; 2026 Program Studi Manajemen Informatika. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Dibuat untuk mempermudah monitoring &amp; publikasi magang mahasiswa MI.
          </p>
        </div>
      </div>
    </footer>
  );
}

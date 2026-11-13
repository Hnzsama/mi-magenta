import { Metadata } from "next";
import {
  BookOpen,
  CheckCircle,
  FileText,
  UserCheck,
  Buildings,
  ArrowRight
} from "@phosphor-icons/react/dist/ssr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Panduan Magang & Stupen - Magenta MI",
  description: "Alur pengajuan magang, verifikasi dosen pembimbing, konversi SKS kurikulum Manajemen Informatika, dan pelaporan berkala pada portal Magenta MI.",
};

export default function PanduanPage() {
  const steps = [
    {
      num: "01",
      title: "Pilih Lowongan & Konsultasi Dosen",
      desc: "Telusuri katalog magang atau studi independen. Diskusikan kecocokan kompetensi divisi dengan Dosen Wali atau Koordinator Magang Prodi MI.",
    },
    {
      num: "02",
      title: "Penerbitan Surat Pengantar Kampus",
      desc: "Ajukan permohonan surat pengantar magang/surat izin kepada bagian tata usaha prodi Manajemen Informatika dengan melampirkan profil instansi tujuan.",
    },
    {
      num: "03",
      title: "Proses Seleksi & Penerimaan Mitra",
      desc: "Mengikuti proses interview/asesmen dari mitra (seperti Celerates, Diskominfo, atau PT PAL). Unggah bukti Letter of Acceptance (LoA) jika diterima.",
    },
    {
      num: "04",
      title: "Pelaksanaan & Logbook Mingguan",
      desc: "Menjalankan aktivitas magang selama 1 semester atau periode program. Mengisi logbook mingguan dan asistensi berkala dengan Dosen Pembimbing Lapangan (DPL).",
    },
    {
      num: "05",
      title: "Ujian Seminar & Konversi SKS",
      desc: "Menyusun laporan akhir, seminar pertanggungjawaban magang, dan proses konversi nilai mata kuliah hingga 20 SKS.",
    },
  ];

  return (
    <div className="min-h-screen py-10 sm:py-16">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            Panduan Akademik &amp; Alur Kerja
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Alur Magang &amp; Studi Independen MI
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Panduan lengkap bagi mahasiswa dan dosen pembimbing untuk memastikan kualitas luaran serta legalitas administrasi magang prodi Manajemen Informatika.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="space-y-4">
          {steps.map((st, i) => (
            <Card key={i} className="hover:border-primary/40 transition-colors">
              <CardContent className="p-6 flex flex-col sm:flex-row items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-mono text-xl font-bold">
                  {st.num}
                </div>
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-foreground">{st.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{st.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="text-primary" size={20} /> Syarat Kelayakan Mahasiswa
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>&bull; Mahasiswa aktif minimal Semester 4 atau Semester 6 sesuai kurikulum program studi.</p>
              <p>&bull; IPK kumulatif minimal 2.75 dan tidak ada mata kuliah prasyarat magang yang tertinggal.</p>
              <p>&bull; Mendapat rekomendasi tertulis dari Dosen Pembimbing Akademik.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UserCheck className="text-primary" size={20} /> Peran Dosen Pembimbing
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>&bull; Memonitor keselarasan tugas mahasiswa di industri dengan Capaian Pembelajaran Lulusan (CPL).</p>
              <p>&bull; Melakukan koordinasi dan monitoring evaluasi tengah periode bersama mentor instansi.</p>
              <p>&bull; Memberikan penilaian akhir dan evaluasi seminar hasil magang.</p>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-2xl border bg-muted/40 p-8 text-center space-y-4">
          <h2 className="text-lg font-bold">Siap Memilih Tempat Magang atau Stupen?</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Jelajahi daftar perusahaan dan instansi pemerintah yang telah membuka kuota bagi mahasiswa Manajemen Informatika.
          </p>
          <Button
            className="gap-2"
            nativeButton={false}
            render={
              <Link href="/#lowongan" className="inline-flex items-center gap-2">
                Lihat Daftar Lowongan Aktif <ArrowRight size={16} />
              </Link>
            }
          />
        </div>
      </div>
    </div>
  );
}

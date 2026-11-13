import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Magenta MI | Magang & Studi Independen Terpadu Manajemen Informatika",
    template: "%s | Magenta MI",
  },
  description:
    "Magenta MI (Magang dan Studi Independen Terpadu) - Platform resmi rekapitulasi data dan informasi kesempatan Magang Industri & Studi Independen bagi mahasiswa program studi Manajemen Informatika.",
  keywords: [
    "Magenta MI",
    "Magenta Manajemen Informatika",
    "Magang dan Studi Independen Terpadu",
    "Magang Manajemen Informatika",
    "Studi Independen Bersertifikat",
    "Stupen MI",
    "MBKM Manajemen Informatika",
    "Celerates Data Analyst",
    "PT PAL Indonesia Magang",
    "Telkom Indonesia Magang",
    "Diskominfo Kediri",
    "Diskominfo Nganjuk",
    "DPRD Surabaya",
    "Vinix7 Yogyakarta",
    "Wings Surya Gresik",
  ],
  authors: [{ name: "Program Studi Manajemen Informatika" }],
  creator: "Manajemen Informatika",
  publisher: "Manajemen Informatika",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "Magenta MI - Magang dan Studi Independen Terpadu",
    title: "Magenta MI | Magang & Studi Independen Terpadu Manajemen Informatika",
    description:
      "Temukan peluang magang industri dan program studi independen bersertifikat terpadu untuk mahasiswa Manajemen Informatika.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Magenta MI - Magang dan Studi Independen Terpadu",
    description:
      "Pusat informasi lowongan magang & studi independen terpadu mahasiswa Manajemen Informatika.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className={cn("h-full scroll-smooth", geistSans.variable, geistMono.variable)}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

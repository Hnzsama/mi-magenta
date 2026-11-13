"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  GraduationCap, 
  Briefcase, 
  UserCheck, 
  List, 
  House, 
  BookOpen,
  ArrowRight
} from "@phosphor-icons/react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-2xs">
      <div className="container mx-auto flex min-h-[4rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-2">
        {/* Brand Section with Logo & New Identity */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group py-1">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-border/60 bg-white shadow-2xs transition-transform group-hover:scale-105">
            <Image
              src="/favicon/apple-touch-icon.png"
              alt="Logo Manajemen Informatika"
              width={38}
              height={38}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col justify-center leading-none">
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-foreground whitespace-nowrap">
                MAGENTA <span className="text-[var(--mi-blue)]">MI</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-full bg-gradient-to-r from-[var(--mi-cyan)]/15 via-[var(--mi-blue)]/15 to-[var(--mi-orange)]/15 text-primary border border-primary/20">
                Terpadu
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground mt-1 whitespace-nowrap font-medium">
              Magang &amp; Studi Independen Terpadu
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium ml-12 mr-auto">
          <Link href="/" className="text-foreground/90 hover:text-primary transition-colors py-1 whitespace-nowrap">
            Beranda
          </Link>

          {/* Program Magang & Stupen Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors py-1 whitespace-nowrap outline-none cursor-pointer"
                >
                  <span>Program Peluang</span>
                  <ChevronDown size={14} className="opacity-70 transition-transform duration-200" />
                </button>
              }
            />
            <DropdownMenuContent align="start" className="w-56 p-2 rounded-xl shadow-lg border">
              <DropdownMenuItem
                render={
                  <Link
                    href="/stupen"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer hover:bg-muted"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--mi-cyan)]/10 text-[var(--mi-blue)]">
                      <GraduationCap size={16} />
                    </div>
                    <div>
                      <span className="font-semibold block text-foreground">Studi Independen</span>
                      <span className="text-[10px] text-muted-foreground">Sertifikasi &amp; Project Industri</span>
                    </div>
                  </Link>
                }
              />
              <DropdownMenuItem
                render={
                  <Link
                    href="/magang"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer hover:bg-muted"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--mi-orange)]/10 text-[var(--mi-orange)]">
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <span className="font-semibold block text-foreground">Magang Industri</span>
                      <span className="text-[10px] text-muted-foreground">Kerja Praktik Mandiri / Tim</span>
                    </div>
                  </Link>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/panduan" className="text-muted-foreground hover:text-primary transition-colors py-1 whitespace-nowrap">
            Panduan Dosen &amp; Mahasiswa
          </Link>
        </nav>

        {/* Dark/Light Mode Toggle & Mobile Hamburger */}
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <ModeToggle />

          {/* Mobile Sheet Trigger (shown on < md screens) */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden rounded-lg h-9 w-9"
                  aria-label="Buka Menu Navigasi"
                >
                  <List size={20} />
                </Button>
              }
            />
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <SheetHeader className="text-left pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden border border-border/60 bg-white shadow-2xs">
                      <Image
                        src="/favicon/apple-touch-icon.png"
                        alt="Logo MI"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <SheetTitle className="text-base font-black">MAGENTA MI</SheetTitle>
                      <p className="text-xs text-muted-foreground">Magang &amp; Studi Independen Terpadu</p>
                    </div>
                  </div>
                </SheetHeader>

                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">
                    Menu Navigasi
                  </p>
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    <House size={18} className="text-primary/70 shrink-0" />
                    <span>Beranda</span>
                  </Link>

                  <div className="py-2 px-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-1.5">
                      Program Peluang
                    </p>
                    <div className="space-y-1 pl-1 border-l-2 border-primary/20">
                      <Link
                        href="/stupen"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-foreground/85 hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        <GraduationCap size={16} className="text-[var(--mi-cyan)]" />
                        <span>Studi Independen (Stupen)</span>
                      </Link>
                      <Link
                        href="/magang"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-foreground/85 hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        <Briefcase size={16} className="text-[var(--mi-orange)]" />
                        <span>Magang Industri</span>
                      </Link>
                    </div>
                  </div>

                  <Link
                    href="/panduan"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    <BookOpen size={18} className="text-primary/70 shrink-0" />
                    <span>Panduan Dosen &amp; Mahasiswa</span>
                  </Link>
                </div>
              </div>

              {/* Bottom Actions inside Sheet */}
              <div className="pt-6 border-t space-y-2">
                <Button
                  className="w-full rounded-lg gap-1.5"
                  nativeButton={false}
                  render={
                    <Link href="/#lowongan" onClick={() => setOpen(false)} className="inline-flex items-center justify-center w-full">
                      Eksplor Lowongan <ArrowRight size={16} />
                    </Link>
                  }
                />
                <Button
                  variant="outline"
                  className="w-full rounded-lg"
                  nativeButton={false}
                  render={
                    <Link href="/admin" onClick={() => setOpen(false)} className="inline-flex items-center justify-center w-full">
                      <UserCheck size={16} className="mr-1.5" /> Portal Admin / Mitra
                    </Link>
                  }
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

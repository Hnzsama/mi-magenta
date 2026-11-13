"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-lg border-border/80 text-muted-foreground"
        aria-label="Toggle theme"
      >
        <span className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-9 w-9 rounded-lg border-border/80 text-foreground hover:text-primary hover:border-primary/50 transition-colors cursor-pointer"
      aria-label="Beralih ke mode gelap atau terang"
      title={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
    >
      {isDark ? (
        <Sun size={18} className="text-amber-400 transition-transform duration-200 rotate-0 scale-100" />
      ) : (
        <Moon size={18} className="text-slate-700 dark:text-slate-200 transition-transform duration-200 rotate-0 scale-100" />
      )}
    </Button>
  );
}

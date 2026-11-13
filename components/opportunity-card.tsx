import Link from "next/link";
import { 
  Building, 
  MapPin, 
  Users, 
  ArrowRight,
  Sparkle
} from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Opportunity } from "@/lib/opportunities";

interface OpportunityCardProps {
  item: Opportunity;
}

export function OpportunityCard({ item }: OpportunityCardProps) {
  const isStupen = item.type === "stupen";

  return (
    <Card className="flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-primary/40 relative overflow-hidden group">
      <div>
        <CardHeader className="pb-3 pt-5">
          {/* Top Row: Type & Mode aligned with Featured or Category */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge 
                variant={isStupen ? "secondary" : "default"} 
                className="text-xs font-semibold rounded-md shadow-2xs"
              >
                {isStupen ? "Studi Independen" : "Magang Industri"}
              </Badge>
              <Badge 
                variant="outline" 
                className="text-xs font-medium rounded-md bg-background text-foreground/80 border-border/80"
              >
                {item.mode === "Tim" ? (
                  <span className="flex items-center gap-1">
                    <Users size={13} /> Tim / Kelompok
                  </span>
                ) : (
                  "Mandiri"
                )}
              </Badge>
            </div>

            {item.featured ? (
              <Badge 
                variant="outline" 
                className="text-[11px] font-semibold text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400 gap-1 rounded-md shrink-0"
              >
                <Sparkle size={12} weight="fill" /> Featured
              </Badge>
            ) : (
              item.categories[0] && (
                <span className="text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md shrink-0">
                  {item.categories[0]}
                </span>
              )
            )}
          </div>

          <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors">
            <Link href={`/peluang/${item.slug}`}>
              {item.roles.join(" / ")}
            </Link>
          </CardTitle>

          <CardDescription className="flex items-center gap-1.5 font-medium text-foreground/80 mt-1.5">
            <Building size={16} className="text-primary/70 shrink-0" />
            <span className="truncate">{item.company}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pb-3 text-sm">
          <div className="flex items-start gap-1.5 text-muted-foreground text-xs">
            <MapPin size={15} className="text-muted-foreground shrink-0 mt-0.5" />
            <span className="line-clamp-2 leading-relaxed">{item.location.address}</span>
          </div>

          {/* Divisions as clean styled badges */}
          <div className="bg-muted/40 p-3 rounded-xl space-y-2 text-xs border border-muted/80">
            <span className="font-semibold text-foreground/90 block text-[11px] uppercase tracking-wider">
              Divisi / Bidang:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {item.divisions.map((div) => (
                <span 
                  key={div} 
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-background border border-border/70 text-foreground/85 shadow-2xs"
                >
                  {div}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </CardContent>
      </div>

      <CardFooter className="pt-3 pb-3 border-t bg-muted/20 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Lokasi: <strong className="text-foreground">{item.location.city}</strong>
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 px-2.5 text-primary hover:text-primary hover:bg-primary/10 rounded-md font-medium"
          nativeButton={false}
          render={
            <Link href={`/peluang/${item.slug}`} className="inline-flex items-center gap-1">
              Detail <ArrowRight size={14} />
            </Link>
          }
        />
      </CardFooter>
    </Card>
  );
}

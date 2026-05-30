import { Badge } from "@/components/ui/badge";
import type { EstadoCarga } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const styles: Record<EstadoCarga, string> = {
  Pendiente: "bg-amber-50 text-amber-700 border-amber-200",
  Validado: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rechazado: "bg-orange-50 text-orange-700 border-orange-200",
};

export function StatusBadge({ estado }: { estado: EstadoCarga }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", styles[estado])}
    >
      {estado}
    </Badge>
  );
}

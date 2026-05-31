import { Cloud, Droplets, Leaf, TreePine, Zap } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface ImpactoKpisProps {
  kgTotal: number;
  co2Evitado: number;
  arbolesEquivalentes: number;
  aguaLitros: number;
  energiaKwh: number;
}

function KpiCard({
  label,
  value,
  unit,
  icon: Icon,
  iconColorClass = "text-primary",
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  iconColorClass?: string;
}) {
  return (
    <Card className="fundares-kpi">
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
            {label}
          </p>
          <div className="flex size-8 items-center justify-center rounded-xl bg-secondary/50">
            <Icon className={`size-4.5 ${iconColorClass}`} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-4 font-heading text-3xl font-black text-foreground tracking-tight flex items-baseline">
          {value}
          {unit && (
            <span className="ml-1 text-xs font-sans font-semibold text-muted-foreground">
              {unit}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

function formatKgKpi(val: number): { value: string; unit: string } {
  if (val >= 1000) {
    return { value: (val / 1000).toFixed(2), unit: "t" };
  }
  return { value: val.toFixed(0), unit: "kg" };
}

function formatKgHero(val: number): { value: string; unit: string } {
  if (val >= 1000) {
    return { value: (val / 1000).toFixed(2), unit: "t" };
  }
  return { value: val.toFixed(1), unit: "kg" };
}

export function ImpactoKpis({
  kgTotal,
  co2Evitado,
  arbolesEquivalentes,
  aguaLitros,
  energiaKwh,
}: ImpactoKpisProps) {
  const co2Formatted = formatKgKpi(co2Evitado);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="CO₂ evitado"
        value={co2Formatted.value}
        unit={co2Formatted.unit}
        icon={Cloud}
        iconColorClass="text-sky-500"
      />
      <KpiCard
        label="Árboles equivalentes"
        value={arbolesEquivalentes}
        icon={TreePine}
        iconColorClass="text-emerald-500"
      />
      <KpiCard
        label="Agua ahorrada"
        value={aguaLitros.toLocaleString("es-BO")}
        unit="L"
        icon={Droplets}
        iconColorClass="text-blue-500"
      />
      <KpiCard
        label="Energía ahorrada"
        value={energiaKwh.toLocaleString("es-BO")}
        unit="kWh"
        icon={Zap}
        iconColorClass="text-amber-500"
      />
    </div>
  );
}

export function ImpactoHero({ kgTotal, empresa }: { kgTotal: number; empresa: string }) {
  const heroWeight = formatKgHero(kgTotal);

  return (
    <Card className="relative overflow-hidden border-none bg-gradient-to-br from-[#1c4748] via-[#225758] to-[#173c3d] text-white shadow-xl shadow-emerald-950/10">
      {/* Patrón SVG decorativo */}
      <svg
        className="absolute inset-0 h-full w-full stroke-white/5 pointer-events-none"
        fill="none"
        viewBox="0 0 400 200"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path d="M-100 150 C 200 50, 150 250, 500 150 M-100 170 C 200 70, 150 270, 500 170 M-100 130 C 200 30, 150 230, 500 130" strokeWidth="1.5" />
      </svg>
      
      {/* Brillo degradado sutil */}
      <div className="absolute -left-12 -top-12 size-48 rounded-full bg-emerald-400/10 blur-3xl" />
      
      <CardContent className="relative z-10 py-10 px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-inner">
              <Leaf className="size-7 text-emerald-300" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-200/80">
                Total reciclado verificado · {empresa}
              </p>
              <h2 className="mt-3 font-heading text-5xl font-black text-white tracking-tight sm:text-6xl md:text-7xl flex items-baseline">
                {heroWeight.value}
                <span className="ml-2 text-2xl font-medium text-emerald-300">{heroWeight.unit}</span>
              </h2>
            </div>
          </div>
          <div className="max-w-xs md:text-right border-t border-white/10 pt-4 md:border-none md:pt-0">
            <p className="text-xs font-medium text-emerald-200/70 uppercase tracking-widest">Certificación Ambiental</p>
            <p className="mt-1 text-sm text-emerald-100/90 leading-relaxed">
              Acumulado de cargas pesadas en origen y validadas por los centros de acopio oficiales de FUNDARES.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import dynamic from "next/dynamic";

const WeightChartInner = dynamic(
  () =>
    import("@/components/dashboard/weight-chart").then((mod) => mod.WeightChart),
  {
    ssr: false,
    loading: () => (
      <div className="fundares-card flex h-80 items-center justify-center rounded-xl border border-border/60 bg-card">
        <p className="text-sm text-muted-foreground">Cargando gráfico...</p>
      </div>
    ),
  }
);

interface WeightChartProps {
  data: Array<{
    label: string;
    reportado: number;
    acopio: number;
  }>;
}

export function WeightChart(props: WeightChartProps) {
  return <WeightChartInner {...props} />;
}

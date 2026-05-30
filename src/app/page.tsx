import { CargasTable } from "@/components/cargas/cargas-table";
import { PendingWidget } from "@/components/dashboard/pending-widget";
import { WeightChart } from "@/components/dashboard/weight-chart-client";
import {
  getCargas,
  getPendingCount,
  getWeightComparisonData,
} from "@/lib/actions/cargas";
import { createServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const [pendingCount, cargas, chartData] = await Promise.all([
    getPendingCount(),
    getCargas(),
    getWeightComparisonData(),
  ]);

  const usingMock = !createServerClient();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard de Validación
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Revise y valide las cargas de recolección registradas por los
          recolectores.
        </p>
        {usingMock && (
          <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Modo demostración: configure{" "}
            <code className="font-mono">.env.local</code> con sus credenciales
            de Supabase para conectar datos reales.
          </p>
        )}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <PendingWidget count={pendingCount} />
        <div className="lg:col-span-2">
          <WeightChart data={chartData} />
        </div>
      </div>

      <CargasTable cargas={cargas} />
    </div>
  );
}

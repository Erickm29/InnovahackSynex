import { CargasTable } from "@/components/cargas/cargas-table";
import { PendingWidget } from "@/components/dashboard/pending-widget";
import { getCargas, getPendingCount } from "@/lib/actions/cargas";

export default async function PendientesPage() {
  const [pendingCount, cargas] = await Promise.all([
    getPendingCount(),
    getCargas("pendientes"),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Pendientes de Validación
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cargas que requieren revisión y aprobación del validador.
        </p>
      </div>

      <div className="mb-8 max-w-sm">
        <PendingWidget count={pendingCount} />
      </div>

      <CargasTable
        cargas={cargas}
        title="Cargas pendientes"
        showOnlyPending
      />
    </div>
  );
}

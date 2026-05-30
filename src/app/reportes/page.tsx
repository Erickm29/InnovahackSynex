import { WeightChart } from "@/components/dashboard/weight-chart-client";
import { StatusBadge } from "@/components/cargas/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCargas, getWeightComparisonData } from "@/lib/actions/cargas";

export default async function ReportesPage() {
  const [cargas, chartData] = await Promise.all([
    getCargas(),
    getWeightComparisonData(),
  ]);

  const validadas = cargas.filter((c) => c.estado === "Validado").length;
  const rechazadas = cargas.filter((c) => c.estado === "Rechazado").length;
  const pendientes = cargas.filter((c) => c.estado === "Pendiente").length;
  const pesoTotal = cargas.reduce((sum, c) => sum + c.peso_reportado, 0);

  const stats = [
    { label: "Total cargas", value: cargas.length },
    { label: "Validadas", value: validadas, color: "text-fundares-accent" },
    { label: "Rechazadas", value: rechazadas, color: "text-fundares-reject" },
    { label: "Pendientes", value: pendientes, color: "text-amber-600" },
    {
      label: "Peso total reportado",
      value: `${pesoTotal.toFixed(1)} kg`,
      color: "text-fundares",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Reportes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen de validaciones y comparación de pesos.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label} className="fundares-card">
            <CardContent className="pt-6">
              <p className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p
                className={`mt-1 text-2xl font-semibold ${stat.color ?? "text-foreground"}`}
              >
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-8">
        <WeightChart data={chartData} />
      </div>

      <Card className="fundares-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Detalle por estado
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Empresa</TableHead>
                <TableHead>Recolector</TableHead>
                <TableHead className="text-right">Peso reportado</TableHead>
                <TableHead className="text-right">Peso acopio</TableHead>
                <TableHead className="pr-6">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cargas.map((carga) => (
                <TableRow key={carga.id}>
                  <TableCell className="pl-6">{carga.empresa}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {carga.recolector_id}
                  </TableCell>
                  <TableCell className="text-right">
                    {carga.peso_reportado} kg
                  </TableCell>
                  <TableCell className="text-right">
                    {carga.peso_acopio != null
                      ? `${carga.peso_acopio} kg`
                      : "—"}
                  </TableCell>
                  <TableCell className="pr-6">
                    <StatusBadge estado={carga.estado} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

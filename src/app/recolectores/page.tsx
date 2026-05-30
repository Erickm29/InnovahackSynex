import { Users } from "lucide-react";

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
import { getCargas, getRecolectoresResumen } from "@/lib/actions/cargas";

export default async function RecolectoresPage() {
  const [resumen, cargas] = await Promise.all([
    getRecolectoresResumen(),
    getCargas(),
  ]);

  const recolectorIds = new Set(resumen.map((r) => r.recolector_id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Gestión de Recolectores
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen de actividad y cargas por recolector.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card className="fundares-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recolectores activos
            </CardTitle>
            <Users className="size-4 text-fundares" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-fundares">
              {recolectorIds.size}
            </p>
          </CardContent>
        </Card>
        <Card className="fundares-card">
          <CardContent className="pt-6">
            <p className="text-xs font-medium text-muted-foreground">
              Total cargas registradas
            </p>
            <p className="mt-1 text-3xl font-semibold">{cargas.length}</p>
          </CardContent>
        </Card>
        <Card className="fundares-card">
          <CardContent className="pt-6">
            <p className="text-xs font-medium text-muted-foreground">
              Pendientes de validación
            </p>
            <p className="mt-1 text-3xl font-semibold text-amber-600">
              {cargas.filter((c) => c.estado === "Pendiente").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="fundares-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Resumen por recolector
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Recolector ID</TableHead>
                <TableHead className="text-right">Total cargas</TableHead>
                <TableHead className="text-right">Pendientes</TableHead>
                <TableHead className="text-right">Validadas</TableHead>
                <TableHead className="pr-6 text-right">Rechazadas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resumen.map((item) => (
                <TableRow key={item.recolector_id}>
                  <TableCell className="pl-6 font-mono text-sm font-medium">
                    {item.recolector_id}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.total_cargas}
                  </TableCell>
                  <TableCell className="text-right text-amber-600">
                    {item.pendientes}
                  </TableCell>
                  <TableCell className="text-right text-fundares-accent">
                    {item.validadas}
                  </TableCell>
                  <TableCell className="pr-6 text-right text-fundares-reject">
                    {item.rechazadas}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="fundares-card mt-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Últimas cargas por recolector
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Recolector</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead className="text-right">Peso</TableHead>
                <TableHead className="pr-6">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cargas.slice(0, 10).map((carga) => (
                <TableRow key={carga.id}>
                  <TableCell className="pl-6 font-mono text-sm">
                    {carga.recolector_id}
                  </TableCell>
                  <TableCell>{carga.empresa}</TableCell>
                  <TableCell className="text-right">
                    {carga.peso_reportado} kg
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

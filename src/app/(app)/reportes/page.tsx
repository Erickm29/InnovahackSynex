import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Building2, CheckCircle2, Clock, Leaf, Package, XCircle } from "lucide-react";

import { WeightChart } from "@/components/dashboard/weight-chart-client";
import { StatusBadge } from "@/components/cargas/status-badge";
import { PageHeader } from "@/components/layout/page-header";
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
import { getResumenTodosAfiliados } from "@/lib/actions/afiliados";
import { ExportPDFButton } from "@/components/dashboard/export-pdf-button";

function formatFecha(value: string) {
  try {
    return format(new Date(value), "dd/MM/yyyy", { locale: es });
  } catch {
    return value;
  }
}

export default async function ReportesPage() {
  const [cargas, chartData, afiliados] = await Promise.all([
    getCargas(),
    getWeightComparisonData(),
    getResumenTodosAfiliados(),
  ]);

  const validadas = cargas.filter((c) => c.estado === "Validado").length;
  const rechazadas = cargas.filter((c) => c.estado === "Rechazado").length;
  const pendientes = cargas.filter((c) => c.estado === "Pendiente").length;
  const pesoTotal = cargas.reduce((sum, c) => sum + c.peso_reportado, 0);

  return (
    <div className="fundares-page">
      <div className="print:hidden">
        <PageHeader
          title="Reportes"
          description="Resumen global de validaciones, comparativa por empresa y estado de recolecciones."
        >
          <ExportPDFButton />
        </PageHeader>
      </div>

      {/* Cabecera exclusiva para la impresión en PDF */}
      <div className="hidden print:flex flex-col gap-4 border-b pb-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#2c6667]">FUNDARES BOLIVIA</h1>
            <p className="text-xs text-muted-foreground mt-1">Fundación para el Reciclaje y Desarrollo Sostenible</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#e8f3ea] text-[#2f5d35]">
              Documento Oficial
            </span>
            <p className="text-[10px] text-muted-foreground mt-2">
              ID Reporte: REP-{new Date().getFullYear()}-{Math.floor(Math.random() * 90000) + 10000}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Reporte Consolidado de Sostenibilidad y Trazabilidad de Cargas
          </h2>
          <div className="grid grid-cols-3 gap-4 mt-3 text-xs text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground">Fecha de emisión:</span>{" "}
              {format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
            </div>
            <div>
              <span className="font-semibold text-foreground">Emisor:</span> Validador de Sostenibilidad FUNDARES
            </div>
            <div>
              <span className="font-semibold text-foreground">Fuente de datos:</span> Supabase Live DB
            </div>
          </div>
        </div>
      </div>

      {/* KPIs globales */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total cargas", value: cargas.length, accent: "text-foreground", Icon: Package },
          { label: "Validadas", value: validadas, accent: "text-emerald-600", Icon: CheckCircle2 },
          { label: "Rechazadas", value: rechazadas, accent: "text-destructive", Icon: XCircle },
          { label: "Pendientes", value: pendientes, accent: "text-amber-600", Icon: Clock },
          { label: "Kg totales", value: `${pesoTotal.toFixed(1)}`, accent: "text-primary", Icon: Leaf },
        ].map((stat) => (
          <Card key={stat.label} className="fundares-kpi">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <stat.Icon className={`size-4 ${stat.accent}`} />
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
              </div>
              <p className={`mt-2 font-heading text-3xl ${stat.accent}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico comparativo */}
      <div className="mb-10">
        <WeightChart data={chartData} />
      </div>

      {/* Tabla resumen por empresa (desde Supabase) */}
      {afiliados.length > 0 && (
        <Card className="fundares-card overflow-hidden mb-10">
          <CardHeader className="border-b border-border/60">
            <div className="flex items-center gap-2">
              <Building2 className="size-5 text-primary" />
              <CardTitle className="text-lg">Resumen por empresa</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              KPIs de cada empresa afiliada según datos reales de Supabase
            </p>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-6">Empresa</TableHead>
                  <TableHead className="text-right">Recintos</TableHead>
                  <TableHead className="text-right">Recolectores</TableHead>
                  <TableHead className="text-right">Informes</TableHead>
                  <TableHead className="text-right">Aprobados</TableHead>
                  <TableHead className="text-right">Kg aprobados</TableHead>
                  <TableHead className="pr-6">Última recolección</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {afiliados.map((af) => (
                  <TableRow key={af.afiliado_id}>
                    <TableCell className="pl-6 font-medium">{af.empresa}</TableCell>
                    <TableCell className="text-right">{af.total_recintos}</TableCell>
                    <TableCell className="text-right">{af.total_recolectores}</TableCell>
                    <TableCell className="text-right">{af.total_informes}</TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium text-emerald-600">{af.informes_aprobados}</span>
                      {" "}
                      <span className="text-xs text-muted-foreground">
                        / {af.total_informes}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-heading text-primary">
                      {Number(af.kg_total_aprobado).toFixed(1)} kg
                    </TableCell>
                    <TableCell className="pr-6 text-sm text-muted-foreground">
                      {af.ultima_recoleccion ? formatFecha(af.ultima_recoleccion) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Tabla detalle todas las cargas */}
      <Card className="fundares-card overflow-hidden">
        <CardHeader className="border-b border-border/60">
          <CardTitle className="text-lg">Detalle de cargas</CardTitle>
          <p className="text-sm text-muted-foreground">
            {cargas.length} recoleccion{cargas.length !== 1 ? "es" : ""} en total
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="pl-6">Empresa</TableHead>
                <TableHead>Recolector</TableHead>
                <TableHead className="text-right">Reportado</TableHead>
                <TableHead className="text-right">Acopio</TableHead>
                <TableHead className="pr-6">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cargas.map((carga) => (
                <TableRow key={carga.id}>
                  <TableCell className="pl-6">{carga.empresa}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {carga.recolector_id}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {carga.peso_reportado} kg
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {carga.peso_acopio != null ? `${carga.peso_acopio} kg` : "—"}
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

      {/* Bloque de firmas exclusivo para la impresión en PDF */}
      <div className="hidden print:flex justify-between items-center mt-16 pt-12 border-t border-dashed border-gray-300">
        <div className="flex flex-col items-center w-1/3">
          <div className="w-full border-t border-gray-400 mt-8 pt-2 text-center text-xs">
            <p className="font-semibold text-foreground">Validador de Operaciones</p>
            <p className="text-muted-foreground">Fundación FUNDARES</p>
          </div>
        </div>
        <div className="flex flex-col items-center w-1/3">
          <div className="w-full border-t border-gray-400 mt-8 pt-2 text-center text-xs">
            <p className="font-semibold text-foreground">Coordinador de Sostenibilidad</p>
            <p className="text-muted-foreground">Director de Impacto ESG</p>
          </div>
        </div>
      </div>
    </div>
  );
}

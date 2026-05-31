import { redirect } from "next/navigation";
import Link from "next/link";
import { Leaf, Recycle, TreePine, Zap, Droplets, CheckCircle2, Clock, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ImpactoHero, ImpactoKpis } from "@/components/cliente/impacto-kpis";
import { MaterialBreakdown } from "@/components/cliente/material-breakdown";
import {
  getResumenAfiliado,
  getTendenciaMensual,
  getResiduosPorTipo,
} from "@/lib/actions/afiliados";
import { getCargasValidadasForAfiliado } from "@/lib/actions/cargas";
import { calcularImpacto, kgPorMaterial } from "@/lib/cliente/impacto";
import { getSession } from "@/lib/auth/session";

export default async function ClienteImpactoPage() {
  const session = await getSession();

  if (!session || session.role !== "cliente" || !session.afiliadoId) {
    redirect("/login");
  }

  const [cargas, resumen] = await Promise.all([
    getCargasValidadasForAfiliado(session.afiliadoId),
    getResumenAfiliado(session.afiliadoId),
  ]);

  const impacto = calcularImpacto(cargas);
  const materiales = kgPorMaterial(cargas);

  return (
    <div className="fundares-page">
      <PageHeader
        title="Tu impacto ambiental"
        description={`Resultado del reciclaje de ${session.afiliadoNombre}, traducido a indicadores de sostenibilidad.`}
      >
        <Link
          href="/sostenibilidad"
          className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-50 border border-emerald-200/50 px-4.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition-all shadow-sm"
        >
          <Sparkles className="size-3.5 text-emerald-600" />
          <span>Ver Dashboard de Sostenibilidad</span>
        </Link>
      </PageHeader>

      {/* KPIs rápidos de estado */}
      {resumen && (
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="fundares-kpi">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2">
                <Recycle className="size-4 text-primary" />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Total registros
                </p>
              </div>
              <p className="mt-2 font-heading text-3xl">{resumen.total_informes}</p>
            </CardContent>
          </Card>
          <Card className="fundares-kpi">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Validados
                </p>
              </div>
              <p className="mt-2 font-heading text-3xl text-emerald-600">
                {resumen.informes_aprobados}
              </p>
            </CardContent>
          </Card>
          <Card className="fundares-kpi">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-amber-500" />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Pendientes
                </p>
              </div>
              <p className="mt-2 font-heading text-3xl text-amber-600">
                {resumen.informes_pendientes}
              </p>
            </CardContent>
          </Card>
          <Card className="fundares-kpi">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2">
                <Leaf className="size-4 text-primary" />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Recintos
                </p>
              </div>
              <p className="mt-2 font-heading text-3xl">{resumen.total_recintos}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mb-8">
        <ImpactoHero kgTotal={impacto.kgTotal} empresa={session.afiliadoNombre ?? "Tu empresa"} />
      </div>

      <div className="mb-10">
        <ImpactoKpis
          kgTotal={impacto.kgTotal}
          co2Evitado={impacto.co2Evitado}
          arbolesEquivalentes={impacto.arbolesEquivalentes}
          aguaLitros={impacto.aguaLitros}
          energiaKwh={impacto.energiaKwh}
        />
      </div>

      <MaterialBreakdown items={materiales} />

      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        Estimaciones basadas en kilos reciclados y factores ambientales estándar por
        material. Los árboles equivalentes se calculan como CO₂ evitado ÷ 21 kg/año.
      </p>
    </div>
  );
}

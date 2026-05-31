"use server";

import { createServerClient } from "@/lib/supabase/server";

export interface ResumenAfiliado {
  afiliado_id: string;
  empresa: string;
  email: string;
  telefono: string;
  total_recintos: number;
  total_recolectores: number;
  total_informes: number;
  informes_aprobados: number;
  informes_pendientes: number;
  informes_rechazados: number;
  kg_total_aprobado: number;
  kg_total_registrado: number;
  ultima_recoleccion: string | null;
}

export interface TendenciaMensual {
  afiliado_id: string;
  empresa: string;
  mes: string;
  total_informes: number;
  kg_total: number;
  kg_aprobado: number;
}

export interface ResiduoPorTipo {
  afiliado_id: string;
  empresa: string;
  tipo_residuo: string;
  kg_total: number;
  cantidad_informes: number;
}

/** Resumen KPI de un afiliado específico */
export async function getResumenAfiliado(
  afiliadoId: string
): Promise<ResumenAfiliado | null> {
  const supabase = createServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("resumen_afiliado")
    .select("*")
    .eq("afiliado_id", afiliadoId)
    .single();

  if (error) {
    console.error("Error fetching resumen_afiliado:", error.message);
    return null;
  }

  return data as ResumenAfiliado;
}

/** Todos los afiliados con KPIs — para el dashboard del admin */
export async function getResumenTodosAfiliados(): Promise<ResumenAfiliado[]> {
  const supabase = createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("resumen_afiliado")
    .select("*")
    .order("kg_total_aprobado", { ascending: false });

  if (error) {
    console.error("Error fetching resumen afiliados:", error.message);
    return [];
  }

  return (data ?? []) as ResumenAfiliado[];
}

/** Tendencia mensual de los últimos 12 meses para un afiliado */
export async function getTendenciaMensual(
  afiliadoId: string
): Promise<TendenciaMensual[]> {
  const supabase = createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("tendencia_mensual_afiliado")
    .select("*")
    .eq("afiliado_id", afiliadoId)
    .order("mes", { ascending: true });

  if (error) {
    console.error("Error fetching tendencia mensual:", error.message);
    return [];
  }

  return (data ?? []) as TendenciaMensual[];
}

/** Residuos por tipo para un afiliado */
export async function getResiduosPorTipo(
  afiliadoId: string
): Promise<ResiduoPorTipo[]> {
  const supabase = createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("residuos_por_tipo_afiliado")
    .select("*")
    .eq("afiliado_id", afiliadoId)
    .order("kg_total", { ascending: false });

  if (error) {
    console.error("Error fetching residuos por tipo:", error.message);
    return [];
  }

  return (data ?? []) as ResiduoPorTipo[];
}

export interface RecintoImpacto {
  recinto_nombre: string;
  kg_total: number;
  total_informes: number;
}

export interface SostenibilidadData {
  afiliados: ResumenAfiliado[];
  residuosPorTipo: Record<string, ResiduoPorTipo[]>;
  tendenciaMensual: Record<string, TendenciaMensual[]>;
  recintoImpacto: Record<string, RecintoImpacto[]>;
}

/** Obtiene todos los datos reales agregados para el dashboard público de sostenibilidad */
export async function getPublicSostenibilidadData(): Promise<SostenibilidadData> {
  const afiliados = await getResumenTodosAfiliados();
  const residuosPorTipo: Record<string, ResiduoPorTipo[]> = {};
  const tendenciaMensual: Record<string, TendenciaMensual[]> = {};
  const recintoImpacto: Record<string, RecintoImpacto[]> = {};

  const supabase = createServerClient();

  // Si no hay Supabase (modo demo/mock)
  if (!supabase) {
    // Generar datos ficticios pero coherentes con los mofificados
    const demoAfiliados: ResumenAfiliado[] = [
      {
        afiliado_id: "demo-astara",
        empresa: "Astara | Ovando SA",
        email: "sostenibilidad@astara.com.bo",
        telefono: "+591 3 3123456",
        total_recintos: 3,
        total_recolectores: 8,
        total_informes: 45,
        informes_aprobados: 42,
        informes_pendientes: 2,
        informes_rechazados: 1,
        kg_total_aprobado: 45800,
        kg_total_registrado: 48000,
        ultima_recoleccion: new Date().toISOString()
      }
    ];

    residuosPorTipo["demo-astara"] = [
      { afiliado_id: "demo-astara", empresa: "Astara | Ovando SA", tipo_residuo: "Papel y Cartón", kg_total: 18200, cantidad_informes: 15 },
      { afiliado_id: "demo-astara", empresa: "Astara | Ovando SA", tipo_residuo: "Plásticos", kg_total: 12500, cantidad_informes: 12 },
      { afiliado_id: "demo-astara", empresa: "Astara | Ovando SA", tipo_residuo: "Chatarra / Metales", kg_total: 10100, cantidad_informes: 10 },
      { afiliado_id: "demo-astara", empresa: "Astara | Ovando SA", tipo_residuo: "Baterías Usadas y Otros", kg_total: 5000, cantidad_informes: 5 }
    ];

    tendenciaMensual["demo-astara"] = [
      { afiliado_id: "demo-astara", empresa: "Astara | Ovando SA", mes: "2026-01-01", total_informes: 5, kg_total: 5000, kg_aprobado: 4800 },
      { afiliado_id: "demo-astara", empresa: "Astara | Ovando SA", mes: "2026-02-01", total_informes: 7, kg_total: 6200, kg_aprobado: 6000 },
      { afiliado_id: "demo-astara", empresa: "Astara | Ovando SA", mes: "2026-03-01", total_informes: 10, kg_total: 8900, kg_aprobado: 8500 },
      { afiliado_id: "demo-astara", empresa: "Astara | Ovando SA", mes: "2026-04-01", total_informes: 11, kg_total: 11000, kg_aprobado: 10800 },
      { afiliado_id: "demo-astara", empresa: "Astara | Ovando SA", mes: "2026-05-01", total_informes: 12, kg_total: 14700, kg_aprobado: 15700 }
    ];

    recintoImpacto["demo-astara"] = [
      { recinto_nombre: "Santa Cruz (Equipetrol)", kg_total: 22400, total_informes: 20 },
      { recinto_nombre: "La Paz (Calacoto)", kg_total: 14200, total_informes: 14 },
      { recinto_nombre: "Cochabamba (Av. América)", kg_total: 9200, total_informes: 8 }
    ];

    return {
      afiliados: demoAfiliados,
      residuosPorTipo,
      tendenciaMensual,
      recintoImpacto
    };
  }

  // Si hay conexión real a Supabase
  await Promise.all(
    afiliados.map(async (a) => {
      const [residuos, tendencia] = await Promise.all([
        getResiduosPorTipo(a.afiliado_id),
        getTendenciaMensual(a.afiliado_id),
      ]);

      residuosPorTipo[a.afiliado_id] = residuos;
      tendenciaMensual[a.afiliado_id] = tendencia;

      const { data: recintosData } = await supabase
        .from("recintos")
        .select("id, nombre")
        .eq("afiliado_id", a.afiliado_id);

      if (recintosData) {
        const recs: RecintoImpacto[] = [];
        for (const r of recintosData) {
          const { data: informesData } = await supabase
            .from("informes")
            .select("id, total_kg, informe_residuos(kg)")
            .eq("recinto_id", r.id)
            .eq("estado", "aprobado");

          const totalInformes = informesData?.length ?? 0;
          const kgTotal = informesData?.reduce((sum, inf) => {
            const infResSum = inf.informe_residuos?.reduce((s: number, ir: any) => s + (ir.kg ?? 0), 0) ?? 0;
            return sum + (infResSum > 0 ? infResSum : inf.total_kg);
          }, 0) ?? 0;

          recs.push({
            recinto_nombre: r.nombre,
            kg_total: Number(kgTotal),
            total_informes: totalInformes
          });
        }
        recintoImpacto[a.afiliado_id] = recs;
      }
    })
  );

  return {
    afiliados,
    residuosPorTipo,
    tendenciaMensual,
    recintoImpacto
  };
}

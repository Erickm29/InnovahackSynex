"use server";

import { revalidatePath } from "next/cache";

import { mockCargas } from "@/lib/mock-data";
import {
  INFORME_QUERY,
  mapEstadoToDb,
  mapInformeToCarga,
  type InformeRow,
} from "@/lib/supabase/mappers";
import { createServerClient } from "@/lib/supabase/server";
import type { EstadoCarga, TrayectoriaResiduo } from "@/lib/supabase/types";

let mockStore = [...mockCargas];

function getMockStore() {
  return mockStore;
}

function updateMockStore(id: string, updates: Partial<TrayectoriaResiduo>) {
  mockStore = mockStore.map((carga) =>
    carga.id === id ? { ...carga, ...updates } : carga
  );
}

export async function getCargas(
  filter?: "all" | "pendientes"
): Promise<TrayectoriaResiduo[]> {
  const supabase = createServerClient();

  if (!supabase) {
    const data = getMockStore();
    if (filter === "pendientes") {
      return data.filter((c) => c.estado === "Pendiente");
    }
    return data;
  }

  let query = supabase
    .from("informes")
    .select(INFORME_QUERY)
    .order("fecha_hora", { ascending: false });

  if (filter === "pendientes") {
    query = query.eq("estado", "pendiente");
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching informes:", error.message);
    throw new Error("No se pudieron cargar los registros");
  }

  return ((data ?? []) as InformeRow[]).map(mapInformeToCarga);
}

export async function getCargaById(
  id: string
): Promise<TrayectoriaResiduo | null> {
  const supabase = createServerClient();

  if (!supabase) {
    return getMockStore().find((c) => c.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("informes")
    .select(INFORME_QUERY)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching informe:", error.message);
    return null;
  }

  return mapInformeToCarga(data as InformeRow);
}

export async function getPendingCount(): Promise<number> {
  const supabase = createServerClient();

  if (!supabase) {
    return getMockStore().filter((c) => c.estado === "Pendiente").length;
  }

  const { count, error } = await supabase
    .from("informes")
    .select("*", { count: "exact", head: true })
    .eq("estado", "pendiente");

  if (error) {
    console.error("Error counting pendientes:", error.message);
    return 0;
  }

  return count ?? 0;
}

export async function updateCargaEstado(
  id: string,
  estado: EstadoCarga,
  notas?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerClient();
  const timestamp = new Date().toISOString();
  const historialEntry = {
    fecha: timestamp,
    accion: estado,
    usuario: "Validador FUNDARES",
    ...(notas ? { notas } : {}),
  };

  if (!supabase) {
    const carga = getMockStore().find((c) => c.id === id);
    if (!carga) {
      return { success: false, error: "Registro no encontrado" };
    }

    updateMockStore(id, {
      estado,
      historial: [...(carga.historial ?? []), historialEntry],
      ...(notas ? { observaciones: notas } : {}),
    });

    revalidatePath("/");
    revalidatePath("/pendientes");
    revalidatePath("/reportes");
    revalidatePath("/recolectores");

    return { success: true };
  }

  const { error } = await supabase
    .from("informes")
    .update({ estado: mapEstadoToDb(estado) })
    .eq("id", id);

  if (error) {
    console.error("Error updating informe:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/pendientes");
  revalidatePath("/reportes");
  revalidatePath("/recolectores");

  return { success: true };
}

export async function getRecolectoresResumen() {
  const cargas = await getCargas();
  const map = new Map<
    string,
    { total: number; pendientes: number; validadas: number; rechazadas: number }
  >();

  for (const carga of cargas) {
    const current = map.get(carga.recolector_id) ?? {
      total: 0,
      pendientes: 0,
      validadas: 0,
      rechazadas: 0,
    };

    current.total += 1;
    if (carga.estado === "Pendiente") current.pendientes += 1;
    if (carga.estado === "Validado") current.validadas += 1;
    if (carga.estado === "Rechazado") current.rechazadas += 1;

    map.set(carga.recolector_id, current);
  }

  return Array.from(map.entries()).map(([recolector_id, stats]) => ({
    recolector_id,
    total_cargas: stats.total,
    pendientes: stats.pendientes,
    validadas: stats.validadas,
    rechazadas: stats.rechazadas,
  }));
}

export async function getWeightComparisonData() {
  const cargas = await getCargas();
  const recent = cargas.slice(0, 6).reverse();

  return recent.map((carga) => ({
    label: carga.empresa.split(" ")[0],
    reportado: carga.peso_reportado,
    acopio: carga.peso_acopio ?? 0,
  }));
}

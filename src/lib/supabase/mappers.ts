import type { EstadoCarga, HistorialEntry, TrayectoriaResiduo } from "./types";

const INFORME_SELECT = `
  *,
  recolectores ( codigo_empleado, nombre ),
  recintos ( nombre, afiliados ( nombre ) ),
  informe_residuos ( kg, tipos_residuo ( nombre ) )
`;

export const INFORME_QUERY = INFORME_SELECT;

export interface InformeRow {
  id: string;
  recolector_id: string;
  recinto_id: string;
  fecha_hora: string;
  gps_lat: number | null;
  gps_lng: number | null;
  gps_precision_m: number | null;
  distancia_m: number | null;
  dentro_geocerca: boolean | null;
  total_kg: number;
  foto_url: string | null;
  estado: string;
  creado_at: string;
  recolectores: {
    codigo_empleado: string;
    nombre: string;
  } | null;
  recintos: {
    nombre: string;
    afiliados: {
      nombre: string;
    } | null;
  } | null;
  informe_residuos: Array<{
    kg: number;
    tipos_residuo: {
      nombre: string;
    } | null;
  }> | null;
}

export function mapEstadoFromDb(estado: string): EstadoCarga {
  switch (estado) {
    case "aprobado":
      return "Validado";
    case "revision":
      return "Rechazado";
    default:
      return "Pendiente";
  }
}

export function mapEstadoToDb(estado: EstadoCarga): string {
  switch (estado) {
    case "Validado":
      return "aprobado";
    case "Rechazado":
      return "revision";
    default:
      return "pendiente";
  }
}

export function mapInformeToCarga(row: InformeRow): TrayectoriaResiduo {
  const pesoAcopio =
    row.informe_residuos?.reduce((sum, item) => sum + item.kg, 0) ?? null;

  const material =
    row.informe_residuos
      ?.map((item) => item.tipos_residuo?.nombre)
      .filter(Boolean)
      .join(", ") || null;

  const historial: HistorialEntry[] = [
    {
      fecha: row.creado_at,
      accion: "Informe registrado",
      usuario: row.recolectores?.nombre ?? row.recolector_id,
    },
  ];

  if (row.estado !== "pendiente") {
    historial.push({
      fecha: row.creado_at,
      accion: mapEstadoFromDb(row.estado),
      usuario: "Validador FUNDARES",
    });
  }

  const observaciones = !row.dentro_geocerca
    ? `Recolección fuera de geocerca (${row.distancia_m ?? "?"} m de distancia).`
    : row.recintos?.nombre
      ? `Recinto: ${row.recintos.nombre}`
      : null;

  return {
    id: row.id,
    created_at: row.creado_at,
    fecha: row.fecha_hora,
    empresa: row.recintos?.afiliados?.nombre ?? "Sin empresa",
    recolector_id:
      row.recolectores?.codigo_empleado ?? row.recolector_id.slice(0, 8),
    peso_reportado: row.total_kg,
    peso_acopio: pesoAcopio,
    estado: mapEstadoFromDb(row.estado),
    material,
    observaciones,
    fotos: row.foto_url ? [row.foto_url] : [],
    firma_url: null,
    historial,
  };
}

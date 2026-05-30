export type EstadoCarga = "Pendiente" | "Validado" | "Rechazado";

export interface HistorialEntry {
  fecha: string;
  accion: string;
  usuario?: string;
  notas?: string;
}

export interface TrayectoriaResiduo {
  id: string;
  created_at: string;
  fecha: string;
  empresa: string;
  recolector_id: string;
  peso_reportado: number;
  peso_acopio: number | null;
  estado: EstadoCarga;
  material?: string | null;
  observaciones?: string | null;
  fotos?: string[] | null;
  firma_url?: string | null;
  historial?: HistorialEntry[] | null;
}

export interface RecolectorResumen {
  recolector_id: string;
  nombre?: string | null;
  total_cargas: number;
  pendientes: number;
  validadas: number;
  rechazadas: number;
}

import type { TrayectoriaResiduo } from "./supabase/types";

export const mockCargas: TrayectoriaResiduo[] = [
  {
    id: "1",
    created_at: "2026-05-28T10:30:00Z",
    fecha: "2026-05-28",
    empresa: "Industrias del Valle S.A.",
    recolector_id: "REC-1042",
    peso_reportado: 245.5,
    peso_acopio: 238.2,
    estado: "Pendiente",
    material: "Cartón corrugado",
    observaciones: "Carga en buen estado, sin contaminación visible.",
    fotos: [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b782?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1611284446314-60a2a356318b?w=400&h=300&fit=crop",
    ],
    firma_url:
      "https://images.unsplash.com/photo-1589330694653-ded6df03f753?w=300&h=120&fit=crop",
    historial: [
      {
        fecha: "2026-05-28T08:15:00Z",
        accion: "Recolección registrada",
        usuario: "REC-1042",
      },
      {
        fecha: "2026-05-28T10:30:00Z",
        accion: "Enviado a validación",
        usuario: "Sistema",
      },
    ],
  },
  {
    id: "2",
    created_at: "2026-05-28T14:20:00Z",
    fecha: "2026-05-28",
    empresa: "Comercial Santa Cruz Ltda.",
    recolector_id: "REC-0876",
    peso_reportado: 180.0,
    peso_acopio: 175.4,
    estado: "Pendiente",
    material: "Plástico PET",
    observaciones: null,
    fotos: [
      "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400&h=300&fit=crop",
    ],
    firma_url:
      "https://images.unsplash.com/photo-1589330694653-ded6df03f753?w=300&h=120&fit=crop",
    historial: [
      {
        fecha: "2026-05-28T12:00:00Z",
        accion: "Recolección registrada",
        usuario: "REC-0876",
      },
    ],
  },
  {
    id: "3",
    created_at: "2026-05-27T09:45:00Z",
    fecha: "2026-05-27",
    empresa: "Grupo Empresarial Norte",
    recolector_id: "REC-1042",
    peso_reportado: 320.8,
    peso_acopio: 315.0,
    estado: "Validado",
    material: "Papel blanco",
    observaciones: "Validado sin novedades.",
    fotos: [],
    firma_url: null,
    historial: [
      {
        fecha: "2026-05-27T11:00:00Z",
        accion: "Validado",
        usuario: "Admin Validación",
      },
    ],
  },
  {
    id: "4",
    created_at: "2026-05-27T16:10:00Z",
    fecha: "2026-05-27",
    empresa: "Distribuidora Central",
    recolector_id: "REC-0231",
    peso_reportado: 95.2,
    peso_acopio: 72.0,
    estado: "Rechazado",
    material: "Chatarra mixta",
    observaciones: "Diferencia de peso superior al umbral permitido.",
    fotos: [
      "https://images.unsplash.com/photo-1611284446314-60a2a356318b?w=400&h=300&fit=crop",
    ],
    firma_url: null,
    historial: [
      {
        fecha: "2026-05-27T17:30:00Z",
        accion: "Rechazado",
        usuario: "Admin Validación",
        notas: "Diferencia de peso del 24%",
      },
    ],
  },
  {
    id: "5",
    created_at: "2026-05-29T07:55:00Z",
    fecha: "2026-05-29",
    empresa: "Alimentos del Sur S.R.L.",
    recolector_id: "REC-0876",
    peso_reportado: 410.0,
    peso_acopio: 405.6,
    estado: "Pendiente",
    material: "Orgánico industrial",
    observaciones: "Requiere revisión de temperatura de almacenamiento.",
    fotos: [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b782?w=400&h=300&fit=crop",
    ],
    firma_url:
      "https://images.unsplash.com/photo-1589330694653-ded6df03f753?w=300&h=120&fit=crop",
    historial: [
      {
        fecha: "2026-05-29T07:55:00Z",
        accion: "Recolección registrada",
        usuario: "REC-0876",
      },
    ],
  },
];

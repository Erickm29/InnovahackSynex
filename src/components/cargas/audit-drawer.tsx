"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, FileText, History, ImageIcon, PenLine } from "lucide-react";

import { StatusBadge } from "@/components/cargas/status-badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { TrayectoriaResiduo } from "@/lib/supabase/types";

interface AuditDrawerProps {
  carga: TrayectoriaResiduo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDate(value: string) {
  try {
    return format(new Date(value), "dd MMM yyyy, HH:mm", { locale: es });
  } catch {
    return value;
  }
}

export function AuditDrawer({ carga, open, onOpenChange }: AuditDrawerProps) {
  if (!carga) return null;

  const diferencia =
    carga.peso_acopio != null
      ? carga.peso_reportado - carga.peso_acopio
      : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-hidden sm:max-w-xl"
      >
        <SheetHeader className="border-b border-border/60 pb-4">
          <SheetTitle className="text-lg font-semibold text-fundares">
            Ficha Técnica
          </SheetTitle>
          <SheetDescription>
            {carga.empresa} · {carga.recolector_id}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-5rem)] pr-4">
          <div className="space-y-6 py-4">
            <section className="fundares-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Resumen de la carga
                </h3>
                <StatusBadge estado={carga.estado} />
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Fecha</dt>
                  <dd className="font-medium">{formatDate(carga.fecha)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Material</dt>
                  <dd className="font-medium">{carga.material ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Peso reportado</dt>
                  <dd className="font-medium">{carga.peso_reportado} kg</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Peso en acopio</dt>
                  <dd className="font-medium">
                    {carga.peso_acopio != null ? `${carga.peso_acopio} kg` : "—"}
                  </dd>
                </div>
                {diferencia != null && (
                  <div className="col-span-2">
                    <dt className="text-muted-foreground">Diferencia</dt>
                    <dd
                      className={
                        Math.abs(diferencia) > 10
                          ? "font-medium text-fundares-reject"
                          : "font-medium text-fundares-accent"
                      }
                    >
                      {diferencia > 0 ? "+" : ""}
                      {diferencia.toFixed(1)} kg
                    </dd>
                  </div>
                )}
              </dl>
              {carga.observaciones && (
                <>
                  <Separator className="my-3" />
                  <div className="flex gap-2 text-sm">
                    <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <p className="text-muted-foreground">{carga.observaciones}</p>
                  </div>
                </>
              )}
            </section>

            <section>
              <div className="mb-3 flex items-center gap-2">
                <History className="size-4 text-fundares" />
                <h3 className="text-sm font-semibold">Historial</h3>
              </div>
              <div className="space-y-3">
                {(carga.historial ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Sin eventos registrados.
                  </p>
                ) : (
                  (carga.historial ?? []).map((entry, index) => (
                    <div
                      key={`${entry.fecha}-${index}`}
                      className="fundares-card flex gap-3 p-3"
                    >
                      <div className="mt-1 size-2 shrink-0 rounded-full bg-fundares" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{entry.accion}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(entry.fecha)}
                          {entry.usuario ? ` · ${entry.usuario}` : ""}
                        </p>
                        {entry.notas && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {entry.notas}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center gap-2">
                <ImageIcon className="size-4 text-fundares" />
                <h3 className="text-sm font-semibold">Fotos de la carga</h3>
              </div>
              {(carga.fotos ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay fotos adjuntas.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {(carga.fotos ?? []).map((foto, index) => (
                    <div
                      key={`${foto}-${index}`}
                      className="overflow-hidden rounded-xl border border-border/60 bg-muted"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={foto}
                        alt={`Foto carga ${index + 1}`}
                        className="aspect-[4/3] w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="mb-3 flex items-center gap-2">
                <PenLine className="size-4 text-fundares" />
                <h3 className="text-sm font-semibold">Firma del recolector</h3>
              </div>
              {carga.firma_url ? (
                <div className="fundares-card overflow-hidden p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={carga.firma_url}
                    alt="Firma del recolector"
                    className="mx-auto h-20 object-contain opacity-80"
                  />
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Firma digital · {carga.recolector_id}
                  </p>
                </div>
              ) : (
                <div className="fundares-card flex items-center gap-2 p-4 text-sm text-muted-foreground">
                  <Calendar className="size-4" />
                  Firma no disponible
                </div>
              )}
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

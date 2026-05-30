"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AlertTriangle, Check, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { AuditDrawer } from "@/components/cargas/audit-drawer";
import { RejectDialog } from "@/components/cargas/reject-dialog";
import { StatusBadge } from "@/components/cargas/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateCargaEstado } from "@/lib/actions/cargas";
import type { TrayectoriaResiduo } from "@/lib/supabase/types";

interface CargasTableProps {
  cargas: TrayectoriaResiduo[];
  title?: string;
  showOnlyPending?: boolean;
}

function formatDate(value: string) {
  try {
    return format(new Date(value), "dd/MM/yyyy", { locale: es });
  } catch {
    return value;
  }
}

export function CargasTable({
  cargas,
  title = "Gestión de Cargas",
  showOnlyPending = false,
}: CargasTableProps) {
  const router = useRouter();
  const [selectedCarga, setSelectedCarga] = useState<TrayectoriaResiduo | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filtered = showOnlyPending
    ? cargas.filter((c) => c.estado === "Pendiente")
    : cargas;

  function openAudit(carga: TrayectoriaResiduo) {
    setSelectedCarga(carga);
    setDrawerOpen(true);
  }

  function handleValidate(id: string) {
    setPendingId(id);
    startTransition(async () => {
      const result = await updateCargaEstado(id, "Validado");
      setPendingId(null);

      if (result.success) {
        toast.success("Carga validada correctamente");
        router.refresh();
      } else {
        toast.error(result.error ?? "Error al validar la carga");
      }
    });
  }

  function openReject(id: string) {
    setRejectId(id);
    setRejectOpen(true);
  }

  return (
    <>
      <Card className="fundares-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {filtered.length} registro{filtered.length !== 1 ? "s" : ""}{" "}
            {showOnlyPending ? "pendientes" : "en total"}
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Fecha</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Recolector ID</TableHead>
                  <TableHead className="text-right">Peso (kg)</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="pr-6 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-12 text-center text-muted-foreground"
                    >
                      No hay cargas para mostrar.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((carga) => (
                    <TableRow
                      key={carga.id}
                      className="cursor-pointer transition-colors hover:bg-muted/40"
                      onClick={() => openAudit(carga)}
                    >
                      <TableCell className="pl-6 font-medium">
                        {formatDate(carga.fecha)}
                      </TableCell>
                      <TableCell>{carga.empresa}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {carga.recolector_id}
                      </TableCell>
                      <TableCell className="text-right">
                        {carga.peso_reportado}
                      </TableCell>
                      <TableCell>
                        <StatusBadge estado={carga.estado} />
                      </TableCell>
                      <TableCell className="pr-6">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Ver ficha técnica"
                            onClick={() => openAudit(carga)}
                          >
                            <Eye className="size-4 text-muted-foreground" />
                          </Button>
                          {carga.estado === "Pendiente" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                title="Validar"
                                disabled={pendingId === carga.id}
                                onClick={() => handleValidate(carga.id)}
                                className="hover:bg-emerald-50"
                              >
                                <Check className="size-4 text-fundares-accent" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                title="Rechazar"
                                onClick={() => openReject(carga.id)}
                                className="hover:bg-orange-50"
                              >
                                <AlertTriangle className="size-4 text-fundares-reject" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AuditDrawer
        carga={selectedCarga}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

      <RejectDialog
        cargaId={rejectId}
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}

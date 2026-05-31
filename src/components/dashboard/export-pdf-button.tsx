"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ExportPDFButton() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = () => {
    setIsGenerating(true);
    toast.info("Preparando reporte para exportación PDF...", {
      description: "Asegurando que los gráficos y datos carguen correctamente.",
      duration: 3000,
    });

    // Pequeño delay de 800ms para permitir que finalicen las transiciones/animaciones de Recharts
    setTimeout(() => {
      setIsGenerating(false);
      window.print();
      toast.success("Reporte exportado correctamente", {
        description: "El navegador ha abierto el asistente de impresión / PDF.",
      });
    }, 1000);
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isGenerating}
      className="fundares-btn shadow-fundares hover:shadow-fundares-lg flex items-center gap-2 rounded-2xl bg-primary text-primary-foreground transition-all duration-300 print:hidden cursor-pointer"
    >
      {isGenerating ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <FileDown className="size-4" />
      )}
      <span>{isGenerating ? "Generando..." : "Exportar Reporte PDF"}</span>
    </Button>
  );
}

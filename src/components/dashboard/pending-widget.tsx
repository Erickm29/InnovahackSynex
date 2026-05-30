import { Clock3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PendingWidgetProps {
  count: number;
}

export function PendingWidget({ count }: PendingWidgetProps) {
  return (
    <Card className="fundares-card border-fundares/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Cargas Pendientes
        </CardTitle>
        <div className="flex size-9 items-center justify-center rounded-lg bg-fundares/10">
          <Clock3 className="size-4 text-fundares" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-semibold tracking-tight text-fundares">
          {count}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Registros esperando validación
        </p>
      </CardContent>
    </Card>
  );
}

"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeightChartProps {
  data: Array<{
    label: string;
    reportado: number;
    acopio: number;
  }>;
}

export function WeightChart({ data }: WeightChartProps) {
  return (
    <Card className="fundares-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Peso Reportado vs Peso en Acopio
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Comparación de cargas recientes (kg)
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5ebe9" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "#5c6f6b", fontSize: 12 }}
                axisLine={{ stroke: "#e5ebe9" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#5c6f6b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5ebe9",
                  boxShadow: "0 1px 3px rgba(0,103,91,0.06)",
                }}
                formatter={(value) => [`${value} kg`, ""]}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                formatter={(value) =>
                  value === "reportado" ? "Peso Reportado" : "Peso en Acopio"
                }
              />
              <Bar
                dataKey="reportado"
                fill="#00675B"
                radius={[6, 6, 0, 0]}
                name="reportado"
              />
              <Bar
                dataKey="acopio"
                fill="#4CAF50"
                radius={[6, 6, 0, 0]}
                name="acopio"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

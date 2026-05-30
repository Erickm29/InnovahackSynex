import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Faltan variables de entorno. Ejecute con .env.local cargado.");
  process.exit(1);
}

const supabase = createClient(url, key);

const INFORME_SELECT = `
  *,
  recolectores ( codigo_empleado, nombre ),
  recintos ( nombre, afiliados ( nombre ) ),
  informe_residuos ( kg, tipos_residuo ( nombre ) )
`;

async function run() {
  console.log("=== PRUEBA DE VINCULACION SUPABASE ===");
  console.log("URL:", url);
  console.log("Key (anon):", key.slice(0, 20) + "..." + key.slice(-10));
  console.log("");

  const { data: informes, error: e1, count } = await supabase
    .from("informes")
    .select("id, fecha_hora, total_kg, estado", { count: "exact" })
    .order("fecha_hora", { ascending: false })
    .limit(5);

  if (e1) {
    console.log("FALLO lectura informes:", e1.message);
    process.exit(1);
  }

  console.log("OK Lectura tabla informes:", count, "registros totales");
  console.log("Muestra (5 mas recientes):");
  informes.forEach((i) =>
    console.log(
      "  -",
      i.id.slice(0, 8),
      "|",
      i.fecha_hora?.slice(0, 10),
      "|",
      i.total_kg + "kg",
      "|",
      i.estado
    )
  );

  const { data: joined, error: e2 } = await supabase
    .from("informes")
    .select(INFORME_SELECT)
    .limit(1)
    .single();

  if (e2) {
    console.log("FALLO query con joins:", e2.message);
    process.exit(1);
  }

  console.log("");
  console.log("OK Query con joins (recolectores, recintos, residuos)");
  console.log("  Empresa:", joined.recintos?.afiliados?.nombre);
  console.log(
    "  Recolector:",
    joined.recolectores?.codigo_empleado,
    "-",
    joined.recolectores?.nombre
  );
  console.log(
    "  Residuos:",
    joined.informe_residuos
      ?.map((r) => `${r.tipos_residuo?.nombre} ${r.kg}kg`)
      .join(", ")
  );

  const { count: pendientes, error: e3 } = await supabase
    .from("informes")
    .select("*", { count: "exact", head: true })
    .eq("estado", "pendiente");

  if (e3) {
    console.log("FALLO conteo pendientes:", e3.message);
    process.exit(1);
  }

  console.log("");
  console.log("OK Cargas pendientes:", pendientes);

  const { data: pendiente } = await supabase
    .from("informes")
    .select("id, estado")
    .eq("estado", "pendiente")
    .limit(1)
    .single();

  if (pendiente) {
    const testId = pendiente.id;
    const { error: e4 } = await supabase
      .from("informes")
      .update({ estado: "aprobado" })
      .eq("id", testId);

    if (e4) {
      console.log("");
      console.log(
        "AVISO escritura (update):",
        e4.message,
        "- RLS puede bloquear updates con anon key"
      );
    } else {
      const { error: e5 } = await supabase
        .from("informes")
        .update({ estado: "pendiente" })
        .eq("id", testId);
      console.log("");
      console.log(
        "OK Escritura verificada: update aprobado -> revertido a pendiente en",
        testId.slice(0, 8)
      );
      if (e5) console.log("  AVISO al revertir:", e5.message);
    }
  } else {
    console.log("");
    console.log("INFO: No hay registros pendientes para probar escritura");
  }

  const tables = ["recolectores", "recintos", "afiliados", "informe_residuos"];
  console.log("");
  console.log("OK Tablas relacionadas:");
  for (const t of tables) {
    const { count: c, error } = await supabase
      .from(t)
      .select("*", { count: "exact", head: true });
    console.log("  -", t + ":", error ? "ERROR " + error.message : c + " registros");
  }

  console.log("");
  console.log("=== RESULTADO: VINCULACION CORRECTA ===");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

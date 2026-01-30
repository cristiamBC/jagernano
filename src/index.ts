import { homeHtml } from "./templates/home";
import { formHtml } from "./templates/form";
import { calendarioHtml } from "./templates/calendario";
import { renderHtml } from "./renderHtml";

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // Home
    if (request.method === "GET" && url.pathname === "/") {
      return new Response(renderHtml(homeHtml), {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Registrar racimos (formulario)
    if (request.method === "GET" && url.pathname === "/registrar") {
      return new Response(renderHtml(formHtml), {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Reporte semanal (en construcción)
    if (request.method === "GET" && url.pathname === "/reporte") {
      return new Response("Página de reporte aún en construcción", {
        status: 200,
      });
    }

    // Nueva vista: calendario de enfunde
    if (request.method === "GET" && url.pathname === "/calendario") {
      return new Response(renderHtml(calendarioHtml), {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Nuevo API: genera secuencia por año/semana
    if (request.method === "GET" && url.pathname === "/api/calendario") {
      const { searchParams } = new URL(request.url);
      const anio = parseInt(searchParams.get("anio") || "");
      const semanaFiltro = searchParams.get("semana");

      if (!anio || isNaN(anio)) {
        return new Response("Parámetro 'anio' inválido", { status: 400 });
      }

      let semanas: number[] = [];

      if (semanaFiltro) {
        semanas = [parseInt(semanaFiltro)];
      } else {
        semanas = Array.from({ length: 52 }, (_, i) => i + 1);
      }

      const resultado = semanas.map((semana) => {
        const semanasPasadas = semanasDesdeBase(anio, semana);
        const secuencia = getColoresParaSemanaIndex(semanasPasadas);

        return {
          semana,
          ...secuencia,
        };
      });

      return new Response(JSON.stringify(resultado), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Grabar racimo (desde el formulario)
    if (request.method === "POST" && url.pathname === "/grabar") {
      const data = await request.json();
      const { semana, corte, lote, peso } = data;

      await env.DB.prepare(
        `
        INSERT INTO racimos (semana, corte, lote, peso)
        VALUES (?, ?, ?, ?)
      `
      )
        .bind(semana, corte, lote, peso)
        .run();

      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Default: ruta no encontrada
    return new Response("Ruta no encontrada", { status: 404 });
  },
};

// Funciones auxiliares

function getColoresParaSemanaIndex(desde: number) {
  const colores = [
    "LILA",
    "ROJO",
    "CAFE",
    "AMARILLO",
    "VERDE",
    "AZUL",
    "BLANCO",
    "NEGRO",
  ];
  const total = colores.length;

  const idx = ((desde % total) + total) % total; // siempre positivo

  return {
    pasado: colores[(idx - 1 + total) % total],
    presente: colores[idx],
    futuro: colores[(idx + 1) % total],
    edad11: colores[(idx + 11) % total],
    edad12: colores[(idx + 12) % total],
    edad13: colores[(idx + 13) % total],
    edad14: colores[(idx + 14) % total],
  };
}

function semanasDesdeBase(anio: number, semana: number): number {
  return (anio - 2017) * 52 + semana - 52;
}





import { renderHtml } from "./renderHtml";
import { formHtml } from "./templates/form";
import { homeHtml } from "./templates/home";

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext) {
    const url = new URL(request.url);
  
      // FRONTEND
    // 🔵 Página principal
    if (request.method === "GET" && url.pathname === "/") {
      return new Response(renderHtml(homeHtml), {
        headers: { "Content-Type": "text/html" }
      });
    }

    // 🟢 Formulario de ingreso
    if (request.method === "GET" && url.pathname === "/registrar") {
      return new Response(renderHtml(formHtml), {
        headers: { "Content-Type": "text/html" }
      });
    }

    // 🟡 Próxima ruta: reporte por semana (en desarrollo)
    if (request.method === "GET" && url.pathname === "/reporte") {
      return new Response("Página de reporte aún en construcción", { status: 200 });
    }
    
    if (request.method === 'POST' && url.pathname === '/grabar') {
      const data = await request.json();  // espera JSON tipo { semana, corte, lote, peso }

      const { semana, corte, lote, peso } = data;

      // Guardar en D1
      await env.DB.prepare(`
        INSERT INTO racimos (semana, corte, lote, peso) 
        VALUES (?, ?, ?, ?)
      `).bind(semana, corte, lote, peso).run();

      // Obtener totales para responder
      const total_semana_corte = await env.DB.prepare(`
        SELECT COUNT(*) as total FROM racimos 
        WHERE semana = ? AND corte = ?
      `).bind(semana, corte).first();

      const total_lote = await env.DB.prepare(`
        SELECT COUNT(*) as total FROM racimos 
        WHERE semana = ? AND corte = ? AND lote = ?
      `).bind(semana, corte, lote).first();

      const cantidad_esperada = await env.DB.prepare(`
        SELECT cantidad_esperada FROM lotes_esperados 
        WHERE semana = ? AND corte = ? AND lote = ?
      `).bind(semana, corte, lote).first();

      const faltan = cantidad_esperada?.cantidad_esperada - total_lote.total;

      return new Response(JSON.stringify({
        consecutivo: total_semana_corte.total + 1,
        cantidad_esperada: cantidad_esperada?.cantidad_esperada || 0,
        registrados_lote: total_lote.total,
        faltan: faltan
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    }

    // Página de prueba
    return new Response('Worker funcionando. Usa POST /grabar para registrar.');
  }
};



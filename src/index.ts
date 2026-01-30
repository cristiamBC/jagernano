import { renderHtml } from "./renderHtml";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/') {
      const content = `
        <form id="racimoForm">
          <label>Semana: <input type="number" name="semana" required /></label><br />
          <label>Corte: <input type="number" name="corte" required /></label><br />
          <label>Lote: <input type="text" name="lote" required /></label><br />
          <label>Peso (kg): <input type="number" step="0.01" name="peso" required /></label><br />
          <button type="submit">Grabar</button>
        </form>

        <div id="resultado"></div>

        <script>
          const form = document.getElementById("racimoForm");
          const resultado = document.getElementById("resultado");

          form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(form));
            const res = await fetch("/grabar", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data)
            }).then(r => r.json());

            resultado.innerHTML = \`
              <strong>Registro exitoso</strong><br>
              Consecutivo: \${res.consecutivo}<br>
              Esperados: \${res.cantidad_esperada}<br>
              Registrados: \${res.registrados_lote}<br>
              Faltan: \${res.faltan}
            \`;
            form.reset();
          });
        </script>
      `;

      return new Response(renderHtml(content), {
        headers: { "Content-Type": "text/html" }
      });
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



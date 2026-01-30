export const calendarioHtml = `
  <h2>📅 Calendario de Enfunde</h2>

  <form id="filtro">
    Año: <input type="number" name="anio" value="2026" min="2017" />
    Semana (opcional): <input type="number" name="semana" min="1" max="52" />
    <button type="submit">Ver</button>
  </form>

  <table border="1" cellspacing="0" cellpadding="4" style="margin-top: 1rem;">
    <thead>
      <tr>
        <th>Semana</th>
        <th>Pasado</th>
        <th>Presente</th>
        <th>Futuro</th>
        <th>Edad 11</th>
        <th>Edad 12</th>
        <th>Edad 13</th>
        <th>Edad 14</th>
      </tr>
    </thead>
    <tbody id="tablaSemanas">
      <!-- JS llenará esta tabla -->
    </tbody>
  </table>

  <script>
    document.getElementById("filtro").addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = new FormData(e.target);
      const anio = form.get("anio");
      const semana = form.get("semana");

      const res = await fetch(\`/api/calendario?anio=\${anio}&semana=\${semana}\`);
      const data = await res.json();

      const tbody = document.getElementById("tablaSemanas");
      tbody.innerHTML = "";

      for (const fila of data) {
        const row = document.createElement("tr");
        row.innerHTML = \`
          <td>\${fila.semana}</td>
          <td>\${fila.pasado}</td>
          <td>\${fila.presente}</td>
          <td>\${fila.futuro}</td>
          <td>\${fila.edad11}</td>
          <td>\${fila.edad12}</td>
          <td>\${fila.edad13}</td>
          <td>\${fila.edad14}</td>
        \`;
        tbody.appendChild(row);
      }
    });

    // Dispara carga inicial
    document.getElementById("filtro").dispatchEvent(new Event("submit"));
  </script>
`;


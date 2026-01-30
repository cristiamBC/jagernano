export const formHtml = `
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


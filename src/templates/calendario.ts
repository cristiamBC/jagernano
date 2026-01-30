<h2>Calendario de Enfunde</h2>

<form id="filtro">
  Año: <input type="number" name="anio" value="2026" min="2017" />
  Semana (opcional): <input type="number" name="semana" min="1" max="52" />
  <button type="submit">Ver</button>
</form>

<table>
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
    <!-- Aquí va cada fila generada por JS -->
  </tbody>
</table>

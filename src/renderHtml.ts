export function renderHtml(content: string) {
	return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>🍌 Registro de Racimos</title>
        <link rel="stylesheet" href="https://static.integrations.cloudflare.com/styles.css">
        <style>
          body { font-family: sans-serif; padding: 2rem; display: flex; justify-content: center; }
          main { max-width: 500px; width: 100%; }
          input, button {
            padding: 0.5rem;
            margin: 0.5rem 0;
            width: 100%;
            border-radius: 6px;
            border: 1px solid #ccc;
            box-sizing: border-box;
          }
          button {
            background-color: #28a745;
            color: white;
            font-weight: bold;
            border: none;
            cursor: pointer;
          }
          button:hover {
            background-color: #218838;
          }
          #resultado {
            margin-top: 1rem;
            background: #f0f0f0;
            padding: 1rem;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <main>
          <h1>🍌 Registro de Racimos</h1>
          ${content}
        </main>
      </body>
    </html>
  `;
}



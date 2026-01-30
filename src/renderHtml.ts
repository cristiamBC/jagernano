export function renderHtml(content: string) {
	return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Registro de Racimos</title>
        <link rel="stylesheet" href="https://static.integrations.cloudflare.com/styles.css">
        <style>
          body { font-family: sans-serif; padding: 2rem; }
          input, button { padding: 0.5rem; margin: 0.5rem 0; width: 100%; max-width: 300px; }
          #resultado { margin-top: 1rem; background: #f0f0f0; padding: 1rem; }
        </style>
      </head>
    
      <body>
        <header>
          <h1>🍌 Registro de Racimos</h1>
        </header>
        <main>
          ${content}
        </main>
      </body>
    </html>
  `;
}


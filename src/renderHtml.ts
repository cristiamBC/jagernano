export function renderHtml(content: string) {
	return `
    <!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Feriados Ecuador</title>
<style>
:root{
  --bg:#0c0c0c;--s1:#161616;--s2:#1e1e1e;--s3:#262626;
  --b1:rgba(255,255,255,.06);--b2:rgba(255,255,255,.12);--b3:rgba(255,255,255,.2);
  --tx:#efefef;--mu:#777;--mu2:#555;
  --gold:#c9a96e;--gold2:#e8d5a3;
  --gr:#4caf7d;--re:#e05c5c;--bl:#5c9be0;--am:#e0a85c;--pu:#9b7fe0;--pk:#e07f9b;
}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--bg);color:var(--tx);font-family:'Georgia',serif;min-height:100vh;padding:0;}
/* header */
.hdr{padding:2rem 2rem 1.5rem;border-bottom:0.5px solid var(--b1);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}
.hdr-title{font-size:1rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);font-weight:normal;}
.hdr-sub{font-size:.7rem;font-family:monospace;color:var(--mu);margin-top:4px;letter-spacing:.05em;}
/* controls */
.ctrl{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:1.25rem 2rem;border-bottom:0.5px solid var(--b1);}
.year-select{background:var(--s2);border:0.5px solid var(--b2);color:var(--tx);padding:9px 14px;border-radius:5px;font-size:13px;font-family:monospace;outline:none;cursor:pointer;}
.year-select:focus{border-color:var(--gold);}
.apikey-input{background:var(--s2);border:0.5px solid var(--b2);color:var(--tx);padding:9px 14px;border-radius:5px;font-size:12px;font-family:monospace;outline:none;width:320px;}
.apikey-input::placeholder{color:var(--mu2);}
.apikey-input:focus{border-color:var(--gold);}
.btn{padding:9px 22px;border-radius:5px;border:0.5px solid var(--gold);background:transparent;color:var(--gold2);font-size:12px;font-family:monospace;letter-spacing:.08em;cursor:pointer;transition:all .15s;white-space:nowrap;}
.btn:hover{background:rgba(200,160,80,.1);}
.btn:disabled{opacity:.35;cursor:not-allowed;}
.btn-sec{border-color:var(--b2);color:var(--mu);}
.btn-sec:hover{background:var(--s2);color:var(--tx);}
.btn-copy{border-color:var(--b2);color:var(--mu);padding:7px 16px;font-size:11px;}
.btn-copy:hover{border-color:var(--gold);color:var(--gold2);background:rgba(200,160,80,.08);}
/* status */
.status{display:flex;align-items:center;gap:10px;padding:10px 2rem;font-family:monospace;font-size:11px;color:var(--mu);border-bottom:0.5px solid var(--b1);min-height:36px;}
.dot{width:6px;height:6px;border-radius:50%;background:var(--mu2);flex-shrink:0;transition:background .3s;}
.dot.run{background:var(--am);animation:pulse 1s infinite;}
.dot.ok{background:var(--gr);}
.dot.err{background:var(--re);}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
/* stream */
.stream-box{margin:1rem 2rem;background:var(--s1);border:0.5px solid var(--b1);border-radius:5px;padding:10px 14px;font-family:monospace;font-size:10px;color:var(--mu);max-height:60px;overflow:hidden;display:none;word-break:break-all;line-height:1.6;}
/* summary */
.summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:8px;padding:1rem 2rem;border-bottom:0.5px solid var(--b1);}
.stat{background:var(--s1);border:0.5px solid var(--b1);border-radius:5px;padding:10px 12px;text-align:center;}
.stat-n{font-size:1.5rem;font-family:monospace;color:var(--gold);}
.stat-l{font-size:9px;font-family:monospace;color:var(--mu);margin-top:3px;letter-spacing:.05em;text-transform:uppercase;}
/* filters */
.filters{display:flex;gap:8px;flex-wrap:wrap;padding:1rem 2rem;align-items:center;border-bottom:0.5px solid var(--b1);}
.filter-sel{background:var(--s2);border:0.5px solid var(--b1);color:var(--tx);padding:7px 12px;border-radius:5px;font-size:11px;font-family:monospace;outline:none;cursor:pointer;}
.filter-sel:focus{border-color:var(--gold);}
.search-in{background:var(--s2);border:0.5px solid var(--b1);color:var(--tx);padding:7px 12px;border-radius:5px;font-size:11px;font-family:monospace;outline:none;width:200px;}
.search-in::placeholder{color:var(--mu2);}
.search-in:focus{border-color:var(--gold);}
.flt-count{font-size:10px;font-family:monospace;color:var(--mu);margin-left:auto;}
/* tabs */
.tabs{display:flex;gap:0;padding:0 2rem;border-bottom:0.5px solid var(--b1);}
.tab{padding:10px 18px;font-size:11px;font-family:monospace;letter-spacing:.06em;cursor:pointer;color:var(--mu);border-bottom:1.5px solid transparent;background:none;border-top:none;border-left:none;border-right:none;transition:color .15s;}
.tab:hover{color:var(--tx);}
.tab.on{color:var(--gold2);border-bottom-color:var(--gold);}
.panel{display:none;padding:1.5rem 2rem;}
.panel.on{display:block;}
/* table */
.tbl-wrap{overflow-x:auto;border:0.5px solid var(--b1);border-radius:6px;}
table{width:100%;border-collapse:collapse;font-size:12px;}
thead th{text-align:left;padding:9px 12px;font-size:10px;font-family:monospace;letter-spacing:.06em;color:var(--mu);border-bottom:0.5px solid var(--b2);background:var(--s1);font-weight:normal;white-space:nowrap;}
tbody tr{border-bottom:0.5px solid var(--b1);}
tbody tr:hover{background:var(--s1);}
td{padding:8px 12px;vertical-align:top;line-height:1.5;}
.fecha{font-family:monospace;font-size:11px;color:var(--mu);white-space:nowrap;}
.diaSem{font-family:monospace;font-size:10px;color:var(--mu2);white-space:nowrap;}
.detalle-tx{font-size:12px;color:var(--tx);line-height:1.5;}
/* badges */
.badge{display:inline-block;font-size:9px;font-family:monospace;letter-spacing:.05em;padding:2px 8px;border-radius:3px;white-space:nowrap;font-weight:normal;}
.b-nac{background:rgba(92,155,224,.15);color:#8bbde8;border:0.5px solid rgba(92,155,224,.25);}
.b-dec{background:rgba(224,168,92,.12);color:#e0c080;border:0.5px solid rgba(224,168,92,.22);}
.b-loc{background:rgba(76,175,125,.12);color:#6dcc9b;border:0.5px solid rgba(76,175,125,.22);}
.b-real{background:rgba(155,127,224,.12);color:#b9a0e8;border:0.5px solid rgba(155,127,224,.22);}
.b-tras{background:rgba(224,127,155,.12);color:#e8a0b9;border:0.5px solid rgba(224,127,155,.22);}
.canton-badge{display:inline-block;font-size:9px;font-family:monospace;padding:1px 6px;border-radius:2px;background:var(--s3);color:var(--mu);border:0.5px solid var(--b1);}
/* json panel */
.json-wrap{position:relative;}
.json-copy{position:absolute;top:10px;right:10px;}
pre{background:var(--s1);border:0.5px solid var(--b1);border-radius:6px;padding:1.25rem;font-family:monospace;font-size:11px;line-height:1.7;overflow-x:auto;white-space:pre-wrap;word-break:break-word;color:#a8d0a8;max-height:500px;overflow-y:auto;}
/* empty */
.empty{text-align:center;padding:3rem;font-family:monospace;font-size:12px;color:var(--mu);}
.empty-icon{font-size:2rem;margin-bottom:10px;opacity:.3;}
/* thinking */
.thinking-hint{font-size:10px;font-family:monospace;color:var(--mu2);padding:6px 2rem;border-bottom:0.5px solid var(--b1);display:none;}
</style>
</head>
<body>

<div class="hdr">
  <div>
    <div class="hdr-title">Feriados Ecuador</div>
    <div class="hdr-sub">Generador vía Claude API · streaming · extended-thinking</div>
  </div>
  <div style="display:flex;gap:8px;align-items:center;">
    <button class="btn btn-copy" id="btnExport" disabled onclick="exportJSON()">Exportar JSON</button>
    <button class="btn btn-copy" id="btnCopy" disabled onclick="copyJSON()">Copiar JSON</button>
  </div>
</div>

<div class="ctrl">
  <select class="year-select" id="yearSel">
    <option value="2025">2025</option>
    <option value="2026" selected>2026</option>
    <option value="2027">2027</option>
    <option value="2028">2028</option>
  </select>
  <input class="apikey-input" id="apiKey" type="password" placeholder="sk-ant-api03-... (API Key de Anthropic)" />
  <button class="btn" id="btnGen" onclick="generar()">Generar</button>
  <button class="btn btn-sec" id="btnStop" onclick="detener()" disabled>Detener</button>
</div>

<div class="status"><div class="dot" id="dot"></div><span id="statusTx">Listo. Ingresa tu API Key y presiona Generar.</span></div>
<div class="thinking-hint" id="thinkHint">El modelo está razonando internamente (extended thinking)... esto puede tomar 20-40s antes de que aparezca el JSON.</div>
<div class="stream-box" id="streamBox"></div>

<div class="summary" id="summary" style="display:none;">
  <div class="stat"><div class="stat-n" id="sTotal">0</div><div class="stat-l">Total</div></div>
  <div class="stat"><div class="stat-n" id="sNac">0</div><div class="stat-l">Nacionales</div></div>
  <div class="stat"><div class="stat-n" id="sDec">0</div><div class="stat-l">Decretos</div></div>
  <div class="stat"><div class="stat-n" id="sLoc">0</div><div class="stat-l">Locales</div></div>
  <div class="stat"><div class="stat-n" id="sTras">0</div><div class="stat-l">Traslados</div></div>
</div>

<div class="filters" id="filterBar" style="display:none;">
  <select class="filter-sel" id="fTipo" onchange="renderTabla()">
    <option value="">Todos los tipos</option>
    <option value="Nacional">Nacional</option>
    <option value="Nacional real">Nacional real</option>
    <option value="Nacional trasladado">Nacional trasladado</option>
    <option value="Decreto">Decreto</option>
    <option value="Local">Local</option>
    <option value="Local real">Local real</option>
    <option value="Local trasladado">Local trasladado</option>
  </select>
  <select class="filter-sel" id="fCanton" onchange="renderTabla()">
    <option value="">Todos los cantones</option>
    <option value="Todo Ecuador">Todo Ecuador</option>
    <option value="Guayaquil">Guayaquil</option>
    <option value="Quito">Quito</option>
    <option value="Samborondón">Samborondón</option>
    <option value="Daule">Daule</option>
    <option value="Durán">Durán</option>
  </select>
  <select class="filter-sel" id="fMes" onchange="renderTabla()">
    <option value="">Todos los meses</option>
    <option value="-01-">Enero</option><option value="-02-">Febrero</option>
    <option value="-03-">Marzo</option><option value="-04-">Abril</option>
    <option value="-05-">Mayo</option><option value="-06-">Junio</option>
    <option value="-07-">Julio</option><option value="-08-">Agosto</option>
    <option value="-09-">Septiembre</option><option value="-10-">Octubre</option>
    <option value="-11-">Noviembre</option><option value="-12-">Diciembre</option>
  </select>
  <input class="search-in" id="fSearch" placeholder="Buscar..." oninput="renderTabla()"/>
  <span class="flt-count" id="fltCount"></span>
</div>

<div class="tabs" id="tabBar" style="display:none;">
  <button class="tab on" id="tab-tabla" onclick="switchTab('tabla')">TABLA</button>
  <button class="tab" id="tab-json" onclick="switchTab('json')">JSON</button>
</div>

<div class="panel on" id="panel-tabla">
  <div class="empty" id="emptyState">
    <div class="empty-icon">📅</div>
    Genera el calendario para ver los feriados aquí.
  </div>
  <div class="tbl-wrap" id="tblWrap" style="display:none;">
    <table>
      <thead>
        <tr>
          <th>FECHA</th><th>DÍA</th><th>TIPO</th><th>APLICACIÓN</th><th>DETALLE</th>
        </tr>
      </thead>
      <tbody id="tbody"></tbody>
    </table>
  </div>
</div>

<div class="panel" id="panel-json">
  <div class="json-wrap">
    <button class="btn btn-copy json-copy" onclick="copyJSON()">Copiar</button>
    <pre id="jsonPre">// El JSON aparecerá aquí después de generar.</pre>
  </div>
</div>

<script>
const DIAS = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
const MESES_CORTO = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
let datos = [];
let abortCtrl = null;

const PROMPT_TEMPLATE = `Actúa como analista de calendario laboral corporativo de Ecuador.

Necesito un calendario laboral de feriados de Ecuador para el año {ANIO}.

OBJETIVO:
Construir el calendario final en tres etapas internas obligatorias:
1. Generar feriados base nacionales y locales.
2. Buscar y validar decretos presidenciales aplicables.
3. Fusionar la información y entregar la tabla final.

Incluye únicamente:
1. Feriados nacionales de Ecuador.
2. Feriados locales solo de estos cantones:
   - Guayaquil
   - Quito
   - Samborondón
   - Daule
   - Durán
3. Feriados, descansos adicionales, puentes, extensiones o jornadas
   no recuperables por decreto presidencial oficial.

FERIADOS NACIONALES BASE:
- Año Nuevo — 1 de enero
- Carnaval — lunes y martes antes del Miércoles de Ceniza
- Viernes Santo — viernes antes del Domingo de Pascua
- Día del Trabajo — 1 de mayo
- Batalla de Pichincha — 24 de mayo
- Primer Grito de Independencia — 10 de agosto
- Independencia de Guayaquil — 9 de octubre
- Día de los Difuntos — 2 de noviembre
- Independencia de Cuenca — 3 de noviembre
- Navidad — 25 de diciembre

FERIADOS LOCALES BASE:
- Fundación de Guayaquil — 25 de julio — Guayaquil
- Cantonización de Durán — 10 de enero — Durán
- Cantonización de Samborondón — 31 de octubre — Samborondón
- Cantonización de Daule — 26 de noviembre — Daule
- Fundación de Quito — 6 de diciembre — Quito

ETAPA 1 — FERIADOS BASE:
- Calcula todos los feriados nacionales fijos.
- Calcula Carnaval y Viernes Santo.
- Calcula los feriados locales indicados.
- Aplica traslados oficiales cuando correspondan.
- Si un feriado se traslada, conserva la fecha real Y la fecha efectiva.

ETAPA 2 — BÚSQUEDA DE DECRETOS:
Busca decretos presidenciales relacionados con:
- días adicionales de descanso
- feriados extendidos / puentes vacacionales
- jornadas obligatorias no recuperables
- feriados excepcionales nacionales
- modificaciones de feriados
- reducción temporal de IVA turístico asociada a feriados

Para cada feriado base, verifica decretos en ventana ±3 días.
También verifica decretos independientes fuera de esas ventanas.
Los decretos tienen prioridad sobre la lista base.

ETAPA 3 — CONSOLIDACIÓN:
Fusiona feriados base + traslados + locales + decretos.
- Si un decreto agrega un día de descanso → objeto independiente.
- Si un decreto solo reduce IVA turístico → agrégalo en el detalle
  del feriado correspondiente, NO como objeto separado.

REGLAS OBLIGATORIAS:
1. No agrupes fechas. Cada día = un objeto independiente.
2. Feriado trasladado → dos objetos:
   - fecha real: tipo "Nacional real" o "Local real"
   - fecha efectiva: tipo "Nacional trasladado" o "Local trasladado"
3. En "detalle" escribe primero el nombre del feriado.
4. Feriados locales → indica el cantón: "(solo Guayaquil)", etc.
5. Si hay decreto → incluye el número en el detalle.
6. Si no puedes verificar un decreto con certeza → omítelo.
7. No incluyas fechas que no sean feriados oficiales.
8. Excluye: Día de la Madre, Día del Padre, Simón Bolívar,
   Miércoles de Ceniza, Día de la Raza, Descubrimiento de América.

VALIDACIÓN FINAL (antes de responder, verifica):
- ¿Están todos los feriados nacionales base?
- ¿Están los locales de los 5 cantones?
- ¿Fechas reales y trasladadas incluidas cuando aplica?
- ¿Se buscaron decretos para TODO el año?
- ¿IVA turístico en el detalle, no como fila separada?
- ¿Se excluyeron fechas no feriadas?

INSTRUCCIÓN CRÍTICA DE OUTPUT:
Responde ÚNICAMENTE con un array JSON válido.
Sin texto adicional, sin markdown, sin \`\`\`, sin explicaciones.
La lista debe ser COMPLETA y EXHAUSTIVA — no la trunces.
El array debe abrirse con [ y cerrarse con ] en la misma respuesta.
NO pares de escribir hasta que el array esté completamente cerrado con ].

Cada elemento tiene exactamente estos cuatro campos:
- "fecha": string YYYY-MM-DD
- "tipo": Nacional | Nacional real | Nacional trasladado | Decreto | Local | Local real | Local trasladado
- "aplicacion": "Todo Ecuador" o nombre del cantón
- "detalle": descripción completa`;

function setStatus(msg, state) {
  document.getElementById('statusTx').textContent = msg;
  const dot = document.getElementById('dot');
  dot.className = 'dot' + (state ? ' ' + state : '');
}

async function generar() {
  const apiKey = document.getElementById('apiKey').value.trim();
  const anio = document.getElementById('yearSel').value;
  if (!apiKey) { setStatus('Ingresa tu API Key para continuar.', 'err'); return; }

  datos = [];
  document.getElementById('btnGen').disabled = true;
  document.getElementById('btnStop').disabled = false;
  document.getElementById('btnExport').disabled = true;
  document.getElementById('btnCopy').disabled = true;
  document.getElementById('summary').style.display = 'none';
  document.getElementById('filterBar').style.display = 'none';
  document.getElementById('tabBar').style.display = 'none';
  document.getElementById('tblWrap').style.display = 'none';
  document.getElementById('emptyState').style.display = 'block';
  document.getElementById('jsonPre').textContent = '// Generando...';
  document.getElementById('streamBox').style.display = 'block';
  document.getElementById('streamBox').textContent = '';
  document.getElementById('thinkHint').style.display = 'block';

  setStatus(`Conectando con Claude API para año ${anio}...`, 'run');

  abortCtrl = new AbortController();
  let fullText = '';
  let tokenCount = 0;

  try {
    const prompt = PROMPT_TEMPLATE.replace('{ANIO}', anio);

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: abortCtrl.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'interleaved-thinking-2025-05-14'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 16000,
        stream: true,
        thinking: { type: 'enabled', budget_tokens: 10000 },
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${resp.status}`);
    }

    const reader = resp.body.getReader();
    const dec = new TextDecoder();
    let buf = '';
    let inThinking = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buf += dec.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop();

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const raw = line.slice(6).trim();
        if (raw === '[DONE]') continue;
        let ev;
        try { ev = JSON.parse(raw); } catch { continue; }

        // detectar bloque thinking vs text
        if (ev.type === 'content_block_start') {
          inThinking = ev.content_block?.type === 'thinking';
          if (!inThinking) {
            document.getElementById('thinkHint').style.display = 'none';
            setStatus('Recibiendo JSON...', 'run');
          }
        }

        if (ev.type === 'content_block_delta' && !inThinking) {
          if (ev.delta?.type === 'text_delta') {
            fullText += ev.delta.text;
            tokenCount++;
            // preview en stream box
            const preview = fullText.slice(-200);
            document.getElementById('streamBox').textContent = preview;
            if (tokenCount % 30 === 0) setStatus(`Recibiendo JSON... ${fullText.length} chars`, 'run');
          }
        }

        if (ev.type === 'message_stop') break;
      }
    }

    // parsear
    const clean = fullText
      .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

    datos = JSON.parse(clean);
    datos.sort((a, b) => a.fecha.localeCompare(b.fecha));

    document.getElementById('streamBox').style.display = 'none';
    setStatus(`Completado — ${datos.length} registros generados para ${anio}.`, 'ok');
    renderSummary();
    renderTabla();
    document.getElementById('jsonPre').textContent = JSON.stringify(datos, null, 2);
    document.getElementById('summary').style.display = 'grid';
    document.getElementById('filterBar').style.display = 'flex';
    document.getElementById('tabBar').style.display = 'flex';
    document.getElementById('btnExport').disabled = false;
    document.getElementById('btnCopy').disabled = false;

  } catch (e) {
    if (e.name === 'AbortError') {
      setStatus('Generación detenida por el usuario.', '');
    } else {
      setStatus('Error: ' + e.message, 'err');
      document.getElementById('streamBox').textContent = 'Error: ' + e.message;
    }
  } finally {
    document.getElementById('btnGen').disabled = false;
    document.getElementById('btnStop').disabled = true;
    document.getElementById('thinkHint').style.display = 'none';
  }
}

function detener() {
  if (abortCtrl) abortCtrl.abort();
}

function tipoBadge(t) {
  const map = {
    'Nacional': 'b-nac', 'Nacional real': 'b-real', 'Nacional trasladado': 'b-tras',
    'Decreto': 'b-dec', 'Local': 'b-loc', 'Local real': 'b-real', 'Local trasladado': 'b-tras'
  };
  return `<span class="badge ${map[t] || 'b-nac'}">${t}</span>`;
}

function renderSummary() {
  document.getElementById('sTotal').textContent = datos.length;
  document.getElementById('sNac').textContent = datos.filter(d => d.tipo.startsWith('Nacional')).length;
  document.getElementById('sDec').textContent = datos.filter(d => d.tipo === 'Decreto').length;
  document.getElementById('sLoc').textContent = datos.filter(d => d.tipo.startsWith('Local')).length;
  document.getElementById('sTras').textContent = datos.filter(d => d.tipo.includes('trasladado')).length;
}

function renderTabla() {
  const tipo = document.getElementById('fTipo').value;
  const canton = document.getElementById('fCanton').value;
  const mes = document.getElementById('fMes').value;
  const q = document.getElementById('fSearch').value.toLowerCase();

  const rows = datos.filter(r => {
    if (tipo && r.tipo !== tipo) return false;
    if (canton && r.aplicacion !== canton) return false;
    if (mes && !r.fecha.includes(mes)) return false;
    if (q && !r.detalle.toLowerCase().includes(q) && !r.fecha.includes(q)) return false;
    return true;
  });

  document.getElementById('fltCount').textContent = `${rows.length} de ${datos.length}`;

  if (!rows.length) {
    document.getElementById('tblWrap').style.display = 'none';
    document.getElementById('emptyState').innerHTML = '<div class="empty-icon">🔍</div>Sin resultados para los filtros aplicados.';
    document.getElementById('emptyState').style.display = 'block';
    return;
  }

  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('tblWrap').style.display = 'block';

  document.getElementById('tbody').innerHTML = rows.map(r => {
    const d = new Date(r.fecha + 'T12:00:00');
    const diaSem = DIAS[d.getDay()];
    const canton = r.aplicacion === 'Todo Ecuador'
      ? `<span style="font-size:10px;font-family:monospace;color:var(--mu)">Todo Ecuador</span>`
      : `<span class="canton-badge">${r.aplicacion}</span>`;
    return `<tr>
      <td class="fecha">${r.fecha}</td>
      <td class="diaSem">${diaSem}</td>
      <td>${tipoBadge(r.tipo)}</td>
      <td>${canton}</td>
      <td class="detalle-tx">${r.detalle}</td>
    </tr>`;
  }).join('');
}

function switchTab(id) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
  document.getElementById('tab-' + id).classList.add('on');
  document.getElementById('panel-' + id).classList.add('on');
}

function copyJSON() {
  const txt = JSON.stringify(datos, null, 2);
  navigator.clipboard.writeText(txt).then(() => {
    const b = document.getElementById('btnCopy');
    const prev = b.textContent;
    b.textContent = 'Copiado ✓';
    setTimeout(() => b.textContent = prev, 2000);
  });
}

function exportJSON() {
  const anio = document.getElementById('yearSel').value;
  const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `feriados-ecuador-${anio}.json`;
  a.click(); URL.revokeObjectURL(url);
}
</script>
</body>
</html>
  `;
}



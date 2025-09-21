import { CommonModule } from '@angular/common';
import { Component, computed, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { deflate } from 'pako';

type Topic = { topic_name: string; description?: string; resources?: string[] };
type Unit = { unit_name: string; objectives: string[]; topics: Topic[], resources?: string[];};
type Curriculum = { course_name: string; grade_level: string | number; units: Unit[], };

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

  function jsonToFreeMind(d: Curriculum): string {
    const esc = xmlEscape;

    const rootText = `${d.course_name ?? 'Curso'}${d.grade_level ? ` (Grado ${d.grade_level})` : ''}`;
    const lines: string[] = [];
    lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
    lines.push(`<map version="1.0.1">`);
    lines.push(`  <node TEXT="${esc(rootText)}">`);

    (d.units ?? []).forEach((u) => {
      const unitName = u.unit_name ?? 'Unidad';
      lines.push(`    <node TEXT="${esc(unitName)}">`);

      if (u.objectives && u.objectives.length) {
        lines.push(`      <node TEXT="Objetivos">`);
        u.objectives.forEach((o) => {
          if (o && o.trim()) lines.push(`        <node TEXT="${esc(o)}"/>`);
        });
        lines.push(`      </node>`);
      }

      if (u.topics && u.topics.length) {
        lines.push(`      <node TEXT="Temas">`);
        u.topics.forEach((t) => {
          const tName = t.topic_name ?? 'Tema';
          lines.push(`        <node TEXT="${esc(tName)}">`);
          const desc = (t.description ?? '').trim();
          if (desc) {
            lines.push(`          <node TEXT="${esc('Descripción: ' + desc)}"/>`);
          }
          if (t.resources && t.resources.length) {
            lines.push(`          <node TEXT="Recursos">`);
            t.resources.forEach((r) => {
              if (r && r.trim()) lines.push(`            <node TEXT="${esc(r)}"/>`);
            });
            lines.push(`          </node>`);
          }
          lines.push(`        </node>`);
        });
        lines.push(`      </node>`);
      }

      if (u.resources && u.resources.length) {
        lines.push(`      <node TEXT="Recursos">`);
        u.resources.forEach((r) => {
          if (r && r.trim()) lines.push(`        <node TEXT="${esc(r)}"/>`);
        });
        lines.push(`      </node>`);
      }

      lines.push(`    </node>`);
    });

    lines.push(`  </node>`);
    lines.push(`</map>`);
    return lines.join('\n');
  }

function curriculumToMermaid(d: Curriculum): string {
  // Limpia texto para Mermaid mindmap:
  // - sin comillas ni paréntesis
  // - sin dobles dos puntos (::) que activan estilos en Mermaid
  // - colapsa espacios y remueve saltos
  const sanitize = (s: string) =>
    (s ?? '')
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/[()"]/g, '')        // quita paréntesis y comillas
      .replace(/::/g, ' — ')        // evita sintaxis de clases
      .replace(/\s{2,}/g, ' ')
      .trim();

  const push = (arr: string[], level: number, line: string) =>
    arr.push(`${'  '.repeat(level)}${line}`);

  const out: string[] = [];
  push(out, 0, 'mindmap');

  // En mindmap, el root es solo una línea con el texto (sin (( )))
  const root = `${sanitize(d.course_name)} · Grado ${sanitize(String(d.grade_level ?? ''))}`.trim();
  push(out, 1, root.length ? root : 'Plan de estudio');

  (d.units ?? []).forEach((u) => {
    const unitName = sanitize(u.unit_name);
    if (unitName) push(out, 2, unitName);

    // Objetivos
    if (u.objectives?.length) {
      push(out, 3, 'Objetivos');
      u.objectives.forEach((o) => {
        const v = sanitize(o);
        if (v) push(out, 4, v);
      });
    }

    // Temas
    if (u.topics?.length) {
      push(out, 3, 'Temas');
      u.topics.forEach((t) => {
        const tn = sanitize(t.topic_name);
        if (tn) push(out, 4, tn);
        const desc = sanitize((t.description ?? '').trim());
        if (desc) push(out, 5, `Descripción — ${desc}`);
      });
    }

    // Recursos
    if (u.resources?.length) {
      push(out, 3, 'Recursos');
      u.resources.forEach((r) => {
        const v = sanitize(r);
        if (v) push(out, 4, v);
      });
    }
  });

  return out.join('\n');
}

function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => legacyCopy(text));
  } else {
    legacyCopy(text);
  }
}

function legacyCopy(text: string) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } finally { document.body.removeChild(ta); }
}

function toMermaidLiveUrl(code: string): string {
  // 1) Armar el payload que Mermaid Live espera
  const payload = {
    code,                          // <-- obligatorio
    mermaid: { theme: 'default' }, // opcional
    autoSync: true                 // opcional
    // updateDiagram: true,        // opcional
  };

  // 2) Stringificar y convertir a UTF-8
  const json = JSON.stringify(payload);
  const utf8 = new TextEncoder().encode(json);

  // 3) Comprimir (DEFLATE)
  const deflated: Uint8Array = deflate(utf8, { level: 9 });

  // 4) Base64 URL-safe (sin padding)
  const b64 = uint8ToBase64(deflated)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  // 5) URL final
  return `https://mermaid.live/edit#pako:${b64}`;
}

function uint8ToBase64(u8: Uint8Array): string {
  let bin = '';
  const CHUNK = 0x8000; // 32K
  for (let i = 0; i < u8.length; i += CHUNK) {
    bin += String.fromCharCode(...u8.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

@Component({
  selector: 'app-respone',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './respone.component.html',
  styleUrl: './respone.component.scss'
})
export class ResponeComponent {
// Estado base
  typingSpeed = 5;
  response = signal('');           // para modo texto (typewriter)
  fullResponse = signal('');       // texto completo en modo texto

  // Estado “estructurado”
  parsed = signal<Curriculum | null>(null);
  rawPayload = signal<any>(null);
  parseError = signal<string | null>(null);
  showRaw = signal(false);
  query = signal('');

  /** Setter: recibes SIEMPRE un string */
  @Input() set message(value: string) {
    this.reset();
    if (!value) return;
    console.log('ResponeComponent: nuevo mensaje', value);
    // Guarda crudo para “ver raw”
    this.rawPayload.set(value);

    // 1) Intentar detectar JSON doblemente embebido (message.content)
    const structured = this.tryParseCurriculum(value);

    if (structured) {
      this.parsed.set(structured);
      return;
    }
  }

  private reset() {
    this.response.set('');
    this.fullResponse.set('');
    this.parsed.set(null);
    this.parseError.set(null);
    this.showRaw.set(false);
    this.query.set('');
  }

  rawPretty = computed(() => {
    const v = this.rawPayload();
    try {
      if (typeof v === 'string') {
        // si es string y además es JSON, embellecerlo; si no, muéstralo tal cual
        try { return JSON.stringify(JSON.parse(v), null, 2); }
        catch { return v; }
      }
      // si es objeto, pretty JSON
      return JSON.stringify(v, null, 2);
    } catch {
      return String(v);
    }
  });

 private tryParseCurriculum(raw: string | Record<string, any>): Curriculum | null {
  // 1) Acepta objeto ya parseado o string JSON
  let root: any = raw;
  if (typeof raw === 'string') {
    try {
      root = JSON.parse(raw);
    } catch {
      // si te mandan texto plano, no es un curriculum válido
      return null;
    }
  }

  // 2) Si por alguna razón aún llega encapsulado, lo soportamos;
  //    pero si ya es el JSON canónico, 'content' será el propio root
  const content = root?.message?.content ?? root?.content ?? root;

  // 3) Si content todavía es string, intentamos parsearlo una vez
  let inner: any = content;
  if (typeof content === 'string') {
    try {
      inner = JSON.parse(content);
    } catch {
      // si no parsea, asumimos que no es válido
      return null;
    }
  }

  // 4) Normaliza alias ES→canónico (por si algún backend alterno cambia encabezados)
  const canon = this.normalizeSpanishSchema(inner);
  if (!canon?.course_name || !Array.isArray(canon?.units)) return null;

  // 5) Limpia cada unidad: resources null→undefined, description ""→undefined, etc.
  canon.units = canon.units.map((u: any) => this.normalizeUnit(u));

  return canon as Curriculum;
}


  /** Quita tildes y baja a minúsculas para comparar claves */
  private normKey(s: string): string {
    return s
      .normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .toLowerCase().trim();
  }

  /** Obtiene el primer campo existente entre varios alias */
  private pick<T extends object>(obj: any, aliases: string[]): any {
    for (const a of aliases) {
      // prueba exacto y “normalizado”
      if (a in obj) return obj[a];
      const key = Object.keys(obj).find(k => this.normKey(k) === this.normKey(a));
      if (key) return obj[key];
    }
    return undefined;
  }

  /** Limpia espacios raros internos: "Ingl es" -> "Inglés" (mantiene tildes originales) */
  private fixWeirdSpaces(s?: string): string | undefined {
    if (typeof s !== 'string') return s;
    return s
      .replace(/\u00A0/g, ' ')   // NBSP → espacio normal
      .replace(/[ \t]{2,}/g, ' ')// colapsa espacios múltiples
      .trim();                   // bordes
  }

  /** Normaliza el esquema con alias en español y variantes */
  private normalizeSpanishSchema(anyObj: any): any {
    if (typeof anyObj !== 'object' || !anyObj) return anyObj;

    const course_name = this.pick(anyObj, ['course_name','curso','nombre_curso','asignatura']);
    const grade_level = this.pick(anyObj, ['grade_level','grado','nivel']);
    const unitsRaw    = this.pick(anyObj, ['units','unidades']);

    const units = Array.isArray(unitsRaw) ? unitsRaw : [];

    return { course_name, grade_level, units };
  }

  /** Normaliza cada unidad: nombres de campos, topics como strings, recursos al nivel de unidad */
  private normalizeUnit(u: any): any {
    if (!u || typeof u !== 'object') return u;

    const unit_name = this.pick(u, ['unit_name','nombre_unidad','titulo','tema']) ?? 'Unidad';
    const objectives = this.pick(u, ['objectives','objetivos','objectivos']) ?? [];
    let topics = this.pick(u, ['topics','temas','topicos']) ?? [];
    const unitResources = this.pick(u, ['resources','recursos']) ?? [];

    // Asegurar arrays
    const objList = Array.isArray(objectives) ? objectives : [];
    const resList = Array.isArray(unitResources) ? unitResources : [];

    // Topics puede venir como array de strings -> convertir
    if (Array.isArray(topics)) {
      topics = topics.map((t: any) => {
        if (typeof t === 'string') {
          return { topic_name: this.fixWeirdSpaces(t) };
        } else if (t && typeof t === 'object') {
          const topic_name = this.pick(t, ['topic_name','nombre_tema','titulo','tema']) ?? 'Tema';
          const description = this.pick(t, ['description','descripcion','detalle','resumen']);
          const resources = this.pick(t, ['resources','recursos']);
          return {
            topic_name: this.fixWeirdSpaces(topic_name),
            description: this.fixWeirdSpaces(description),
            resources: Array.isArray(resources) ? resources : undefined
          };
        }
        return { topic_name: 'Tema' };
      });
    } else {
      topics = [];
  }

  // Limpieza leve de objetivos
  const cleanedObj = objList
    .filter((o: any) => typeof o === 'string')
    .map((o: string) => this.fixWeirdSpaces(o) as string);

  return {
    unit_name: this.fixWeirdSpaces(unit_name) ?? 'Unidad',
    objectives: cleanedObj,
    topics,
    // Conserva recursos de la UNIDAD si existen en el esquema de entrada
    resources: resList.length ? resList.map((r: any) => typeof r === 'string' ? this.fixWeirdSpaces(r) : r) : undefined
  };
}

  // Filtro de búsqueda para el modo estructurado
  filteredUnits = computed<Unit[]>(() => {
    const data = this.parsed();
    const q = this.query().trim().toLowerCase();
    if (!data) return [];
    if (!q) return data.units;

    return data.units
      .map(u => {
        const unitHit =
          u.unit_name.toLowerCase().includes(q) ||
          u.objectives.some(o => o.toLowerCase().includes(q));
        const topics = u.topics.filter(
          t =>
            t.topic_name.toLowerCase().includes(q) ||
            (t.description ?? '').toLowerCase().includes(q)
        );
        if (unitHit || topics.length) return { ...u, topics };
        return null;
      })
      .filter(Boolean) as Unit[];
  });

  // Acciones UX
  toggleRaw() { this.showRaw.set(!this.showRaw()); }

  copyMindmapMermaid() {
    const d = this.parsed() as Curriculum | null;
    if (!d) return;

    const text = curriculumToMermaid(d);
    copyToClipboard(text);
  }


  downloadJson() {
    const d = this.parsed();
      if (!d) return;

      const mm = jsonToFreeMind(d);
      const safe = (d.course_name || 'curriculum').replace(/[^\w\-]+/g, '_');
      const fileName = `${safe}${d.grade_level ? `_Grado_${d.grade_level}` : ''}.mm`;

      const blob = new Blob([mm], { type: 'application/x-freemind' }); // o 'text/xml'
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
  }

  openMermaidLive(preload: boolean = true) {
    if (!preload) {
      window.open('https://mermaid.live/edit', '_blank', 'noopener');
      return;
    }
    const d = this.parsed();
    if (!d) {
      window.open('https://mermaid.live/edit', '_blank', 'noopener');
      return;
    }
    const code = curriculumToMermaid(d); // tu helper "mindmap\n  root((...))\n ..."
    const url = toMermaidLiveUrl(code);
    window.open(url, '_blank', 'noopener');
  }

}

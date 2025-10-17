# ResiaApp — Frontend (Angular)

**ResiaApp** es una aplicación web construida con **Angular 19.2.0** orientada a la recomendacion de planes de estudio basados en IA para la eduacion rural en colombia.  
Este README documenta cómo **instalar, desarrollar, probar, construir y desplegar** el proyecto, además de pautas de calidad y soporte.

> 📌 **Stack principal:** Angular 19, TypeScript, RxJS, Angular Router, (opcional) Tailwind/PrimeNG/Material, Karma/Playwright/Cypress según configuración del proyecto.

---

## 🚀 Quickstart

### Requisitos
- **Node.js** LTS (recomendado ≥ 20.x)
- **Package manager:** `npm` (o `pnpm`/`yarn`)
- **Angular CLI:**
  ```bash
  npm i -g @angular/cli@19
  ```

### Instalación
```bash
# Clonar el repo
git clone <tu-repo-url>
cd resia-app

# Instalar dependencias
npm ci    # o: npm install / pnpm i / yarn
```

### Levantar en local (dev server)
```bash
npm run start     # alias de: ng serve
# o: ng serve
```
Abre `http://localhost:4200/`. El servidor recarga automáticamente ante cambios en el código.

---

## 🧩 Estructura del proyecto

```
resia-app/
├─ src/
│  ├─ app/
│  │  ├─ core/           # servicios singleton (auth, api, interceptors)
│  │  ├─ shared/         # componentes/pipe/directivas reutilizables
│  │  ├─ features/       # módulos de características (rutas hijas)
│  │  └─ app.routes.ts   # enrutamiento raíz
│  ├─ assets/            # íconos, imágenes, fuentes
│  ├─ environments/
│  │  ├─ environment.ts
│  │  └─ environment.prod.ts
│  └─ main.ts
├─ angular.json
├─ package.json
└─ README.md
```

## ⚙️ Configuración de entornos

Configura **variables** en `src/environments`:

- `environment.ts` (desarrollo)
- `environment.prod.ts` (producción)

Ejemplo:
```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api',
  featureFlags: {
    enableStudentTests: true,
    enableMindMaps: true
  }
};
```

## 📜 Scripts útiles

Agrega (o verifica) estos scripts en `package.json`:

```json
{
  "scripts": {
    "start": "ng serve",
    "start:hmr": "ng serve --hmr",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e",
    "format": "prettier --write \"src/**/*.{ts,html,scss,css}\"",
    "typecheck": "tsc --noEmit",
    "clean": "rimraf dist .angular && rimraf node_modules && npm cache verify"
  }
}
```

---

## 🛠️ Desarrollo

### Generar código (scaffolding)
```bash
ng g c features/plan-estudios/pages/plan-list
ng g s core/services/plan-estudios
ng g m features/plan-estudios --route plan --module app
```
Más esquemas disponibles:
```bash
ng generate --help
```

### Estándares de código
- **ESLint** con reglas para Angular/TypeScript.
- **Prettier** para formato consistente.
- Convención de imports y **arquitectura por features** (evita “god modules”).
- **Conventional Commits** (ej.: `feat:`, `fix:`, `docs:`, `refactor:`).  
  Ejemplo: `feat(tests): add student status test creation modal`

---

## 🧪 Pruebas

### Unit tests (Karma + Jasmine por defecto)
```bash
npm run test
# o con cobertura:
ng test --code-coverage
```
El reporte de cobertura suele generarse en `coverage/`.

### End-to-end (E2E)
Dependiendo de lo que uses en el proyecto:

**Playwright (recomendado)**
```bash
# si no está instalado:
ng add @playwright/test
npm run e2e
```

**Cypress**
```bash
# si elegiste Cypress:
ng add @cypress/schematic
npm run e2e
```

> Documenta en `e2e/README.md` los casos críticos: autenticación, creación de pruebas, consulta de estado, visualización de plan de estudios, etc.

---

## 📦 Build y artefactos

Construcción para producción:
```bash
npm run build:prod
# Salida en: dist/resia-app/
```

Opciones comunes:
- `--base-href /subcarpeta/` para despliegues en subrutas.
- `--aot` (compilación anticipada) y `--optimization` activadas por defecto en producción.

---

## 🚀 Despliegue

### Estático (NGINX, Apache, S3, Firebase, Netlify, Vercel, GitHub Pages)
1. Ejecuta `ng build --configuration production`.
2. Sube el contenido de `dist/resia-app/` a tu hosting estático.

**NGINX ejemplo de server block:**
```nginx
server {
  listen 80;
  server_name resiaapp.example.com;
  root /var/www/resiaapp;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

> Asegúrate de redirigir a `index.html` para que el Router de Angular maneje las rutas.

---

## 🔒 Seguridad y datos

- Interceptores de **Auth** (Bearer/JWT) en `core/interceptors`.
- **CSRF** si interactúas con cookies.
- Sanitización de HTML y escape de datos en plantillas.
- Evita logs sensibles en producción.

---

## ♿ Accesibilidad (A11y)

- Uso correcto de roles ARIA y etiquetas semánticas.
- Contraste suficiente y navegación por teclado.
- Pruebas con Lighthouse/axe en vistas críticas.

---

## 📈 Rendimiento

- Lazy loading por módulos/feature.
- ChangeDetectionStrategy.OnPush donde sea posible.
- Pre-carga selectiva (`PreloadAllModules`) si aplica.
- Imágenes optimizadas y `ngOptimizedImage`.

---

## 🔄 Flujo de trabajo recomendado

1. Crea rama desde `main`:
   `git checkout -b feat/plan-studies-view`
2. Commits con convención.
3. PR con checklist (lint, test, cobertura).
4. Revisión y squash/merge.
5. Tag de versión (semver) y changelog.

---

## 🧰 Troubleshooting

- **El servidor no arranca / errores raros**
  ```bash
  npm run clean
  npm ci
  ng serve
  ```
- **Conflictos de versiones**: revisa `engines` en `package.json` y usa Node LTS.
- **Rutas 404 en producción**: configura el servidor para servir `index.html` en rutas SPA.
- **CORS**: habilita CORS en el backend o usa un reverse proxy.

---

## 📚 Documentación adicional

- [Angular Docs](https://angular.dev/)
- [Angular CLI](https://angular.dev/tools/cli)
- [RxJS](https://rxjs.dev/)
- [Angular ESLint](https://github.com/angular-eslint/angular-eslint)
- [Playwright](https://playwright.dev/) / [Cypress](https://www.cypress.io/)

---

## 👥 Mantenimiento

- **Owners:** @tu-usuario  
- **Issues:** usar GitHub Issues con plantillas (bug/feature).  
- **Versionado:** **SemVer** + `CHANGELOG.md`.



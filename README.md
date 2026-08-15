# HUMANITALIS

Web corporativa bilingüe de HUMANITALIS: inteligencia artificial para el patrimonio cultural. Presenta capacidades de reconocimiento documental, estructuración, análisis computacional, enriquecimiento de colecciones, edición digital y consultoría técnica.

## Tecnología

- Next.js con App Router, React y TypeScript.
- CSS mantenible con variables de marca y diseño responsive, sin librería visual pesada.
- ESLint y comprobación estricta de tipos.
- Cormorant Garamond para títulos y Manrope para interfaz y lectura, servidas localmente mediante `@fontsource` (sin llamadas a servicios de fuentes).
- Metadatos bilingües, Open Graph generado con Next, JSON-LD, sitemap, robots y manifest.

## Desarrollo local

Requiere una versión LTS reciente de Node.js (20 o superior).

```bash
npm install
npm run dev
```

La web queda disponible en `http://localhost:3000`; la raíz redirige a `/es`. Rutas principales: `/es` y `/en`.

Comprobaciones:

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

## Variables de entorno

Copia `.env.example` a `.env.local` y configura:

- `NEXT_PUBLIC_SITE_URL`: URL canónica sin barra final. En local puede ser `http://localhost:3000`.
- `NEXT_PUBLIC_CONTACT_EMAIL`: correo corporativo opcional. Si queda vacío, la llamada a la acción enlaza de forma segura a `https://www.alvarocuellar.com/`.

No se necesitan claves privadas, base de datos ni servicios externos.

## Edición de contenido y marca

- Los textos bilingües se centralizan en `content/dictionaries.ts`.
- Las URLs, el contacto y los datos legales opcionales están en `lib/config.ts`.
- Los colores, tipografías, espaciado y comportamiento responsive están en `app/globals.css`.
- Los archivos maestros facilitados por el fundador son `humanitalis-logo-exact.svg` y `humanitalis-lockup-exact.svg` en la raíz. Contienen el arte aprobado como imagen incrustada y se conservan intactos. Las copias de publicación de `public/brand/` convierten ese arte directamente en trazados vectoriales reales, sin base64 ni pixelado; no deben redibujarse ni sustituirse por aproximaciones. Las variantes monocromas y el favicon derivan de esos trazados.
- La imagen original que inspiró el sistema está en `references/humanitalis-brand-reference.png`; no se publica en la web.

## Despliegue futuro en Vercel

1. Crear un repositorio de GitHub llamado exactamente `humanitalis` y subir este proyecto cuando exista autorización.
2. Importar el repositorio desde Vercel.
3. Configurar `NEXT_PUBLIC_SITE_URL` con la URL definitiva y, si existe, `NEXT_PUBLIC_CONTACT_EMAIL`.
4. Ejecutar un despliegue de producción y verificar canonical, sitemap, enlaces y páginas legales.

No se ha creado repositorio remoto, hecho push ni realizado despliegue alguno.

## Pendiente antes de la publicación oficial

Deben facilitarse y revisarse con asesoramiento adecuado:

- Razón social o nombre legal definitivo.
- NIF u otro identificador fiscal aplicable.
- Domicilio fiscal o dirección legal que proceda.
- Correo corporativo de contacto.
- Redacción legal definitiva y responsable del tratamiento, si corresponde.
- Dominio público definitivo.

Las páginas legales actuales indican expresamente que esos datos están pendientes. No hay formularios, analítica, píxeles publicitarios ni cookies de marketing.

## Límites editoriales

No se debe afirmar que una biblioteca, archivo, museo, universidad o institución es cliente, socio o colaborador sin autorización expresa. En particular, el prototipo de manuscritos teatrales debe presentarse únicamente como demostración técnica independiente; no implica una colaboración oficial, contrato o respaldo de la Biblioteca Nacional de España. No deben añadirse clientes, cifras, testimonios, premios, afiliaciones ni cargos no confirmados.

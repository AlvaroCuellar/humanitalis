# Decisiones permanentes del proyecto HUMANITALIS

## Posicionamiento

HUMANITALIS es una empresa tecnológica especializada ampliamente en inteligencia artificial aplicada al patrimonio cultural, las humanidades y las colecciones históricas. Combina investigación humanística, IA, tratamiento documental e infraestructuras digitales. No reducir la marca a transcripción ni utilizar «El pasado, legible» como lema principal.

Públicos: bibliotecas, archivos, museos, universidades, grupos de investigación e instituciones culturales.

## Afirmaciones permitidas

- Fundador: Álvaro Cuéllar.
- Equipo actual: únicamente Álvaro Cuéllar. No añadir otras personas sin indicación expresa.
- Perfil: investigador especializado en Humanidades Digitales, literatura del Siglo de Oro, análisis computacional y patrimonio textual.
- Web pública: https://www.alvarocuellar.com/
- El visor https://bne-manuscritos-siglo-de-oro.vercel.app/ es una demostración técnica independiente para explorar procesamiento y transcripción de manuscritos teatrales del Siglo de Oro conservados en la Biblioteca Nacional de España.

Nunca inventar clientes, socios, colaboraciones, cargos institucionales, afiliaciones actuales, premios, testimonios, cifras, contratos ni proyectos. No afirmar que la BNE es cliente, socia o colaboradora; no usar su logo.

## Identidad

Dirección editorial, sobria, institucional y contemporánea. Paleta base: oxblood `#681821`, burdeos oscuro `#3B0D13`, tinta `#171817`, marfil `#F2EBDD`/`#FAF6ED` y latón `#B28A3F`. Serif editorial Cormorant Garamond y sans Manrope. Los maestros oficiales son `humanitalis-logo-exact.svg` y `humanitalis-lockup-exact.svg` en la raíz: deben usarse sin reinterpretar. Las copias publicadas en `public/brand/` son trazados vectoriales derivados directamente de esos maestros y no deben volver a sustituirse por aproximaciones. El símbolo combina una H clásica, un folio central, ejes finos y nodos.

Evitar estética SaaS genérica, gradientes azules/morados, neón, chips, robots, cerebros, clichés medievales, fotografía de stock y decoración dorada excesiva.

## Arquitectura y contenido

- Next.js App Router, TypeScript y React; mantener dependencias mínimas y preparación para Vercel.
- Español e inglés en rutas indexables `/es` y `/en`; textos centralizados en `content/dictionaries.ts`.
- Mantener equivalencia de navegación y contenido entre idiomas.
- Contacto mediante `NEXT_PUBLIC_CONTACT_EMAIL`; si falta, enlazar a la web del fundador sin mostrar valores ficticios.
- URL canónica mediante `NEXT_PUBLIC_SITE_URL`; no asumir dominio definitivo.
- Sin CMS, base de datos, analítica, seguimiento, publicidad ni formulario hasta recibir autorización y requisitos.
- Datos legales opcionales en `lib/config.ts`. No completar NIF, domicilio o razón social mediante suposiciones.

## Calidad

Preservar accesibilidad, foco visible, HTML semántico, rendimiento, reduced motion y responsive sin desbordamiento. Antes de entregar cambios relevantes, ejecutar lint, typecheck y build. No crear repositorio remoto, hacer push, desplegar, comprar dominio ni activar servicios externos sin confirmación explícita del usuario.

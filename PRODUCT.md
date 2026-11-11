# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (static output). Chosen by the user.
Content source: the WordPress REST API of https://isfdyt93-bue.infd.edu.ar/sitio/ (`/wp-json/wp/v2/pages` and `/media`), read at build time by `src/data/wp.ts`. Oferta académica, carreras, formularios de alumnos y docentes, contacto, autoridades, etapas de inscripción y calendario vienen de la API; la última lectura exitosa se guarda en `src/data/wp-snapshot.json` como respaldo. Los menús de WordPress son privados (401), por eso Campus, INFoD y Argentina.gob.ar son enlaces fijos en `src/data/site.ts`.

## Users

- Primary: personas adultas de San Vicente, Alejandro Korn y alrededores (conurbano sur / Gran Buenos Aires) que quieren una carrera terciaria gratuita con salida laboral, muchas veces trabajando de día; también sus familias. Cursan de noche.
- Secondary: egresados de secundaria, quienes buscan cambiar de rubro, y estudiantes actuales/docentes que buscan campus, horarios, mesas, formularios.

## Product Purpose

Landing institucional del Instituto Superior de Formación Técnica N° 93 "Presidente Arturo Umberto Illia" (San Vicente, Buenos Aires). Debe presentar la institución, mostrar la oferta académica 2026 y llevar a la preinscripción. Éxito: un visitante nuevo entiende en segundos qué es el ISFT 93, qué puede estudiar, que es gratuito y cómo se inscribe. Prioridad de acciones: 1) conocer la institución, 2) explorar carreras, 3) inscribirse.

## Positioning

Institución pública y emblemática de San Vicente desde 1993: carreras terciarias, gratuitas, con títulos oficiales, cursada nocturna, convenios con universidades que reconocen todas las materias aprobadas para completar la licenciatura en 2 años más. Lema del logo: "Comunidad educativa. Acompañándote en tu formación."

## Operating Context

- Dependiente de la Dirección de Educación Superior de Formación Técnica de la Provincia de Buenos Aires.
- Sede San Vicente: Av. San Martín 101 (1865), al lado de la Iglesia. Tel (02225) 481175 / 484015. institutosuperior93@gmail.com
- Anexo Enfermería: E.E.S. N° 5, Juan B. Justo 263 (1864), Alejandro Korn.
- Sede UNSaV (Universidad Nacional de San Vicente): Av. Sarmiento esquina Illia.
- Horario de atención: lunes a viernes 18:30 a 22:30 hs (cursadas 18:30 a 22:40; turno tarde UNSaV 13:00 a 17:00).
- Inscripción formal presencial en diciembre, lunes a viernes 19:00 a 21:00 hs en San Martín 101. Proceso 2026 en tres etapas: 1) preinscripción online (Google Form, no asegura vacante), 2) inscripción formal, 3) confirmación. Reinscripción 2° y 3° año aparte.
- Redes: Facebook ISFDYT93SV, Instagram institutosuperiors93sv, Twitter is93sanvi.
- Campus virtual: https://isfdyt93-bue.infd.edu.ar/aula/escritorio.cgi
- Sitio actual (fuente de datos): https://isfdyt93-bue.infd.edu.ar/sitio/

## Capabilities and Constraints

Oferta 2026 por sede:
- Sede San Vicente (noche): Tecnicatura Superior en Marketing (Administración con orientación en Marketing), Guía de Turismo, Administración Contable, Administración Pública.
- Sede Enfermería, Alejandro Korn (noche): Tecnicatura Superior en Enfermería.
- UNSaV, turno tarde 13:00–17:00: Biotecnología; Ciencia de Datos e Inteligencia Artificial.
- UNSaV, turno vespertino 18:30–22:30: Desarrollo de Software; Análisis de Sistemas.
- Carreras previas listadas en el sitio: Análisis, Desarrollo y Programación de Aplicaciones.
- Carreras de 3 años, terciarias, gratuitas, título oficial. Más de 1000 estudiantes cursan actualmente.
- Fundado en junio de 1993; primeras carreras: Análisis de Sistemas y Administración Contable.
- Autoridades: Director Betiana Maricel Jacobsen; Regente Adán Aloe; Secretario Daniel Palma.
- Becas PROGRESAR, preguntas frecuentes, horarios, mesas de examen, formularios, calendario 2026 (PDF) existen en el sitio actual y deben enlazarse, no reescribirse.
- Contenido en español rioplatense (voseo permitido: "inscribite", "empezá").
- Undecided: dominio, destino final del formulario de preinscripción, fechas exactas de inscripción 2026/2027.

## Brand Commitments

- Nombre oficial: "Instituto Superior de Formación Técnica N° 93 «Presidente Arturo Umberto Illia»" (ISFT 93), San Vicente.
- Logo circular en `logo.png` (azul cobalto "ISFT 93", pergamino dorado, tipografía serif en negro, anillo con "Comunidad educativa" / "Acompañándote en tu formación"). Colores del logo: azul y amarillo/dorado.
- Dirección elegida por el usuario tras dos tiradas de exploración (rechazó direcciones experimentales: "horrible, más formal"): portada institucional clásica y formal, ejecutada al máximo nivel, sin experimentos. Vinculante: tono sobrio, jerarquía académica clara, sin metáforas visuales lúdicas.
- Referentes de calidad pedidos: University of Florida, Oxford / Cambridge / Yale, UBA / UNLP / UTN, gob.ar / Ministerio.

## Evidence on Hand

- `logo.png` en la raíz del proyecto (1280x1280).
- `hero.jpg` en la raíz (1376x671): foto real del edificio patrimonial del instituto, esquina con plátanos, cielo azul profundo, cartel "30 años" en el balcón. Resolución modesta: recomendar una versión de mayor resolución.
- Datos institucionales, carreras y proceso de inscripción del sitio oficial (arriba).
- Tríptico institucional en el sitio actual: https://isfdyt93-bue.infd.edu.ar/sitio/wp-content/uploads/2023/09/is93_triptico_frente-1000x773.jpg
- No hay fotografías propias, testimonios, cifras de empleabilidad ni nombres de convenios universitarios confirmados: no inventarlos. Cualquier imagen o testimonio ilustrativo debe estar marcado como placeholder.

## Product Principles

- Primero lo útil: carreras, sede, horario, gratuidad e inscripción son visibles sin scrollear mucho.
- Orgullo público y local: una institución estatal con 30+ años en San Vicente, sin tono de marketing privado ni claims inventados.
- Pensada para quien llega del trabajo: legible en el celular, rápida y con acciones claras.
- Cada dato sale del sitio oficial; lo que no esté verificado se deja marcado como pendiente.

## Accessibility & Inclusion

- Público adulto y diverso, mayormente móvil; contraste alto y texto legible. Objetivo WCAG AA.

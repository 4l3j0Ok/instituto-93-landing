---
name: ISFT N° 93, San Vicente
description: Portada institucional formal de un instituto público de formación técnica; fachada real, azul del escudo y dorado del pergamino.
colors:
  navy-ink: "#0b1f4b"
  navy-field: "#122c66"
  cobalt: "#0a4ba6"
  cobalt-deep: "#083c85"
  pergamino-gold: "#f2b51d"
  pergamino-gold-light: "#f7cb5a"
  paper: "#f7f9fc"
  white: "#ffffff"
  tint: "#eaf0f9"
  ink: "#0e1b38"
  muted: "#4a5774"
  rule: "#cfd8e8"
  on-dark: "#dbe4f5"
typography:
  display:
    fontFamily: "'Libre Caslon Text', 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(2.5rem, 4.6vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Libre Caslon Text', 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(2rem, 3.6vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.12
  title:
    fontFamily: "'Libre Caslon Text', 'Iowan Old Style', Georgia, serif"
    fontSize: "1.625rem"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "'Public Sans Variable', 'Public Sans', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Public Sans Variable', 'Public Sans', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: 1.2
rounded:
  sm: "2px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 3rem)"
  section: "clamp(4rem, 8vw, 7rem)"
  row: "1.0625rem"
components:
  button-primary:
    backgroundColor: "{colors.pergamino-gold}"
    textColor: "{colors.navy-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "15px 26px"
  button-primary-hover:
    backgroundColor: "{colors.pergamino-gold-light}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "15px 26px"
  link-inline:
    textColor: "{colors.cobalt}"
    typography: "{typography.label}"
---

# Design System: ISFT N° 93, San Vicente

## Overview

**Creative North Star: "La Fachada Institucional"**

Una portada pública y seria: el edificio real es la prueba, la información se ordena como la de un ministerio. El sistema toma el azul cobalto del escudo y el dorado de su pergamino y los apoya sobre papel azulado, con títulos en serifa clásica y una sans de interfaz de tono gubernamental. No hay metáfora lúdica: autoridad por claridad, filetes finos y tablas, no por ornamento.

La densidad es media y ordenada. Cada sección arranca con un título serif amplio y se resuelve con listas regladas (carreras por sede, etapas, enlaces) en lugar de tarjetas. La fotografía a sangre abre la página bajo un degradé azul marino que deja leer el título.

**Key Characteristics:**
- Azul marino y cobalto para autoridad; dorado reservado a la acción principal y a un filete.
- Serifa en los títulos, sans en todo lo funcional.
- Filetes de 1px y 2px como estructura; ninguna tarjeta ni sombra.
- Fotografía real del edificio como única imagen.
- Esquinas casi rectas (2px).

## Colors

Paleta del escudo sobre papel frío: azules profundos, un solo dorado y neutros teñidos de azul.

### Primary
- **Azul Tinta Marino** (#0b1f4b): fondo de la barra superior, del bloque de inscripción y del pie; también color de los títulos sobre papel.
- **Cobalto del Escudo** (#0a4ba6): enlaces, flechas y acentos interactivos sobre fondo claro.

### Secondary
- **Dorado Pergamino** (#f2b51d): botón principal, filete bajo la fotografía y numerales de etapas sobre marino.

### Neutral
- **Papel Azulado** (#f7f9fc): fondo de página.
- **Velo Azul** (#eaf0f9): fondo de la sección de comunidad y hover de filas.
- **Tinta** (#0e1b38): texto principal.
- **Gris Pizarra** (#4a5774): texto secundario, detalles y horarios.
- **Filete** (#cfd8e8): líneas divisorias.
- **Blanco Frío sobre Marino** (#dbe4f5): texto de lectura sobre fondos oscuros.

### Named Rules
**The One Gold Rule.** El dorado señala la acción de inscripción y el filete del hero; nunca decora.
**The Tinted Neutral Rule.** Ningún gris puro: todos los neutros llevan matiz azul del escudo.

## Typography

**Display Font:** Libre Caslon Text (con Iowan Old Style, Georgia, serif)
**Body Font:** Public Sans Variable (con system-ui, sans-serif)

**Character:** Serifa de edición clásica para la voz institucional y sans neutra de uso público para todo lo que se lee o se pulsa.

### Hierarchy
- **Display** (400, clamp(2.5rem, 4.6vw, 4rem), 1.06): titular del hero, máximo 17ch.
- **Headline** (400, clamp(2rem, 3.6vw, 3rem), 1.12): títulos de sección.
- **Title** (400, 1.625rem, 1.2): nombres de sede, etapas, bloques de contacto.
- **Body** (400, 1.0625rem, 1.6): texto corrido, medida máxima ~38rem.
- **Label** (700, 0.9375rem–1rem): botones, navegación y enlaces destacados; horarios con numerales tabulares.

### Named Rules
**The Serif Speaks Rule.** Los títulos son serifa; lo que se pulsa es sans.
**The Tabular Hours Rule.** Los horarios se componen con numerales tabulares.

## Layout

Contenedor de 1240px con gutter fluido (1.25rem a 3rem). Secciones con ritmo vertical de 4rem a 7rem. Los títulos de sección ocupan la columna izquierda (5fr) y el texto introductorio la derecha (6fr); el directorio de carreras repite esa proporción: sede a la izquierda, carreras a la derecha. A 75rem el menú pasa a desplegable, a 56rem todo colapsa a una columna, a 36rem los accesos rápidos se apilan.

## Elevation & Depth

Plano por defecto. La jerarquía se expresa con filetes, cambios de fondo (papel, velo azul, marino) y la fotografía. La única sombra es la del menú móvil desplegado (`0 12px 24px -12px rgba(11, 31, 75, 0.25)`).

### Named Rules
**The Hairline Rule.** La estructura la dan filetes de 1px, y 2px marino al abrir un bloque; no se agregan sombras ni tarjetas.

## Shapes

Esquinas de 2px en botones y etiquetas; el resto es recto. Bloques separados por filetes horizontales. Las imágenes son rectángulos sin máscara.

## Components

### Buttons
- **Shape:** casi recto (2px).
- **Primary:** fondo Dorado Pergamino, texto Azul Tinta Marino, 700, padding 15px 26px; hover aclara a #f7cb5a.
- **Ghost / Line:** borde de 1.5px blanco translúcido sobre fondos oscuros; hover con velo blanco del 12–14%.
- **Focus:** anillo de 3px cobalto sobre claro y dorado sobre oscuro, desplazado 3px.

### Navigation
- Barra superior marino con aviso de dependencia y tres enlaces de trámites. Cabecera blanca fija con escudo, nombre en serifa y menú en sans 600; subrayado cobalto al pasar. En móvil, botón de menú con borde marino y lista desplegable.

### Filas de carreras (componente distintivo)
- Directorio por sede: título de sede en serifa y dirección a la izquierda; lista de carreras con filetes a la derecha. Hover: fondo velo azul, sangría de 0.75rem y flecha que avanza 4px. Etiqueta "Nueva" en cuadro de 2px con borde filete.

### Etapas de inscripción
- Lista ordenada sobre marino: numeral serif dorado de 3.75rem, título serif, texto y un botón por etapa, separados por filetes translúcidos.

## Do's and Don'ts

### Do:
- **Do** reservar el dorado para el botón principal y el filete bajo la fotografía.
- **Do** componer los listados con filetes y filas, no con tarjetas.
- **Do** mantener los títulos en Libre Caslon Text y lo funcional en Public Sans.
- **Do** teñir de azul los neutros y mantener el contraste AA.

### Don't:
- **Don't** agregar sombras, glassmorphism ni degradés en el texto.
- **Don't** introducir ilustraciones ni íconos decorativos; las flechas son trazos geométricos.
- **Don't** usar imágenes generadas como si fueran fotos del instituto.

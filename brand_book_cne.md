# BRAND_BOOK.md — CNE

> Guía oficial de identidad visual y desarrollo UI/UX  
> Fuente principal: Libro de Marca CNE  
> Versión: 1.1 — Revisada con correcciones de accesibilidad y tipografía web

---

# 1. Identidad de Marca

## Nombre
CNE

## Objetivo del documento
Este archivo define las reglas visuales, tipográficas y de desarrollo que deben respetarse en cualquier sistema, aplicación, software, dashboard, landing page o sitio web desarrollado para la marca CNE.

Toda IA, desarrollador o diseñador debe utilizar este documento como fuente principal de verdad para decisiones de branding y frontend.

---

# 2. Personalidad de Marca

## La marca debe transmitir
- Profesionalismo
- Confianza
- Modernidad
- Claridad
- Institucionalidad
- Tecnología
- Cercanía

## Estilo visual
- Corporativo moderno
- Minimalista
- Limpio
- Alto contraste visual
- Interfaces ordenadas
- Uso consistente del color institucional

## Evitar
- Estilos infantiles
- Saturación de colores
- Sombras exageradas
- Gradientes agresivos
- Interfaces recargadas
- Animaciones excesivas

---

# 3. Colores Oficiales

## Color Primario Azul

| Tipo | Valor |
|---|---|
| HEX | #133C65 |
| RGB | 19, 60, 101 |
| CMYK | 100%, 81%, 35%, 23% |
| Contraste sobre blanco | ~10.5:1 ✅ WCAG AAA |

### Uso
- Headers
- Sidebar
- Navegación
- Botones principales
- Elementos institucionales
- Footer
- Títulos importantes

---

## Color Primario Naranja

| Tipo | Valor |
|---|---|
| HEX (identidad visual) | #F5831F |
| RGB | 245, 131, 31 |
| CMYK | 0%, 59%, 100%, 0% |
| Contraste sobre blanco | ~3.0:1 ⚠️ Solo elementos grandes |
| HEX (variante accesible texto) | #A85400 |
| Contraste variante sobre blanco | ~5.2:1 ✅ WCAG AA |

### Uso del naranja institucional `#F5831F`
- Íconos y elementos gráficos decorativos
- Bordes y acentos visuales
- Call To Action (botones grandes ≥ 18px bold)
- Indicadores activos
- Elementos de énfasis visual

### Uso de la variante accesible `#A85400`
- Texto de enlace sobre fondo blanco
- Etiquetas y badges con texto pequeño
- Cualquier uso tipográfico en color naranja

### Regla de contraste naranja
> Usar `#F5831F` únicamente para texto blanco sobre fondo naranja en botones o componentes grandes. Para texto naranja sobre fondo claro, usar siempre `#A85400`.

---

# 4. Colores de Enlace

## Gris Corporativo

| Tipo | Valor |
|---|---|
| HEX | #707173 |
| RGB | 112, 113, 115 |
| Contraste sobre blanco | ~4.6:1 ✅ WCAG AA |

### Uso
- Texto secundario
- Bordes
- Fondos suaves
- Elementos neutros

---

## Blanco

| Tipo | Valor |
|---|---|
| HEX | #FFFFFF |
| RGB | 255, 255, 255 |

### Uso
- Fondos principales
- Espacios negativos
- Cards
- Layouts limpios

---

## Azul Grisáceo

| Tipo | Valor |
|---|---|
| HEX | #728196 |
| RGB | 113, 129, 150 |

### Uso
- Fondos secundarios
- Secciones informativas
- Estados deshabilitados
- Componentes auxiliares

---

# 5. Reglas de Color

## Permitido
- Uso de degradaciones del azul y naranja
- Degradaciones en múltiplos de 10%
- Uso consistente de paleta institucional
- Uso de la variante accesible `#A85400` donde se requiera contraste AA en texto naranja

## NO permitido
- Alterar colores oficiales
- Cambiar tonalidades arbitrariamente
- Degradar colores de enlace
- Usar colores fuera de la identidad visual sin aprobación
- Usar `#F5831F` como color de texto sobre fondo blanco (no cumple WCAG AA para texto pequeño)

---

# 6. Tipografía Oficial

## Fuente principal (licenciada / impresión)
**Avenir** — Fuente comercial de pago (Monotype). Usar en materiales impresos, PDF institucionales y cuando se cuente con la licencia activa (vía Adobe Fonts).

## Fuente principal web (open source)
**Plus Jakarta Sans** — Google Fonts  
Geométrica humanista, proporciones muy similares a Avenir. Gratuita, de código abierto y optimizada para pantalla.

```html
<!-- Cargar en <head> del proyecto -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;700;800&display=swap" rel="stylesheet">
```

```css
/* Variable CSS global */
--font-brand: 'Plus Jakarta Sans', Arial, sans-serif;
```

### Equivalencia de pesos

| Avenir | Plus Jakarta Sans |
|---|---|
| Avenir Light | Plus Jakarta Sans 300 |
| Avenir Book | Plus Jakarta Sans 400 |
| Avenir Medium | Plus Jakarta Sans 500 |
| Avenir Heavy | Plus Jakarta Sans 700 |
| Avenir Black | Plus Jakarta Sans 800 |

---

## Fuente fallback final
**Arial** — Usar únicamente si ni Avenir ni Plus Jakarta Sans están disponibles.

### Stack completo CSS
```css
font-family: 'Avenir', 'Plus Jakarta Sans', Arial, sans-serif;
```

---

# 7. Reglas Tipográficas

## Headers
- Peso: 700 (Heavy) / 800 (Black)
- Uso institucional
- Espaciado limpio
- `letter-spacing: -0.01em` a `-0.02em` para tamaños grandes

## Texto general
- Peso: 400 (Book) o 500 (Medium)
- Alta legibilidad
- `line-height: 1.6` para cuerpo de texto
- `line-height: 1.3` para headings

## Botones
- Peso: 500 (Medium) o 700 (Heavy)
- Texto claro y directo
- `letter-spacing: 0.01em`

## Escala tipográfica recomendada

```ts
xs:   12px
sm:   14px
base: 16px
lg:   18px
xl:   20px
2xl:  24px
3xl:  30px
4xl:  36px
5xl:  48px
```

---

# 8. Lineamientos UI/UX

## Diseño General
Las interfaces deben:
- Ser limpias
- Tener mucho espacio en blanco
- Priorizar legibilidad
- Mantener jerarquía visual clara
- Ser responsive
- Mantener consistencia entre módulos

---

## Bordes
- Border radius recomendado: 10px–16px

---

## Sombras
- Muy suaves
- Minimalistas
- Evitar sombras pesadas

```css
/* Sombras permitidas */
shadow-sm:  0 1px 2px rgba(19, 60, 101, 0.06)
shadow-md:  0 4px 12px rgba(19, 60, 101, 0.10)
shadow-lg:  0 8px 24px rgba(19, 60, 101, 0.12)
```

---

## Botones

### Primario
- Fondo: azul institucional `#133C65`
- Texto: blanco `#FFFFFF`
- Border radius: 10px–12px

### Secundario / CTA
- Fondo: naranja institucional `#F5831F`
- Texto: blanco `#FFFFFF`
- Border radius: 10px–12px

### Hover
- Primario: `#0D2D4D` (oscurecer 15%)
- Secundario: `#D96A0A` (oscurecer 15%)
- Transición: `150ms ease-in-out`

### Focus (accesibilidad)
- Outline: `3px solid #F5831F`
- Outline offset: `2px`
- Nunca eliminar el estado focus (no `outline: none` sin alternativa visible)

### Disabled
- Fondo: `#C5CDD6`
- Texto: `#707173`
- Cursor: `not-allowed`
- Sin hover ni efectos interactivos

### Loading
- Spinner inline en color blanco
- Texto reemplazado o acompañado de indicador
- Botón deshabilitado durante carga (`disabled + aria-busy="true"`)

---

## Formularios

### Input normal
- Borde: `1px solid #C5CDD6`
- Border radius: 10px
- Padding: `12px 16px`
- Fondo: `#FFFFFF`

### Focus
- Borde: `2px solid #133C65`
- Sombra: `0 0 0 3px rgba(19, 60, 101, 0.15)`

### Error
- Borde: `2px solid #D32F2F`
- Mensaje de error en rojo `#D32F2F` debajo del input
- Ícono de error alineado al campo

### Éxito / Validado
- Borde: `2px solid #2E7D32`
- Ícono de check en verde `#2E7D32`

### Disabled
- Fondo: `#F4F6F8`
- Texto: `#707173`
- Borde: `1px solid #C5CDD6`
- Cursor: `not-allowed`

---

# 9. Desarrollo Frontend

## Stack preferido
- React
- Next.js
- TypeScript
- TailwindCSS

---

## Librerías recomendadas
- shadcn/ui
- Radix UI
- Framer Motion (uso moderado, sin animaciones excesivas)
- Lucide Icons

---

## Reglas de código

### Obligatorio
- Componentes reutilizables
- Código modular
- Clean Architecture
- Responsive Design
- Mobile First
- Accesibilidad WCAG AA
- Fuente web cargada desde Google Fonts con `display=swap`

### Evitar
- CSS inline
- Componentes gigantes
- Colores hardcodeados fuera del sistema de tokens
- Uso inconsistente de spacing
- Eliminar estados focus sin alternativa accesible

---

# 10. Tokens de Diseño

## Border Radius

```ts
sm:  8px
md:  12px
lg:  16px
xl:  24px
```

## Espaciado

```ts
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
3xl: 64px
```

## Sombras

```ts
sm:  '0 1px 2px rgba(19, 60, 101, 0.06)'
md:  '0 4px 12px rgba(19, 60, 101, 0.10)'
lg:  '0 8px 24px rgba(19, 60, 101, 0.12)'
```

---

# 11. Tailwind Theme Recomendado

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary:        '#133C65',
        'primary-dark': '#0D2D4D',
        secondary:      '#F5831F',
        'secondary-dark': '#D96A0A',
        'secondary-accessible': '#A85400',
        neutral:        '#707173',
        'soft-blue':    '#728196',
        'surface':      '#F4F6F8',
        white:          '#FFFFFF',
        error:          '#D32F2F',
        success:        '#2E7D32',
      },
      fontFamily: {
        brand: ['Avenir', 'Plus Jakarta Sans', 'Arial', 'sans-serif'],
        web:   ['Plus Jakarta Sans', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        sm:  '8px',
        md:  '12px',
        lg:  '16px',
        xl:  '24px',
      },
      boxShadow: {
        sm:  '0 1px 2px rgba(19, 60, 101, 0.06)',
        md:  '0 4px 12px rgba(19, 60, 101, 0.10)',
        lg:  '0 8px 24px rgba(19, 60, 101, 0.12)',
      },
    },
  },
}

export default config
```

---

# 12. Dark Mode

El dark mode **no está definido en la identidad visual oficial** de CNE en su versión actual.

Si se requiere en un proyecto específico, debe aprobarse con el equipo de marca y seguir estas directrices mínimas:

| Elemento | Light | Dark (referencia) |
|---|---|---|
| Fondo principal | `#FFFFFF` | `#0F1C2E` |
| Superficie card | `#F4F6F8` | `#1A2D45` |
| Texto principal | `#133C65` | `#E8EFF7` |
| Texto secundario | `#707173` | `#9BAABB` |
| Acento primario | `#133C65` | `#3A7DBF` |
| Acento secundario | `#F5831F` | `#F5831F` |

> Por defecto, desarrollar en **modo claro (light)**. El dark mode es opcional y requiere aprobación.

---

# 13. Prompt Base para Claude Code

```txt
Usa BRAND_BOOK.md como autoridad principal para cualquier decisión visual o frontend.

RESPETA:
- Colores institucionales (primario #133C65, secundario #F5831F / accesible #A85400)
- Tipografía: Plus Jakarta Sans (web) / Avenir (impresión)
- Diseño corporativo moderno
- Espaciado limpio
- Interfaces minimalistas
- Componentes reutilizables
- Responsive design, Mobile First
- Accesibilidad WCAG AA en todos los estados (normal, hover, focus, disabled, error)

NO inventes estilos fuera de la identidad visual.
NO elimines el estado focus de elementos interactivos.
NO uses #F5831F como color de texto pequeño sobre blanco.

Todo componente debe verse institucional, moderno y profesional.
```

---

# 14. Estructura Recomendada del Proyecto

```txt
/docs
   BRAND_BOOK.md
   DESIGN_SYSTEM.md
   UI_COMPONENT_RULES.md
   FRONTEND_GUIDELINES.md

/src
   /components
      /ui          ← componentes base (Button, Input, Badge...)
      /layout      ← Header, Sidebar, Footer
      /shared      ← componentes reutilizables de negocio
   /styles
      globals.css  ← variables CSS y fuente web
      tokens.ts    ← tokens de diseño exportados
```

---

# 15. Prioridad de Diseño

En caso de conflicto:
1. BRAND_BOOK.md
2. DESIGN_SYSTEM.md
3. Requerimiento funcional
4. Preferencia del desarrollador

---

# 16. Observaciones Finales

La identidad visual de CNE debe mantenerse consistente en:
- Sistemas internos
- Aplicaciones móviles
- Landing pages
- Dashboards
- Presentaciones
- Material institucional
- Componentes UI
- Experiencias digitales

Cualquier desviación del branding debe ser aprobada previamente.

### Cambios en versión 1.1
- Corregido contraste del naranja: variante accesible `#A85400` para texto
- Tipografía web definida: **Plus Jakarta Sans** (Google Fonts, open source)
- Agregados estados: focus, disabled, loading, error, éxito en botones y formularios
- Agregada sección de dark mode con lineamientos mínimos
- Expandida escala tipográfica y de espaciado
- Tailwind config completo con todas las variables
- Sombras con tinte azul institucional

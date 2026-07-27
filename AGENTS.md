# Arkanoid — memoria del proyecto

## Qué es

Juego de Arkanoid en **HTML, CSS y JavaScript vanilla**, sin dependencias ni bundlers. El jugador abre el juego en el navegador y juega directamente.

**Estado actual:** MVP jugable con animaciones de explosión, 5 niveles, sonidos y progresión (SPEC 01–03 implementadas). Nuevas features grandes siguen el workflow spec-driven descrito abajo.

## Cómo ejecutar

No hay build ni tests automatizados. Para probar:

```bash
# Opción 1: servidor local (recomendado; evita problemas de CORS con assets)
npx serve .
# o: python -m http.server 8080

# Opción 2: abrir index.html directamente (puede fallar la carga de assets por CORS)
```

Abrir `http://localhost:3000` (o el puerto que indique el servidor) y verificar la consola del navegador.

## Estructura del repo

```
04-arkanoid/
├── index.html              # punto de entrada; canvas 800×600
├── css/
│   └── game.css            # estilos del juego
├── js/
│   ├── main.js             # game loop, orquestación
│   ├── state.js            # estado central y reset
│   ├── constants.js        # dimensiones, velocidades, puntuación
│   ├── input.js            # mouse, teclado, pausa
│   ├── ball.js             # física de la pelota
│   ├── blocks.js           # grilla de bloques
│   ├── collisions.js       # colisiones paleta/pelota/bloques
│   ├── render.js           # dibujo en canvas
│   ├── explosions.js       # animaciones al romper bloques
│   ├── levels.js           # 5 niveles predefinidos
│   └── audio.js            # sonidos de rebote y rotura
├── assets/
│   ├── spritesheet-breakout.png
│   ├── spritesheet.js      # carga y dibuja sprites (no editar salvo spec)
│   └── sounds/
│       ├── ball-bounce.mp3
│       └── break-sound.mp3
├── specs/                  # contratos spec-driven (ver sección Workflow)
│   ├── .spec-config.yml    # config del workflow (ramas git)
│   ├── 01-mvp-arkanoid.md
│   ├── 02-block-explosion-animation.md
│   └── 03-levels-and-sounds.md
├── .agents/skills/         # skills de Cursor (spec, spec-impl)
├── .claude/skills/         # copia equivalente para Claude Code
└── AGENTS.md               # este archivo
```

## Assets existentes

- **`assets/spritesheet.js`**: expone `loadSpritesheet(cb)`, `drawSprite(ctx, name, x, y, w, h)`, `drawFrame(ctx, frame, x, y, w, h)` y `EXPLOSION_FRAMES` por color. Sprites: `paddle`, `ball`, `block_{color}` (gray, red, yellow, cyan, magenta, hotpink, green).
- **`assets/spritesheet-breakout.png`**: imagen fuente del spritesheet.
- **`assets/sounds/`**: `ball-bounce.mp3`, `break-sound.mp3`.

Reutilizar `spritesheet.js`; no duplicar coordenadas de sprites en otro archivo.

## Convenciones de código

- **Cero dependencias**: sin npm packages, frameworks ni bundlers para el juego.
- **Canvas 2D** para renderizado del juego.
- **Estilo JS** (según `spritesheet.js`): camelCase, comillas simples, espacios dentro de paréntesis `function foo( bar )`, punto y coma al final de sentencias.
- **Coordenadas**: origen arriba-izquierda; velocidades en píxeles por frame salvo que una spec diga lo contrario.
- **Idioma**: comentarios y UI del juego en español; nombres de variables/funciones en inglés.
- **Alcance mínimo**: no agregar features, abstracciones o dependencias no pedidas.

## Arquitectura

- Un solo canvas (`#game`, 800×600 px).
- Game loop con `requestAnimationFrame` en `js/main.js`.
- Estado centralizado en `state` (`js/state.js`): fase del juego, puntuación, vidas, nivel, paleta, pelota, bloques, explosiones activas.
- Módulos JS separados por responsabilidad (input, colisiones, render, audio, niveles, etc.).
- Scripts cargados en orden fijo desde `index.html` (sin módulos ES ni bundler).

## Workflow spec-driven

Este proyecto usa **specs numeradas** en `specs/` como contrato entre diseño e implementación. Una spec vaga produce código improvisado; la definición es deliberadamente lenta, la ejecución rápida.

### Cuándo usar spec vs implementar directo

| Situación | Acción |
|-----------|--------|
| Feature grande, nueva área del sistema, varias decisiones de diseño | Crear spec con skill `spec` → aprobar → implementar con `spec-impl` |
| Bug fix, ajuste pequeño, cambio acotado en código existente | Implementar directo, sin spec nueva |
| Algo mencionado en conversación pero fuera de la spec activa | Anotar para una spec futura; **no** implementar "de paso" |

### Skills disponibles

| Skill | Ubicación | Uso |
|-------|-----------|-----|
| `spec` | `.agents/skills/spec/` (y `.claude/skills/spec/`) | Diseñar una spec antes de codear. **No escribe código.** |
| `spec-impl` | `.agents/skills/spec-impl/` (y `.claude/skills/spec-impl/`) | Implementar una spec cuyo estado sea **Approved/Aprobado**. |

Plantilla de referencia: `.agents/skills/spec/template.md`.

### Flujo completo

```
/spec [descripción]     →  Fase de preguntas, spec sección por sección
                         →  Guardar en specs/NN-slug.md con estado Draft

(revisión humana)       →  Cambiar estado a Approved / Aprobado

/spec-impl NN-slug      →  Validar estado Approved
                         →  Crear rama spec-NN-slug (según config)
                         →  Implementar paso a paso del plan
                         →  Verificar criterios de aceptación
                         →  Cambiar estado a Implemented / Implementado
```

**Reglas del flujo:**

- Leer `specs/` y las **dos specs más recientes** antes de implementar algo grande.
- Las specs son el contrato: si algo no está en la spec activa, no se implementa.
- **Nunca** marcar una spec como `Approved` automáticamente; eso lo hace el humano.
- **Nunca** escribir código durante `/spec`; solo el archivo `.md` al final.
- Durante `/spec-impl`, implementar lo acordado aunque parezca subóptimo; los cambios van a la spec, no al código por sorpresa.
- Al terminar la implementación, el humano actualiza el estado a `Implemented` y hace el commit final.

### Estados de una spec

Estados válidos (usar un idioma consistente en todo el repo; aquí usamos español):

| Estado | Significado |
|--------|-------------|
| `Draft` / `Borrador` | En diseño; no implementar |
| `In review` / `En revisión` | Pendiente de revisión humana |
| `Approved` / `Aprobado` | Listo para `/spec-impl` |
| `Implemented` / `Implementado` | Código entregado y criterios verificados |
| `Obsolete` / `Obsoleto` | Ya no aplica |

`/spec-impl` **solo** continúa si el estado significa "aprobado". Cualquier otro estado detiene la ejecución.

### Estructura de una spec

Cada spec sigue la plantilla en `.agents/skills/spec/template.md`:

1. **Cabecera** — estado, dependencias, fecha, objetivo en una sola frase.
2. **Alcance** — qué incluye y qué **no** incluye (ambos obligatorios).
3. **Modelo de datos** — estructuras concretas con nombres reales; o declarar que reutiliza una spec anterior.
4. **Plan de implementación** — pasos numerados; cada paso deja el sistema funcional y ejecutable.
5. **Criterios de aceptación** — checklist booleano verificable (no "que funcione bien").
6. **Decisiones** — qué se eligió, qué se descartó y por qué.
7. **Riesgos** (opcional) — solo si hay riesgos no obvios.
8. **Qué no está en esta spec** (refuerzo al final) — repetición explícita del fuera de alcance.

Convenciones de redacción: nombres de archivo concretos (`js/levels.js`), sin TODOs sin resolver, sin código ejecutable largo.

### Ramas git y configuración

- Convención de rama por spec: `spec-NN-slug` (ej. `spec-01-mvp-arkanoid`).
- Config en `specs/.spec-config.yml`:

```yaml
AutoCreateBranch: true   # default: /spec-impl crea y cambia a la rama sin preguntar
                         # false: pide confirmación [y/N] antes de crear la rama
```

### Inventario de specs

| Spec | Estado | Resumen |
|------|--------|---------|
| `01-mvp-arkanoid` | Implementado | MVP jugable: paleta, pelota, bloques, vidas, puntuación, overlays |
| `02-block-explosion-animation` | Implementado | Animación sprite al destruir bloques |
| `03-levels-and-sounds` | Implementado | 5 niveles, progresión, velocidad por nivel, sonidos |

La siguiente spec será `04-` con slug descriptivo (ej. `04-powerups.md`).

## Restricciones

- No introducir React, Vite, Webpack, TypeScript ni librerías de juego.
- No editar `assets/spritesheet.js` salvo que la spec lo requiera explícitamente.
- No crear commits ni PRs salvo que el usuario lo pida.
- No marcar specs como `Approved` automáticamente; eso lo hace el usuario.
- No expandir scope más allá de lo pedido o de lo que dice la spec activa.

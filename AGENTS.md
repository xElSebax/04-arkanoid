# Arkanoid — memoria del proyecto

## Qué es

Juego de Arkanoid en **HTML, CSS y JavaScript vanilla**, sin dependencias ni bundlers. El jugador abre el juego en el navegador y juega directamente. **El juego aún no está implementado**; solo existen assets y utilidades de sprites.

## Cómo ejecutar

No hay build ni tests automatizados. Para probar:

```bash
# Opción 1: servidor local (recomendado; evita problemas de CORS con assets)
npx serve .
# o: python -m http.server 8080

# Opción 2: abrir index.html directamente (cuando exista)
```

Abrir `http://localhost:3000` (o el puerto que indique el servidor) y verificar la consola del navegador.

## Estructura del repo

```
04-arkanoid/
├── index.html          # (pendiente) punto de entrada
├── css/                # (pendiente) estilos
├── js/                 # (pendiente) lógica del juego
├── assets/
│   ├── spritesheet-breakout.png
│   ├── spritesheet.js  # carga y dibuja sprites (ya existe)
│   └── sounds/
│       ├── ball-bounce.mp3
│       └── break-sound.mp3
├── specs/              # specs aprobadas (workflow spec-driven)
├── .agents/skills/     # skills de Cursor (spec, spec-impl)
├── .claude/skills/     # copia equivalente para Claude Code
└── AGENTS.md           # este archivo
```

## Assets existentes

- **`assets/spritesheet.js`**: expone `loadSpritesheet(cb)`, `drawSprite(ctx, name, x, y, w, h)` y `drawFrame(ctx, frame, x, y, w, h)`. Sprites: `paddle`, `ball`, `block_{color}` (gray, red, yellow, cyan, magenta, hotpink, green). Explosiones por color en `EXPLOSION_FRAMES`.
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

## Workflow spec-driven

Este proyecto usa specs numeradas en `specs/`. Skills disponibles:

| Skill | Ubicación | Uso |
|-------|-----------|-----|
| `spec` | `.agents/skills/spec/` | Diseñar una spec antes de codear. **No escribe código.** |
| `spec-impl` | `.agents/skills/spec-impl/` | Implementar una spec con estado **Approved/Aprobado**. |

Flujo: `/spec` → revisar y aprobar spec → `/spec-impl NN-slug`.

Leer `specs/` y las dos specs más recientes antes de implementar algo grande. Las specs son el contrato; si algo no está en la spec, no se implementa "de paso".

## Restricciones

- No introducir React, Vite, Webpack, TypeScript ni librerías de juego.
- No editar `assets/spritesheet.js` salvo que la spec lo requiera explícitamente.
- No crear commits ni PRs salvo que el usuario lo pida.
- No marcar specs como `Approved` automáticamente; eso lo hace el usuario.

## Arquitectura prevista

Un solo canvas, game loop con `requestAnimationFrame`, estado centralizado en un objeto `state`, módulos JS separados por responsabilidad (input, colisiones, render, audio). La estructura exacta de archivos se define en la primera spec (`01-mvp-arkanoid` o similar).

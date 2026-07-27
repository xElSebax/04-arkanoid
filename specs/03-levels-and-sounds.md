# SPEC 03 — Niveles, progresión y sonidos

> **Estado:** Implementado
> **Depende de:** SPEC 01, SPEC 02
> **Fecha:** 2026-07-27
> **Objetivo:** Añadir 5 niveles con patrones de bloques distintos y velocidad de pelota progresiva (+10% por nivel), transición automática entre niveles con selector en pausa, y sonidos de rebote y rotura usando los MP3 existentes.

## Alcance

**Incluye:**

- **5 niveles predefinidos** en `js/levels.js`: cada uno define un patrón de bloques distinto sobre la grilla 6×13 (celdas vacías = sin bloque). El nivel actual del juego (grilla llena 6×13) pasa a ser el **nivel 1**.
- **Progresión:** campo `state.level` (1–5). Al destruir todos los bloques de un nivel < 5, tras **~1 s** de retardo se carga el siguiente nivel automáticamente (pelota en la paleta, `phase: 'ready'`). Las **vidas y el puntaje se mantienen** entre niveles.
- **Velocidad de pelota por nivel:** magnitud base `BALL_SPEED × (1 + 0.1 × (level − 1))` al lanzar y al normalizar velocidad tras rebotes en paleta (nivel 1 = 100%, 2 = 110%, …, 5 = 140%).
- **Victoria** solo al completar el **nivel 5**; overlay actual de victoria + `R` para reiniciar desde el nivel 1.
- **Game over** sin cambios respecto al SPEC 01; `R` reinicia partida completa (nivel 1, vidas y puntaje iniciales).
- **Selector de nivel en pausa:** con `phase === 'paused'`, teclas **1–5** cargan ese nivel al instante (misma vidas/puntaje, bloques del nivel elegido, pelota en paleta). Overlay de pausa actualizado con la instrucción.
- **HUD:** mostrar número de nivel en pantalla (p. ej. junto a puntos/vidas).
- **Sonidos** con los MP3 existentes, módulo `js/audio.js`:
  - `ball-bounce.mp3` al rebotar en paredes o paleta.
  - `break-sound.mp3` al destruir un bloque.
- Precarga de audio al iniciar; reproducción con `HTMLAudioElement` (sin librerías). Sin mute ni controles de volumen.
- Integración en `js/collisions.js` (rebotes y rotura), `js/state.js`, `js/blocks.js`, `js/input.js`, `js/render.js`, `js/main.js` e `index.html`.

**Fuera de alcance (specs futuras):**

- Música de fondo, mute, volumen o menú de opciones de audio.
- Niveles adicionales, generación procedural o editor de niveles.
- Power-ups, bloques multi-golpe, bloques especiales.
- Cambios en `assets/spritesheet.js`.
- High scores o persistencia en `localStorage`.
- Overlay intermedio de “nivel completado” (solo retardo breve antes de cargar el siguiente).
- Tests automatizados ni herramientas de build.

## Modelo de datos

### Estado central (`js/state.js`)

```js
const state = {
  phase: 'ready',       // 'ready' | 'playing' | 'paused' | 'victory' | 'gameOver'
  level: 1,             // 1–5
  transitionRemainingMs: 0, // > 0: esperando ~1 s antes de cargar el siguiente nivel
  score: 0,
  lives: LIVES_START,
  paddle: { /* sin cambios */ },
  ball: { /* sin cambios */ },
  blocks: [ /* { x, y, w, h, color, alive } */ ],
  explosions: [ /* sin cambios SPEC 02 */ ],
};
```

Convenciones:

- `initState()` / `resetGame()` arrancan en `level: 1`, `transitionRemainingMs: 0`.
- `loadLevel( n )` (en `js/blocks.js` o `js/levels.js`): asigna `state.level = n`, regenera bloques del nivel `n`, resetea pelota en paleta (`attached: true`, `vx/vy: 0`), `phase: 'ready'`. No toca `score` ni `lives`.
- Al limpiar un nivel < 5: `transitionRemainingMs = 1000` y la pelota se detiene; no se cambia `phase` a `'victory'`.
- Al limpiar el nivel 5: `phase = 'victory'` (comportamiento actual).
- En pausa, teclas 1–5 llaman `loadLevel( n )` y cancelan `transitionRemainingMs` si estaba activo.

### Velocidad de pelota por nivel

```js
const LEVEL_SPEED_BONUS = 0.1; // +10% por nivel

function getBallSpeedForLevel( level ) {
  return BALL_SPEED * ( 1 + LEVEL_SPEED_BONUS * ( level - 1 ) );
}
// nivel 1 → 5.0, 2 → 5.5, 3 → 6.0, 4 → 6.5, 5 → 7.0
```

- Al **lanzar** (`launchBall`): `ball.vy = -getBallSpeedForLevel( state.level )`.
- Tras rebote en **paleta** (`checkPaddleCollision`): usar `getBallSpeedForLevel( state.level )` en lugar de `BALL_SPEED` fijo.
- Tras rebotes en paredes/bloques: conservar magnitud actual (no re-normalizar cada frame); solo el lanzamiento y el rebote en paleta fijan la velocidad objetivo del nivel.

### Definición de niveles (`js/levels.js`)

```js
// Matriz 6 filas × 13 columnas. null = celda vacía; string = color del bloque.
const LEVELS = [
  {
    id: 1,
    name: 'Nivel 1',
    grid: [
      /* fila 0 */ [ 'red', 'red', ... ],   // 13 celdas — grilla completa (nivel actual)
      /* filas 1–5 */ ...
    ],
  },
  { id: 2, name: 'Nivel 2', grid: [ /* patrón con huecos */ ] },
  { id: 3, name: 'Nivel 3', grid: [ /* otro patrón */ ] },
  { id: 4, name: 'Nivel 4', grid: [ /* otro patrón */ ] },
  { id: 5, name: 'Nivel 5', grid: [ /* otro patrón */ ] },
];
```

- Colores válidos: los mismos de `BLOCK_ROW_COLORS` (`'red'`, `'yellow'`, `'cyan'`, `'magenta'`, `'hotpink'`, `'green'`).
- `generateBlocksFromLevel( levelIndex )` lee `LEVELS[levelIndex - 1].grid`, coloca bloques solo donde la celda no es `null`, con posición calculada igual que hoy (`BLOCK_W`, `BLOCK_H`, centrado horizontal, `BLOCK_TOP_MARGIN`).
- Nivel 1 = grilla llena idéntica al juego actual.

### Audio (`js/audio.js`)

```js
const SOUND_PATHS = {
  bounce: 'assets/sounds/ball-bounce.mp3',
  break: 'assets/sounds/break-sound.mp3',
};

let audioReady = false;
const sounds = { bounce: null, break: null };

function initAudio( onReady ) { /* precarga ambos Audio; onReady al terminar */ }
function playBounce() { /* playBounce si audioReady */ }
function playBreak() { /* playBreak si audioReady */ }
```

- Precarga en paralelo con el spritesheet al arrancar (`main.js`).
- `playBounce()` / `playBreak()`: clonar o `currentTime = 0` antes de `.play()` para permitir solapamiento rápido; errores de autopolicy se ignoran silenciosamente (sin UI).
- Sin estado de mute ni volumen en `state`.

### Constantes nuevas (`js/constants.js`)

```js
const LEVEL_COUNT = 5;
const LEVEL_TRANSITION_MS = 1000;
const LEVEL_SPEED_BONUS = 0.1;
```

## Plan de implementación

1. **Constantes y niveles.** Crear `js/levels.js` con `LEVELS` (5 matrices 6×13; nivel 1 = grilla completa actual) y `generateBlocksFromLevel( level )`. Añadir en `js/constants.js`: `LEVEL_COUNT`, `LEVEL_TRANSITION_MS`, `LEVEL_SPEED_BONUS`. Añadir `getBallSpeedForLevel( level )` en `js/ball.js` o `js/levels.js`. Registrar script en `index.html`. Prueba manual: consola sin errores; `generateBlocksFromLevel( 1 )` produce 78 bloques.

2. **Estado y carga de nivel.** En `js/state.js`: añadir `level` y `transitionRemainingMs`; refactorizar `generateBlocks()` → `loadLevel( n )` que regenera bloques, resetea pelota en paleta y pone `phase: 'ready'`. `initState()` / `resetGame()` llaman `loadLevel( 1 )`. Prueba manual: el juego arranca igual que antes (nivel 1 completo).

3. **Progresión entre niveles.** En `checkVictory()`: si quedan bloques vivos, salir; si `level < 5`, detener pelota y `transitionRemainingMs = LEVEL_TRANSITION_MS`; si `level === 5`, `phase = 'victory'`. En `main.js`, descontar `transitionRemainingMs` con `dt` cuando `> 0`; al llegar a 0, `loadLevel( level + 1 )`. Prueba manual: al limpiar nivel 1, tras ~1 s aparece nivel 2 con otro patrón; vidas y puntaje se mantienen.

4. **Velocidad por nivel.** Usar `getBallSpeedForLevel( state.level )` en `launchBall()` y `checkPaddleCollision()`. Prueba manual: en nivel 2+ la pelota se siente más rápida al lanzar y al rebotar en la paleta.

5. **Selector en pausa.** En `js/input.js`: con `phase === 'paused'`, teclas `1`–`5` llaman `loadLevel( n )` y ponen `transitionRemainingMs = 0`. Actualizar overlay de pausa en `render.js` con “Teclas 1–5: elegir nivel”. Prueba manual: pausar con Esc y saltar a cualquier nivel.

6. **HUD de nivel.** Mostrar “Nivel: N” en `render.js` junto a puntos/vidas. Prueba manual: el número cambia al avanzar o al elegir nivel en pausa.

7. **Módulo de audio.** Crear `js/audio.js` con `initAudio()`, `playBounce()`, `playBreak()`; precargar en `main.js` junto al spritesheet. Prueba manual: consola sin errores; audios precargados.

8. **Integrar sonidos.** `playBounce()` en rebotes de paredes y paleta (`ball.js`, `collisions.js`); `playBreak()` al destruir bloque (`collisions.js`). Prueba manual: se oyen rebote y rotura durante la partida; pausa no rompe el juego.

9. **Victoria y reinicio finales.** Confirmar que victoria solo ocurre en nivel 5; `R` en victoria/game over reinicia nivel 1 con vidas y puntaje iniciales. Prueba manual: flujo completo niveles 1→5, victoria, reinicio con `R`.

## Criterios de aceptación

- [x] El juego carga sin errores en consola con `js/levels.js` y `js/audio.js` registrados en `index.html`.
- [x] Existen exactamente 5 niveles predefinidos en `js/levels.js`; el nivel 1 es la grilla completa 6×13 actual.
- [x] Cada nivel tiene un patrón de bloques distinto (al menos un hueco en niveles 2–5).
- [x] El HUD muestra el número de nivel actual (1–5).
- [x] Al destruir todos los bloques del nivel 1–4, tras ~1 s se carga el siguiente nivel automáticamente.
- [x] Al cargar un nuevo nivel, la pelota vuelve a la paleta (`attached: true`) y `phase` es `'ready'`.
- [x] Las vidas y el puntaje se mantienen al pasar de un nivel al siguiente.
- [x] Al destruir todos los bloques del nivel 5 aparece el overlay de victoria (no antes).
- [x] La velocidad al lanzar en nivel N es `BALL_SPEED × (1 + 0.1 × (N − 1))` (verificable: nivel 5 notablemente más rápido que nivel 1).
- [x] Con `Esc` en pausa, las teclas 1–5 cargan el nivel correspondiente al instante.
- [x] El overlay de pausa indica que se puede elegir nivel con teclas 1–5.
- [x] `R` en victoria o game over reinicia partida completa en nivel 1 (3 vidas, puntaje 0).
- [x] Se reproduce `ball-bounce.mp3` al rebotar la pelota en paredes o paleta.
- [x] Se reproduce `break-sound.mp3` al destruir un bloque.
- [x] No hay controles de mute ni volumen en esta versión.
- [x] `assets/spritesheet.js` no se modifica.
- [x] Las explosiones (SPEC 02) siguen funcionando al romper bloques.

## Decisiones

- **Sí:** una sola spec para niveles y sonidos. Ambas features estaban diferidas desde SPEC 01/02 y se integran sin conflictos.
- **Sí:** 5 niveles predefinidos en `js/levels.js` como matrices 6×13 (`null` = vacío). Datos explícitos, fáciles de editar sin tocar lógica.
- **Sí:** nivel 1 = grilla actual completa. Migración sin cambio visual para quien ya jugó el MVP.
- **Sí:** velocidad +10% lineal por nivel sobre `BALL_SPEED`. Fórmula simple y predecible (nivel 5 = 140% de la base).
- **Sí:** vidas y puntaje acumulados entre niveles. Comportamiento clásico de Arkanoid.
- **Sí:** transición automática con retardo de 1 s, sin overlay intermedio. Flujo continuo; victoria solo en nivel 5.
- **Sí:** selector de nivel 1–5 solo en pausa. Herramienta de prueba sin menú ni pantalla extra.
- **Sí:** módulo `js/audio.js` con `HTMLAudioElement` y los dos MP3 existentes. Sin dependencias; alineado con `.cursor/rules/vanilla-web.mdc`.
- **Sí:** sonidos sin mute ni volumen. El usuario pidió explícitamente sin controles de audio por ahora.
- **Sí:** `getBallSpeedForLevel()` solo en lanzamiento y rebote de paleta. Rebotes en paredes/bloques conservan magnitud actual; evita re-normalizar cada frame.
- **No:** generación procedural o niveles infinitos. Complejidad innecesaria para 5 niveles fijos.
- **No:** overlay “Nivel completado” entre niveles. El retardo de 1 s es suficiente feedback.
- **No:** música de fondo ni assets de audio nuevos. Fuera de alcance; solo `ball-bounce.mp3` y `break-sound.mp3`.
- **No:** cambios en `spritesheet.js`. Convención del proyecto.
- **No:** persistencia de progreso (localStorage). Diferido a spec futura de high scores.

## Riesgos

| Riesgo | Mitigación |
| ------ | ---------- |
| Política de autoplay del navegador bloquea audio hasta interacción del usuario | Precargar en `initAudio()`; el primer sonido real ocurre tras clic/espacio (lanzamiento), que ya es interacción. Ignorar errores de `.play()` rechazado sin romper el juego. |
| Muchos `break-sound` simultáneos al romper bloques en ráfaga | Clonar el `Audio` o resetear `currentTime = 0` antes de cada `.play()`; aceptar solapamiento breve. |
| `checkVictory()` dispara transición mientras la pelota sigue en movimiento | Detener `ball.vx` y `ball.vy` al iniciar `transitionRemainingMs`; no avanzar física de pelota mientras `transitionRemainingMs > 0`. |
| Selector de nivel en pausa deja explosiones del nivel anterior | `loadLevel()` vacía `state.explosions` junto con los bloques. |
| Velocidad hardcodeada (`BALL_SPEED`) en código existente | Buscar todos los usos de `BALL_SPEED` en `ball.js` y `collisions.js` y sustituir solo donde corresponde (lanzamiento y paleta). |

## Qué **no** está en esta spec

- Música de fondo, mute, volumen o menú de opciones de audio.
- Niveles adicionales, generación procedural o editor de niveles.
- Power-ups, bloques multi-golpe o bloques especiales.
- High scores o persistencia en `localStorage`.
- Overlay intermedio de “nivel completado”.
- Cambios en `assets/spritesheet.js`.
- Tests automatizados ni herramientas de build.

Cada uno de esos puntos, si se implementa, va en su propia spec.

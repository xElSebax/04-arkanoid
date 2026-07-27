# SPEC 01 — MVP jugable de Arkanoid

> **Estado:** Aprobado
> **Depende de:** —
> **Fecha:** 2026-07-27
> **Objetivo:** Implementar un Arkanoid de un solo nivel, jugable con mouse y teclado, con vidas, puntuación y overlays de victoria y game over.

## Alcance

**Incluye:**

- Punto de entrada `index.html` con canvas 800×600 px centrado en la página.
- Game loop con `requestAnimationFrame` y estado centralizado en un objeto `state`.
- Paleta controlable con **mouse** (sigue la posición horizontal del cursor) y **teclado** (flechas izquierda/derecha).
- Pelota con física básica: rebote en paredes, paleta y bloques; ángulo según punto de impacto en la paleta.
- Lanzamiento de la pelota con clic o barra espaciadora; tras perder una vida, la pelota vuelve a la paleta hasta relanzar.
- Un nivel fijo: grilla de **6 filas × 13 columnas**, un color por fila (red, yellow, cyan, magenta, hotpink, green); todos los bloques se destruyen con **1 golpe**.
- Colisiones paleta/pelota/bloques y detección de pelota perdida (cae por debajo de la paleta).
- **3 vidas** al inicio; game over al perder la última.
- **Puntuación** visible en pantalla: +10 puntos por bloque destruido; sin persistencia.
- Overlay de **victoria** al destruir todos los bloques y overlay de **game over** al agotar vidas.
- Pausa con **Esc**; reinicio de partida con **R** desde victoria o game over.
- Módulos JS separados por responsabilidad (input, colisiones, render, etc.) y estilos en `css/`.
- Reutilización de `assets/spritesheet.js` sin duplicar coordenadas de sprites.

**Fuera de alcance (specs futuras):**

- Sonidos (rebote de pelota, rotura de bloque).
- Animación de explosión al romper bloques.
- Múltiples niveles o progresión entre pantallas.
- Power-ups y bloques especiales.
- Bloques de varios golpes (p. ej. grises).
- High scores o persistencia en `localStorage`.
- Menú principal, opciones o configuración de audio.
- Versión móvil o controles táctiles dedicados.
- Tests automatizados ni herramientas de build/bundlers.



## Modelo de datos

Constantes de juego:

```js
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const LIVES_START = 3;
const SCORE_PER_BLOCK = 10;
const BLOCK_COLS = 13;
const BLOCK_ROWS = 6;
const BLOCK_W = 32;
const BLOCK_H = 16;
const BALL_SIZE = 16;
const PADDLE_W = 120;   // escala visual respecto al sprite (162×14)
const PADDLE_H = 14;
const BALL_SPEED = 5;   // px/frame; magnitud base al lanzar
const PADDLE_KEYBOARD_SPEED = 8; // px/frame con flechas
```

Estado central:

```js
const state = {
  phase: 'ready', // 'ready' | 'playing' | 'paused' | 'victory' | 'gameOver'
  score: 0,
  lives: LIVES_START,
  paddle: { x: 0, y: 0, w: PADDLE_W, h: PADDLE_H },
  ball: {
    x: 0,
    y: 0,
    w: BALL_SIZE,
    h: BALL_SIZE,
    vx: 0,
    vy: 0,
    attached: true, // true = pegada a la paleta, esperando lanzamiento
  },
  blocks: [
    // { x, y, w, h, color, alive }
    // color: 'red' | 'yellow' | 'cyan' | 'magenta' | 'hotpink' | 'green'
  ],
};
```

Convenciones:

- Origen de coordenadas: esquina superior izquierda.
- Velocidades en píxeles por frame.
- `blocks` se genera al iniciar/reiniciar partida; `alive: false` marca bloques destruidos (o se eliminan del array — decisión de implementación).
- Colores por fila (fila 0 → `red`, 1 → `yellow`, 2 → `cyan`, 3 → `magenta`, 4 → `hotpink`, 5 → `green`).
- La grilla de bloques se centra horizontalmente en el canvas con margen superior fijo.



## Plan de implementación

1. **Esqueleto del proyecto.** Crear `index.html`, `css/game.css` y `js/main.js` con canvas 800×600 centrado, carga de `assets/spritesheet.js` y game loop con `requestAnimationFrame` que limpia el canvas. Prueba manual: abrir con servidor local, consola sin errores.
2. **Estado y render básico.** Añadir `js/constants.js`, `js/state.js` y `js/render.js`. Inicializar `state` con paleta centrada abajo y pelota pegada (`attached: true`). Dibujar paleta y pelota con `drawSprite`. Prueba manual: se ven paleta y pelota estáticas.
3. **Input de paleta.** Añadir `js/input.js`: mouse mueve la paleta en X (clamp dentro del canvas); flechas izquierda/derecha mueven la paleta; la pelota sigue la paleta mientras `attached`. Prueba manual: paleta responde a mouse y teclado.
4. **Lanzamiento y movimiento de pelota.** Al hacer clic o pulsar espacio con `phase === 'ready'` o `'playing'` y `attached === true`, lanzar pelota (`attached: false`, `vx`/`vy` con magnitud `BALL_SPEED`). Actualizar posición cada frame; rebote en paredes izquierda, derecha y superior. Prueba manual: pelota rebota en paredes; al perderla por abajo cae fuera del canvas.
5. **Grilla de bloques.** Añadir `js/blocks.js`: generar 6×13 bloques centrados con colores por fila; dibujarlos en `render.js`. Prueba manual: pantalla llena de bloques de colores sobre la paleta.
6. **Colisiones.** Añadir `js/collisions.js`: pelota–paleta (invertir/inclinar trayectoria según punto de impacto); pelota–bloque (marcar `alive: false`, sumar 10 al score). Prueba manual: bloques desaparecen y el score sube.
7. **Vidas y fin de ronda.** Si la pelota cae por debajo de la paleta: restar vida; si quedan vidas, resetear pelota en paleta (`attached: true`); si no, `phase = 'gameOver'`. Si no quedan bloques vivos, `phase = 'victory'`. Prueba manual: perder 3 vidas lleva a game over; limpiar todos los bloques lleva a victoria.
8. **Overlays, pausa y reinicio.** Dibujar overlays de texto en canvas para victoria y game over; `Esc` alterna `'paused'` ↔ `'playing'`; `R` en victoria o game over reinicia partida (`resetGame()`). Prueba manual: flujo completo jugable de principio a fin.



## Criterios de aceptación

- [ ] El juego carga en el navegador con servidor local sin errores en la consola.
- [ ] El canvas mide 800×600 px y está centrado en la página.
- [ ] La paleta se mueve con el mouse (eje X) y con las flechas izquierda/derecha.
- [ ] La pelota inicia pegada a la paleta; se lanza con clic o barra espaciadora.
- [ ] La pelota rebota en las paredes laterales, la superior, la paleta y los bloques.
- [ ] El ángulo de rebote en la paleta varía según el punto de impacto.
- [ ] Hay exactamente 78 bloques (6 filas × 13 columnas) con un color distinto por fila.
- [ ] Cada bloque se destruye con un solo golpe y desaparece del juego.
- [ ] Cada bloque destruido suma 10 puntos; el puntaje se muestra en pantalla.
- [ ] Al perder la pelota se resta una vida; con vidas restantes la pelota vuelve a la paleta para relanzar.
- [ ] La partida empieza con 3 vidas.
- [ ] Al agotar las 3 vidas aparece un overlay de game over.
- [ ] Al destruir todos los bloques aparece un overlay de victoria.
- [ ] La tecla Esc pausa y reanuda el juego.
- [ ] La tecla R reinicia la partida desde los overlays de victoria o game over.
- [ ] No hay sonidos ni animaciones de explosión en esta versión.
- [ ] Los sprites se dibujan vía `assets/spritesheet.js` (sin duplicar coordenadas en otros archivos).



## Decisiones

- **Sí:** canvas fijo 800×600 px. Tamaño predecible para la grilla de bloques y colisiones simples.
- **Sí:** mouse + teclado (flechas) para la paleta. Cubre ambos estilos de juego sin complejidad extra.
- **Sí:** un solo nivel fijo con grilla 6×13. El MVP es jugable de punta a punta sin sistema de niveles.
- **Sí:** 3 vidas, game over al perderlas, overlay de victoria al limpiar bloques. Estados claros y verificables.
- **Sí:** +10 puntos por bloque, visible en pantalla, sin persistencia. Puntuación simple sin almacenamiento.
- **Sí:** pelota pegada a la paleta hasta lanzar (clic o espacio); mismo comportamiento tras perder vida.
- **Sí:** todos los bloques de 1 golpe; colores por fila sin grises. Evita lógica de multi-hit en el MVP.
- **Sí:** Esc para pausar, R para reiniciar desde victoria/game over. Controles mínimos y estándar.
- **Sí:** módulos JS por responsabilidad (`state`, `input`, `render`, `collisions`, `blocks`, `main`). Alineado con la arquitectura prevista en `AGENTS.md`.
- **No:** sonidos en el MVP. Diferido a spec futura; los assets ya existen para cuando se implementen.
- **No:** animación de explosión al romper bloques. Diferido a spec futura; `EXPLOSION_FRAMES` queda sin usar por ahora.
- **No:** power-ups, múltiples niveles, bloques multi-golpe, high scores, menú principal. Cada uno merece su propia spec.
- **No:** frameworks, bundlers ni dependencias npm. Coherente con las restricciones del proyecto.



## Riesgos


| Riesgo                                                 | Mitigación                                                                          |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| CORS al abrir `index.html` directamente (sin servidor) | Documentar en `AGENTS.md` que se use servidor local (`npx serve .`).                |
| Pelota atraviesa bloques a alta velocidad (tunneling)  | Colisión AABB simple; si se detecta en pruebas, separar eje X/Y en el mismo frame.  |
| Mouse sale del canvas durante el juego                 | Clamp de la paleta al ancho del canvas; posición del mouse se ignora si está fuera. |




## Qué **no** está en esta spec

- Sonidos (rebote, rotura de bloque).
- Animación de explosión al destruir bloques.
- Múltiples niveles, power-ups, bloques multi-golpe.
- High scores o persistencia.
- Menú, opciones, versión móvil.
- Tests automatizados ni herramientas de build.

Cada uno de esos puntos, si se implementa, va en su propia spec.
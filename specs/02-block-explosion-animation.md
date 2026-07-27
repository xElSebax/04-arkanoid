# SPEC 02 — Animación de explosión al destruir bloques

> **Estado:** Aprobado
> **Depende de:** SPEC 01
> **Fecha:** 2026-07-27
> **Objetivo:** Mostrar una animación sprite de explosión en la posición del bloque al destruirlo, reutilizando `EXPLOSION_FRAMES` de `spritesheet.js` sin cambiar la lógica de juego ni añadir sonido.

## Alcance

**Incluye:**

- Al destruir un bloque, disparar una animación de explosión en su posición (`x`, `y`) con el mismo tamaño del bloque (`BLOCK_W` × `BLOCK_H`).
- Usar `EXPLOSION_FRAMES[color]`, `EXPLOSION_DURATION` y `drawFrame()` de `assets/spritesheet.js` sin modificar ese archivo.
- La destrucción lógica es inmediata: el bloque deja de colisionar, suma puntos y cuenta para victoria en el mismo frame del impacto; la explosión es solo visual.
- Lista de explosiones activas en el estado del juego; actualización y render en cada frame del game loop.
- Varias explosiones pueden reproducirse a la vez (p. ej. si se rompen varios bloques en frames consecutivos).
- Con `Esc` en pausa, las explosiones en curso se congelan junto con el resto del juego.
- Al destruir el último bloque, el overlay de victoria aparece de inmediato; la explosión puede seguir visible un instante debajo del overlay.

**Fuera de alcance (specs futuras):**

- Sonido de rotura (`break-sound.mp3`) u otros efectos de audio.
- Bloques de varios golpes, power-ups o bloques especiales.
- Partículas, screen shake u otros efectos visuales más allá del spritesheet de explosión.
- Cambios en `assets/spritesheet.js`.
- Retrasar victoria, puntuación o colisiones hasta que termine la animación.

## Modelo de datos

Nuevas estructuras en el estado central (`js/state.js`):

```js
// Cada entrada es una explosión visual activa
state.explosions = [
  // {
  //   x, y, w, h,           // misma posición y tamaño que el bloque destruido
  //   color,                // 'red' | 'yellow' | 'cyan' | 'magenta' | 'hotpink' | 'green'
  //   elapsedMs: 0,         // tiempo acumulado de la animación
  // }
];
```

Constantes reutilizadas (sin duplicar en otros archivos):

- `EXPLOSION_FRAMES` y `EXPLOSION_DURATION` (150 ms) desde `assets/spritesheet.js`.
- `BLOCK_W` y `BLOCK_H` desde `js/constants.js` para el tamaño de dibujo.

Convenciones:

- Al destruir un bloque se hace `push` en `state.explosions` con la posición y el `color` del bloque; `elapsedMs` inicia en `0`.
- El índice de frame se calcula en runtime: `Math.floor( ( elapsedMs / EXPLOSION_DURATION ) * frameCount )`, acotado al rango `[0, frameCount - 1]`.
- Una explosión se elimina del array cuando `elapsedMs >= EXPLOSION_DURATION`.
- `state.explosions` se vacía en `initState()` / `resetGame()` junto con el resto del estado.
- `elapsedMs` avanza cuando `state.phase !== 'paused'` (congelada en pausa; en `'victory'` sigue avanzando para que la animación termine bajo el overlay).

Módulo previsto:

- `js/explosions.js` — funciones `spawnExplosion( block )`, `updateExplosions( dt )` y `renderExplosions( ctx )` (o integración equivalente en `render.js` si el archivo queda muy pequeño).

## Plan de implementación

1. **Estado y esqueleto.** Añadir `state.explosions = []` en `js/state.js` y vaciarlo en `initState()` / `resetGame()`. Crear `js/explosions.js` con `spawnExplosion( block )`, `updateExplosions( dt )` y `renderExplosions( ctx )` (funciones vacías o mínimas). Registrar el script en `index.html`. Prueba manual: el juego carga y juega igual que antes.

2. **Disparo al destruir bloque.** En `js/collisions.js`, tras `block.alive = false`, llamar a `spawnExplosion( block )` con posición, tamaño y color del bloque. Prueba manual: al romper un bloque, `state.explosions` tiene una entrada (verificable en consola si hace falta); el bloque sigue desapareciendo al instante y el score sube.

3. **Render de explosiones.** En `js/render.js`, dibujar explosiones después de los bloques vivos y antes de paleta/pelota, usando `drawFrame()` con el frame correspondiente a `elapsedMs`. Prueba manual: al romper un bloque se ve al menos el primer frame de explosión en su posición.

4. **Animación y limpieza.** En `js/main.js`, medir `dt` entre frames con `performance.now()` y llamar a `updateExplosions( dt )` cuando `state.phase !== 'paused'`. Avanzar `elapsedMs`, calcular el índice de frame y eliminar entradas con `elapsedMs >= EXPLOSION_DURATION`. Prueba manual: la explosión recorre los 4 frames (~150 ms) y desaparece sola.

5. **Pausa y victoria.** Confirmar que en `'paused'` no se avanza `elapsedMs` (explosión congelada). En `'victory'`, sí se avanza para que la animación pueda terminar bajo el overlay. Prueba manual: `Esc` congela una explosión a mitad; al limpiar el último bloque, victoria aparece al instante y la explosión sigue un instante visible debajo.

## Criterios de aceptación

- [ ] El juego carga sin errores en consola con el nuevo módulo `js/explosions.js`.
- [ ] Al destruir un bloque, desaparece de inmediato (sin colisión ni render del bloque).
- [ ] Al destruir un bloque, aparece una animación de explosión en la misma posición y tamaño del bloque.
- [ ] El color de la explosión coincide con el color del bloque destruido (usa `EXPLOSION_FRAMES[color]`).
- [ ] La animación muestra 4 frames en ~150 ms (`EXPLOSION_DURATION`) y luego desaparece.
- [ ] Cada bloque destruido sigue sumando 10 puntos en el mismo frame del impacto.
- [ ] Al destruir el último bloque, el overlay de victoria aparece de inmediato (sin esperar el fin de la animación).
- [ ] Con `Esc` en pausa, las explosiones en curso se congelan; al reanudar, continúan desde donde quedaron.
- [ ] Varias explosiones pueden mostrarse a la vez si se rompen bloques en frames consecutivos.
- [ ] Al reiniciar con `R` (victoria o game over), no quedan explosiones activas de la partida anterior.
- [ ] `assets/spritesheet.js` no se modifica.
- [ ] No se reproduce sonido al romper bloques.

## Decisiones

- **Sí:** destrucción lógica inmediata; la explosión es solo visual. Mantiene la jugabilidad del SPEC 01 sin retrasar colisiones ni victoria.
- **Sí:** reutilizar `EXPLOSION_FRAMES`, `EXPLOSION_DURATION` y `drawFrame()` de `spritesheet.js` sin editar ese archivo. Evita duplicar coordenadas y respeta las convenciones del proyecto.
- **Sí:** array `state.explosions` con `elapsedMs` por entrada. Permite varias explosiones simultáneas y limpieza automática al terminar.
- **Sí:** módulo dedicado `js/explosions.js`. Separa responsabilidad visual sin inflar `collisions.js` ni `render.js`.
- **Sí:** victoria inmediata; la animación puede seguir bajo el overlay. El jugador no espera a que termine la explosión para ver el resultado.
- **Sí:** congelar explosiones solo en pausa (`'paused'`). En `'victory'` la animación sigue avanzando para que se vea un instante debajo del overlay.
- **Sí:** medir `dt` con `performance.now()` en el game loop. `EXPLOSION_DURATION` está en milisegundos; hace falta delta time real, no asumir 60 fps fijos.
- **No:** sonido de rotura en esta spec. Diferido a spec futura; el asset `break-sound.mp3` ya existe.
- **No:** retrasar puntuación, colisiones o victoria hasta el fin de la animación. Complicaría la lógica sin beneficio jugable.
- **No:** partículas, screen shake u otros efectos visuales. Fuera de alcance; el spritesheet ya define la explosión.

## Riesgos

| Riesgo | Mitigación |
| ------ | ---------- |
| Picos de `dt` (pestaña en segundo plano) saltan frames de la explosión | Acotar `dt` a un máximo razonable (p. ej. 50 ms) antes de sumarlo a `elapsedMs`. |
| Muchas explosiones simultáneas en el mismo frame | Con 78 bloques máximo y destrucción de uno por frame de colisión, el array nunca crece de forma problemática; limpiar entradas terminadas cada frame. |
| Orden de dibujo: explosión tapada por paleta o pelota | Renderizar explosiones después de bloques y antes de paleta/pelota. |

## Qué **no** está en esta spec

- Sonido de rotura (`break-sound.mp3`) u otros efectos de audio.
- Bloques de varios golpes, power-ups o bloques especiales.
- Partículas, screen shake u otros efectos visuales más allá del spritesheet de explosión.
- Cambios en `assets/spritesheet.js`.
- Retrasar puntuación, colisiones o victoria hasta que termine la animación.

Cada uno de esos puntos, si se implementa, va en su propia spec.

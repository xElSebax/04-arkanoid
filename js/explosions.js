function spawnExplosion( block ) {
  state.explosions.push( {
    x: block.x,
    y: block.y,
    w: block.w,
    h: block.h,
    color: block.color,
    elapsedMs: 0,
  } );
}

function updateExplosions( dt ) {
  for ( const explosion of state.explosions ) {
    explosion.elapsedMs += dt;
  }

  state.explosions = state.explosions.filter(
    ( explosion ) => explosion.elapsedMs < EXPLOSION_DURATION
  );
}

function renderExplosions( ctx ) {
  for ( const explosion of state.explosions ) {
    const frames = EXPLOSION_FRAMES[ explosion.color ];
    if ( !frames ) continue;

    const frameCount = frames.length;
    const frameIndex = Math.min(
      frameCount - 1,
      Math.floor( ( explosion.elapsedMs / EXPLOSION_DURATION ) * frameCount )
    );
    drawFrame( ctx, frames[ frameIndex ], explosion.x, explosion.y, explosion.w, explosion.h );
  }
}

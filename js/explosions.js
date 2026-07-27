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
}

function renderExplosions( ctx ) {
}

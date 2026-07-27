function clearCanvas( ctx ) {
  ctx.fillStyle = '#000';
  ctx.fillRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );
}

function drawOverlay( ctx, title, subtitle ) {
  ctx.fillStyle = 'rgba( 0, 0, 0, 0.65 )';
  ctx.fillRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText( title, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 16 );
  ctx.font = '18px sans-serif';
  ctx.fillText( subtitle, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20 );
  ctx.textAlign = 'left';
}

function render( ctx, state ) {
  clearCanvas( ctx );

  for ( const block of state.blocks ) {
    if ( !block.alive ) continue;
    drawSprite( ctx, 'block_' + block.color, block.x, block.y, block.w, block.h );
  }

  renderExplosions( ctx );

  const { paddle, ball } = state;
  drawSprite( ctx, 'paddle', paddle.x, paddle.y, paddle.w, paddle.h );
  drawSprite( ctx, 'ball', ball.x, ball.y, ball.w, ball.h );

  ctx.fillStyle = '#fff';
  ctx.font = '16px sans-serif';
  ctx.fillText( 'Puntos: ' + state.score, 16, 24 );

  const livesLabel = 'Vidas: ';
  ctx.fillText( livesLabel, 16, 44 );
  const livesIconSize = 14;
  const livesGap = 4;
  let livesX = 16 + ctx.measureText( livesLabel ).width;
  const livesY = 44 - livesIconSize + 2;
  for ( let i = 0; i < state.lives; i++ ) {
    drawSprite( ctx, 'ball', livesX, livesY, livesIconSize, livesIconSize );
    livesX += livesIconSize + livesGap;
  }

  if ( state.phase === 'paused' ) {
    drawOverlay( ctx, 'Pausa', 'Pulsa Esc para continuar' );
  } else if ( state.phase === 'victory' ) {
    drawOverlay( ctx, '¡Victoria!', 'Pulsa R para reiniciar' );
  } else if ( state.phase === 'gameOver' ) {
    drawOverlay( ctx, 'Game over', 'Pulsa R para reiniciar' );
  }
}

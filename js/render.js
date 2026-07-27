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

  const { paddle, ball } = state;
  drawSprite( ctx, 'paddle', paddle.x, paddle.y, paddle.w, paddle.h );
  drawSprite( ctx, 'ball', ball.x, ball.y, ball.w, ball.h );

  ctx.fillStyle = '#fff';
  ctx.font = '16px sans-serif';
  ctx.fillText( 'Puntos: ' + state.score, 16, 24 );
  ctx.fillText( 'Vidas: ' + state.lives, 16, 44 );

  if ( state.phase === 'paused' ) {
    drawOverlay( ctx, 'Pausa', 'Pulsa Esc para continuar' );
  } else if ( state.phase === 'victory' ) {
    drawOverlay( ctx, '¡Victoria!', 'Pulsa R para reiniciar' );
  } else if ( state.phase === 'gameOver' ) {
    drawOverlay( ctx, 'Game over', 'Pulsa R para reiniciar' );
  }
}

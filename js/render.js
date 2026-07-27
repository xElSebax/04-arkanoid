function clearCanvas( ctx ) {
  ctx.fillStyle = '#000';
  ctx.fillRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );
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
}

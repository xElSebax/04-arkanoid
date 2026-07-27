function clearCanvas( ctx ) {
  ctx.fillStyle = '#000';
  ctx.fillRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );
}

function render( ctx, state ) {
  clearCanvas( ctx );

  const { paddle, ball } = state;
  drawSprite( ctx, 'paddle', paddle.x, paddle.y, paddle.w, paddle.h );
  drawSprite( ctx, 'ball', ball.x, ball.y, ball.w, ball.h );
}

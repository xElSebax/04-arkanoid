function rectsOverlap( a, b ) {
  return a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y;
}

function checkPaddleCollision() {
  const { ball, paddle } = state;
  if ( ball.vy <= 0 ) return;
  if ( !rectsOverlap( ball, paddle ) ) return;

  ball.y = paddle.y - ball.h;

  const hitOffset = ( ( ball.x + ball.w / 2 ) - paddle.x ) / paddle.w - 0.5;
  const maxAngle = Math.PI / 3;
  const angle = hitOffset * 2 * maxAngle;
  ball.vx = BALL_SPEED * Math.sin( angle );
  ball.vy = -BALL_SPEED * Math.cos( angle );
}

function resolveBallBlockCollision( ball, block ) {
  const overlapLeft = ball.x + ball.w - block.x;
  const overlapRight = block.x + block.w - ball.x;
  const overlapTop = ball.y + ball.h - block.y;
  const overlapBottom = block.y + block.h - ball.y;
  const minOverlap = Math.min( overlapLeft, overlapRight, overlapTop, overlapBottom );

  if ( minOverlap === overlapLeft ) {
    ball.x = block.x - ball.w;
    ball.vx = -Math.abs( ball.vx );
  } else if ( minOverlap === overlapRight ) {
    ball.x = block.x + block.w;
    ball.vx = Math.abs( ball.vx );
  } else if ( minOverlap === overlapTop ) {
    ball.y = block.y - ball.h;
    ball.vy = -Math.abs( ball.vy );
  } else {
    ball.y = block.y + block.h;
    ball.vy = Math.abs( ball.vy );
  }
}

function checkBlockCollisions() {
  const { ball } = state;

  for ( const block of state.blocks ) {
    if ( !block.alive ) continue;
    if ( !rectsOverlap( ball, block ) ) continue;

    block.alive = false;
    spawnExplosion( block );
    state.score += SCORE_PER_BLOCK;
    resolveBallBlockCollision( ball, block );
    break;
  }
}

function checkCollisions() {
  if ( state.ball.attached || state.phase !== 'playing' ) return;
  if ( state.transitionRemainingMs > 0 ) return;

  checkPaddleCollision();
  checkBlockCollisions();
}

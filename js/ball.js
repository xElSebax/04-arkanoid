function launchBall() {
  const { ball } = state;
  if ( state.phase !== 'ready' && state.phase !== 'playing' ) return;
  if ( !ball.attached ) return;

  ball.attached = false;
  ball.vx = 0;
  ball.vy = -BALL_SPEED;

  if ( state.phase === 'ready' ) {
    state.phase = 'playing';
  }
}

function updateBall() {
  const { ball } = state;
  if ( ball.attached ) return;
  if ( state.phase !== 'playing' ) return;

  ball.x += ball.vx;
  ball.y += ball.vy;

  if ( ball.x <= 0 ) {
    ball.x = 0;
    ball.vx = -ball.vx;
  }
  if ( ball.x + ball.w >= CANVAS_WIDTH ) {
    ball.x = CANVAS_WIDTH - ball.w;
    ball.vx = -ball.vx;
  }
  if ( ball.y <= 0 ) {
    ball.y = 0;
    ball.vy = -ball.vy;
  }
}

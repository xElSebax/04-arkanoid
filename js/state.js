const state = {
  phase: 'ready',
  level: 1,
  transitionRemainingMs: 0,
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
    attached: true,
  },
  blocks: [],
  explosions: [],
};

function updateBallAttachedPosition() {
  const { paddle, ball } = state;
  ball.x = paddle.x + ( paddle.w - ball.w ) / 2;
  ball.y = paddle.y - ball.h;
}

function resetBallOnPaddle() {
  const { ball } = state;
  ball.vx = 0;
  ball.vy = 0;
  ball.attached = true;
  updateBallAttachedPosition();
}

function checkVictory() {
  if ( state.phase !== 'playing' ) return;
  if ( state.transitionRemainingMs > 0 ) return;

  const anyAlive = state.blocks.some( ( block ) => block.alive );
  if ( anyAlive ) return;

  state.ball.vx = 0;
  state.ball.vy = 0;

  if ( state.level < LEVEL_COUNT ) {
    state.transitionRemainingMs = LEVEL_TRANSITION_MS;
  } else {
    state.phase = 'victory';
  }
}

function initState() {
  state.score = 0;
  state.lives = LIVES_START;

  state.paddle.x = ( CANVAS_WIDTH - PADDLE_W ) / 2;
  state.paddle.y = CANVAS_HEIGHT - PADDLE_H - PADDLE_BOTTOM_MARGIN;
  state.paddle.w = PADDLE_W;
  state.paddle.h = PADDLE_H;

  state.ball.w = BALL_SIZE;
  state.ball.h = BALL_SIZE;

  loadLevel( 1 );
}

function resetGame() {
  initState();
}

function checkBallLost() {
  const { ball } = state;
  if ( ball.attached || state.phase !== 'playing' ) return;
  if ( state.transitionRemainingMs > 0 ) return;
  if ( ball.y <= CANVAS_HEIGHT ) return;

  state.lives -= 1;

  if ( state.lives > 0 ) {
    resetBallOnPaddle();
  } else {
    state.phase = 'gameOver';
    ball.vx = 0;
    ball.vy = 0;
  }
}

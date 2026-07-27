const state = {
  phase: 'ready',
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

  const anyAlive = state.blocks.some( ( block ) => block.alive );
  if ( !anyAlive ) {
    state.phase = 'victory';
    state.ball.vx = 0;
    state.ball.vy = 0;
  }
}

function initState() {
  state.phase = 'ready';
  state.score = 0;
  state.lives = LIVES_START;
  state.explosions = [];
  generateBlocks();

  state.paddle.x = ( CANVAS_WIDTH - PADDLE_W ) / 2;
  state.paddle.y = CANVAS_HEIGHT - PADDLE_H - PADDLE_BOTTOM_MARGIN;
  state.paddle.w = PADDLE_W;
  state.paddle.h = PADDLE_H;

  state.ball.w = BALL_SIZE;
  state.ball.h = BALL_SIZE;
  state.ball.vx = 0;
  state.ball.vy = 0;
  state.ball.attached = true;
  updateBallAttachedPosition();
}

function resetGame() {
  initState();
}

function checkBallLost() {
  const { ball } = state;
  if ( ball.attached || state.phase !== 'playing' ) return;
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

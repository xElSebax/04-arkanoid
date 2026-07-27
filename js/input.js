const keys = {
  left: false,
  right: false,
};

let mouseX = null;
let mouseOnCanvas = false;

function clampPaddleX( x ) {
  return Math.max( 0, Math.min( x, CANVAS_WIDTH - state.paddle.w ) );
}

function initInput( canvas ) {
  canvas.addEventListener( 'mousemove', ( e ) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseOnCanvas = true;
  } );

  canvas.addEventListener( 'mouseleave', () => {
    mouseOnCanvas = false;
  } );

  canvas.addEventListener( 'click', () => {
    launchBall();
  } );

  window.addEventListener( 'keydown', ( e ) => {
    if ( e.key === 'ArrowLeft' ) keys.left = true;
    if ( e.key === 'ArrowRight' ) keys.right = true;
    if ( e.key === ' ' ) {
      e.preventDefault();
      launchBall();
    }
    if ( e.key === 'Escape' && !e.repeat ) {
      if ( state.phase === 'playing' ) {
        state.phase = 'paused';
      } else if ( state.phase === 'paused' ) {
        state.phase = 'playing';
      }
    }
    if ( state.phase === 'paused' && !e.repeat ) {
      const level = parseInt( e.key, 10 );
      if ( level >= 1 && level <= LEVEL_COUNT ) {
        loadLevel( level );
      }
    }
    if ( ( e.key === 'r' || e.key === 'R' ) && !e.repeat ) {
      if ( state.phase === 'victory' || state.phase === 'gameOver' ) {
        resetGame();
      }
    }
  } );

  window.addEventListener( 'keyup', ( e ) => {
    if ( e.key === 'ArrowLeft' ) keys.left = false;
    if ( e.key === 'ArrowRight' ) keys.right = false;
  } );
}

function updateInput() {
  if ( state.phase !== 'ready' && state.phase !== 'playing' ) return;

  const { paddle } = state;

  if ( mouseOnCanvas && mouseX !== null ) {
    paddle.x = clampPaddleX( mouseX - paddle.w / 2 );
  }

  if ( keys.left ) {
    paddle.x = clampPaddleX( paddle.x - PADDLE_KEYBOARD_SPEED );
  }
  if ( keys.right ) {
    paddle.x = clampPaddleX( paddle.x + PADDLE_KEYBOARD_SPEED );
  }

  if ( state.ball.attached ) {
    updateBallAttachedPosition();
  }
}

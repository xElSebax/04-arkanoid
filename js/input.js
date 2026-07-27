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

  window.addEventListener( 'keydown', ( e ) => {
    if ( e.key === 'ArrowLeft' ) keys.left = true;
    if ( e.key === 'ArrowRight' ) keys.right = true;
  } );

  window.addEventListener( 'keyup', ( e ) => {
    if ( e.key === 'ArrowLeft' ) keys.left = false;
    if ( e.key === 'ArrowRight' ) keys.right = false;
  } );
}

function updateInput() {
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

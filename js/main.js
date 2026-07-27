const canvas = document.getElementById( 'game' );
const ctx = canvas.getContext( '2d' );
const MAX_FRAME_DT = 50;
let lastFrameTime = performance.now();

function gameLoop( now ) {
  const dt = Math.min( now - lastFrameTime, MAX_FRAME_DT );
  lastFrameTime = now;

  updateInput();
  updateBall();
  checkCollisions();
  checkVictory();
  checkBallLost();

  if ( state.phase !== 'paused' ) {
    updateExplosions( dt );
  }

  render( ctx, state );
  requestAnimationFrame( gameLoop );
}

loadSpritesheet( () => {
  initState();
  initInput( canvas );
  gameLoop();
} );

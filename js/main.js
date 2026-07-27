const canvas = document.getElementById( 'game' );
const ctx = canvas.getContext( '2d' );
const MAX_FRAME_DT = 50;
let lastFrameTime = performance.now();

function updateLevelTransition( dt ) {
  if ( state.transitionRemainingMs <= 0 ) return;

  state.transitionRemainingMs -= dt;
  if ( state.transitionRemainingMs <= 0 ) {
    state.transitionRemainingMs = 0;
    loadLevel( state.level + 1 );
  }
}

function gameLoop( now ) {
  const dt = Math.min( now - lastFrameTime, MAX_FRAME_DT );
  lastFrameTime = now;

  updateInput();
  updateLevelTransition( dt );
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

let assetsReady = 0;

function onAssetsReady() {
  assetsReady += 1;
  if ( assetsReady < 2 ) return;

  initState();
  initInput( canvas );
  gameLoop();
}

loadSpritesheet( onAssetsReady );
initAudio( onAssetsReady );

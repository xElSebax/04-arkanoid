const canvas = document.getElementById( 'game' );
const ctx = canvas.getContext( '2d' );

function gameLoop() {
  updateInput();
  updateBall();
  checkCollisions();
  render( ctx, state );
  requestAnimationFrame( gameLoop );
}

loadSpritesheet( () => {
  initState();
  initInput( canvas );
  gameLoop();
} );

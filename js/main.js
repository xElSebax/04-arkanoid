const canvas = document.getElementById( 'game' );
const ctx = canvas.getContext( '2d' );

function gameLoop() {
  updateInput();
  render( ctx, state );
  requestAnimationFrame( gameLoop );
}

loadSpritesheet( () => {
  initState();
  initInput( canvas );
  gameLoop();
} );

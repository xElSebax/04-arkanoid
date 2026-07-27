const canvas = document.getElementById( 'game' );
const ctx = canvas.getContext( '2d' );

function gameLoop() {
  render( ctx, state );
  requestAnimationFrame( gameLoop );
}

loadSpritesheet( () => {
  initState();
  gameLoop();
} );

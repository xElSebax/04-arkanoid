const canvas = document.getElementById( 'game' );
const ctx = canvas.getContext( '2d' );

function clearCanvas() {
  ctx.fillStyle = '#000';
  ctx.fillRect( 0, 0, canvas.width, canvas.height );
}

function gameLoop() {
  clearCanvas();
  requestAnimationFrame( gameLoop );
}

loadSpritesheet( () => {
  gameLoop();
} );

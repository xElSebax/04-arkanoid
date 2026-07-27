function generateBlocks() {
  const gridWidth = BLOCK_COLS * BLOCK_W;
  const startX = ( CANVAS_WIDTH - gridWidth ) / 2;
  const startY = BLOCK_TOP_MARGIN;
  const blocks = [];

  for ( let row = 0; row < BLOCK_ROWS; row++ ) {
    for ( let col = 0; col < BLOCK_COLS; col++ ) {
      blocks.push( {
        x: startX + col * BLOCK_W,
        y: startY + row * BLOCK_H,
        w: BLOCK_W,
        h: BLOCK_H,
        color: BLOCK_ROW_COLORS[ row ],
        alive: true,
      } );
    }
  }

  state.blocks = blocks;
}

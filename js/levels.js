function fullRow( color ) {
  return Array( BLOCK_COLS ).fill( color );
}

function checkerGrid() {
  return BLOCK_ROW_COLORS.map( function ( color, row ) {
    return Array.from( { length: BLOCK_COLS }, function ( _, col ) {
      return ( row + col ) % 2 === 0 ? color : null;
    } );
  } );
}

function frameGrid() {
  return BLOCK_ROW_COLORS.map( function ( color, row ) {
    return Array.from( { length: BLOCK_COLS }, function ( _, col ) {
      const isEdge = row === 0 || row === BLOCK_ROWS - 1 || col === 0 || col === BLOCK_COLS - 1;
      return isEdge ? color : null;
    } );
  } );
}

function pyramidGrid() {
  const mid = ( BLOCK_ROWS - 1 ) / 2;

  return BLOCK_ROW_COLORS.map( function ( color, row ) {
    const dist = Math.abs( row - mid );
    const width = BLOCK_COLS - dist * 2;
    const startCol = dist;

    return Array.from( { length: BLOCK_COLS }, function ( _, col ) {
      return col >= startCol && col < startCol + width ? color : null;
    } );
  } );
}

function towersGrid() {
  return BLOCK_ROW_COLORS.map( function ( color, row ) {
    return Array.from( { length: BLOCK_COLS }, function ( _, col ) {
      const inLeftTower = col < 3;
      const inRightTower = col >= BLOCK_COLS - 3;
      const inCenter = col >= 5 && col <= 7 && row >= 2 && row <= 3;
      return inLeftTower || inRightTower || inCenter ? color : null;
    } );
  } );
}

const LEVELS = [
  {
    id: 1,
    name: 'Nivel 1',
    grid: [
      fullRow( 'red' ),
      fullRow( 'yellow' ),
      fullRow( 'cyan' ),
      fullRow( 'magenta' ),
      fullRow( 'hotpink' ),
      fullRow( 'green' ),
    ],
  },
  {
    id: 2,
    name: 'Nivel 2',
    grid: checkerGrid(),
  },
  {
    id: 3,
    name: 'Nivel 3',
    grid: frameGrid(),
  },
  {
    id: 4,
    name: 'Nivel 4',
    grid: pyramidGrid(),
  },
  {
    id: 5,
    name: 'Nivel 5',
    grid: towersGrid(),
  },
];

function getBallSpeedForLevel( level ) {
  return BALL_SPEED * ( 1 + LEVEL_SPEED_BONUS * ( level - 1 ) );
}

function generateBlocksFromLevel( level ) {
  const levelData = LEVELS[ level - 1 ];
  if ( !levelData ) return [];

  const gridWidth = BLOCK_COLS * BLOCK_W;
  const startX = ( CANVAS_WIDTH - gridWidth ) / 2;
  const startY = BLOCK_TOP_MARGIN;
  const blocks = [];

  for ( let row = 0; row < BLOCK_ROWS; row++ ) {
    for ( let col = 0; col < BLOCK_COLS; col++ ) {
      const color = levelData.grid[ row ][ col ];
      if ( color === null ) continue;

      blocks.push( {
        x: startX + col * BLOCK_W,
        y: startY + row * BLOCK_H,
        w: BLOCK_W,
        h: BLOCK_H,
        color: color,
        alive: true,
      } );
    }
  }

  return blocks;
}

function loadLevel( level ) {
  state.level = level;
  state.blocks = generateBlocksFromLevel( level );
  state.explosions = [];
  state.transitionRemainingMs = 0;
  resetBallOnPaddle();
  state.phase = 'ready';
}

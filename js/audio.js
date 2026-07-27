const SOUND_PATHS = {
  bounce: 'assets/sounds/ball-bounce.mp3',
  break: 'assets/sounds/break-sound.mp3',
};

let audioReady = false;
const sounds = { bounce: null, break: null };

function initAudio( onReady ) {
  const keys = Object.keys( SOUND_PATHS );
  let loaded = 0;

  function checkReady() {
    loaded += 1;
    if ( loaded >= keys.length ) {
      audioReady = true;
      onReady();
    }
  }

  keys.forEach( function ( key ) {
    const audio = new Audio( SOUND_PATHS[ key ] );
    audio.addEventListener( 'canplaythrough', checkReady, { once: true } );
    audio.addEventListener( 'error', checkReady, { once: true } );
    sounds[ key ] = audio;
  } );
}

function playSound( key ) {
  if ( !audioReady || !sounds[ key ] ) return;

  const instance = sounds[ key ].cloneNode();
  instance.play().catch( function () {} );
}

function playBounce() {
  playSound( 'bounce' );
}

function playBreak() {
  playSound( 'break' );
}

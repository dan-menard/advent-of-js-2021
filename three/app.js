(() => {
  const AUDIO_KEY_MAP = {
    'c': 1, 'c#': 2, 'd': 3, 'd#': 4, 'e': 5,
    'f': 6, 'f#': 7, 'g': 8, 'g#': 9, 'a': 10,
    'a#': 11, 'b': 12, 'C': 13, 'C#': 14, 'D': 15,
    'D#': 16, 'E': 17, 'F': 18, 'F#': 19, 'G': 20,
    'G#': 21, 'A': 22, 'A#': 23
  };

  function playKey(keySvg) {
    const keyId = keySvg.parentNode.dataset.id;

    const audio = new Audio(`./audio/key-${AUDIO_KEY_MAP[keyId]}.mp3`);
    audio.play();
  }

  function go() {
    document.querySelector('.piano').addEventListener('click', (evt) => playKey(evt.target));
  }

  document.addEventListener('DOMContentLoaded', go);
})();

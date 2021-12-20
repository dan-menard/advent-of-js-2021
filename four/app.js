(() => {
  const KEY_CODE_MAP = {
    'BACKSPACE': 8,
    'TAB': 9,
    'ENTER': 13,
    'SHIFT': 16,
    'CAPSLOCK': 27, // I have capslock remapped to Esc :p
    '0': 48, 
    '1': 49,
    '2': 50,
    '3': 51,
    '4': 52,
    '5': 53,
    '6': 54,
    '7': 55,
    '8': 56,
    '9': 57,
    ';': 59,
    '=': 61,
    'A': 65,
    'B': 66,
    'C': 67,
    'D': 68,
    'E': 69,
    'F': 70,
    'G': 71,
    'H': 72,
    'I': 73,
    'J': 74,
    'K': 75,
    'L': 76,
    'M': 77,
    'N': 78,
    'O': 79,
    'P': 80,
    'Q': 81,
    'R': 82,
    'S': 83,
    'T': 84,
    'U': 85,
    'V': 86,
    'W': 87,
    'X': 88,
    'Y': 89,
    'Z': 90,
    '-': 173,
    ',': 188,
    '.': 190,
    '/': 191,
    '`': 192,
    '[': 219,
    '\\': 220,
    ']': 221,
    "'": 222,
  };

  function listenForKeys() {
    document.addEventListener('keydown', (keyDownEvt) => {
      let activeKey = document.querySelector('button.jiggle');
      let activeKeyCode = KEY_CODE_MAP[activeKey.dataset.key];

      const pressedKeyCode = keyDownEvt.keyCode;

      while (activeKeyCode === pressedKeyCode) {
        activeKey.classList.remove('jiggle');

        const keys = Array.from(document.querySelectorAll('button'));
        const randomKeyIndex = Math.floor(Math.random() * keys.length);

        keys[randomKeyIndex].classList.add('jiggle');

        activeKey = document.querySelector('button.jiggle');
        activeKeyCode = KEY_CODE_MAP[activeKey.dataset.key];
      }
    });
  }

  document.addEventListener('DOMContentLoaded', listenForKeys);
})();

(() => {
  let dragging = false;

  function listen() {
    const priceEl = document.querySelector('.dollars');
    const inputEl = document.querySelector('input#priceRange');

    const inputWidth = inputEl.clientWidth;
    const inputLeft = Math.floor(inputEl.getBoundingClientRect().left);
    const inputRight = Math.ceil(inputLeft + inputWidth);

    inputEl.addEventListener('mousedown', () => {
      dragging = true;
    });

    inputEl.addEventListener('mouseup', () => {
      dragging = false;
    });

    inputEl.addEventListener('mousemove', (mouseEvent) => {
      if (dragging) {
        const x = Math.min(Math.max(mouseEvent.clientX, inputLeft), inputRight);
        const percent = ((x - inputLeft) / inputWidth) * 100;

        priceEl.textContent = percent.toFixed(2);
      }
    });

  }

  document.addEventListener('DOMContentLoaded', listen);
})();

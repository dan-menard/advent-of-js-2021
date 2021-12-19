(() => {
  function playKey(keySvg) {
    const key = keySvg.parentNode.dataset.id;
    console.log(key);
  }

  function go() {
    document.querySelector('.piano').addEventListener('click', (evt) => playKey(evt.target));
  }

  document.addEventListener('DOMContentLoaded', go);
})();

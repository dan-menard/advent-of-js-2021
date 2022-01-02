(() => {
  const modalOpen = true;

  function toggleModal() {
    document.querySelector('.overlay').classList.toggle('hide');
  }

  function listen() {
    document.querySelector('button.close').addEventListener('click', toggleModal);
    document.querySelector('a#something').addEventListener('click', toggleModal);
  }

  document.addEventListener('DOMContentLoaded', listen);
})();

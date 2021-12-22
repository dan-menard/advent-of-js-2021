(() => {
  function getAllInputs() {
    return Array.from(document.querySelectorAll('input'))
  }

  function checkVerification() {
    if (getAllInputs().every((input) => input.value)) {
      console.log('**** Verified! ****');
    }
  }

  function listenForFormSubmit() {
    document.querySelector('form').addEventListener('submit', (submitEvent) => {
      checkVerification();
      submitEvent.preventDefault();
    });
  }

  function listenForClipboardPaste() {
    document.addEventListener('paste', (pasteEvent) => {
      const pasteInput = (event.clipboardData || window.clipboardData).getData('text');
      const digits = pasteInput.split('');

      getAllInputs().forEach((inputEl, index) => {
        inputEl.value = digits[index] ? digits[index] : '';
      });

      checkVerification();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    listenForFormSubmit();
    listenForClipboardPaste();

    const firstInput = document.querySelector('input');
    firstInput.focus();

    firstInput.parentNode.addEventListener('input', (inputEvent) => {
      const nextInputEl = inputEvent.target.nextElementSibling;

      if (nextInputEl) {
        nextInputEl.focus();
      }

      checkVerification();
    });
  });
})();

(() => {
  const shiftKeycode = 16;

  let shiftIsDown = false;
  let lastClickedEpisodeId;

  function parseId(inputEl) {
    return inputEl.id.split('-')[1];
  }

  function checkShiftDown(keyEvent) {
    if (keyEvent.keyCode === 16) {
      shiftIsDown = true; 
      document.body.classList.add('multi-select-mode');
    }
  }

  function checkShiftUp(keyEvent) {
    if (keyEvent.keyCode === 16) {
      shiftIsDown = false; 
      document.body.classList.remove('multi-select-mode');
    }
  }

  function episodeClicked(clickEvent) {
    if (shiftIsDown && lastClickedEpisodeId) {
      const labelEl = clickEvent.target.parentNode;
      const episodeListEl = labelEl.parentNode.parentNode;

      const clickedEpisodeId = parseId(labelEl.querySelector('input'));
      const allEpisodeCheckboxes = Array.from(episodeListEl.querySelectorAll('input'));

      if (clickedEpisodeId === lastClickedEpisodeId) {
        labelEl.querySelector('input').checked = false;
        return;
      }

      const checkboxesToClick = clickedEpisodeId > lastClickedEpisodeId
        ? allEpisodeCheckboxes.filter((checkbox) => {
            const id = parseId(checkbox);
            return id <= clickedEpisodeId && id > lastClickedEpisodeId;
          })
        : allEpisodeCheckboxes.filter((checkbox) => {
            const id = parseId(checkbox);
            return id < lastClickedEpisodeId && id >= clickedEpisodeId;
          });

      checkboxesToClick.forEach((checkbox) => {
        checkbox.checked = true;
      });
    } else if (clickEvent.target.id) {
      lastClickedEpisodeId = parseId(clickEvent.target);
    }
  }

  function listen() {
    document.addEventListener('keydown', checkShiftDown);
    document.addEventListener('keyup', checkShiftUp);

    const episodeList = document.querySelector('.episodes');
    episodeList.addEventListener('click', episodeClicked);
  }

  document.addEventListener('DOMContentLoaded', listen);
})();

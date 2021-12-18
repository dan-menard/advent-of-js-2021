
main = () => {
  let timerInterval;

  function toggleStartStop() {
    const startStopButton = document.querySelector('button.start.stop');

    if (startStopButton.innerHTML === 'start') {
      runTimer();
      startStopButton.innerHTML = 'stop';
    } else {
      pauseTimer();
      startStopButton.innerHTML = 'start';
    }
  }

  function toggleEditable() {
    const inputs = Array.from(document.querySelectorAll('input'));

    if (inputs.every((input) => input.disabled)) {
      inputs.forEach((input) => input.disabled = false);
    } else {
      inputs.forEach((input) => input.disabled = true);
    }
  }

  function pauseTimer() {
    clearInterval(timerInterval);
  }

  function runTimer() {
    timerInterval = setInterval(() => {
      const secondsEl = document.querySelector('.seconds input');
      const seconds = Number(secondsEl.value);

      if (seconds) {
        const newSeconds = seconds - 1;
        secondsEl.value = newSeconds > 9 ? newSeconds : '0' + newSeconds;
      } else {
        const minutesEl = document.querySelector('.minutes input');
        const minutes = Number(minutesEl.value);

        if (minutes) {
          minutesEl.value = minutes - 1;
          secondsEl.value = 59;
        } else {
          toggleStartStop();
          alert('Time’s up!');
        }
      }
    }, 1000);
  }

  function addEventListeners() {
    const startStopButton = document.querySelector('button.start.stop');
    const settingsButton = document.querySelector('button.settings');

    startStopButton.addEventListener('click', toggleStartStop);
    settingsButton.addEventListener('click', toggleEditable);
  }

  addEventListeners();
}

document.addEventListener('DOMContentLoaded', main);
